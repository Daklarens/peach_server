const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Подключите статические файлы до маршрутов
app.use(express.json({ limit: '13mb' })); 
app.use(bodyParser.urlencoded({ extended: true }));

// Для работы с API
app.use("/api/users", require("./routes/users"));

// Для отображения страницы
app.use("/", require("./routes/auth"));

module.exports = {
  app,
};
