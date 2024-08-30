const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

function verifyTelegramData(initDataString) {
    // Извлекаем секретный токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
   const str = 'auth_date=1725058933\nquery_id=AAGYe81ZAAAAAJh7zVk7ct-Y\nuser=%7B%22id%22%3A1506638744%2C%22first_name%22%3A%22Dark%22%2C%22last_name%22%3A%22Larens%22%2C%22username%22%3A%22darklarens%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D'
    // Создаем секретный ключ используя HMAC-SHA256 и строку "WebAppData"
    const secretKey = crypto.createHmac('sha256', botToken)
        .update("WebAppData")
        .digest();

    // Генерируем проверочный хеш с использованием секретного ключа
    const checkHash = crypto.createHmac('sha256', secretKey)
        .update(str)
        .digest('hex');

    // Печатаем для отладки
    console.log('Строка проверки данных:', secretKey);
    console.log('Сгенерированный хеш:', checkHash);
    //console.log('Полученный хеш от Telegram:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

module.exports = verifyTelegramData;