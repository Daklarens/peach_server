const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const servicesUser = require("../services/servicesUser");
const servicesTimer = require("../services/servicesTimer");
const errorMessage = ["Логин или пароль не верны", "Пользователь с таким именем уже существует"];

const UserService = new servicesUser.UserService();
const TimerService = new servicesTimer.TimerService();

// hash
async function generateHash(fileBuffer) {
  let fileBufferSha = await crypto.createHash("sha256").update(fileBuffer, "utf8").digest("hex");
  return fileBufferSha;
}

const auth = () => async (req, res, next) => {
  if (!req.cookies["sessionId"]) {
    return next();
  }
  console.log('Проверка пользователя')
  next();
};

router.get("/", auth(), async (req, res) => {
  res.render("index", {
    user: req.user,
  });
});


module.exports = router;