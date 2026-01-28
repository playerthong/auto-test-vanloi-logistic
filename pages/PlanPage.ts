
import { Page, Locator, expect } from '@playwright/test';

export class PlanPage {
    readonly page: Page;
    readonly createButton: Locator;
    readonly noteInput: Locator;
    readonly saveButton: Locator;
    readonly listbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createButton = page.getByRole('button', { name: /TẠO KẾ HOẠCH/i });
        this.noteInput = page.getByPlaceholder('Điền ghi chú...');
        this.saveButton = page.getByRole('button', { name: 'Lưu' });
        this.listbox = page.locator('ul[role="listbox"]');
    }

    async goto() {
        await this.page.goto('/plan');
        await this.page.waitForLoadState('networkidle');
    }

    async openCreateForm() {
        await expect(this.createButton).toBeVisible({ timeout: 10000 });
        await this.createButton.click();
        await expect(this.page.getByText('Kế hoạch mới')).toBeVisible();
    }

    async selectAutocompleteOption(labelRegex: RegExp, optionText?: string) {
        // 1. Locate container
        const container = this.page.locator('div').filter({ hasText: labelRegex });
        const input = container.locator('input');

        // 2. Click to open dropdown
        await input.click({ force: true });

        if (optionText) {
            await input.fill(optionText);
        }

        // 3. Wait for listbox
        await expect(this.listbox).toBeVisible({ timeout: 10000 });

        // 4. Select option
        let optionToClick;
        if (optionText) {
            // If specific text provided, try to find it
            optionToClick = this.listbox.locator('li[role="option"]').filter({ hasText: optionText }).first();
        } else {
            // Default to first available option
            optionToClick = this.listbox.locator('li[role="option"]').first();
        }

        // Wait for loading to finish
        const loadingMessage = this.listbox.getByText(/Loading|Đang tải/i);
        if (await loadingMessage.isVisible()) {
            await expect(loadingMessage).toBeHidden({ timeout: 10000 });
        }

        await expect(optionToClick).toBeVisible({ timeout: 10000 });
        // Verify not empty to avoid ghost clicks
        await expect(optionToClick).not.toBeEmpty();

        await optionToClick.click();
    }

    async fillDateTimePicker(labelText: string, date: Date) {
        // Find container by label text
        const container = this.page.locator('.MuiBox-root')
            .filter({ hasText: labelText })
            .first();

        // Fill separate inputs
        await container.getByRole('spinbutton', { name: 'Day' }).first().fill(date.getDate().toString().padStart(2, '0'));
        await container.getByRole('spinbutton', { name: 'Month' }).first().fill((date.getMonth() + 1).toString().padStart(2, '0'));
        await container.getByRole('spinbutton', { name: 'Year' }).first().fill(date.getFullYear().toString());
        await container.getByRole('spinbutton', { name: 'Hours' }).first().fill(date.getHours().toString().padStart(2, '0'));
        await container.getByRole('spinbutton', { name: 'Minutes' }).first().fill(date.getMinutes().toString().padStart(2, '0'));
    }

    async enterNote(note: string) {
        await this.noteInput.fill(note);
    }

    async submit() {
        await this.saveButton.click();
    }

    async createPlan(data: {
        routeRegex?: string;
        vehicleGroupRegex?: string;
        vehicleRegex?: string;
        driverRegex?: string;
        start?: Date;
        end?: Date;
        note?: string;
    }) {
        // Defaults for regex if not provided, assuming standard labels
        await this.selectAutocompleteOption(/^Tuyến\(\*\)$/, data.routeRegex);
        await this.selectAutocompleteOption(/^Tải trọng xe\(\*\)$/, data.vehicleGroupRegex);
        await this.selectAutocompleteOption(/^Xe\s*\(\*\)$/, data.vehicleRegex);
        await this.selectAutocompleteOption(/^Tài xế chính\s*\(\*\)$/, data.driverRegex);

        if (data.start) {
            await this.fillDateTimePicker('Thời gian bắt đầu', data.start);
        }
        if (data.end) {
            await this.fillDateTimePicker('Thời gian kết thúc', data.end);
        }
        if (data.note) {
            await this.enterNote(data.note);
        }

        await this.submit();
    }
}
