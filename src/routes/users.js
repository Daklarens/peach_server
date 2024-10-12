const express = require("express");
const path = require('path');
const fs = require('fs');
const TeleBot = require('telebot');
const UserService = require('../services/servicesUser');
const service = new UserService.UserService();
const { verifyTelegramData, createToken, verifyAndRefreshToken } = require('../verify');
//const { update } = require("lodash");
const router = express.Router();
const uploadsDir = path.join(__dirname, '../processed');
require('dotenv').config();
const bot = new TeleBot({token: process.env.TELEGRAM_BOT_TOKEN,usePlugins: ['askUser']});

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
      console.log(userCheck)
      const outData = { ...userCheck, token };
      res.send(outData);
    } else {
      res.sendStatus(502);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(502);
  }
});

router.post('/ankets', async(req,res)=>{
  console.log('Запрос на получение анкет')
  try{
    const data = req.body
    //Проверка токена и получение данных
    const veryfToken = await verifyAndRefreshToken(data.token)
    if(veryfToken.token != null){
      console.log(data.actions)
      const actionsA = await service.actionsAnkets(veryfToken.decoded.id,data.actions)
      const userAnket = await service.getAnketsForUser(veryfToken.decoded.id,data.page)
      if(userAnket){
        res.send({token:veryfToken.token,data:userAnket, update:actionsA})
      }else{
        res.send({token:veryfToken.token,data:userAnket, update:actionsA})
      }
    }else{
      res.send({token:'0000000000',data:'0000000000'})
    }
  } catch (err){
    console.log(err)
    res.send({token:'0000000000',data:'0000000000'})
  }
})

router.post('/match', async(req,res)=>{
  console.log('Запрос на получение взаимных анкет')
  try{
    const data = req.body
    //Проверка токена и получение данных
    const veryfToken = await verifyAndRefreshToken(data.token)
    if(veryfToken.token != null){
      // если токен правильный 
      const getMatchUsers = await service.matchAnkets(veryfToken.decoded.id)
      if(getMatchUsers){
        res.send({token:veryfToken.token,data:getMatchUsers})
      }else{
        res.send({token:veryfToken.token,data:false})
      }
    }else{
      res.send({token:'0000000000',data:false})
    }
  } catch (err){
    console.log(err)
    res.send({token:'0000000000',data:false})
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

router.post('/getPeachUser', (req,res)=>{
  const data = req.body.data
  console.log(data)
  bot.sendMessage(data.tid,`Вы выбрали пользователя с id ${data.ttid}`)
})

bot.start();

module.exports = router;