const express = require('express');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Настраиваем multer для загрузки файлов в папку 'uploads'
const upload = multer({ dest: 'uploads/' });

/*
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
*/



// Подключаем multer для обработки загрузки файлов, до обработки JSON и URL-encoded данных
// 'file' — это имя поля с файлом, нужно уточнить, если другое
app.use(upload.single('file'));

// Подключаем парсинг JSON и URL-encoded данных
// Эти middleware должны быть после multer, чтобы не обрабатывать multipart/form-data запросы
app.use(express.json({ limit: '50mb' })); // Увеличьте лимит в зависимости от ваших нужд
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Подключаем cookie-parser после обработки JSON и URL-encoded
app.use(cookieParser());

// Подключаем статические файлы, желательно после middleware для обработки данных
// Добавление '/dist' для доступа к статическим файлам из папки dist
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../dist')));

// Подключаем маршруты, которые используют multer, json и urlencoded данные
app.use("/api/users/upload", require("./routes/foto"));
app.use("/api/users/", require("./routes/users"));
app.use("/", require("./routes/auth"));

module.exports = {
  app,
};
