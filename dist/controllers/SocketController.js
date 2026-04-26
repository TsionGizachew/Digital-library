"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketController = void 0;
const SocketService_1 = require("../services/SocketService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
class SocketController {
    constructor() {
        this.getConnectionStatus = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const socketService = this.getSocketService();
            const connectedUsers = socketService.getConnectedUsersCount();
            response_1.ResponseUtil.success(res, {
                connectedUsers,
                status: 'active',
                timestamp: new Date().toISOString(),
            }, 'Socket connection status retrieved successfully');
        });
        this.sendSystemNotification = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { message, type = 'info', targetUsers } = req.body;
            if (!message) {
                return next(new types_1.AppError('Message is required', 400));
            }
            const socketService = this.getSocketService();
            await socketService.sendSystemNotification(message, type, targetUsers);
            response_1.ResponseUtil.success(res, null, 'System notification sent successfully');
        });
        this.sendMaintenanceNotification = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { startTime, endTime } = req.body;
            if (!startTime || !endTime) {
                return next(new types_1.AppError('Start time and end time are required', 400));
            }
            const socketService = this.getSocketService();
            await socketService.sendMaintenanceNotification(new Date(startTime), new Date(endTime));
            response_1.ResponseUtil.success(res, null, 'Maintenance notification sent successfully');
        });
        this.sendDirectMessage = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { userId } = req.params;
            const { message, type = 'message' } = req.body;
            if (!message) {
                return next(new types_1.AppError('Message is required', 400));
            }
            const socketService = this.getSocketService();
            await socketService.sendDirectMessage(userId, message, type);
            response_1.ResponseUtil.success(res, null, 'Direct message sent successfully');
        });
        this.broadcastToAdmins = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { event, data } = req.body;
            if (!event || !data) {
                return next(new types_1.AppError('Event and data are required', 400));
            }
            const socketService = this.getSocketService();
            await socketService.broadcastToAdmins(event, data);
            response_1.ResponseUtil.success(res, null, 'Message broadcasted to admins successfully');
        });
        this.sendEmergencyNotification = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { message } = req.body;
            if (!message) {
                return next(new types_1.AppError('Emergency message is required', 400));
            }
            const socketService = this.getSocketService();
            await socketService.sendEmergencyNotification(message);
            response_1.ResponseUtil.success(res, null, 'Emergency notification sent successfully');
        });
        this.sendBookingReminders = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const socketService = this.getSocketService();
            await socketService.sendBookingReminders();
            response_1.ResponseUtil.success(res, null, 'Booking reminders sent successfully');
        });
        this.sendOverdueNotifications = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const socketService = this.getSocketService();
            await socketService.sendOverdueNotifications();
            response_1.ResponseUtil.success(res, null, 'Overdue notifications sent successfully');
        });
        this.broadcastStatistics = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { stats } = req.body;
            if (!stats) {
                return next(new types_1.AppError('Statistics data is required', 400));
            }
            const socketService = this.getSocketService();
            await socketService.broadcastStatistics(stats);
            response_1.ResponseUtil.success(res, null, 'Statistics broadcasted successfully');
        });
        this.checkUserConnection = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { userId } = req.params;
            const socketService = this.getSocketService();
            const isConnected = socketService.isUserConnected(userId);
            response_1.ResponseUtil.success(res, {
                userId,
                isConnected,
                timestamp: new Date().toISOString(),
            }, 'User connection status checked successfully');
        });
        this.getSocketEvents = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const events = {
                booking: [
                    'booking:created',
                    'booking:status',
                    'booking:updated',
                    'booking:reminder',
                    'booking:overdue',
                ],
                book: [
                    'book:availability_changed',
                    'book:updated',
                    'book:added',
                    'book:new',
                    'book:available',
                ],
                user: [
                    'user:status_changed',
                    'user:updated',
                    'user:registered',
                ],
                system: [
                    'notification',
                    'emergency',
                    'connected',
                    'message:received',
                    'typing:user',
                ],
                admin: [
                    'stats:updated',
                    'direct:message',
                ],
            };
            response_1.ResponseUtil.success(res, events, 'Socket events list retrieved successfully');
        });
        try {
            this.socketService = new SocketService_1.SocketService();
        }
        catch (error) {
        }
    }
    getSocketService() {
        if (!this.socketService) {
            this.socketService = new SocketService_1.SocketService();
        }
        return this.socketService;
    }
}
exports.SocketController = SocketController;
//# sourceMappingURL=SocketController.js.map