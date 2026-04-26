export interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    API_VERSION: string;
    MONGODB_URI: string;
    MONGODB_TEST_URI: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    LOG_LEVEL: string;
    LOG_FILE: string;
    SOCKET_CORS_ORIGIN: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
}
export declare const env: EnvConfig;
export declare const isDevelopment: boolean;
export declare const isProduction: boolean;
export declare const isTest: boolean;
//# sourceMappingURL=env.d.ts.map