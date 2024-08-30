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
     // Сортируем ключи и создаем строку для проверки

     if (typeof data.user === 'object') {
        data.user = JSON.stringify(data.user);
    }

    const dataString = Object.entries(data)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&'); 
    // Генерируем проверочный хеш
    const checkHash = crypto.createHmac('sha256', 'b578e1e59507bcd86d0b4732700fdb15e8ff1b6c5e3fc431fbc93b20539b2131')
    .update(dataString)
    .digest('hex');

    // Печатаем для отладки
    console.log('Строка',initDataString);
    console.log('Сформированная строка данных:', dataString);
    console.log('Сгенерированный хеш:', checkHash);
    console.log('Полученный хеш:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
 return checkHash === hash;
}

module.exports = verifyTelegramData;