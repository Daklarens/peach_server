
const BASE_URL = 'https://podryvanov.ru/api/users';

// Универсальная функция для выполнения fetch запросов
async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}` 
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error; // Пробрасываем ошибку дальше, чтобы обработать её на уровне компонента
    }
}

// Функция для GET запросов
export async function getData(endpoint) {
    return apiFetch(endpoint);
}

// Функция для POST запросов
export async function postData(endpoint, data) {
    return apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// Можно добавить другие функции для PUT, DELETE запросов и другие специфические