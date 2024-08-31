const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

function verifyTelegramData(initDataString) {
    // Извлекаем секретный токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    // Парсим строку initData в объект
    const initData = querystring.parse(initDataString);

    // Преобразуем поле user из URL-кодированной строки JSON обратно в объект, затем в строку JSON
    if (initData.user && typeof initData.user === 'string') {
        initData.user = JSON.stringify(JSON.parse(initData.user)); // Декодируем и форматируем
    }

    // Преобразуем строку JSON user в нужный формат с экранированными кавычками
    if (initData.user) {
        initData.user = initData.user.replace(/"/g, '\\"'); // Экранируем кавычки
        initData.user = initData.user; // Оборачиваем строку user в кавычки и добавляем префикс 'user='
    }

    // Убираем поле hash из данных для проверки
    const { hash, ...data } = initData;

    // Сортируем ключи в алфавитном порядке
    const sortedKeys = Object.keys(data).sort();

    // Формируем строку в нужном формате с разделителем '\n'
    const formattedString = sortedKeys
        .map(key => `${key}=${data[key]}`)
        .join('\n');  // Используем '\n' как разделитель


    console.log('Сформированная строка для хеширования:', formattedString);

    // Создаем хеш на основе токена бота
    const secretKey = crypto.createHmac('sha256', "WebAppData")
        .update(botToken)
        .digest('hex');

    // Генерируем проверочный хеш
    const checkHash = crypto.createHmac('sha256',  formattedString)
        .update(secretKey)
        .digest('hex');

    console.log('Сгенерированный хеш:', checkHash);
    console.log('Хеш от Telegram:', hash);

    // Сравниваем проверочный хеш с хешем из данных Telegram
    return checkHash === hash;
}

module.exports = verifyTelegramData;