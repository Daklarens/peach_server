const express = require("express");
const router = express.Router();
const servicesUser = require("../services/servicesUser");
const servicesTimer = require("../services/servicesTimer");

const UserService = new servicesUser.UserService();
const TimerService = new servicesTimer.TimerService();
 
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
  if (req.query.isActive === "true") {
    res.json(await TimerService.getActiveTimers(req.user._id));
  } else {
    res.json(await TimerService.getOldTimers(req.user._id));
  }
});

router.post("/", auth(), async (req, res) => {
  const newTimer = await TimerService.createNewTimer(req.body.description, req.user._id);
  res.json({ id: newTimer});
});

router.post("/:id/stop", auth(), async(req, res) => {
  res.json( await TimerService.stopTimer(req.params.id, req.user._id));
});

module.exports = router;

