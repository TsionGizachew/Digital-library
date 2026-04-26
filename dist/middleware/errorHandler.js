"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.errorHandler = void 0;
const types_1 = require("../types");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new types_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new types_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new types_1.AppError(message, 400);
};
const handleJWTError = () => new types_1.AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new types_1.AppError('Your token has expired! Please log in again.', 401);
const sendErrorDev = (err, res) => {
    const errorResponse = {
        success: false,
        message: err.message,
        error: err.name,
        stack: err.stack,
        timestamp: new Date().toISOString(),
    };
    res.status(err.statusCode).json(errorResponse);
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        const errorResponse = {
            success: false,
            message: err.message,
            timestamp: new Date().toISOString(),
        };
        res.status(err.statusCode).json(errorResponse);
    }
    else {
        logger_1.logger.error('ERROR 💥', err);
        const errorResponse = {
            success: false,
            message: 'Something went wrong!',
            timestamp: new Date().toISOString(),
        };
        res.status(500).json(errorResponse);
    }
};
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (env_1.isDevelopment) {
        sendErrorDev(err, res);
    }
    else {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
process.on('unhandledRejection', (err) => {
    logger_1.logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger_1.logger.error(err.name, err.message);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger_1.logger.error(err);
    process.exit(1);
});
//# sourceMappingURL=errorHandler.js.map