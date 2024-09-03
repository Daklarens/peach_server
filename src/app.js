const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
  console.log('Incoming Request Headers:', req.headers);
  req.on('data', chunk => {
    console.log('Received chunk:', chunk.toString());
  });
  req.on('end', () => {
    console.log('End of request');
  });
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: '13mb' })); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Настройка для обычных статических файлов
app.use(express.static(path.join(__dirname, '../dist')));

// Для работы с API
app.use("/api/users/", require("./routes/users"));

// Для отображения страницы
app.use("/", require("./routes/auth"));

module.exports = {
  app,
};
