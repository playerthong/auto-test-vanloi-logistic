
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PlanPage } from '../pages/PlanPage';
import { BASE_URL, ACCOUNT } from "../utils/const";

test.describe('Schedule Creation Validation', () => {

    test('Validation alerts for missing required fields', async ({ page }) => {
        // Init POMs
        const loginPage = new LoginPage(page);
        const planPage = new PlanPage(page);

        // Login
        await page.goto(BASE_URL);
        await loginPage.login(ACCOUNT.ADMIN.USERNAME, ACCOUNT.ADMIN.PASSWORD);
        await page.waitForSelector('text=Version App', { state: 'visible', timeout: 30000 });

        // Go to Plan page and open create form
        await planPage.goto();
        await planPage.openCreateForm();

        // 1. Missing Route (Tuyến)
        // We do NOT select route.
        // We attempt to submit or check immediate validation? 
        // Assuming validation happens on Submit click or we need to submit to see alert.
        // "alert" usually means a Toast/Snackbar or browser alert.
        // Previous tests checked .MuiSnackbar-root.
        // The prompt says "alert 'Vui lòng chọn tuyến'".
        await planPage.submit();
        await expect(page.locator('.MuiSnackbar-root')).toContainText('Vui lòng chọn tuyến', { timeout: 5000 });
        // Wait for toast to hide to prevent overlapping assertions
        await expect(page.locator('.MuiSnackbar-root')).toBeHidden({ timeout: 5000 });


        // 2. Select Route, but missing Vehicle Model Group (Tải trọng)
        await planPage.selectAutocompleteOption(/^Tuyến\(\*\)$/);
        await planPage.submit();
        await expect(page.locator('.MuiSnackbar-root')).toContainText('Vui lòng chọn tải trọng', { timeout: 5000 });
        await expect(page.locator('.MuiSnackbar-root')).toBeHidden({ timeout: 5000 });

        // 3. Select Vehicle Model Group, but missing Vehicle (Xe)
        await planPage.selectAutocompleteOption(/^Tải trọng xe\(\*\)$/);
        await planPage.submit();
        await expect(page.locator('.MuiSnackbar-root')).toContainText('Vui lòng chọn xe', { timeout: 5000 });
        await expect(page.locator('.MuiSnackbar-root')).toBeHidden({ timeout: 5000 });

        // 4. Select Vehicle, but missing Main Driver (Tài xế chính)
        await planPage.selectAutocompleteOption(/^Xe\s*\(\*\)$/);
        await planPage.submit();
        await expect(page.locator('.MuiSnackbar-root')).toContainText('Vui lòng chọn tài xế', { timeout: 5000 });
    });
});
