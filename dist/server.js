"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./config/app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const AuthService_1 = require("./services/AuthService");
const SocketService_1 = require("./services/SocketService");
const socket_1 = require("./config/socket");
require("./utils/createUploadsDir");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
async function startServer() {
    try {
        await database_1.database.connect();
        const app = (0, app_1.createApp)();
        const httpServer = (0, http_1.createServer)(app);
        const socketManager = (0, socket_1.initializeSocket)(httpServer);
        const socketService = new SocketService_1.SocketService();
        logger_1.logger.info('Socket.IO initialized successfully');
        const authRoutes = require('./routes/authRoutes').default;
        const userRoutes = require('./routes/userRoutes').default;
        const bookRoutes = require('./routes/bookRoutes').default;
        const adminRoutes = require('./routes/adminRoutes').default;
        const bookingRoutes = require('./routes/bookingRoutes').default;
        const socketRoutes = require('./routes/socketRoutes').default;
        const dashboardRoutes = require('./routes/dashboardRoutes').default;
        const eventsAndAnnouncementsRoutes = require('./routes/eventsAndAnnouncementsRoutes').default;
        app.use(`/api/${env_1.env.API_VERSION}/auth`, authRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/users`, userRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/books`, bookRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/admin`, adminRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/bookings`, bookingRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/socket`, socketRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/dashboard`, dashboardRoutes);
        app.use(`/api/${env_1.env.API_VERSION}/events-announcements`, eventsAndAnnouncementsRoutes);
        app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/build')));
        app.get('*', (req, res) => {
            if (!req.originalUrl.startsWith('/api')) {
                res.sendFile(path_1.default.join(__dirname, '../frontend/build/index.html'));
            }
        });
        (0, app_1.setupErrorHandling)(app);
        const authService = new AuthService_1.AuthService();
        authService.setSocketService(socketService);
        await authService.createDefaultAdmin();
        const server = httpServer.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode`);
            logger_1.logger.info(`📚 Digital Library API v${env_1.env.API_VERSION} is ready!`);
            logger_1.logger.info(`🔗 Health check: http://localhost:${env_1.env.PORT}/health`);
            logger_1.logger.info(`📖 API docs: http://localhost:${env_1.env.PORT}/api-docs`);
            logger_1.logger.info(`⚡ Socket.IO enabled for real-time features`);
            logger_1.logger.info(`👥 Connected users: ${socketManager.getConnectedUsersCount()}`);
        });
        const gracefulShutdown = async (signal) => {
            logger_1.logger.info(`${signal} received. Starting graceful shutdown...`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed.');
                try {
                    await database_1.database.disconnect();
                    logger_1.logger.info('Database connection closed.');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.logger.error('Error during graceful shutdown:', error);
                    process.exit(1);
                }
            });
            setTimeout(() => {
                logger_1.logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map