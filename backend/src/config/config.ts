import dotenv from "dotenv"

dotenv.config();

const required = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const optional = (key: string, defaultValue: string): string => {
    const value = process.env[key];
    if (!value) {
        return defaultValue;
    }
    return value;
};

export const config = {
    PORT: parseInt(optional('PORT', '3000'), 10),
    DATABASE_URL: required("DATABASE_URL"),
    JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
    ACCESS_TOKEN_EXPIRES_IN: optional("ACCESS_TOKEN_EXPIRES_IN", "15m"),
    REFRESH_TOKEN_EXPIRES_IN_DAYS: parseInt(optional("REFRESH_TOKEN_EXPIRES_IN_DAYS", "7"), 10),
    NODE_ENV: optional("NODE_ENV", "dev")
}
