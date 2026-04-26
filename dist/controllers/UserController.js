"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
class UserController {
    constructor() {
        this.getProfile = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const user = await this.userService.getUserById(userId);
            response_1.ResponseUtil.success(res, user, 'Profile retrieved successfully');
        });
        this.updateProfile = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const updateData = req.body;
            const updatedUser = await this.userService.updateUser(userId, updateData);
            response_1.ResponseUtil.updated(res, updatedUser, 'Profile updated successfully');
        });
        this.getUserById = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const requestingUserId = req.user?.id;
            const requestingUserRole = req.user?.role;
            if (!requestingUserId || !requestingUserRole) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            await this.userService.validateUserAccess(id, requestingUserId, requestingUserRole);
            const user = await this.userService.getUserById(id);
            response_1.ResponseUtil.success(res, user, 'User retrieved successfully');
        });
        this.getAllUsers = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const query = req.query;
            const result = await this.userService.getAllUsers(query);
            response_1.ResponseUtil.paginated(res, result.users, result.pagination, 'Users retrieved successfully');
        });
        this.updateUser = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await this.userService.updateUser(id, updateData);
            response_1.ResponseUtil.updated(res, updatedUser, 'User updated successfully');
        });
        this.deleteUser = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            response_1.ResponseUtil.deleted(res, 'User deleted successfully');
        });
        this.blockUser = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const updatedUser = await this.userService.blockUser(id);
            response_1.ResponseUtil.updated(res, updatedUser, 'User blocked successfully');
        });
        this.unblockUser = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const updatedUser = await this.userService.unblockUser(id);
            response_1.ResponseUtil.updated(res, updatedUser, 'User unblocked successfully');
        });
        this.getUserStats = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const stats = await this.userService.getUserStats();
            response_1.ResponseUtil.success(res, stats, 'User statistics retrieved successfully');
        });
        this.searchUsers = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { search } = req.query;
            if (!search || typeof search !== 'string') {
                return next(new types_1.AppError('Search term is required', 400));
            }
            const result = await this.userService.searchUsers(search, req.query);
            response_1.ResponseUtil.paginated(res, result.users, result.pagination, 'Users search completed successfully');
        });
        this.getUsersByRole = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { role } = req.params;
            if (!Object.values(types_1.UserRole).includes(role)) {
                return next(new types_1.AppError('Invalid user role', 400));
            }
            const result = await this.userService.getUsersByRole(role, req.query);
            response_1.ResponseUtil.paginated(res, result.users, result.pagination, `Users with role ${role} retrieved successfully`);
        });
        this.getUsersByStatus = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { status } = req.params;
            if (!Object.values(types_1.UserStatus).includes(status)) {
                return next(new types_1.AppError('Invalid user status', 400));
            }
            const result = await this.userService.getUsersByStatus(status, req.query);
            response_1.ResponseUtil.paginated(res, result.users, result.pagination, `Users with status ${status} retrieved successfully`);
        });
        this.updatePreferences = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const preferences = req.body;
            const updatedUser = await this.userService.updateUserPreferences(userId, preferences);
            response_1.ResponseUtil.updated(res, updatedUser, 'Preferences updated successfully');
        });
        this.addFavoriteCategory = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            const { category } = req.body;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            if (!category) {
                return next(new types_1.AppError('Category is required', 400));
            }
            const updatedUser = await this.userService.addFavoriteCategory(userId, category);
            response_1.ResponseUtil.updated(res, updatedUser, 'Favorite category added successfully');
        });
        this.removeFavoriteCategory = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            const { category } = req.params;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const updatedUser = await this.userService.removeFavoriteCategory(userId, category);
            response_1.ResponseUtil.updated(res, updatedUser, 'Favorite category removed successfully');
        });
        this.getFavoriteBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const favoriteBooks = await this.userService.getFavoriteBooks(userId);
            response_1.ResponseUtil.success(res, favoriteBooks, 'Favorite books retrieved successfully');
        });
        this.addFavoriteBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            const { bookId } = req.body;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            if (!bookId) {
                return next(new types_1.AppError('Book ID is required', 400));
            }
            const updatedUser = await this.userService.addFavoriteBook(userId, bookId);
            response_1.ResponseUtil.updated(res, updatedUser, 'Book added to favorites successfully');
        });
        this.removeFavoriteBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            const { bookId } = req.params;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const updatedUser = await this.userService.removeFavoriteBook(userId, bookId);
            response_1.ResponseUtil.updated(res, updatedUser, 'Book removed from favorites successfully');
        });
        this.toggleFavoriteBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            const { bookId } = req.params;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const result = await this.userService.toggleFavoriteBook(userId, bookId);
            response_1.ResponseUtil.success(res, result, result.message);
        });
        this.userService = new UserService_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map