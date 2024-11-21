const crypto = require('crypto');
const querystring = require('querystring');

function validateInitData(initData, botToken) {
  try {
    // Парсим initData в объект
    const vals = querystring.parse(initData);

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
    return [h === vals.hash, vals];
  } catch (error) {
    console.error('Ошибка проверки initData:', error);
    return [null, null];
  }
}

// Пример использования
const BOT_TOKEN = '7080055309:AAH0hctq7SeHNEWVr7s6Khn6-ofTVGLiaw8';
const initData = 'query_id=AAGYe81ZAAAAAJh7zVmksysH&user=%7B%22id%22%3A1506638744%2C%22first_name%22%3A%22Dark%22%2C%22last_name%22%3A%22Larens%22%2C%22username%22%3A%22darklarens%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FaghIYI433tIXDaTOAbs8UFlPOFr6rXL-lnVw9hnwt4c.svg%22%7D&auth_date=1732224750&signature=3dVOhnfeCi9loyutVm54ltznVBGmNesepkmTNfRL6dZF0rXkLR_FYkn1P4838KEviaJJmLvwnFkaNUGduOQqBg&hash=c74a90093577b9d2a4f996fc9bd70758edf9ae512f3ab9fb2059fc6f11c9276a';

const [isValid, parsedData] = validateInitData(initData, BOT_TOKEN);

if (isValid) {
  console.log('Данные достоверны:', parsedData);
} else {
  console.log('Данные недостоверны или произошла ошибка.');
}