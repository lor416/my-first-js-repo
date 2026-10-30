const { test, expect } = require('@playwright/test');

// Импортируем все наши Page Objects
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { CartPage } = require('./pages/CartPage');
const { CheckoutStepOnePage } = require('./pages/CheckoutStepOnePage');
const { CheckoutStepTwoPage } = require('./pages/CheckoutStepTwoPage');
const { CheckoutCompletePage } = require('./pages/CheckoutCompletePage');

test('E2E: Покупка самого дорогого товара (POM)', async ({ page }) => {
    // 1. Инициализируем все страницы
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // 2. Логин и проверка заголовка
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    expect(await inventoryPage.getPageTitle()).toBe('Products');

    // 3. Добавление самого дорогого товара и запоминание его имени
    const expectedItemName = await inventoryPage.addMostExpensiveItemToCart();

    // 4. Переход в корзину и проверка товара
    await inventoryPage.openCart();
    expect(await cartPage.getItemNameInCart()).toBe(expectedItemName);

    // 5. Оформление заказа
    await cartPage.goToCheckout();
    await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');
    await checkoutStepTwoPage.finishCheckout();

    // 6. Проверка успешного завершения
    expect(await checkoutCompletePage.getCompletionMessage()).toBe('Thank you for your order!');
});