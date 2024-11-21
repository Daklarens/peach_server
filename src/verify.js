const crypto = require('crypto');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Загружаем переменные окружения

  //Проферка хеша 
  function verifyTelegramData(initDataString) {
    // Парсим строку initData в объект
    const initData = querystring.parse(initDataString);

    // Извлекаем токен бота из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // Отделяем хеш от остальных данных
    const { ...data } = initData;
    const { hash } = initData;
    // Преобразуем поле user из URL-кодированной строки JSON обратно в JSON строку
    if (data.user && typeof data.user === 'string') {
        data.user = JSON.stringify(JSON.parse(data.user)); // Убедимся, что поле user в нужном формате
    }

    // Сортируем ключи и создаем строку проверки данных
    const sortedKeys = Object.keys(data).sort();
    let dataCheckString = sortedKeys
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
    if(checkHash === hash){
        return {hash: true, data:initData};
    }else{
        return {hash: false};
    }
    
}
//Создание токена 
function createToken(userData) {

    // Секретный ключ для подписи токена (необходимо хранить в .env)
    const secretKey = String(process.env.JWT_SECRET);

    // Настройки токена, например, время жизни
    const options = {
        expiresIn: '30m' // Токен будет действителен 1 час
    };

    // Создаем и подписываем токен
    const token = jwt.sign(userData, secretKey, options);

    return token;
}
//проверка токена и создание нового
function verifyAndRefreshToken(token, userData) {
    const secretKey = String(process.env.JWT_SECRET) ;

    try {
        // Проверяем токен
        const decoded = jwt.verify(token, secretKey);
        return { valid: true, token, decoded }; // Возвращаем токен, если он ещё действителен
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Если токен истёк, создаём новый
            console.log('Токен истёк, создаём новый...');
            const newToken = createToken(userData); // Функция для создания нового токена
            return { valid: false, token: newToken, decoded: null };
        } else {
            // Другие ошибки проверки токена
            console.error('Ошибка проверки токена:', error.message);
            return { valid: false, token: null, decoded: null };
        }
    }
}

function verifyDecode(token) {
    const secretKey = String(process.env.JWT_SECRET) ;
    try {
        // Проверяем токен
        const decoded = jwt.verify(token, secretKey);
        return { valid: true, token, decoded }; 
    } catch (error) {
        console.error('Ошибка проверки токена:', error.message);
        return { valid: false, token: null, decoded: null };
    }
}

module.exports = {verifyTelegramData,createToken,verifyAndRefreshToken,verifyDecode};