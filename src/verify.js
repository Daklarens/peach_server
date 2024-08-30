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
     .map(([key, value]) => `${key}=${value}`)
     .join('&'); 


     // Преобразуем обратно в строку URL-параметров
    //const dataString = querystring.stringify(sortedData);

    // Создаем секретный ключ на основе токена бота
    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    // Генерируем проверочный хеш
    const checkHash = crypto.createHmac('sha256', secretKey)
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