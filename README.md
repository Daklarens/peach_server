

````markdown
# Peach — Telegram Mini App для знакомств

**Peach** — это backend-сервер для мини-приложения Telegram, предназначенного для знакомств. Пользователи создают анкеты, ставят лайки, получают совпадения и могут общаться в чате — всё прямо внутри Telegram благодаря WebApp.


## 🔥 Основной функционал

- Аутентификация через Telegram WebApp
- Создание и редактирование анкеты пользователя
- Просмотр анкет других участников
- Свайпы (лайк/дизлайк)
- Обнаружение взаимных лайков (матчи)
- Чат между пользователями с совпадениями

---

## 🚀 Установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/Daklarens/peach_server.git
   cd peach_server
````

2. Установите зависимости:

   ```bash
   npm install
   ```

3. Создайте файл `.env` в корне проекта и заполните переменные:

   ```
   PORT=3000
   DB_URL=mongodb://localhost:27017/peach
   BOT_TOKEN=<ВАШ_TELEGRAM_BOT_TOKEN>
   FRONTEND_URL=https://ваш-домен-фронта
   ```

4. Запустите сервер:

   ```bash
   npm start
   ```

---

## 📦 API

| Метод | Эндпоинт            | Назначение                        |
| ----- | ------------------- | --------------------------------- |
| POST  | `/auth`             | Авторизация через Telegram WebApp |
| POST  | `/createProfile`    | Создать или обновить анкету       |
| GET   | `/nextUser/:id`     | Получить следующего пользователя  |
| POST  | `/like/:id`         | Поставить лайк                    |
| POST  | `/dislike/:id`      | Поставить дизлайк                 |
| GET   | `/matches/:id`      | Получить список совпадений        |
| POST  | `/message`          | Отправить сообщение               |
| GET   | `/messages/:chatId` | Получить историю сообщений        |

---

## 🗃️ Структура данных (MongoDB)

* **User**

  * Telegram ID
  * Имя, возраст, пол, гео
  * Фото, описание, интересы
  * История свайпов и лайков
* **Likes**

  * `userId`, `likedUserId`, `mutual: boolean`
* **Messages**

  * `chatId`, `senderId`, `receiverId`, `text`, `timestamp`

---

## 🛠 Стек технологий

* **Node.js** + **Express** — backend сервер
* **MongoDB** + **Mongoose** — база данных
* **Telegram WebApp** — интерфейс внутри Telegram
* **dotenv**, **axios**, **body-parser**, **cors** и др.

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT**.

---

## 👤 Автор

* GitHub: [@Daklarens](https://github.com/Daklarens)

