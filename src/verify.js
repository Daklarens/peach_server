const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

function verifyTelegramData(initDataString) {
    // Извлекаем секретный токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const initData = querystring.parse(initDataString);
    if (initData.user) {
        initData.user = JSON.parse(initData.user);
    }
    const { hash, ...data } = initData;

    const sortedData = Object.keys(data)
    .sort()
    .map(key => `${key}=${typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]}`)
    .join('&');  // Используем & для соединения параметров
    console.log(sortedData)
    // Создаем секретный ключ на основе токена бота
    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    // Генерируем проверочный хеш
    const checkHash = crypto.createHmac('sha256', secretKey)
        .update(sortedData)
        .digest('hex');

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

module.exports = verifyTelegramData;