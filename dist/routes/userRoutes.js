"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.use(middleware_1.authenticate);
router.get('/profile', userController.getProfile);
router.put('/profile', middleware_1.validateUserUpdate, userController.updateProfile);
router.put('/preferences', [
    (0, express_validator_1.body)('emailNotifications').optional().isBoolean(),
    (0, express_validator_1.body)('smsNotifications').optional().isBoolean(),
    (0, express_validator_1.body)('favoriteCategories').optional().isArray(),
    middleware_1.handleValidationErrors,
], userController.updatePreferences);
router.post('/favorites/categories', [(0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'), middleware_1.handleValidationErrors], userController.addFavoriteCategory);
router.delete('/favorites/categories/:category', userController.removeFavoriteCategory);
router.get('/favorites', userController.getFavoriteBooks);
router.post('/favorites', [(0, express_validator_1.body)('bookId').notEmpty().withMessage('Book ID is required'), middleware_1.handleValidationErrors], userController.addFavoriteBook);
router.delete('/favorites/:bookId', userController.removeFavoriteBook);
router.post('/books/:bookId/favorite', [(0, middleware_1.validateObjectId)('bookId'), middleware_1.handleValidationErrors], userController.toggleFavoriteBook);
router.get('/', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), middleware_1.validatePaginationQuery, userController.getAllUsers);
router.get('/search', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), middleware_1.validatePaginationQuery, userController.searchUsers);
router.get('/stats', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), userController.getUserStats);
router.get('/role/:role', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), middleware_1.validatePaginationQuery, userController.getUsersByRole);
router.get('/status/:status', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), middleware_1.validatePaginationQuery, userController.getUsersByStatus);
router.get('/:id', (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, userController.getUserById);
router.put('/:id', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.validateUserUpdate, userController.updateUser);
router.delete('/:id', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, userController.deleteUser);
router.put('/:id/block', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, userController.blockUser);
router.put('/:id/unblock', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, userController.unblockUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map