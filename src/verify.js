const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

function verifyTelegramData(initDataString) {
    // Извлекаем секретный токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const initData = querystring.parse(initDataString);

    // Если поле user существует и является строкой JSON, преобразуем его обратно в объект
    if (initData.user && typeof initData.user === 'string') {
        initData.user = JSON.parse(initData.user);
    }

    const { hash, ...data } = initData;

    // Если поле user существует как объект, преобразуем его обратно в JSON строку без кодирования
    if (typeof data.user === 'object') {
        data.user = JSON.stringify(data.user);
    }

    // Сортируем ключи и создаем строку для проверки данных с использованием '\n'
    const sortedKeys = Object.keys(data).sort();
    const dataCheckString = sortedKeys
        .map(key => `${key}=${data[key]}`)
        .join('\n'); // Используем '\n' как разделитель

    // Создаем секретный ключ используя HMAC-SHA256 и строку "WebAppData"
    const secretKey = crypto.createHmac('sha256', botToken)
        .update("WebAppData")
        .digest();

    // Генерируем проверочный хеш с использованием секретного ключа
    const checkHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Печатаем для отладки
    console.log('Строка проверки данных:', dataCheckString);
    console.log('Сгенерированный хеш:', checkHash);
    console.log('Полученный хеш от Telegram:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

module.exports = verifyTelegramData;