const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

function verifyTelegramData(initDataString) {
    // Извлекаем секретный токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const initData = querystring.parse(initDataString);
    if (initData.user && typeof initData.user === 'string') {
        initData.user = JSON.parse(initData.user);
    }

    const { hash, ...data } = initData;

    // Если поле user существует как объект, преобразуем его обратно в JSON строку
    if (typeof data.user === 'object') {
        data.user = JSON.stringify(data.user);
    }

    // Сортируем ключи и создаем строку для проверки с использованием '\n'
    const sortedKeys = Object.keys(data).sort();
    const dataString = sortedKeys
        .map(key => `${key}=${data[key]}`)
        .join('\n');  // Используем '\n' как разделитель

    // Создаем секретный ключ на основе токена бота (будет буфер)
    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    // Генерируем проверочный хеш
    const checkHash = crypto.createHmac('sha256', secretKey)
        .update(dataString)
        .digest('hex');

    // Печатаем для отладки
    console.log('Исходная строка:', initDataString);
    console.log('Сформированная строка данных:', dataString);
    console.log('Сгенерированный хеш:', checkHash);
    console.log('Полученный хеш:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

module.exports = verifyTelegramData;