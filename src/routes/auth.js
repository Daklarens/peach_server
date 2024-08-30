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
  const userSession = await UserService.findSessionUser(req.cookies["sessionId"]);
  if(userSession){
    const user = await UserService.findUser(userSession.userId);
    req.user = user;
  }
  
  req.sessionId = req.cookies["sessionId"];
  next();
};

router.get("/", auth(), async (req, res) => {
  let message, truMess;
  switch (req.query.authError) {
    case "0":
      message = errorMessage[0];
      break;
    case "1":
      message = errorMessage[1];
      break;

    default:
      message = "";
      break;
  }
  if (req.query.signup) {
    truMess = "Регистрация прошла успешно";
  }
  res.render("index", {
    user: req.user,
    authError: message,
    signup: truMess,
  });
  if (req.user) {
    const checkTimer = await TimerService.countTimer(req.user._id);
    if (checkTimer === 0 || checkTimer === undefined) {
      await TimerService.createNewTimer("First timer", req.user._id);
    }
  }
});

router.post("/signup", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = await UserService.findUser(username);
  if (!user) {
    let pass = await generateHash(password);
    await UserService.addUser(username, pass);
    res.redirect("/?signup=true");
  } else {
    res.redirect("/?authError=1");
  }
});

router.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const { username, password } = req.body;
  const user = await UserService.findUser(username);
  if (!user || user.password !== (await generateHash(password))) {
    return res.redirect("/?authError=0");
  }
  const sessionId = await UserService.createSession(user._id);
  res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
});

router.get("/logout", auth(), async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  await UserService.deleteSession(req.cookies["sessionId"]);
  res.clearCookie("sessionId");
  res.redirect("/");
});

module.exports = router;