const crypto = require('crypto');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Загружаем переменные окружения

  //Проферка хеша 
  function verifyTelegramData(initDataString) {
    console.log(initDataString)
    try {
        // Парсим initData в объект
        const vals = querystring.parse(initDataString);
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        // Формируем строку проверки данных
        const dataCheckString = Object.keys(vals)
          .filter((key) => key !== 'hash') // Исключаем hash
          .sort() // Сортируем ключи
          .map((key) => `${key}=${decodeURIComponent(vals[key])}`) // Декодируем значение
          .join('\n');
    
        // Создаем секретный ключ
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
          .update(botToken)
          .digest();
    
        // Вычисляем хэш строки проверки данных
        const h = crypto.createHmac('sha256', secretKey)
          .update(dataCheckString)
          .digest('hex');
    
        // Возвращаем результат проверки
        return {hash: true, data:vals};
      } catch (error) {
        console.error('Ошибка проверки initData:', error);
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