"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const BookingRepository_1 = require("../repositories/BookingRepository");
const BookService_1 = require("./BookService");
const SocketService_1 = require("./SocketService");
const types_1 = require("../types");
const mongoose_1 = require("mongoose");
class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository_1.BookingRepository();
        this.bookService = new BookService_1.BookService();
        try {
            this.socketService = new SocketService_1.SocketService();
        }
        catch (error) {
        }
    }
    getSocketService() {
        try {
            if (!this.socketService) {
                this.socketService = new SocketService_1.SocketService();
            }
            return this.socketService;
        }
        catch (error) {
            return null;
        }
    }
    async createBooking(data) {
        const book = await this.bookService.getBookById(data.bookId);
        if (!book.isAvailable()) {
            throw new types_1.AppError('Book is not available for booking', 400);
        }
        const existingBooking = await this.bookingRepository.findActiveBookingForUserAndBook(data.userId, data.bookId);
        if (existingBooking) {
            throw new types_1.AppError('You already have an active booking for this book', 409);
        }
        const bookingData = {
            userId: new mongoose_1.Types.ObjectId(data.userId),
            bookId: new mongoose_1.Types.ObjectId(data.bookId),
            borrowPeriodDays: data.borrowPeriodDays || 14,
            notes: data.notes,
            metadata: {
                requestSource: data.metadata?.requestSource || 'web',
                ipAddress: data.metadata?.ipAddress,
                userAgent: data.metadata?.userAgent,
            },
        };
        const booking = await this.bookingRepository.create(bookingData);
        await this.bookService.reserveBook(data.bookId);
        const socketService = this.getSocketService();
        if (socketService) {
            await socketService.notifyBookingCreated(booking);
        }
        return booking;
    }
    async getBookingById(id) {
        const booking = await this.bookingRepository.findByIdWithDetails(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        return booking;
    }
    async updateBooking(id, updateData) {
        const existingBooking = await this.bookingRepository.findById(id);
        if (!existingBooking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        const updatedBooking = await this.bookingRepository.update(id, updateData);
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to update booking', 500);
        }
        return updatedBooking;
    }
    async deleteBooking(id) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (booking.status !== types_1.BookingStatus.PENDING) {
            throw new types_1.AppError('Only pending bookings can be deleted', 400);
        }
        await this.bookService.releaseBook(booking.bookId.toString());
        const deleted = await this.bookingRepository.delete(id);
        if (!deleted) {
            throw new types_1.AppError('Failed to delete booking', 500);
        }
    }
    async getAllBookings(query) {
        return await this.bookingRepository.findAll(query);
    }
    async getUserBookings(userId, query) {
        const bookings = await this.bookingRepository.findByUserId(userId, { ...query, status: query.status });
        return bookings;
    }
    async getBookBookings(bookId, query) {
        return await this.bookingRepository.findByBookId(bookId, query);
    }
    async getPendingBookings(query) {
        return await this.bookingRepository.findPendingBookings(query);
    }
    async getOverdueBookings(query) {
        return await this.bookingRepository.findOverdueBookings(query);
    }
    async approveBooking(id, adminId, notes) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (booking.status !== types_1.BookingStatus.PENDING) {
            throw new types_1.AppError('Only pending bookings can be approved', 400);
        }
        const book = await this.bookService.getBookById(booking.bookId.toString());
        if (!book.isAvailable() && book.availability.availableCopies === 0) {
            throw new types_1.AppError('Book is no longer available', 400);
        }
        const updatedBooking = await this.bookingRepository.update(id, {
            status: types_1.BookingStatus.APPROVED,
            approvedBy: adminId,
            approvedDate: new Date(),
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + (booking.borrowPeriodDays * 24 * 60 * 60 * 1000)),
            adminNotes: notes,
        });
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to approve booking', 500);
        }
        const socketService = this.getSocketService();
        if (socketService) {
            await socketService.notifyBookingApproved(updatedBooking);
        }
        return updatedBooking;
    }
    async rejectBooking(id, adminId, reason) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (booking.status !== types_1.BookingStatus.PENDING) {
            throw new types_1.AppError('Only pending bookings can be rejected', 400);
        }
        await this.bookService.releaseBook(booking.bookId.toString());
        const updatedBooking = await this.bookingRepository.update(id, {
            status: types_1.BookingStatus.REJECTED,
            rejectedBy: adminId,
            rejectedDate: new Date(),
            adminNotes: reason,
        });
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to reject booking', 500);
        }
        const socketService = this.getSocketService();
        if (socketService) {
            await socketService.notifyBookingRejected(updatedBooking);
        }
        return updatedBooking;
    }
    async returnBook(id) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (booking.status !== types_1.BookingStatus.APPROVED && booking.status !== types_1.BookingStatus.OVERDUE) {
            throw new types_1.AppError('Only approved or overdue bookings can be returned', 400);
        }
        await this.bookService.releaseBook(booking.bookId.toString());
        const updatedBooking = await this.bookingRepository.update(id, {
            status: types_1.BookingStatus.RETURNED,
            returnDate: new Date(),
        });
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to return book', 500);
        }
        const socketService = this.getSocketService();
        if (socketService) {
            await socketService.notifyBookingReturned(updatedBooking);
        }
        return updatedBooking;
    }
    async renewBooking(id, additionalDays) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (!booking.canBeRenewed()) {
            throw new types_1.AppError('Booking cannot be renewed', 400);
        }
        const renewalDays = additionalDays || booking.borrowPeriodDays;
        const newDueDate = new Date(booking.dueDate.getTime() + (renewalDays * 24 * 60 * 60 * 1000));
        const updatedBooking = await this.bookingRepository.update(id, {
            dueDate: newDueDate,
            renewalCount: booking.renewalCount + 1,
        });
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to renew booking', 500);
        }
        return updatedBooking;
    }
    async getBookingStats() {
        return await this.bookingRepository.getBookingStats();
    }
    async getUserBookingHistory(userId, query) {
        return await this.bookingRepository.getUserBookingHistory(userId, query);
    }
    async getPopularBooks(query) {
        return await this.bookingRepository.getPopularBooks(query);
    }
    async getBookingsDueSoon(days = 3) {
        return await this.bookingRepository.findBookingsDueSoon(days);
    }
    async getRecentUserBookings(userId, days = 3) {
        return await this.bookingRepository.findRecentUserBookings(userId, days);
    }
    async updateOverdueBookings() {
        return await this.bookingRepository.updateOverdueBookings();
    }
    async validateUserBookingAccess(bookingId, userId, userRole) {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (userRole === 'admin') {
            return;
        }
        if (booking.userId.toString() !== userId) {
            throw new types_1.AppError('You can only access your own bookings', 403);
        }
    }
    async cancelBooking(id, userId) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (booking.userId.toString() !== userId) {
            throw new types_1.AppError('You can only cancel your own bookings', 403);
        }
        if (booking.status !== types_1.BookingStatus.PENDING) {
            throw new types_1.AppError('Only pending bookings can be cancelled', 400);
        }
        await this.bookService.releaseBook(booking.bookId.toString());
        const updatedBooking = await this.bookingRepository.update(id, {
            status: types_1.BookingStatus.REJECTED,
            adminNotes: 'Cancelled by user',
        });
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to cancel booking', 500);
        }
        return updatedBooking;
    }
    async rateBooking(id, userId, rating) {
        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new types_1.AppError('Booking not found', 404);
        }
        if (booking.userId.toString() !== userId) {
            throw new types_1.AppError('You can only rate your own bookings', 403);
        }
        if (booking.status !== types_1.BookingStatus.RETURNED) {
            throw new types_1.AppError('You can only rate returned books', 400);
        }
        const updatedBooking = await this.bookingRepository.update(id, { rating });
        if (!updatedBooking) {
            throw new types_1.AppError('Failed to rate booking', 500);
        }
        return updatedBooking;
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=BookingService.js.map