const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://restful-booker.herokuapp.com';

// Глобальные переменные для передачи данных между тестами
let bookingId;
let authToken;

// test.describe.serial чтобы тесты шли по порядку
test.describe.serial('CRUD тесты для Restful-booker', () => {

    const bookingData = {
        firstname: "Ivan",
        lastname: "Ivanov",
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-05-01",
            checkout: "2026-05-10"
        },
        additionalneeds: "Breakfast"
    };

    // 1. CREATE (POST)
    test('1. Создание бронирования', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/booking`, {
            data: bookingData
        });

        // Проверки
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('bookingid');
        expect(responseBody.booking).toEqual(bookingData);
        
        // ID ДЛЯ СЛЕДУЮЩИХ ТЕСТОВ
        bookingId = responseBody.bookingid; 
    });

    // 2. READ (GET)
    test('2. Получение информации о бронировании', async ({ request }) => {
        // Используем ID из первого теста
        const response = await request.get(`${BASE_URL}/booking/${bookingId}`);

        // Проверки
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe(bookingData.firstname);
        expect(responseBody.lastname).toBe(bookingData.lastname);
    });

    // 3. UPDATE (PUT)
    test('3. Обновление бронирования', async ({ request }) => {
        // Сначала получаем токен
        const authResponse = await request.post(`${BASE_URL}/auth`, {
            data: { username: "admin", password: "password123" }
        });
        authToken = (await authResponse.json()).token;

        // Новые данные
        const updatedData = {
            firstname: "Petr",
            lastname: "Petrov",
            totalprice: 999,
            depositpaid: false,
            bookingdates: { checkin: "2024-06-01", checkout: "2024-06-05" }
        };

        // Отправляем PUT запрос
        const response = await request.put(`${BASE_URL}/booking/${bookingId}`, {
            headers: {
                'Cookie': `token=${authToken}`
            },
            data: updatedData
        });

        // Проверки
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.firstname).toBe("Petr");
        expect(responseBody.totalprice).toBe(999);
    });

    // 4. DELETE
    test('4. Удаление бронирования', async ({ request }) => {
        // Отправляем DELETE запрос (используем токен из 3-го теста)
        const response = await request.delete(`${BASE_URL}/booking/${bookingId}`, {
            headers: {
                'Cookie': `token=${authToken}`
            }
        });

        // Проверка
        expect(response.status()).toBe(201);

        // Дополнительная проверка: убеждаемся, что брони больше нет (404)
        const getResponse = await request.get(`${BASE_URL}/booking/${bookingId}`);
        expect(getResponse.status()).toBe(404);
    });
});