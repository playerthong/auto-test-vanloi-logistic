import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, ACCOUNT } from "../utils/const";

test.describe('Kiểm thử tính năng Đăng nhập', () => {

    test('Đăng nhập thất bại sẽ hiển thị thông báo lỗi', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(BASE_URL);

        // Thực hiện đăng nhập với thông tin sai
        await loginPage.login("ABC", "123");

        // Kiểm tra thông báo lỗi
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toBeTruthy(); // Kiểm tra xem có text lỗi không
        console.log('Lỗi hiển thị:', errorText);
    });

    test('Đăng nhập admin thành công', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto(BASE_URL);
        await loginPage.login(ACCOUNT.ADMIN.USERNAME, ACCOUNT.ADMIN.PASSWORD);

        // Kiểm tra chuyển hướng sau khi login thành công
        await expect(page).not.toHaveURL(/.*login/);
    });

    test('Đăng nhập operator thành công', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto(BASE_URL);
        await loginPage.login(ACCOUNT.OPERATOR.USERNAME, ACCOUNT.OPERATOR.PASSWORD);

        // Kiểm tra chuyển hướng sau khi login thành công
        await expect(page).not.toHaveURL(/.*login/);
    });
});