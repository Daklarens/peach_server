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
// Для JSON
app.use(express.json({ limit: '50mb' })); // Увеличьте лимит в зависимости от ваших нужд
app.use(bodyParser.json({ limit: '50mb' })); // Для body-parser

// Для urlencoded
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Для body-parser


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
