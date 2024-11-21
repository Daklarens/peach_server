const crypto = require('crypto');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Загружаем переменные окружения

 // Проверка хеша Telegram
 function verifyTelegramData(initDataString) {
    try {
        if (!initDataString) {
            throw new Error('Строка initDataString не передана');
        }

        // Парсим строку initData в объект
        const initData = querystring.parse(initDataString);

        // Извлекаем токен бота из переменных окружения
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new Error('TELEGRAM_BOT_TOKEN не установлен');
        }

        // Отделяем hash от остальных данных
        const { hash, ...data } = initData;

        if (!hash) {
            throw new Error('Параметр hash отсутствует');
        }

        // Преобразуем поле user из URL-кодированной строки JSON обратно в JSON строку (если оно есть)
        if (data.user && typeof data.user === 'string') {
            try {
                data.user = JSON.stringify(JSON.parse(data.user));
            } catch (err) {
                throw new Error('Поле user имеет некорректный формат JSON');
            }
        }

        // Сортируем ключи и создаем строку проверки данных
        const sortedKeys = Object.keys(data).sort();
        const dataCheckString = sortedKeys
            .map(key => `${key}=${data[key]}`)
            .join('\n'); // Используем '\n' как разделитель

        // Генерация секретного ключа
        const secretKey = crypto.createHmac('sha256', "WebAppData")
            .update(botToken)
            .digest();

        // Генерация хеша строки проверки данных
        const checkHash = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        // Сравниваем с хешем, предоставленным Telegram
        if (checkHash !== hash) {
            return { hash: false, error: 'Хеш не совпадает' };
        }

        // Дополнительная проверка метки времени auth_date (устаревшие данные)
        const authDate = parseInt(data.auth_date, 10);
        const currentTime = Math.floor(Date.now() / 1000); // Текущее время в Unix
        const maxTimeDiff = 86400; // Максимальная разница (1 день)

        if (isNaN(authDate) || (currentTime - authDate > maxTimeDiff)) {
            return { hash: false, error: 'auth_date устарел или некорректен' };
        }

        // Данные валидны
        return { hash: true, data: initData };
    } catch (err) {
        console.error('Ошибка в verifyTelegramData:', err.message);
        return { hash: false, error: err.message };
    }
}
//Создание токена 
function createToken(userData) {

    // Секретный ключ для подписи токена (необходимо хранить в .env)
    const secretKey = String(process.env.JWT_SECRET);

    // Настройки токена, например, время жизни
    const options = {
        expiresIn: '30m' // Токен будет действителен 1 час
    };

    // Создаем и подписываем токен
    const token = jwt.sign(userData, secretKey, options);

    return token;
}
//проверка токена и создание нового
function verifyAndRefreshToken(token, userData) {
    const secretKey = String(process.env.JWT_SECRET) ;

    try {
        // Проверяем токен
        const decoded = jwt.verify(token, secretKey);
        return { valid: true, token, decoded }; // Возвращаем токен, если он ещё действителен
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Если токен истёк, создаём новый
            console.log('Токен истёк, создаём новый...');
            const newToken = createToken(userData); // Функция для создания нового токена
            return { valid: false, token: newToken, decoded: null };
        } else {
            // Другие ошибки проверки токена
            console.error('Ошибка проверки токена:', error.message);
            return { valid: false, token: null, decoded: null };
        }
    }
}

function verifyDecode(token) {
    const secretKey = String(process.env.JWT_SECRET) ;
    try {
        // Проверяем токен
        const decoded = jwt.verify(token, secretKey);
        return { valid: true, token, decoded }; 
    } catch (error) {
        console.error('Ошибка проверки токена:', error.message);
        return { valid: false, token: null, decoded: null };
    }
}

module.exports = {verifyTelegramData,createToken,verifyAndRefreshToken,verifyDecode};