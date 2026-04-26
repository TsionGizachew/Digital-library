"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const BookingService_1 = require("../services/BookingService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
class BookingController {
    constructor() {
        this.createBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const { bookId, borrowPeriodDays, notes } = req.body;
            const bookingData = {
                userId,
                bookId,
                borrowPeriodDays,
                notes,
                metadata: {
                    requestSource: 'web',
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                },
            };
            const booking = await this.bookingService.createBooking(bookingData);
            response_1.ResponseUtil.created(res, booking, 'Booking request created successfully');
        });
        this.getBookingById = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const userId = req.user?.id;
            const userRole = req.user?.role;
            if (!userId || !userRole) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            await this.bookingService.validateUserBookingAccess(id, userId, userRole);
            const booking = await this.bookingService.getBookingById(id);
            response_1.ResponseUtil.success(res, booking, 'Booking retrieved successfully');
        });
        this.updateBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const updateData = req.body;
            const updatedBooking = await this.bookingService.updateBooking(id, updateData);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Booking updated successfully');
        });
        this.deleteBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            await this.bookingService.deleteBooking(id);
            response_1.ResponseUtil.deleted(res, 'Booking deleted successfully');
        });
        this.getAllBookings = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const query = req.query;
            const result = await this.bookingService.getAllBookings(query);
            response_1.ResponseUtil.paginated(res, result.records, result.pagination, 'Bookings retrieved successfully');
        });
        this.getUserBookings = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const result = await this.bookingService.getUserBookings(userId, req.query);
            response_1.ResponseUtil.paginated(res, result.records, result.pagination, 'User bookings retrieved successfully');
        });
        this.getUserBookingHistory = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const result = await this.bookingService.getUserBookingHistory(userId, req.query);
            response_1.ResponseUtil.paginated(res, result.records, result.pagination, 'User booking history retrieved successfully');
        });
        this.getPendingBookings = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const result = await this.bookingService.getPendingBookings(req.query);
            response_1.ResponseUtil.paginated(res, result.records, result.pagination, 'Pending bookings retrieved successfully');
        });
        this.getOverdueBookings = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const result = await this.bookingService.getOverdueBookings(req.query);
            response_1.ResponseUtil.paginated(res, result.records, result.pagination, 'Overdue bookings retrieved successfully');
        });
        this.approveBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const { notes } = req.body;
            const adminId = req.user?.id;
            if (!adminId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const updatedBooking = await this.bookingService.approveBooking(id, adminId, notes);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Booking approved successfully');
        });
        this.rejectBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const { reason } = req.body;
            const adminId = req.user?.id;
            if (!adminId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            if (!reason) {
                return next(new types_1.AppError('Rejection reason is required', 400));
            }
            const updatedBooking = await this.bookingService.rejectBooking(id, adminId, reason);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Booking rejected successfully');
        });
        this.returnBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const updatedBooking = await this.bookingService.returnBook(id);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Book returned successfully');
        });
        this.renewBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const { additionalDays } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            await this.bookingService.validateUserBookingAccess(id, userId, req.user?.role || '');
            const updatedBooking = await this.bookingService.renewBooking(id, additionalDays);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Booking renewed successfully');
        });
        this.cancelBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const updatedBooking = await this.bookingService.cancelBooking(id, userId);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Booking cancelled successfully');
        });
        this.getBookingStats = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const stats = await this.bookingService.getBookingStats();
            response_1.ResponseUtil.success(res, stats, 'Booking statistics retrieved successfully');
        });
        this.getPopularBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const result = await this.bookingService.getPopularBooks(req.query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, 'Popular books retrieved successfully');
        });
        this.getBookingsDueSoon = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { days } = req.query;
            const daysNumber = days ? parseInt(days, 10) : 3;
            const bookings = await this.bookingService.getBookingsDueSoon(daysNumber);
            response_1.ResponseUtil.success(res, bookings, 'Bookings due soon retrieved successfully');
        });
        this.updateOverdueBookings = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const updatedCount = await this.bookingService.updateOverdueBookings();
            response_1.ResponseUtil.success(res, { updatedCount }, `${updatedCount} bookings marked as overdue`);
        });
        this.rateBooking = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const { rating } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            if (!rating || rating < 1 || rating > 5) {
                return next(new types_1.AppError('Rating must be between 1 and 5', 400));
            }
            const updatedBooking = await this.bookingService.rateBooking(id, userId, rating);
            response_1.ResponseUtil.updated(res, updatedBooking, 'Book rated successfully');
        });
        this.bookingService = new BookingService_1.BookingService();
    }
}
exports.BookingController = BookingController;
//# sourceMappingURL=BookingController.js.map