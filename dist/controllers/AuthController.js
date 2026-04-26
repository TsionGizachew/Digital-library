"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
class AuthController {
    constructor() {
        this.register = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { name, email, password, role } = req.body;
            const result = await this.authService.register({
                name,
                email,
                password,
                role,
            });
            response_1.ResponseUtil.success(res, result, 'User registered successfully', 201);
        });
        this.login = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { email, password } = req.body;
            const result = await this.authService.login({
                email,
                password,
            });
            response_1.ResponseUtil.success(res, result, 'Login successful');
        });
        this.refreshToken = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return next(new types_1.AppError('Refresh token is required', 400));
            }
            const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshToken);
            response_1.ResponseUtil.success(res, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed successfully');
        });
        this.logout = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { refreshToken } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            if (!refreshToken) {
                return next(new types_1.AppError('Refresh token is required', 400));
            }
            await this.authService.logout(userId, refreshToken);
            response_1.ResponseUtil.success(res, null, 'Logout successful');
        });
        this.logoutAll = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            await this.authService.logoutAll(userId);
            response_1.ResponseUtil.success(res, null, 'Logged out from all devices successfully');
        });
        this.changePassword = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            if (!currentPassword || !newPassword) {
                return next(new types_1.AppError('Current password and new password are required', 400));
            }
            await this.authService.changePassword(userId, currentPassword, newPassword);
            response_1.ResponseUtil.success(res, null, 'Password changed successfully');
        });
        this.forgotPassword = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { email } = req.body;
            if (!email) {
                return next(new types_1.AppError('Email is required', 400));
            }
            await this.authService.forgotPassword(email);
            response_1.ResponseUtil.success(res, null, 'If an account with that email exists, a password reset link has been sent');
        });
        this.resetPassword = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return next(new types_1.AppError('Token and new password are required', 400));
            }
            await this.authService.resetPassword(token, newPassword);
            response_1.ResponseUtil.success(res, null, 'Password reset successfully');
        });
        this.getProfile = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const userRepository = new (await Promise.resolve().then(() => __importStar(require('../repositories/UserRepository')))).UserRepository();
            const user = await userRepository.findById(userId);
            if (!user) {
                return next(new types_1.AppError('User not found', 404));
            }
            response_1.ResponseUtil.success(res, user, 'Profile retrieved successfully');
        });
        this.verifyToken = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            response_1.ResponseUtil.success(res, { user: req.user }, 'Token is valid');
        });
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map