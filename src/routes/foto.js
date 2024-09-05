const express = require("express");
const FileService = require('../services/FileService');
const UserService = require('../services/servicesUser');
const service = new UserService.UserService();
const router = express.Router();
router.post('/', async (req, res) => {    
    try {
        // Проверка, загружен ли файл
        if (!req.file) {
            return res.status(400).send('Файл не загружен');
        }
        const outputDir = path.join(__dirname, '../processed'); // Путь к папке для сохранения обработанных изображений
        const filename = await FileService.processAndSaveImage(req.file, outputDir);
        // Обработка данных пользователя, если они переданы отдельно
        if (req.body.data) {
            try {

                const userData = JSON.parse(req.body.data);
                console.log('Данные пользователя:', userData);
                req.body.data.avatar = filename
                const dataOut = await service.createAnkets(req.body.data)
                console.log(dataOut)

            } catch (parseError) {
                console.error('Ошибка парсинга данных пользователя:', parseError);
                return res.status(400).send('Некорректные данные пользователя');
            }
        } else {
            console.log('Данные пользователя отсутствуют');
        }

        res.send(`Файл ${req.file.originalname} успешно загружен`);
    } catch (error) {
        console.error('Ошибка при обработке загрузки:', error);
        res.status(500).send('Ошибка при обработке запроса');
    }
});


module.exports = router;