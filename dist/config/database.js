"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (this.isConnected) {
            logger_1.logger.info('Database already connected');
            return;
        }
        try {
            const uri = env_1.isTest ? env_1.env.MONGODB_TEST_URI : env_1.env.MONGODB_URI;
            const options = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                family: 4,
                bufferCommands: false,
            };
            await mongoose_1.default.connect(uri, options);
            this.isConnected = true;
            logger_1.logger.info(`Database connected successfully to ${env_1.isTest ? 'test' : 'production'} database`);
            mongoose_1.default.connection.on('error', (error) => {
                logger_1.logger.error('Database connection error:', error);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('disconnected', () => {
                logger_1.logger.warn('Database disconnected');
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('reconnected', () => {
                logger_1.logger.info('Database reconnected');
                this.isConnected = true;
            });
        }
        catch (error) {
            logger_1.logger.error('Database connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            logger_1.logger.info('Database disconnected successfully');
        }
        catch (error) {
            logger_1.logger.error('Error disconnecting from database:', error);
            throw error;
        }
    }
    async clearDatabase() {
        if (!env_1.isTest) {
            throw new Error('Database clearing is only allowed in test environment');
        }
        try {
            const collections = mongoose_1.default.connection.collections;
            for (const key in collections) {
                const collection = collections[key];
                await collection.deleteMany({});
            }
            logger_1.logger.info('Test database cleared successfully');
        }
        catch (error) {
            logger_1.logger.error('Error clearing test database:', error);
            throw error;
        }
    }
    getConnectionStatus() {
        return this.isConnected && mongoose_1.default.connection.readyState === 1;
    }
    async healthCheck() {
        try {
            if (!this.isConnected) {
                return { status: 'error', message: 'Database not connected' };
            }
            await mongoose_1.default.connection.db.admin().ping();
            return {
                status: 'healthy',
                message: `Database connection is healthy. ReadyState: ${mongoose_1.default.connection.readyState}`
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
exports.database = Database.getInstance();
process.on('SIGINT', async () => {
    logger_1.logger.info('Received SIGINT. Gracefully shutting down database connection...');
    await exports.database.disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger_1.logger.info('Received SIGTERM. Gracefully shutting down database connection...');
    await exports.database.disconnect();
    process.exit(0);
});
//# sourceMappingURL=database.js.map