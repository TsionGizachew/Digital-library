"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const types_1 = require("../types");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        return user;
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        return user;
    }
    async updateUser(id, updateData) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new types_1.AppError('User not found', 404);
        }
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.userRepository.exists(updateData.email);
            if (emailExists) {
                throw new types_1.AppError('Email is already taken', 409);
            }
        }
        const updatedUser = await this.userRepository.update(id, updateData);
        if (!updatedUser) {
            throw new types_1.AppError('Failed to update user', 500);
        }
        return updatedUser;
    }
    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const deleted = await this.userRepository.delete(id);
        if (!deleted) {
            throw new types_1.AppError('Failed to delete user', 500);
        }
    }
    async getAllUsers(query) {
        const result = await this.userRepository.findAll(query);
        return result;
    }
    async updateUserStatus(id, status) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const updatedUser = await this.userRepository.updateStatus(id, status);
        if (!updatedUser) {
            throw new types_1.AppError('Failed to update user status', 500);
        }
        return updatedUser;
    }
    async blockUser(id) {
        return this.updateUserStatus(id, types_1.UserStatus.SUSPENDED);
    }
    async unblockUser(id) {
        return this.updateUserStatus(id, types_1.UserStatus.ACTIVE);
    }
    async getUserStats() {
        const [activeUsers, blockedUsers, pendingUsers, adminUsers] = await Promise.all([
            this.userRepository.countByStatus(types_1.UserStatus.ACTIVE),
            this.userRepository.countByStatus(types_1.UserStatus.SUSPENDED),
            this.userRepository.countByStatus(types_1.UserStatus.INACTIVE),
            this.userRepository.countByRole(types_1.UserRole.ADMIN),
        ]);
        const totalUsers = activeUsers + blockedUsers + pendingUsers;
        return {
            totalUsers,
            activeUsers,
            blockedUsers,
            adminUsers,
            regularUsers: totalUsers - adminUsers,
        };
    }
    async searchUsers(searchTerm, query) {
        const searchQuery = {
            ...query,
            search: searchTerm,
        };
        return this.getAllUsers(searchQuery);
    }
    async getUsersByRole(role, query) {
        const roleQuery = {
            ...query,
            role,
        };
        return this.getAllUsers(roleQuery);
    }
    async getUsersByStatus(status, query) {
        const statusQuery = {
            ...query,
            status,
        };
        return this.getAllUsers(statusQuery);
    }
    async updateUserPreferences(id, preferences) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const updateData = {
            preferences: {
                ...user.preferences,
                ...preferences,
            },
        };
        return this.updateUser(id, updateData);
    }
    async addFavoriteCategory(id, category) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const favoriteCategories = user.preferences?.favoriteCategories || [];
        if (!favoriteCategories.includes(category)) {
            favoriteCategories.push(category);
        }
        return this.updateUserPreferences(id, { favoriteCategories });
    }
    async removeFavoriteCategory(id, category) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const favoriteCategories = (user.preferences?.favoriteCategories || [])
            .filter(cat => cat !== category);
        return this.updateUserPreferences(id, { favoriteCategories });
    }
    async validateUserAccess(userId, requestingUserId, requestingUserRole) {
        if (requestingUserRole === types_1.UserRole.ADMIN) {
            return;
        }
        if (userId !== requestingUserId) {
            throw new types_1.AppError('You can only access your own data', 403);
        }
    }
    async getFavoriteBooks(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        return user.favoriteBooks;
    }
    async addFavoriteBook(userId, bookId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        if (user.favoriteBooks.includes(bookId)) {
            throw new types_1.AppError('Book is already in favorites', 400);
        }
        user.favoriteBooks.push(bookId);
        await user.save();
        return user;
    }
    async removeFavoriteBook(userId, bookId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        user.favoriteBooks = user.favoriteBooks.filter((id) => id.toString() !== bookId);
        await user.save();
        return user;
    }
    async toggleFavoriteBook(userId, bookId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const isFavorite = user.favoriteBooks.some(id => id.toString() === bookId);
        if (isFavorite) {
            user.favoriteBooks = user.favoriteBooks.filter(id => id.toString() !== bookId);
            await user.save();
            return { success: true, message: 'Book removed from favorites' };
        }
        else {
            user.favoriteBooks.push(bookId);
            await user.save();
            return { success: true, message: 'Book added to favorites' };
        }
    }
    async getUserCount() {
        return await this.userRepository.countDocuments();
    }
    async resetPassword(userId, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        user.password = newPassword;
        await user.save();
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map