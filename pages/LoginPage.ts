import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Sử dụng ID vì chúng là duy nhất và ổn định nhất trong HTML của bạn
        this.usernameInput = page.locator('#Username');
        this.passwordInput = page.locator('#password');
        // Nút đăng nhập có type="submit"
        this.loginButton = page.locator('button[type="submit"]');
        // Selector cho thông báo lỗi (thường là các thẻ p hoặc span có class error của Mui)
        this.errorMessage = page.locator('.MuiAlert-colorError');
    }

    /**
     * Thực hiện hành động đăng nhập
     * @param user Tên đăng nhập
     * @param pass Mật khẩu
     */
    async login(user: string, pass: string) {
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }

    /**
     * Lấy nội dung thông báo lỗi hiển thị trên màn hình
     * @returns string
     */
    async getErrorMessage(): Promise<string | null> {
        // Chờ một chút nếu thông báo lỗi xuất hiện trễ
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        return await this.errorMessage.textContent();
    }
}