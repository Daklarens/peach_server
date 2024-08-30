const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req)
  console.log(req.body.description);
});

module.exports = router;

