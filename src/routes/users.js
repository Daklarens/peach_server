const express = require("express");
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const FileService = require('../file');
const UserService = require('../services/servicesUser');
const service = new UserService.UserService();
const { verifyTelegramData, createToken, verifyAndRefreshToken } = require('../verify');
const router = express.Router();
const uploadsDir = path.join(__dirname, './uploads/avatars');
require('dotenv').config();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Лимит 10MB
});

// Запуск приложения 
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    // Проверка хеша
    const isValid = verifyTelegramData(data.initData);
    if (isValid.hash) {
      // Парсим строку юзера
      const dataStr = isValid.data.user.replace(/"([^"]+)":/g, '$1:');
      const jsonString = dataStr.replace(/(\w+):/g, '"$1":'); // Добавляем кавычки вокруг ключей
      const dataUser = JSON.parse(jsonString);
      // Сервис для авторизации данных пользователя 
      const userCheck = await service.userLoader(dataUser);
      // Создание токена с записью данных пользователя
      const token = createToken(dataUser, process.env.JWT);
      // Отправка всех данных
      const outData = { ...userCheck, token };
      console.log(outData);
      res.send(outData);
    } else {
      res.sendStatus(502);
    }
  } catch (error) {
    console.log('Ошибка при загрузке приложения');
    console.log(error);
    res.sendStatus(502);
  }
});

// Маршрут для загрузки аватара
router.post('/upload', upload.single('avatar'), async (req, res) => {
  console.log('loading img')
  try {
    const outputDir = path.join(__dirname, '../noPublic/avatars');

    // Парсим JSON строку, переданную в FormData
    const jsonData = JSON.parse(req.body.data);

    // Используем FileService для обработки и сохранения изображения
    const filename = await FileService.processAndSaveImage(req.file, outputDir);

    console.log('Image processed and saved successfully:', filename);
    console.log('Received JSON data:', jsonData);

    res.status(200).send({ success: true, message: 'Image and data saved successfully', filename, jsonData });
  } catch (error) {
    console.error('Error processing image or data:', error.message);
    res.status(500).send({ success: false, message: error.message });
  }
});

// Маршрут для получения изображения по имени файла
router.get('/f1/:filename', (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(uploadsDir, filename);

  // Проверяем, существует ли файл и отправляем его
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({ success: false, message: 'Image not found' });
    }
    res.sendFile(filepath);
  });
});

module.exports = router;