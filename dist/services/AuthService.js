"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const EmailService_1 = require("./EmailService");
const types_1 = require("../types");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    constructor() {
        this.socketService = null;
        this.userRepository = new UserRepository_1.UserRepository();
    }
    setSocketService(socketService) {
        this.socketService = socketService;
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new types_1.AppError('User with this email already exists', 409);
        }
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email.toLowerCase(),
            password: data.password,
            role: data.role || types_1.UserRole.USER,
        });
        const tokens = jwt_1.JWTUtil.generateTokenPair({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        await this.userRepository.addRefreshToken(user._id.toString(), tokens.refreshToken);
        const userResponse = user.toJSON();
        if (this.socketService) {
            await this.socketService.notifyUserRegistered(userResponse);
        }
        return {
            user: userResponse,
            tokens,
        };
    }
    async login(data) {
        const user = await this.userRepository.findByEmailWithPassword(data.email);
        if (!user) {
            throw new types_1.AppError('Invalid email or password', 401);
        }
        if (user.status !== 'active') {
            throw new types_1.AppError('Your account has been deactivated. Please contact support.', 401);
        }
        const isPasswordValid = await user.comparePassword(data.password);
        if (!isPasswordValid) {
            throw new types_1.AppError('Invalid email or password', 401);
        }
        const tokens = jwt_1.JWTUtil.generateTokenPair({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        await Promise.all([
            this.userRepository.addRefreshToken(user._id.toString(), tokens.refreshToken),
            this.userRepository.updateLastLogin(user._id.toString()),
        ]);
        const userResponse = user.toJSON();
        return {
            user: userResponse,
            tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jwt_1.JWTUtil.verifyRefreshToken(refreshToken);
            const user = await this.userRepository.findByIdWithRefreshTokens(decoded.userId);
            if (!user) {
                throw new types_1.AppError('Invalid refresh token', 401);
            }
            if (!user.refreshTokens.includes(refreshToken)) {
                throw new types_1.AppError('Invalid refresh token', 401);
            }
            if (user.status !== 'active') {
                throw new types_1.AppError('Your account has been deactivated. Please contact support.', 401);
            }
            const tokens = jwt_1.JWTUtil.generateTokenPair({
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            });
            await Promise.all([
                this.userRepository.removeRefreshToken(user._id.toString(), refreshToken),
                this.userRepository.addRefreshToken(user._id.toString(), tokens.refreshToken),
            ]);
            return tokens;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new types_1.AppError('Refresh token expired. Please log in again.', 401);
            }
            if (error.name === 'JsonWebTokenError') {
                throw new types_1.AppError('Invalid refresh token.', 401);
            }
            throw error;
        }
    }
    async logout(userId, refreshToken) {
        await this.userRepository.removeRefreshToken(userId, refreshToken);
    }
    async logoutAll(userId) {
        await this.userRepository.clearRefreshTokens(userId);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findByEmailWithPassword('');
        const userWithPassword = await this.userRepository.findByIdWithRefreshTokens(userId);
        if (!userWithPassword) {
            throw new types_1.AppError('User not found', 404);
        }
        const userForPasswordCheck = await this.userRepository.findByEmailWithPassword(userWithPassword.email);
        if (!userForPasswordCheck) {
            throw new types_1.AppError('User not found', 404);
        }
        const isCurrentPasswordValid = await userForPasswordCheck.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new types_1.AppError('Current password is incorrect', 400);
        }
        userForPasswordCheck.password = newPassword;
        await userForPasswordCheck.save();
        await this.userRepository.clearRefreshTokens(userId);
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();
        const emailService = new EmailService_1.EmailService();
        await emailService.sendPasswordResetEmail(email, resetToken, user.name);
    }
    async resetPassword(token, newPassword) {
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await this.userRepository.findByResetToken(hashedToken);
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new types_1.AppError('Invalid or expired reset token', 400);
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await this.userRepository.clearRefreshTokens(user._id.toString());
    }
    async createDefaultAdmin() {
        const adminExists = await this.userRepository.findByEmail(env_1.env.ADMIN_EMAIL);
        if (adminExists) {
            return;
        }
        await this.userRepository.createAdmin({
            name: 'System Administrator',
            email: env_1.env.ADMIN_EMAIL,
            password: env_1.env.ADMIN_PASSWORD,
        });
        console.log('Default admin created successfully');
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map