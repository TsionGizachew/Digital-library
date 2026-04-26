"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandling = exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
const notFoundHandler_1 = require("../middleware/notFoundHandler");
const createApp = () => {
    const app = (0, express_1.default)();
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                scriptSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    const allowedOrigins = env_1.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };
    app.use((0, cors_1.default)(corsOptions));
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
        max: env_1.env.RATE_LIMIT_MAX_REQUESTS,
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.',
            error: 'RATE_LIMIT_EXCEEDED',
            timestamp: new Date().toISOString(),
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use(express_1.default.static('public'));
    app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            environment: env_1.env.NODE_ENV,
            version: env_1.env.API_VERSION,
        });
    });
    return app;
};
exports.createApp = createApp;
const setupErrorHandling = (app) => {
    app.use(notFoundHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
};
exports.setupErrorHandling = setupErrorHandling;
//# sourceMappingURL=app.js.map