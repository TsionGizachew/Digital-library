"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../entities/User");
const types_1 = require("../types");
const pagination_1 = require("../utils/pagination");
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepository {
    async create(userData) {
        const user = new User_1.User(userData);
        return await user.save();
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await User_1.User.findById(id).populate('favoriteBooks');
    }
    async findByEmail(email) {
        return await User_1.User.findOne({ email: email.toLowerCase() });
    }
    async findByEmailWithPassword(email) {
        return await User_1.User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
    }
    async findByIdWithRefreshTokens(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await User_1.User.findById(id).select('+refreshTokens');
    }
    async findByResetToken(hashedToken) {
        return await User_1.User.findOne({ resetPasswordToken: hashedToken }).select('+resetPasswordToken +resetPasswordExpires');
    }
    async update(id, updateData) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await User_1.User.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true });
    }
    async delete(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return false;
        }
        const result = await User_1.User.findByIdAndDelete(id);
        return !!result;
    }
    async findAll(query) {
        const { page, limit, skip, sortBy, sortOrder } = pagination_1.PaginationUtil.parseQuery(query);
        const filter = {};
        if (query.role) {
            filter.role = query.role;
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
            ];
        }
        const sort = pagination_1.PaginationUtil.buildSortObject(sortBy, sortOrder);
        const [users, totalItems] = await Promise.all([
            User_1.User.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            User_1.User.countDocuments(filter),
        ]);
        const pagination = pagination_1.PaginationUtil.calculatePagination(totalItems, page, limit);
        return {
            users,
            pagination,
        };
    }
    async updateLastLogin(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return;
        }
        await User_1.User.findByIdAndUpdate(id, { lastLogin: new Date() });
    }
    async addRefreshToken(id, token) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return;
        }
        await User_1.User.findByIdAndUpdate(id, { $push: { refreshTokens: token } });
    }
    async removeRefreshToken(id, token) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return;
        }
        await User_1.User.findByIdAndUpdate(id, { $pull: { refreshTokens: token } });
    }
    async clearRefreshTokens(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return;
        }
        await User_1.User.findByIdAndUpdate(id, { $set: { refreshTokens: [] } });
    }
    async updateStatus(id, status) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await User_1.User.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true, runValidators: true });
    }
    async countByRole(role) {
        return await User_1.User.countDocuments({ role });
    }
    async countByStatus(status) {
        return await User_1.User.countDocuments({ status });
    }
    async exists(email) {
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        return !!user;
    }
    async createAdmin(adminData) {
        const admin = new User_1.User({
            ...adminData,
            role: types_1.UserRole.ADMIN,
            status: types_1.UserStatus.ACTIVE,
        });
        return await admin.save();
    }
    async aggregate(pipeline) {
        return await User_1.User.aggregate(pipeline);
    }
    async countDocuments(filter = {}) {
        return await User_1.User.countDocuments(filter);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map