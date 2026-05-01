"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const AdminService_1 = require("../services/AdminService");
const BookService_1 = require("../services/BookService");
const UserService_1 = require("../services/UserService");
const BookingService_1 = require("../services/BookingService");
const ReportService_1 = require("../services/ReportService");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
const AppError_1 = __importDefault(require("../utils/AppError"));
class DashboardController {
    constructor() {
        this.getOverview = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            if (user.role === types_1.UserRole.ADMIN) {
                const result = await this.adminService.getDashboardStats();
                const stats = {
                    totalMembers: result.users.total,
                    totalBooks: result.books.total,
                    borrowedBooks: result.books.booked,
                    overdueBooks: result.bookings.overdue,
                    reservedBooks: result.bookings.pending,
                    newMembersThisMonth: result.users.newThisMonth,
                };
                const recentBookings = await this.bookingService.getAllBookings({
                    limit: 5,
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                });
                const recentActivity = recentBookings.records.map((booking) => ({
                    id: booking.id,
                    type: booking.status.toLowerCase(),
                    user: booking.user.name,
                    book: booking.book.title,
                    timestamp: booking.createdAt,
                }));
                response_1.ResponseUtil.success(res, { stats, recentActivity }, 'Dashboard overview retrieved successfully');
            }
            else {
                const borrowedBooks = await this.bookingService.getUserBookings(user.id, {
                    status: types_1.BookingStatus.APPROVED,
                });
                const reservedBooks = await this.bookingService.getUserBookings(user.id, {
                    status: types_1.BookingStatus.PENDING,
                });
                const readingHistory = await this.bookingService.getUserBookings(user.id, {
                    status: types_1.BookingStatus.RETURNED,
                });
                const dueSoonNotifications = await this.bookingService.getBookingsDueSoon(3);
                const recentBookings = await this.bookingService.getRecentUserBookings(user.id, 3);
                const notifications = [
                    ...dueSoonNotifications.map((b) => ({
                        id: b._id,
                        type: 'due_soon',
                        title: 'Book Due Soon',
                        message: `Your copy of "${b.book.title}" is due soon.`,
                        date: b.dueDate,
                        read: false,
                    })),
                    ...recentBookings.map((b) => ({
                        id: b._id,
                        type: 'new_booking',
                        title: 'Booking Confirmed',
                        message: `You have successfully booked "${b.book.title}".`,
                        date: b.createdAt,
                        read: false,
                    })),
                ];
                const userWithFavorites = await this.userService.getUserById(user.id);
                const userDashboardData = {
                    borrowedBooks: borrowedBooks.records,
                    reservedBooks: reservedBooks.records,
                    readingHistory: readingHistory.records,
                    notifications,
                    favoriteBooks: userWithFavorites?.favoriteBooks || [],
                };
                response_1.ResponseUtil.success(res, userDashboardData, 'Dashboard overview retrieved successfully');
            }
        });
        this.getBorrowedBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            console.log(`Fetching borrowed books for user: ${userId}`);
            const result = await this.bookingService.getUserBookings(userId, {
                ...req.query,
                status: types_1.BookingStatus.APPROVED,
            });
            console.log('Borrowed books data from service:', JSON.stringify(result, null, 2));
            response_1.ResponseUtil.success(res, result.records, 'Borrowed books retrieved successfully');
        });
        this.getReservedBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            const result = await this.bookingService.getUserBookings(userId, {
                ...req.query,
                status: types_1.BookingStatus.PENDING,
            });
            response_1.ResponseUtil.success(res, result.records, 'Reserved books retrieved successfully');
        });
        this.getReadingHistory = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            const result = await this.bookingService.getUserBookings(userId, {
                ...req.query,
                status: types_1.BookingStatus.RETURNED,
            });
            response_1.ResponseUtil.success(res, result.records, 'Reading history retrieved successfully');
        });
        this.getNotifications = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            const dueSoonBookings = await this.bookingService.getBookingsDueSoon(3);
            const bookingNotifications = dueSoonBookings.map((b) => ({
                id: `booking-${b._id}`,
                type: 'due_soon',
                title: 'Book Due Soon',
                message: `Your copy of "${b.book.title}" is due soon.`,
                date: b.dueDate,
                read: false,
            }));
            const userNotifications = await this.notificationRepository.findByUserId(userId);
            const eventAnnouncementNotifications = userNotifications.map((n) => ({
                id: `notification-${n._id}`,
                type: 'announcement',
                title: 'Library Update',
                message: n.message,
                date: n.createdAt,
                read: n.read || false,
            }));
            const allNotifications = [...bookingNotifications, ...eventAnnouncementNotifications]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20);
            response_1.ResponseUtil.success(res, allNotifications, 'Notifications retrieved successfully');
        });
        this.markNotificationAsRead = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { notificationId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            const updatedNotification = await this.notificationRepository.markAsRead(notificationId);
            if (!updatedNotification) {
                return next(new AppError_1.default('Notification not found', 404));
            }
            response_1.ResponseUtil.success(res, updatedNotification, 'Notification marked as read');
        });
        this.getFavoriteBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            console.log(`Fetching favorite books for user: ${userId}`);
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return next(new AppError_1.default('User not found', 404));
            }
            console.log('Favorite books data from service:', JSON.stringify(user.favoriteBooks, null, 2));
            response_1.ResponseUtil.success(res, user.favoriteBooks, 'Favorite books retrieved successfully');
        });
        this.sendReminder = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { bookingId } = req.params;
            response_1.ResponseUtil.success(res, { bookingId, reminderSent: true }, 'Reminder sent successfully');
        });
        this.renewBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { bookingId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            await this.bookingService.validateUserBookingAccess(bookingId, userId, req.user.role);
            const renewedBooking = await this.bookingService.renewBooking(bookingId);
            response_1.ResponseUtil.success(res, renewedBooking, 'Book renewed successfully');
        });
        this.returnBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { bookingId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            await this.bookingService.validateUserBookingAccess(bookingId, userId, req.user.role);
            const returnedBooking = await this.bookingService.returnBook(bookingId);
            response_1.ResponseUtil.success(res, returnedBooking, 'Book returned successfully');
        });
        this.cancelReservation = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { bookingId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new AppError_1.default('User not authenticated', 401));
            }
            const cancelledBooking = await this.bookingService.cancelBooking(bookingId, userId);
            response_1.ResponseUtil.success(res, cancelledBooking, 'Reservation cancelled successfully');
        });
        this.getChartsData = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user || user.role !== types_1.UserRole.ADMIN) {
                return next(new AppError_1.default('Unauthorized', 403));
            }
            const chartsData = await this.adminService.getDashboardChartsData();
            response_1.ResponseUtil.success(res, chartsData, 'Chart data retrieved successfully');
        });
        this.generateReport = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const user = req.user;
            if (!user || user.role !== types_1.UserRole.ADMIN) {
                return next(new AppError_1.default('Unauthorized', 403));
            }
            await this.reportService.generateLibraryReport(res);
        });
        this.getHomePageStats = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const totalBooks = await this.bookService.getBookCount();
            const totalMembers = await this.userService.getUserCount();
            const totalCategories = await this.bookService.getCategoryCount();
            const stats = {
                totalBooks,
                totalMembers,
                totalCategories,
            };
            response_1.ResponseUtil.success(res, stats, 'Home page stats retrieved successfully');
        });
        this.adminService = new AdminService_1.AdminService();
        this.bookService = new BookService_1.BookService();
        this.userService = new UserService_1.UserService();
        this.bookingService = new BookingService_1.BookingService();
        this.reportService = new ReportService_1.ReportService();
        this.notificationRepository = new NotificationRepository_1.NotificationRepository();
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=DashboardController.js.map