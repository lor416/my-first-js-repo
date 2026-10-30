class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItemName = page.locator('.cart_list .inventory_item_name').first();
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async getItemNameInCart() {
        return await this.cartItemName.textContent();
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}
module.exports = { CartPage };