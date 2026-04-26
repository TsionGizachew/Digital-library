"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_1 = require("../config/socket");
const logger_1 = require("../utils/logger");
class SocketService {
    constructor() {
        this.socketManager = (0, socket_1.getSocketManager)();
    }
    async notifyBookingCreated(booking) {
        try {
            this.socketManager.emitBookingCreated(booking);
        }
        catch (error) {
            logger_1.logger.error('Error emitting booking created event:', error);
        }
    }
    async notifyBookingApproved(booking) {
        try {
            this.socketManager.emitBookingUpdated(booking, 'pending');
        }
        catch (error) {
            logger_1.logger.error('Error emitting booking approved event:', error);
        }
    }
    async notifyBookingRejected(booking) {
        try {
            this.socketManager.emitBookingUpdated(booking, 'pending');
        }
        catch (error) {
            logger_1.logger.error('Error emitting booking rejected event:', error);
        }
    }
    async notifyBookingReturned(booking) {
        try {
            this.socketManager.emitBookingUpdated(booking, 'approved');
        }
        catch (error) {
            logger_1.logger.error('Error emitting booking returned event:', error);
        }
    }
    async notifyBookingRenewed(booking) {
        try {
            this.socketManager.emitBookingUpdated(booking, 'approved');
        }
        catch (error) {
            logger_1.logger.error('Error emitting booking renewed event:', error);
        }
    }
    async notifyBookAvailabilityChanged(book) {
        try {
            this.socketManager.emitBookAvailabilityChanged(book);
        }
        catch (error) {
            logger_1.logger.error('Error emitting book availability changed event:', error);
        }
    }
    async notifyBookAdded(book) {
        try {
            this.socketManager.sendToAdmins('book:added', {
                type: 'book_added',
                data: book,
                message: `New book added: ${book.title}`,
                timestamp: new Date().toISOString(),
            });
            this.socketManager.getIO().emit('book:new', {
                type: 'new_book',
                data: {
                    id: book._id,
                    title: book.title,
                    author: book.author,
                    category: book.category,
                },
                message: `New book available: ${book.title} by ${book.author}`,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error emitting book added event:', error);
        }
    }
    async notifyBookUpdated(book) {
        try {
            this.socketManager.sendToAdmins('book:updated', {
                type: 'book_updated',
                data: book,
                timestamp: new Date().toISOString(),
            });
            if (book.status === 'available' && book.availability.availableCopies > 0) {
                this.socketManager.getIO().to(`book:${book._id}`).emit('book:available', {
                    type: 'book_available',
                    data: book,
                    message: `${book.title} is now available for booking!`,
                    timestamp: new Date().toISOString(),
                });
            }
        }
        catch (error) {
            logger_1.logger.error('Error emitting book updated event:', error);
        }
    }
    async notifyUserStatusChanged(user) {
        try {
            this.socketManager.emitUserStatusChanged(user);
        }
        catch (error) {
            logger_1.logger.error('Error emitting user status changed event:', error);
        }
    }
    async notifyUserRegistered(user) {
        try {
            this.socketManager.sendToAdmins('user:registered', {
                type: 'user_registered',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                message: `New user registered: ${user.name}`,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error emitting user registered event:', error);
        }
    }
    async sendSystemNotification(message, type = 'info', targetUsers) {
        try {
            this.socketManager.emitSystemNotification(message, type, targetUsers);
        }
        catch (error) {
            logger_1.logger.error('Error sending system notification:', error);
        }
    }
    async sendMaintenanceNotification(startTime, endTime) {
        try {
            const message = `System maintenance scheduled from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}`;
            this.socketManager.emitSystemNotification(message, 'warning');
        }
        catch (error) {
            logger_1.logger.error('Error sending maintenance notification:', error);
        }
    }
    async sendBookingReminders() {
        try {
            logger_1.logger.info('Sending booking reminders...');
        }
        catch (error) {
            logger_1.logger.error('Error sending booking reminders:', error);
        }
    }
    async sendOverdueNotifications() {
        try {
            logger_1.logger.info('Sending overdue notifications...');
        }
        catch (error) {
            logger_1.logger.error('Error sending overdue notifications:', error);
        }
    }
    async broadcastStatistics(stats) {
        try {
            this.socketManager.sendToAdmins('stats:updated', {
                type: 'stats_updated',
                data: stats,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error broadcasting statistics:', error);
        }
    }
    getConnectedUsersCount() {
        return this.socketManager.getConnectedUsersCount();
    }
    isUserConnected(userId) {
        return this.socketManager.isUserConnected(userId);
    }
    async sendDirectMessage(userId, message, type = 'message') {
        try {
            this.socketManager.sendToUser(userId, 'direct:message', {
                type,
                message,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error sending direct message:', error);
        }
    }
    async broadcastToAdmins(event, data) {
        try {
            this.socketManager.sendToAdmins(event, {
                ...data,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error broadcasting to admins:', error);
        }
    }
    async sendEmergencyNotification(message) {
        try {
            this.socketManager.getIO().emit('emergency', {
                type: 'emergency',
                message,
                timestamp: new Date().toISOString(),
                priority: 'high',
            });
        }
        catch (error) {
            logger_1.logger.error('Error sending emergency notification:', error);
        }
    }
    async notifyNewAnnouncement(announcement) {
        try {
            this.socketManager.getIO().emit('announcement:new', {
                type: 'new_announcement',
                data: announcement,
                message: `New announcement: ${announcement.title}`,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            logger_1.logger.error('Error emitting new announcement event:', error);
        }
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=SocketService.js.map