"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isProduction = exports.isDevelopment = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnvVar = (name, defaultValue) => {
    const value = process.env[name];
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value || defaultValue;
};
const getEnvNumber = (name, defaultValue) => {
    const value = process.env[name];
    if (!value && defaultValue === undefined) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value ? parseInt(value, 10) : defaultValue;
};
exports.env = {
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    PORT: getEnvNumber('PORT', 3001),
    API_VERSION: getEnvVar('API_VERSION', 'v1'),
    MONGODB_URI: getEnvVar('MONGODB_URI'),
    MONGODB_TEST_URI: getEnvVar('MONGODB_TEST_URI', 'mongodb://localhost:27017/digital-library-test'),
    JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: getEnvVar('JWT_ACCESS_EXPIRES_IN', '15m'),
    JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
    CORS_ORIGIN: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
    RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
    RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 1000),
    LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
    LOG_FILE: getEnvVar('LOG_FILE', 'logs/app.log'),
    SOCKET_CORS_ORIGIN: getEnvVar('SOCKET_CORS_ORIGIN', 'http://localhost:3000'),
    ADMIN_EMAIL: getEnvVar('ADMIN_EMAIL'),
    ADMIN_PASSWORD: getEnvVar('ADMIN_PASSWORD'),
    CLOUDINARY_CLOUD_NAME: getEnvVar('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
};
exports.isDevelopment = exports.env.NODE_ENV === 'development';
exports.isProduction = exports.env.NODE_ENV === 'production';
exports.isTest = exports.env.NODE_ENV === 'test';
//# sourceMappingURL=env.js.map