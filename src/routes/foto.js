const express = require("express");
const router = express.Router();

router.post("/upload", function (req, res, next) {
    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});


module.exports = router;