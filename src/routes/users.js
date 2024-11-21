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
bot.on('/start', msg=>{
  bot.sendMessage(msg.from.id,'Приветствую!\nТы можешь протестировать приложение нажав на кнопку "peach"\n<a href="https://t.me/+cyf3SRSBm2k4NTky">Наш чат</a>',{parseMode:'html'})
})
// Запуск приложения 
router.post("/", async (req, res) => {
  console.log('Загрузка приложения')
  try {
    const data = req.body;
    console.log(data)
    // Проверка хеша
    const initDataString = 'query_id=AAGYe81ZAAAAAJh7zVlYGAJ5&user=%7B%22id%22%3A1506638744%2C%22first_name%22%3A%22Dark%22%2C%22last_name%22%3A%22Larens%22%2C%22username%22%3A%22darklarens%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FaghIYI433tIXDaTOAbs8UFlPOFr6rXL-lnVw9hnwt4c.svg%22%7D&auth_date=1732218029&signature=SfIubt6sLAcukBwy-u5BJqkzDPaLzHLxFF0vW68OzVr7RDXeqT42__6xOKmnGt5aerOa4qucSQ_o1ddTrVpxCg&hash=30cc685cc4ae7b50585210d2dee9f52ebc846c79697412c4563e988f8303ebfd';
    const isValid = verifyTelegramData(initDataString);//data.initData
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
      //console.log(userCheck)
      const outData = { ...userCheck, token };
      res.send(outData);
    } else {
      console.log('Хеш не совпадает')
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
      if(actionsA){
        if(actionsA.match.length > 0){await service.sendMessageToUsers(actionsA.match,'У вас образовалась взаимная симпатия 💞. Откройте приложение для просмотра',bot)}
        if(actionsA.like.length > 0){await service.sendMessageToUsers(actionsA.like,'Вам поставили 💖',bot)}
      }
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
      const getMeLikes = await service.getMeLikes(veryfToken.decoded.id)
      console.log(getMeLikes)
      if(getMatchUsers|| getMeLikes){
        res.send({token:veryfToken.token,data:getMatchUsers,myLike:getMeLikes})
      }else{
        res.send({token:veryfToken.token,data:false,myLike:false})
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

router.post('/getPeachUser', async(req,res)=>{
  const data = req.body.data
  const getter = await service.getInfoUser(data.ttid)
  bot.sendMessage(data.tid,`Теперь вы можете начать общение с <a href="tg://user?id=${data.ttid}">${data.ancetName}</a>\n@${getter.username}`,{parseMode:'html'})
  res.sendStatus(200)
})

bot.start();

module.exports = router;