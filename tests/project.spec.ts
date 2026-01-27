
import { test, expect, Page } from '@playwright/test';
import { ProjectPage } from '../pages/ProjectPage';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, ACCOUNT } from "../utils/const";
import { companyData } from '../data_testing/company.ts';

test.describe('Project Creation', () => {

    test('Create new Project linked to Company', async ({ page }) => {
        // 1. Login
        const loginPage = new LoginPage(page);
        await page.goto(BASE_URL);
        await loginPage.login(ACCOUNT.ADMIN.USERNAME, ACCOUNT.ADMIN.PASSWORD);
        await page.waitForSelector('text=Version App', { state: 'visible', timeout: 30000 }); // Wait for login success

        // 2. Initialize POM
        const projectPage = new ProjectPage(page);

        // 3. Navigate
        await projectPage.goto();
        await page.waitForLoadState('domcontentloaded');

        // 4. Fill Data
        // Use the Company Name from the fixture we (hypothetically) created in company-create step.
        // Assuming "Cong Ty Test Logistics 3PL" exists.
        const targetCompany = companyData.name;

        await projectPage.createProject({
            company: targetCompany,
            name: `Project for ${companyData.code}`,
            active: true,
            // Future dates to avoid validation errors
            startDate: '01/01/2026 08:00',
            endDate: '31/12/2026 17:00',
            region: 'southern', // Valid value from projectForm.tsx logic (mocked logic or known values)
            description: 'Automated project creation test',
        });

        // 5. Verify Success
        await expect(page.locator('.MuiSnackbar-root')).toContainText(/thành công|success/i, { timeout: 10000 });

        // Optional: Verify redirection to Edit page
        await expect(page).toHaveURL(/.*\/company\/project\/edit\/.*/);
    });
});
