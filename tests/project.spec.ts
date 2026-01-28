
import { test, expect, Page } from '@playwright/test';
import { ProjectPage } from '../pages/ProjectPage';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, ACCOUNT } from "../utils/const";
import { companyData } from '../data_testing/company';
import { projectData } from '../data_testing/project';

test.describe('Project Creation', () => {

    test('Create new Project', async ({ page }) => {
        // 1. Login
        const loginPage = new LoginPage(page);
        console.log("BASE_URL", BASE_URL)
        await page.goto(BASE_URL);
        await loginPage.login(ACCOUNT.ADMIN.USERNAME, ACCOUNT.ADMIN.PASSWORD);
        await page.waitForSelector('text=Version App', { state: 'visible', timeout: 30000 }); // Wait for login success

        // 2. Initialize POM
        const projectPage = new ProjectPage(page);

        // 3. Navigate
        await projectPage.goto();
        await page.waitForLoadState('domcontentloaded');

        // 4. Fill Data
        const targetCompany = companyData.name;

        await projectPage.createProject(projectData);

        // 5. Verify Success 
        await expect(page).toHaveURL(/.*\/company\/project\/edit\/.*/);
    });
});
