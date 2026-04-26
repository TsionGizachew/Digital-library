"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const middleware_1 = require("../middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post('/register', middleware_1.validateUserRegistration, authController.register);
router.post('/login', middleware_1.validateUserLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', middleware_1.authenticate, authController.logout);
router.post('/logout-all', middleware_1.authenticate, authController.logoutAll);
router.post('/change-password', middleware_1.authenticate, [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
], authController.changePassword);
router.post('/forgot-password', [(0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')], authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', middleware_1.authenticate, authController.getProfile);
router.get('/verify', middleware_1.authenticate, authController.verifyToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map