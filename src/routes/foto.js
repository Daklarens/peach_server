const express = require("express");
const multer  = require("multer");
const router = express.Router();

const upload = multer({dest:"uploads"});
router.post("/upload", upload.single("filedata"), function (req, res, next) {
   
    let filedata = req.file;
 
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});


module.exports = router;