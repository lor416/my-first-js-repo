class InventoryPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.locator('.title');
        this.cartIcon = page.locator('.shopping_cart_link');
        // Локатор для сортировки
        this.sortDropdown = page.locator('[data-test="product-sort-container"]'); 
        // Локатор первой кнопки "Add to cart" после сортировки
        this.firstAddToCartBtn = page.locator('.btn_inventory').first();
        // Локатор названия первого товара в списке
        this.firstItemName = page.locator('.inventory_item_name').first();
    }

    async getPageTitle() {
        return await this.pageTitle.textContent();
    }

    async sortByPriceHighToLow() {
        await this.sortDropdown.selectOption('hilo'); // по возрастанию 
    }

    async addMostExpensiveItemToCart() {
        await this.sortByPriceHighToLow();
        // имя товара
        const itemName = await this.firstItemName.textContent(); 
        await this.firstAddToCartBtn.click();
        return itemName; // Возвращаем имя, чтобы тест мог его использовать
    }

    async openCart() {
        await this.cartIcon.click();
    }
}
module.exports = { InventoryPage };