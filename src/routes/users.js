const express = require("express");
const path = require('path');
const fs = require('fs');
const UserService = require('../services/servicesUser');
const service = new UserService.UserService();
const { verifyTelegramData, createToken, verifyAndRefreshToken } = require('../verify');
const router = express.Router();
const uploadsDir = path.join(__dirname, './uploads/avatars');
require('dotenv').config();

// Запуск приложения 
router.post("/", async (req, res) => {
  console.log('Загрузка приложения')
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

router.post('/ankets', async(req,res)=>{
  console.log('Запрос на получение анкет')
  try{
    const data = req.body
    //Проверка токена и получение данных
    const veryfToken = verifyAndRefreshToken(data.token)
    

  } catch (err){

  }
})

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