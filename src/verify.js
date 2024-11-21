const crypto = require('crypto');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Загружаем переменные окружения

 // Проверка хеша Telegram
 function verifyTelegramData(initDataString) {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) throw new Error('Bot token отсутствует');

        const initData = querystring.parse(initDataString);
        const { hash, ...data } = initData;

        if (!hash) throw new Error('Параметр hash отсутствует');

        if (data.user && typeof data.user === 'string') {
            data.user = JSON.stringify(JSON.parse(data.user)); // Убедимся в правильности JSON
        }

        const sortedKeys = Object.keys(data).sort();
        const dataCheckString = sortedKeys.map(key => `${key}=${data[key]}`).join('\n');

        console.log('Строка проверки данных:', dataCheckString);

        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();

        console.log('Секретный ключ (hex):', secretKey.toString('hex'));

        const checkHash = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        console.log('Сгенерированный хеш:', checkHash);
        console.log('Хеш от Telegram:', hash);

        if (checkHash !== hash) {
            throw new Error('Хеши не совпадают');
        }

        return { valid: true };
    } catch (error) {
        console.error('Ошибка проверки:', error.message);
        return { valid: false, error: error.message };
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