"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canManageUser = exports.requireAdmin = exports.requireSuperAdmin = exports.requireRole = void 0;
const enums_1 = require("../types/enums");
const AppError_1 = __importDefault(require("../utils/AppError"));
const User_1 = require("../entities/User");
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.default('Authentication required', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.default(`Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`, 403));
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireSuperAdmin = (0, exports.requireRole)(enums_1.UserRole.SUPERADMIN);
exports.requireAdmin = (0, exports.requireRole)(enums_1.UserRole.ADMIN, enums_1.UserRole.SUPERADMIN);
const canManageUser = async (req, res, next) => {
    const { userId } = req.params;
    const currentUser = req.user;
    if (!currentUser) {
        return next(new AppError_1.default('Authentication required', 401));
    }
    if (currentUser.role === enums_1.UserRole.SUPERADMIN) {
        return next();
    }
    if (currentUser.role === enums_1.UserRole.ADMIN) {
        try {
            const targetUser = await User_1.User.findById(userId);
            if (!targetUser) {
                return next(new AppError_1.default('User not found', 404));
            }
            if (targetUser.role === enums_1.UserRole.ADMIN ||
                targetUser.role === enums_1.UserRole.SUPERADMIN) {
                return next(new AppError_1.default('You cannot manage admin or superadmin accounts', 403));
            }
            return next();
        }
        catch (error) {
            return next(new AppError_1.default('Error checking user permissions', 500));
        }
    }
    return next(new AppError_1.default('Access denied', 403));
};
exports.canManageUser = canManageUser;
//# sourceMappingURL=roleAuth.js.map