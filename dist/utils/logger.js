"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logWarn = exports.logInfo = exports.logError = exports.morganStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
const logDir = path_1.default.dirname(env_1.env.LOG_FILE);
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => {
    if (info instanceof Error) {
        return `${info.timestamp} ${info.level}: ${info.stack}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
}));
const transports = [
    new winston_1.default.transports.Console({
        level: env_1.isDevelopment ? 'debug' : 'info',
    }),
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    }),
    new winston_1.default.transports.File({
        filename: env_1.env.LOG_FILE,
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    }),
];
exports.logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL,
    levels,
    format,
    transports,
    exitOnError: false,
});
exports.morganStream = {
    write: (message) => {
        exports.logger.http(message.trim());
    },
};
const logError = (error, context) => {
    exports.logger.error('Error occurred', {
        message: error.message,
        stack: error.stack,
        context,
    });
};
exports.logError = logError;
const logInfo = (message, context) => {
    exports.logger.info(message, context);
};
exports.logInfo = logInfo;
const logWarn = (message, context) => {
    exports.logger.warn(message, context);
};
exports.logWarn = logWarn;
const logDebug = (message, context) => {
    exports.logger.debug(message, context);
};
exports.logDebug = logDebug;
//# sourceMappingURL=logger.js.map