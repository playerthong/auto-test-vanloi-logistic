import { Page, Locator } from '@playwright/test';

export class CompanyPage {
    readonly page: Page;
    // Khai báo các Locators
    readonly nameInput: Locator;
    readonly codeInput: Locator;
    readonly businessTypeSelect: Locator;
    readonly companyTypeSelect: Locator;
    readonly feeVatInput: Locator;
    readonly streetInput: Locator;
    readonly cityInput: Locator;
    readonly countryInput: Locator;
    readonly vatInput: Locator;
    readonly emailInput: Locator;
    readonly detailInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Mapping dựa trên label hoặc name thông thường của các hệ thống Logistics
        this.nameInput = page.locator('input[name="name"]');
        this.codeInput = page.locator('input[name="code"]');
        this.businessTypeSelect = page.locator('select[name="businessType"]');
        this.companyTypeSelect = page.locator('select[name="companyType"]');
        this.feeVatInput = page.locator('input[name="feeVat"]');
        this.streetInput = page.getByPlaceholder('Street');
        this.cityInput = page.getByPlaceholder('City');
        this.countryInput = page.getByPlaceholder('Select country *');
        this.vatInput = page.locator('input[name="vat"]');
        this.emailInput = page.locator('input[name="email"]');
        this.detailInput = page.locator('textarea[name="companyDetails"]');
        this.saveButton = page.getByRole('button', { name: /save|Tạo Mới|create/i });
    }

    /**
     * Hàm điền toàn bộ thông tin từ đối tượng JSON
     */
    async createCompany(data: any) {
        await this.nameInput.fill(data.name);
        await this.codeInput.fill(data.code);
        await this.businessTypeSelect.selectOption(data.businessType);
        await this.companyTypeSelect.selectOption(data.companyType);
        await this.feeVatInput.fill(data.feeVat);
        await this.streetInput.fill(data.street);
        await this.cityInput.fill(data.city);
        await this.vatInput.fill(data.vat);
        await this.detailInput.fill(data.detail);
        await this.emailInput.fill(data.email);
        await this.countryInput.fill(data.country);
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
        // Có thể thêm các trường khác tương tự...

        await this.saveButton.click();
    }
}