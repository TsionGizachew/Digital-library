"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const UserService_1 = require("./UserService");
const BookService_1 = require("./BookService");
const UserRepository_1 = require("../repositories/UserRepository");
const BookRepository_1 = require("../repositories/BookRepository");
const BookingRepository_1 = require("../repositories/BookingRepository");
const AnnouncementRepository_1 = require("../repositories/AnnouncementRepository");
const EventRepository_1 = require("../repositories/EventRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../types");
const SocketService_1 = require("./SocketService");
class AdminService {
    constructor() {
        this.userService = new UserService_1.UserService();
        this.bookService = new BookService_1.BookService();
        this.userRepository = new UserRepository_1.UserRepository();
        this.bookRepository = new BookRepository_1.BookRepository();
        this.bookingRepository = new BookingRepository_1.BookingRepository();
        this.announcementRepository = new AnnouncementRepository_1.AnnouncementRepository();
        this.eventRepository = new EventRepository_1.EventRepository();
        this.socketService = new SocketService_1.SocketService();
    }
    async getDashboardStats() {
        const [userStats, bookStats, categoryStats, bookingStats] = await Promise.all([
            this.userService.getUserStats(),
            this.bookService.getBookStats(),
            this.bookService.getCategoryStats(),
            this.bookingRepository.getBookingStats(),
        ]);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [newUsersThisMonth, newBooksThisMonth] = await Promise.all([
            this.userRepository.findAll({
                page: 1,
                limit: 1000,
            }),
            this.bookRepository.findAll({
                page: 1,
                limit: 1000,
            }),
        ]);
        return {
            users: {
                total: userStats.totalUsers,
                active: userStats.activeUsers,
                blocked: userStats.blockedUsers,
                admins: userStats.adminUsers,
                newThisMonth: newUsersThisMonth.users.filter(user => new Date(user.createdAt) >= startOfMonth).length,
            },
            books: {
                total: bookStats.totalBooks,
                available: bookStats.availableBooks,
                booked: bookStats.bookedBooks,
                maintenance: bookStats.maintenanceBooks,
                newThisMonth: newBooksThisMonth.books.filter(book => new Date(book.createdAt) >= startOfMonth).length,
            },
            bookings: {
                total: bookingStats.total,
                pending: bookingStats.pending,
                approved: bookingStats.approved,
                rejected: bookingStats.rejected,
                overdue: bookingStats.overdue,
            },
            categories: categoryStats,
        };
    }
    async getDashboardChartsData() {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const monthlyBookings = await this.bookingRepository.aggregate([
            { $match: { createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    borrowed: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                    returned: { $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] } },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        const monthlyNewMembers = await this.userRepository.aggregate([
            { $match: { createdAt: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        return { monthlyBookings, monthlyNewMembers };
    }
    async getSystemActivity() {
        const [recentUsers, recentBooks, popularBooks] = await Promise.all([
            this.userRepository.findAll({
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            }),
            this.bookRepository.findAll({
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            }),
            this.bookRepository.findPopular({
                page: 1,
                limit: 10,
            }),
        ]);
        return {
            recentUsers: recentUsers.users,
            recentBooks: recentBooks.books,
            recentBookings: [],
            popularBooks: popularBooks.books,
        };
    }
    async getAllBooks(query) {
        return this.bookRepository.findAll(query);
    }
    async getBorrowingRecords(query) {
        const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc', search, status } = query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sortBy,
            sortOrder,
            search,
            status,
        };
        const { records, pagination } = await this.bookingRepository.findAll(options);
        return { bookings: records, pagination };
    }
    async promoteUserToAdmin(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        if (user.role === types_1.UserRole.ADMIN) {
            throw new types_1.AppError('User is already an admin', 400);
        }
        return await this.userRepository.update(userId, { role: types_1.UserRole.ADMIN });
    }
    async demoteAdminToUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        if (user.role === types_1.UserRole.USER) {
            throw new types_1.AppError('User is already a regular user', 400);
        }
        return await this.userRepository.update(userId, { role: types_1.UserRole.USER });
    }
    async bulkUpdateBookStatus(bookIds, status) {
        const updatePromises = bookIds.map(id => this.bookService.updateBookStatus(id, status));
        await Promise.all(updatePromises);
    }
    async bulkUpdateUserStatus(userIds, status) {
        const updatePromises = userIds.map(id => this.userService.updateUserStatus(id, status));
        await Promise.all(updatePromises);
    }
    async getSystemHealth() {
        const databaseHealth = { status: 'healthy', message: 'Database connection is stable' };
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const totalMemory = memoryUsage.heapTotal;
        const usedMemory = memoryUsage.heapUsed;
        const memoryPercentage = (usedMemory / totalMemory) * 100;
        return {
            database: databaseHealth,
            server: {
                status: 'healthy',
                uptime: Math.floor(uptime),
            },
            memory: {
                used: Math.round(usedMemory / 1024 / 1024),
                total: Math.round(totalMemory / 1024 / 1024),
                percentage: Math.round(memoryPercentage),
            },
        };
    }
    async getSystemStats() {
        const [userStats, bookStats] = await Promise.all([
            this.userService.getUserStats(),
            this.bookService.getBookStats(),
        ]);
        return { userStats, bookStats };
    }
    async getAllUsers(query) {
        return this.userService.getAllUsers(query);
    }
    async blockUser(userId) {
        return this.userService.blockUser(userId);
    }
    async unblockUser(userId) {
        return this.userService.unblockUser(userId);
    }
    async resetUserPassword(userId, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        return await this.userService.resetPassword(userId, newPassword);
    }
    async createBook(bookData) {
        const adminId = '60d21b4667d0d8992e610c85';
        return this.bookService.createBook(bookData, adminId);
    }
    async updateBookStatus(bookId, status) {
        return this.bookService.updateBookStatus(bookId, status);
    }
    async exportUserData(format = 'json') {
        const users = await this.userRepository.findAll({
            page: 1,
            limit: 10000,
        });
        if (format === 'json') {
            return users.users;
        }
        return users.users;
    }
    async exportBookData(format = 'json') {
        const books = await this.bookRepository.findAll({
            page: 1,
            limit: 10000,
        });
        if (format === 'json') {
            return books.books;
        }
        return books.books;
    }
    async getAuditLog(query) {
        return {
            logs: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 10,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }
    async validateAdminAccess(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        if (user.role !== types_1.UserRole.ADMIN) {
            throw new types_1.AppError('Access denied. Admin privileges required.', 403);
        }
        if (user.status !== types_1.UserStatus.ACTIVE) {
            throw new types_1.AppError('Admin account is not active', 403);
        }
    }
    async approveBorrowingRequest(recordId, adminId) {
        const record = await this.bookingRepository.findById(recordId);
        if (!record) {
            throw new types_1.AppError('Borrowing record not found', 404);
        }
        await record.approve(new mongoose_1.default.Types.ObjectId(adminId));
        await this.socketService.notifyBookingApproved(record);
        return record;
    }
    async rejectBorrowingRequest(recordId, reason, adminId) {
        const record = await this.bookingRepository.findById(recordId);
        if (!record) {
            throw new types_1.AppError('Borrowing record not found', 404);
        }
        await record.reject(new mongoose_1.default.Types.ObjectId(adminId), reason);
        await this.socketService.notifyBookingRejected(record);
        return record;
    }
    async returnBook(recordId) {
        const record = await this.bookingRepository.findById(recordId);
        if (!record) {
            throw new types_1.AppError('Borrowing record not found', 404);
        }
        await record.markAsReturned();
        await this.socketService.notifyBookingReturned(record);
        return record;
    }
    async getUserBorrowingHistory(userId) {
        console.log("here is from this function ", userId);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new types_1.AppError('User not found', 404);
        }
        const records = await this.bookingRepository.findAll({ userId });
        return records;
    }
    async getAnnouncements(query) {
        return this.announcementRepository.findAll(query);
    }
    async createAnnouncement(announcementData, adminId) {
        const admin = await this.userRepository.findById(adminId);
        if (!admin) {
            throw new types_1.AppError('Admin user not found', 404);
        }
        const announcement = await this.announcementRepository.create({ ...announcementData, authorId: adminId, authorName: admin.name });
        this.socketService.notifyNewAnnouncement(announcement);
        return announcement;
    }
    async updateAnnouncement(announcementId, announcementData) {
        const announcement = await this.announcementRepository.findById(announcementId);
        if (!announcement) {
            throw new types_1.AppError('Announcement not found', 404);
        }
        return this.announcementRepository.update(announcementId, announcementData);
    }
    async deleteAnnouncement(announcementId) {
        await this.announcementRepository.delete(announcementId);
    }
    async toggleAnnouncementStatus(announcementId, status) {
        const announcement = await this.announcementRepository.findById(announcementId);
        if (!announcement) {
            throw new types_1.AppError('Announcement not found', 404);
        }
        if (!['draft', 'published', 'archived'].includes(status)) {
            throw new types_1.AppError('Invalid status', 400);
        }
        return this.announcementRepository.update(announcementId, { status: status });
    }
    async getEvents(query) {
        return this.eventRepository.findAll(query);
    }
    async createEvent(eventData, adminId) {
        const admin = await this.userRepository.findById(adminId);
        if (!admin) {
            throw new types_1.AppError('Admin user not found', 404);
        }
        return this.eventRepository.create({ ...eventData, authorId: adminId, authorName: admin.name });
    }
    async updateEvent(eventId, eventData) {
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new types_1.AppError('Event not found', 404);
        }
        return this.eventRepository.update(eventId, eventData);
    }
    async deleteEvent(eventId) {
        await this.eventRepository.delete(eventId);
    }
    async generateReport() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [newBooks, newMembers, popularBooks] = await Promise.all([
            this.bookRepository.findAll({
                page: 1,
                limit: 1000,
            }),
            this.userRepository.findAll({
                page: 1,
                limit: 1000,
            }),
            this.bookRepository.findPopular({
                page: 1,
                limit: 10,
            }),
        ]);
        return {
            newBooks: newBooks.books.filter(book => new Date(book.createdAt) >= startOfMonth),
            newMembers: newMembers.users.filter(user => new Date(user.createdAt) >= startOfMonth),
            popularBooks: popularBooks.books,
        };
    }
    async createRecommendation(data, userId) {
        console.log('New recommendation received:', {
            ...data,
            userId,
            createdAt: new Date(),
        });
        return {
            success: true,
            message: 'Recommendation submitted successfully',
            data: {
                ...data,
                userId,
                status: 'pending',
                createdAt: new Date(),
            },
        };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=AdminService.js.map