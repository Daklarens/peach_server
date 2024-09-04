const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer  = require("multer");
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
app.use("/api/users/upload", require("./routes/foto"))
app.use(express.json({ limit: '50mb' })); // Увеличьте лимит в зависимости от ваших нужд
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use("/api/users/", require("./routes/users"));
app.use("/", require("./routes/auth"));

module.exports = {
  app,
};
