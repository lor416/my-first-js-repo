class CheckoutCompletePage {
    constructor(page) {
        this.page = page;
        this.completeHeader = page.locator('.complete-header');
    }

    async getCompletionMessage() {
        return await this.completeHeader.textContent();
    }
}
module.exports = { CheckoutCompletePage };