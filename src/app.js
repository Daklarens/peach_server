const express = require("express");
const cookieParser = require("cookie-parser");
const path = require('path');
const bodyParser = require('body-parser');
const app = express(); 

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '13mb' })); 
app.use(bodyParser.urlencoded({ extended: true }));
//Для работы с api
app.use("/api/users", require("./routes/users"));
//Для отображения страницы
app.use("/", require("./routes/auth"));

module.exports = {
  app,
};
