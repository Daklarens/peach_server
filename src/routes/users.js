const express = require("express");
const path = require('path');
const FileService = require('../file');
const UserService = require('../services/servicesUser')
const service = new UserService.UserService()
const {verifyTelegramData, createToken, verifyAndRefreshToken} = require('../verify');
const router = express.Router();
const uploadsDir = path.join(__dirname, './uploads/avatars');
require('dotenv').config();

//Запуск приложения 
router.post("/", async (req, res) => {
  console.log(req.body)
  try{
    const data = req.body
  //Проверка хеша
  const isValid = verifyTelegramData(data.initData);
  if(isValid.hash){
    //парсим строку юзера
    const dataStr = isValid.data.user
      .replace(/"([^"]+)":/g, '$1:'); 
    const jsonString = dataStr.replace(/(\w+):/g, '"$1":'); // Добавляем кавычки вокруг ключей
    const dataUser = JSON.parse(jsonString);
    console.log(dataUser)
    //Сервис для авторизации данных пользователя 
    const userCheck = await service.userLoader(dataUser)
    //Создание токена с записью данных польователя
    const token = createToken(dataUser, process.env.JWT)
    //Отправка всех данных
    console.log(isValid)
    res.send({...userCheck, token}) 
  }else{
    res.sendStatus(502)
  }
  } catch (error) {
    console.log('Ошибка при загрузке приложения')
    console.log(error)
    res.sendStatus(502)
  }
});

router.post('/upload', async (req, res) => {
  try {
    const base64Image = req.body.data.avatar;
    const outputDir = path.join(__dirname, './public/avatars/');

    // Используем FileService для обработки и сохранения изображения
    const filename = await FileService.processAndSaveImage(base64Image, outputDir);

    console.log('Image processed and saved successfully:', filename);
    res.status(200).send({ success: true, message: 'Image saved successfully', filename });
  } catch (error) {
    console.error('Error processing image:', error.message);
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

