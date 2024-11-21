const crypto = require('crypto');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Загружаем переменные окружения

 // Проверка хеша Telegram
function verifyTelegramData(initDataString) {
    try {
        // Парсим строку initData в объект
        const initData = querystring.parse(initDataString);

        // Извлекаем токен бота из переменных окружения
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new Error('TELEGRAM_BOT_TOKEN не установлен');
        }

        // Отделяем hash и signature от остальных данных
        const { hash, signature, ...data } = initData;

        // Преобразуем поле user из URL-кодированной строки JSON обратно в JSON строку
        if (data.user && typeof data.user === 'string') {
            data.user = JSON.stringify(JSON.parse(data.user)); // Убедимся, что поле user в нужном формате
        }

        // Сортируем ключи и создаем строку проверки данных
        const sortedKeys = Object.keys(data).sort();
        const dataCheckString = sortedKeys
            .map(key => `${key}=${data[key]}`)
            .join('\n'); // Используем '\n' как разделитель

        // --- Проверка hash ---
        // Создаем секретный ключ используя HMAC-SHA256 и строку "WebAppData"
        const secretKey = crypto.createHmac('sha256', "WebAppData")
            .update(botToken)
            .digest();

        // Генерируем проверочный хеш с использованием секретного ключа
        const checkHash = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        // --- Проверка signature ---
        // Генерируем проверочный signature с использованием токена бота
        const checkSignature = crypto.createHmac('sha256', botToken)
            .update(dataCheckString)
            .digest('hex');

        // Сравниваем проверочный хеш и сигнатуру с данными Telegram
        if (checkHash === hash && checkSignature === signature) {
            return { hash: true, data: initData };
        } else {
            return { hash: false };
        }
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