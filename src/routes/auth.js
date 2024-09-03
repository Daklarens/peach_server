const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const servicesUser = require("../services/servicesUser");
const servicesTimer = require("../services/servicesTimer");


const UserService = new servicesUser.UserService();
const TimerService = new servicesTimer.TimerService();

router.get("/", async (req, res) => {
  console.log(' main ')
  res.sendFile("index.html");
});
router.post("/k/", async (req, res) => {
  console.log('kkkkkkkk')
});





module.exports = router;