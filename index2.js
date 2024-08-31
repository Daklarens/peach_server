const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config(); // Загружаем переменные окружения

function verifyTelegramData(initDataString) {
    // Парсим строку initData в объект
    const initData = querystring.parse(initDataString);

    // Извлекаем токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // Отделяем хеш от остальных данных
    const { hash, ...data } = initData;

    // Преобразуем поле user из URL-кодированной строки JSON обратно в JSON строку
    if (data.user && typeof data.user === 'string') {
        data.user = JSON.stringify(JSON.parse(data.user)); // Убедимся, что поле user в нужном формате
    }

    // Сортируем ключи и создаем строку проверки данных
    const sortedKeys = Object.keys(data).sort();
    const dataCheckString = sortedKeys
        .map(key => `${key}=${data[key]}`)
        .join('\n'); // Используем '\n' как разделитель

    // Создаем секретный ключ используя HMAC-SHA256 и строку "WebAppData"
    const secretKey = crypto.createHmac('sha256', "WebAppData")
        .update(botToken)
        .digest();

    // Генерируем проверочный хеш с использованием секретного ключа
    const checkHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Печатаем для отладки
    console.log('Строка проверки данных:', dataCheckString);
    console.log('Секретный ключ (hex):', secretKey.toString('hex'));
    console.log('Сгенерированный хеш:', checkHash);
    console.log('Полученный хеш от Telegram:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

// Пример использования функции с вашими данными
const initData = 'query_id=AAGYe81ZAAAAAJh7zVlchXdp&user=%7B%22id%22%3A1506638744%2C%22first_name%22%3A%22Dark%22%2C%22last_name%22%3A%22Larens%22%2C%22username%22%3A%22darklarens%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725098352&hash=dea1eb5c107ec6a283cabe3e092aa02e20a61566b4f4f6ea900f09e05a8dfbea';

console.log('Проверка хеша:', verifyTelegramData(initData));