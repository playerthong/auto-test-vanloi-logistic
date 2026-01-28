import { test, expect } from '@playwright/test';
import { CompanyPage } from '../pages/CompanyPage';
import { LoginPage } from '../pages/LoginPage';
import { BASE_URL, ACCOUNT } from "../utils/const";
import { companyData } from '../data_testing/company';

test('Tạo được công ty mới từ dữ liệu JSON', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(BASE_URL);
    await loginPage.login(ACCOUNT.ADMIN.USERNAME, ACCOUNT.ADMIN.PASSWORD);
    await page.waitForSelector('text=Version App', { state: 'visible', timeout: 30000 }); // Wait for login success

    const companyPage = new CompanyPage(page);
    const congTyWidget = page.getByRole('link', { name: 'Công ty' });
    await congTyWidget.highlight(); // Phần tử sẽ nhấp nháy trên màn hình debug
    await congTyWidget.click();

    // Tìm button có tên là "Mới"
    await page.getByRole('button', { name: 'Mới' }).click();

    // Thực hiện điền form từ JSON
    companyData.name = companyData.name + "-" + Date.now();
    companyData.code = companyData.code + "-" + Date.now();
    await companyPage.createCompany(companyData);

    // Kiểm tra thông báo thành công (giả định dùng Toast message hoặc URL thay đổi)
    await expect(page.locator('.MuiSnackbar-root')).toContainText(/thành công|success/i, { timeout: 10000 });
    await page.goto('/company')
    // 1. Xác định bảng và lấy dòng dữ liệu đầu tiên (không tính tiêu đề thead)
    const firstRow = page.locator('table tbody tr').first();
    console.log(await page.locator('table tbody tr').count()); // Xem có bao nhiêu bảng trên trang
    const codeCell = firstRow.locator('td').nth(1);
    await expect(codeCell).toHaveText(companyData.code);
});