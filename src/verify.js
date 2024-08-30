const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

function verifyTelegramData(initDataString) {
    // Извлекаем секретный токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
   const str = 'auth_date=1725058933\nquery_id=AAGYe81ZAAAAAJh7zVk7ct-Y\nuser={id:1506638744,first_name:"Dark",last_name:"Larens",username:"darklarens",language_code:"ru",is_premium:true,allows_write_to_pm:true}'
    // Создаем секретный ключ используя HMAC-SHA256 и строку "WebAppData"
    const secretKey = crypto.createHmac('sha256', botToken)
        .update("WebAppData")
        .digest();

    // Генерируем проверочный хеш с использованием секретного ключа
    const checkHash = crypto.createHmac('sha256', str)
        .update(secretKey)
        .digest('hex');

    // Печатаем для отладки
    console.log('Строка проверки данных:', secretKey);
    console.log('Сгенерированный хеш:', checkHash);
    console.log('Полученный хеш от Telegram:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

module.exports = verifyTelegramData;