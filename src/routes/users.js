const express = require("express");
const jwt = require('jsonwebtoken');
const verifyTelegramData = require('../verify');
const router = express.Router();
require('dotenv').config();

// Генерация токена
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '10m' }); // токен с временем жизни 10 минут
}

router.post("/", async (req, res) => {
  const data = req.body.description
  console.log(data);
  const JWT_SECRET = process.env.JWT;
  const isValid = verifyTelegramData(data.initData);
  console.log(isValid)


});

module.exports = router;

