
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PlanPage } from '../pages/PlanPage';
import { BASE_URL, ACCOUNT } from "../utils/const";
import planData from '../data_testing/plan.json';

test.describe('Plan Creation from JSON', () => {

    test('Create plans from data_testing/plan.json', async ({ page }) => {
        // 1. Init POMs
        const loginPage = new LoginPage(page);
        const planPage = new PlanPage(page);

        // 2. Login
        await page.goto(BASE_URL);
        await loginPage.login(ACCOUNT.ADMIN.USERNAME, ACCOUNT.ADMIN.PASSWORD);
        await page.waitForSelector('text=Version App', { state: 'visible', timeout: 30000 });

        // 3. Navigate to /plan
        await planPage.goto();

        // 4. Iterate over JSON data and create plans
        for (const plan of planData) {
            await planPage.openCreateForm();

            // Convert ISO strings to Date objects
            const startTime = new Date(plan.startTime);
            const endTime = new Date(plan.endTime);

            await planPage.createPlan({
                start: startTime,
                end: endTime,
                note: plan.note,
                routeRegex: plan.route,
                vehicleGroupRegex: plan.vehicleModelGroup,
                vehicleRegex: plan.vehicle,
                driverRegex: plan.mainDriver,
            });

            // Verify success toast
            await expect(page.locator('.MuiSnackbar-root')).toContainText(/thành công|success/i, { timeout: 10000 });

            // Wait for toast to disappear or just wait a bit before next iteration 
            // to avoid state overlap if clicking "Create Plan" too fast
            await expect(page.locator('.MuiSnackbar-root')).toBeHidden({ timeout: 10000 });
        }
    });

});
