export const BASE_URL = process.env.BASE_URL || "";
export const ACCOUNT = {
    ADMIN: {
        USERNAME: process.env.USERNAME_ADMIN || "",
        PASSWORD: process.env.PASSWORD_ADMIN || "",
    },
    OPERATOR: {
        USERNAME: process.env.USERNAME_OPERATOR || "",
        PASSWORD: process.env.PASSWORD_OPERATOR || "",
    }
}
