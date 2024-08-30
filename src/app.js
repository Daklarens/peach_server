const express = require("express");
const cookieParser = require("cookie-parser");
const nunjucks = require("nunjucks");
const app = express(); 

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/timers", require("./routes/timers"));
app.use("/", require("./routes/auth"));

module.exports = {
  app,
};
