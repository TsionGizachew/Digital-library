"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const types_1 = require("../types");
const env_1 = require("../config/env");
const errorHandler_1 = require("./errorHandler");
exports.authenticate = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    console.log('--- Authenticate Middleware ---');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log('Token:', token);
    if (!token) {
        console.log('Authentication failed: No token provided.');
        return next(new types_1.AppError('You are not logged in! Please log in to get access.', 401));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        console.log('Decoded Token:', decoded);
    }
    catch (error) {
        console.log('Authentication failed: Token verification failed.', error);
        return next(new types_1.AppError('Invalid token. Please log in again.', 401));
    }
    const currentUser = await User_1.User.findById(decoded.userId).select('+refreshTokens');
    if (!currentUser) {
        console.log(`Authentication failed: User with ID ${decoded.userId} not found.`);
        return next(new types_1.AppError('The user belonging to this token does no longer exist.', 401));
    }
    console.log('Current User:', currentUser._id, currentUser.email, currentUser.role);
    if (currentUser.status !== 'active') {
        return next(new types_1.AppError('Your account has been deactivated. Please contact support.', 401));
    }
    req.user = {
        id: currentUser._id.toString(),
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
    };
    console.log('Authentication successful. User set:', req.user);
    next();
});
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new types_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new types_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.authorize = authorize;
exports.optionalAuth = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
            const currentUser = await User_1.User.findById(decoded.userId);
            if (currentUser && currentUser.status === 'active') {
                req.user = {
                    id: currentUser._id.toString(),
                    email: currentUser.email,
                    role: currentUser.role,
                    status: currentUser.status,
                };
            }
        }
        catch (error) {
        }
    }
    next();
});
const checkOwnership = (resourceUserIdField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new types_1.AppError('You are not logged in! Please log in to get access.', 401));
        }
        if (req.user.role === types_1.UserRole.ADMIN) {
            return next();
        }
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
        if (resourceUserId && resourceUserId !== req.user.id) {
            return next(new types_1.AppError('You can only access your own resources', 403));
        }
        next();
    };
};
exports.checkOwnership = checkOwnership;
//# sourceMappingURL=auth.js.map