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
const initData = 'query_id=AAGYe81ZAAAAAJh7zVl7LhNo&user=%7B%22id%22%3A1506638744%2C%22first_name%22%3A%22Dark%22%2C%22last_name%22%3A%22Larens%22%2C%22username%22%3A%22darklarens%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FaghIYI433tIXDaTOAbs8UFlPOFr6rXL-lnVw9hnwt4c.svg%22%7D&auth_date=1732222577&signature=O6efb1azqJxSn5ItpDPBs_BNEAakihdaKK3pagDHNiOMqXr79YdJBTxPVR05m1wKyYjTrOZJ5qe1uXdOTTPJDA&hash=bcbfe36988f6828c7b48f3392c3bae6a8cdf1c51982e012feb6c0e911ccb46c4'

console.log('Проверка хеша:', verifyTelegramData(initData));