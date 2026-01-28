
import { Page, Locator, expect } from '@playwright/test';

export class ProjectPage {
    readonly page: Page;
    readonly companyInput: Locator;
    readonly nameInput: Locator;
    readonly activeCheckbox: Locator;
    readonly startDateInput: Locator;
    readonly endDateInput: Locator;
    readonly regionSelect: Locator;
    readonly descriptionInput: Locator;
    readonly submitButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locators based on Box > Typography + Component structure
        this.companyInput = page.locator('div')
            .filter({ hasText: /^Công ty \*$/ })
            .getByRole('textbox') // Autocomplete input
            .first();

        this.nameInput = page.locator('input[name="name"]');

        this.activeCheckbox = page.getByRole('checkbox');

        this.startDateInput = page.locator('div')
            .filter({ hasText: /^Ngày bắt đầu \*$/ })
            .getByRole('textbox')
            .first();

        this.endDateInput = page.locator('div')
            .filter({ hasText: /^Ngày kết thúc \*$/ })
            .getByRole('textbox')
            .first();

        this.regionSelect = page.locator('select[name="region"]');
        this.descriptionInput = page.locator('input[name="description"]');

        this.submitButton = page.getByRole('button', { name: /Tạo Mới/i });
        this.backButton = page.getByRole('button', { name: /Quay lại/i });
    }
    async selectAutocompleteOption(labelRegex: RegExp) {
        // 1. Tìm container bọc ngoài cùng có chứa text "Công ty *"
        const container = this.page.locator('div.MuiBox-root').filter({ hasText: /^Công ty \*/ });

        // 2. Từ container đó, tìm input có role combobox
        const input = container.locator('input[role="combobox"]');
        console.log(`Số lượng input tìm thấy: ${await input.count()}`);

        // 2. Click để mở dropdown
        // Đảm bảo element sẵn sàng trước khi click
        await input.waitFor({ state: 'visible' });
        await input.click();

        // 3. Chọn option đầu tiên xuất hiện trong listbox
        const firstOption = this.page.locator('ul[role="listbox"] li').first();
        await firstOption.waitFor({ state: 'visible' });
        await firstOption.click();
    };
    async goto() {
        await this.page.goto('/company/project/create');
    }

    async selectCompany(companyName: string) {
        // Click to focus and trigger dropdown if needed, or just type
        await this.companyInput.click();
        await this.companyInput.fill(companyName);

        // Wait for the dropdown option to appear and be visible
        // MUI Autocomplete options usually have role="option"
        // We select the one that matches text exactly or contains it safely
        const option = this.page.getByRole('option', { name: companyName }).first();
        await expect(option).toBeVisible();
        await option.click();
    }

    async fillProjectName(name: string) {
        await this.nameInput.fill(name);
    }

    async toggleActive(active: boolean) {
        const isChecked = await this.activeCheckbox.isChecked();
        if (isChecked !== active) {
            await this.activeCheckbox.click();
        }
    }

    async selectRegion(regionValue: string) {
        await this.regionSelect.selectOption(regionValue);
    }

    async fillDescription(desc: string) {
        await this.descriptionInput.fill(desc);
    }
    async fillDatePicker(label: string, dateString: string) {
        // 1. Tìm container chứa label tương ứng gần nhất
        const container = this.page.locator('div.MuiBox-root').filter({
            has: this.page.locator('p', { hasText: label })
        }).last();
        const date = new Date(dateString);
        const targetYear = date.getUTCFullYear();
        const targetMonth = date.getUTCMonth() + 1;
        const targetDay = date.getUTCDate();
        const targetHours = date.getUTCHours();
        const targetMinutes = date.getUTCMinutes();
        await container.highlight();
        console.log("target date", `${targetDay}/${targetMonth}/${targetYear}`)
        await container.getByRole('spinbutton', { name: 'Day' }).first().fill(targetDay.toString());

        await container.getByRole('spinbutton', { name: 'Month' }).first().fill(targetMonth.toString());
        await container.getByRole('spinbutton', { name: 'Year' }).first().fill(targetYear.toString());
        await container.getByRole('spinbutton', { name: 'Hours' }).first().fill(targetHours.toString());
        await container.getByRole('spinbutton', { name: 'Minutes' }).first().fill(targetMinutes.toString());

        // Đôi khi cần nhấn Enter để xác nhận giá trị trong MUI
        // await dateInput.press('Enter');
    }
    async fillDate(locator: Locator, dateString: string) {
        // Expecting dateString in format compatible with input, e.g., "DD/MM/YYYY HH:mm"
        await locator.click(); // Focus
        // Clear potentially? Or just fill.
        // MUI inputs sometimes tricky.
        await locator.fill(dateString);
        await this.page.keyboard.press('Tab'); // Close picker if opened
    }

    async enterStartDate(dateString: string) {
        await this.fillDatePicker("Ngày bắt đầu *", dateString);
    }

    async enterEndDate(dateString: string) {
        await this.fillDatePicker("Ngày kết thúc *", dateString);
    }

    async submit() {
        await this.submitButton.click();
    }

    async createProject(data: {
        company: string;
        name: string;
        active?: boolean;
        startDate: string;
        endDate: string;
        region: string;
        description?: string;
    }) {
        await this.selectAutocompleteOption(/^Công ty/);
        await this.fillProjectName(data.name);

        if (typeof data.active === 'boolean') {
            await this.toggleActive(data.active);
        }

        await this.enterStartDate(data.startDate);
        await this.enterEndDate(data.endDate);

        await this.selectRegion(data.region);

        if (data.description) {
            await this.fillDescription(data.description);
        }

        await this.submit();
    }
}
