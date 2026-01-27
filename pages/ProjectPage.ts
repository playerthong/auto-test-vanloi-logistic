
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
        // 1. Locate the container based on the label and find its input
        const container = this.page.locator('div').filter({ hasText: labelRegex });
        const input = container.locator('input');

        // 2. Click to open the dropdown
        await input.click({ force: true });

        // 3. Locate the listbox
        const listbox = this.page.locator('ul[role="listbox"]');

        // 4. Wait for the listbox to be visible
        await expect(listbox).toBeVisible({ timeout: 10000 });

        /** * 5. CHECK LOAD STATUS:
         * We wait until at least one option (li) exists AND it does not have 
         * placeholder text like "Loading..." or "No options".
         */
        const firstOption = listbox.locator('li[role="option"]').first();

        // Ensure the first option is attached and visible
        await expect(firstOption).toBeVisible({ timeout: 10000 });

        // Optional: If your app shows a "Loading..." li item, wait for it to disappear
        const loadingMessage = listbox.getByText(/Loading|Đang tải/i);
        if (await loadingMessage.isVisible()) {
            await expect(loadingMessage).toBeHidden({ timeout: 10000 });
        }

        // 6. Final verification: Ensure the option has actual text content 
        // (This prevents clicking an empty/ghost row during render)
        await expect(firstOption).not.toBeEmpty();

        // 7. Click the first valid option
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

    async fillDate(locator: Locator, dateString: string) {
        // Expecting dateString in format compatible with input, e.g., "DD/MM/YYYY HH:mm"
        await locator.click(); // Focus
        // Clear potentially? Or just fill.
        // MUI inputs sometimes tricky.
        await locator.fill(dateString);
        await this.page.keyboard.press('Tab'); // Close picker if opened
    }

    async enterStartDate(dateString: string) {
        await this.fillDate(this.startDateInput, dateString);
    }

    async enterEndDate(dateString: string) {
        await this.fillDate(this.endDateInput, dateString);
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
        await this.selectAutocompleteOption(/^Công ty \(\*\)$/);
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
