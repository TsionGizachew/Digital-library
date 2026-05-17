"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketManager = exports.initializeSocket = exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
class SocketManager {
    constructor(httpServer) {
        this.connectedUsers = new Map();
        const allowedOrigins = env_1.env.SOCKET_CORS_ORIGIN.split(',').map(origin => origin.trim());
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: (origin, callback) => {
                    if (!origin) {
                        logger_1.logger.info('Socket.IO: Allowing request with no origin');
                        return callback(null, true);
                    }
                    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                        logger_1.logger.info(`Socket.IO: Allowing origin: ${origin}`);
                        callback(null, true);
                    }
                    else {
                        logger_1.logger.warn(`Socket.IO: Rejecting origin: ${origin}`);
                        logger_1.logger.warn(`Socket.IO: Allowed origins: ${allowedOrigins.join(', ')}`);
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                methods: ['GET', 'POST'],
                credentials: true,
            },
            transports: ['websocket', 'polling'],
            allowEIO3: true,
            pingTimeout: 60000,
            pingInterval: 25000,
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Authentication token required'));
                }
                const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
                if (!decoded || typeof decoded !== 'object') {
                    return next(new Error('Invalid token payload'));
                }
                socket.userId = decoded.userId;
                socket.userRole = decoded.role;
                socket.userEmail = decoded.email;
                logger_1.logger.info(`Socket authenticated for user: ${decoded.email}`);
                next();
            }
            catch (error) {
                logger_1.logger.error('Socket authentication failed:', error);
                next(new Error('Authentication failed'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            logger_1.logger.info(`User connected: ${socket.userEmail} (${socket.id})`);
            if (socket.userId) {
                this.connectedUsers.set(socket.userId, socket.id);
                socket.join(`user:${socket.userId}`);
                if (socket.userRole === 'admin' || socket.userRole === 'superadmin') {
                    socket.join('admin');
                }
            }
            socket.on('join:book', (bookId) => {
                socket.join(`book:${bookId}`);
                logger_1.logger.info(`User ${socket.userEmail} joined book room: ${bookId}`);
            });
            socket.on('leave:book', (bookId) => {
                socket.leave(`book:${bookId}`);
                logger_1.logger.info(`User ${socket.userEmail} left book room: ${bookId}`);
            });
            socket.on('message:send', (data) => {
                const messageData = {
                    message: data.message,
                    userId: socket.userId,
                    userEmail: socket.userEmail,
                    timestamp: new Date().toISOString(),
                };
                if (data.room) {
                    socket.to(data.room).emit('message:received', messageData);
                }
                else {
                    socket.broadcast.emit('message:received', messageData);
                }
            });
            socket.on('typing:start', (room) => {
                socket.to(room).emit('typing:user', {
                    userId: socket.userId,
                    userEmail: socket.userEmail,
                    isTyping: true,
                });
            });
            socket.on('typing:stop', (room) => {
                socket.to(room).emit('typing:user', {
                    userId: socket.userId,
                    userEmail: socket.userEmail,
                    isTyping: false,
                });
            });
            socket.on('disconnect', (reason) => {
                logger_1.logger.info(`User disconnected: ${socket.userEmail} (${reason})`);
                if (socket.userId) {
                    this.connectedUsers.delete(socket.userId);
                }
            });
            socket.emit('connected', {
                message: 'Connected to Digital Library real-time service',
                userId: socket.userId,
                timestamp: new Date().toISOString(),
            });
        });
    }
    emitBookingCreated(booking) {
        this.io.to('admin').emit('booking:created', {
            type: 'booking_created',
            data: booking,
            timestamp: new Date().toISOString(),
        });
        this.io.to(`user:${booking.userId}`).emit('booking:status', {
            type: 'booking_created',
            data: booking,
            message: 'Your booking request has been submitted successfully',
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info(`Booking created event emitted for booking: ${booking._id}`);
    }
    emitBookingUpdated(booking, previousStatus) {
        const eventType = `booking_${booking.status}`;
        this.io.to(`user:${booking.userId}`).emit('booking:status', {
            type: eventType,
            data: booking,
            previousStatus,
            message: this.getBookingStatusMessage(booking.status),
            timestamp: new Date().toISOString(),
        });
        this.io.to('admin').emit('booking:updated', {
            type: eventType,
            data: booking,
            previousStatus,
            timestamp: new Date().toISOString(),
        });
        this.io.to(`book:${booking.bookId}`).emit('book:availability_changed', {
            type: 'booking_status_changed',
            bookId: booking.bookId,
            bookingStatus: booking.status,
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info(`Booking updated event emitted for booking: ${booking._id} (${booking.status})`);
    }
    emitBookAvailabilityChanged(book) {
        this.io.to(`book:${book._id}`).emit('book:availability_changed', {
            type: 'availability_changed',
            data: {
                bookId: book._id,
                title: book.title,
                availableCopies: book.availability.availableCopies,
                totalCopies: book.availability.totalCopies,
                status: book.status,
            },
            timestamp: new Date().toISOString(),
        });
        this.io.to('admin').emit('book:updated', {
            type: 'availability_changed',
            data: book,
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info(`Book availability changed event emitted for book: ${book._id}`);
    }
    emitUserStatusChanged(user) {
        this.io.to(`user:${user._id}`).emit('user:status_changed', {
            type: 'status_changed',
            data: {
                userId: user._id,
                status: user.status,
                role: user.role,
            },
            message: this.getUserStatusMessage(user.status),
            timestamp: new Date().toISOString(),
        });
        this.io.to('admin').emit('user:updated', {
            type: 'status_changed',
            data: user,
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info(`User status changed event emitted for user: ${user._id} (${user.status})`);
    }
    emitSystemNotification(message, type = 'info', targetUsers) {
        const notification = {
            type: 'system_notification',
            level: type,
            message,
            timestamp: new Date().toISOString(),
        };
        if (targetUsers && targetUsers.length > 0) {
            targetUsers.forEach(userId => {
                this.io.to(`user:${userId}`).emit('notification', notification);
            });
        }
        else {
            this.io.emit('notification', notification);
        }
        logger_1.logger.info(`System notification emitted: ${message} (${type})`);
    }
    emitBookingReminder(booking) {
        this.io.to(`user:${booking.userId}`).emit('booking:reminder', {
            type: 'due_soon',
            data: booking,
            message: `Your book "${booking.book?.title}" is due soon. Please return it by ${new Date(booking.dueDate).toLocaleDateString()}.`,
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info(`Booking reminder emitted for booking: ${booking._id}`);
    }
    emitOverdueNotification(booking) {
        this.io.to(`user:${booking.userId}`).emit('booking:overdue', {
            type: 'overdue',
            data: booking,
            message: `Your book "${booking.book?.title}" is overdue. Please return it as soon as possible.`,
            timestamp: new Date().toISOString(),
        });
        this.io.to('admin').emit('booking:overdue', {
            type: 'overdue',
            data: booking,
            timestamp: new Date().toISOString(),
        });
        logger_1.logger.info(`Overdue notification emitted for booking: ${booking._id}`);
    }
    getBookingStatusMessage(status) {
        const messages = {
            pending: 'Your booking request is pending approval',
            approved: 'Your booking has been approved! You can now collect the book',
            rejected: 'Your booking request has been rejected',
            returned: 'Thank you for returning the book',
            overdue: 'Your book is overdue. Please return it as soon as possible',
        };
        return messages[status] || 'Booking status updated';
    }
    getUserStatusMessage(status) {
        const messages = {
            active: 'Your account is now active',
            blocked: 'Your account has been blocked. Please contact support',
            pending: 'Your account is pending approval',
        };
        return messages[status] || 'Account status updated';
    }
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }
    getIO() {
        return this.io;
    }
    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }
    sendToUser(userId, event, data) {
        this.io.to(`user:${userId}`).emit(event, data);
    }
    sendToAdmins(event, data) {
        this.io.to('admin').emit(event, data);
    }
}
exports.SocketManager = SocketManager;
let socketManager;
const initializeSocket = (httpServer) => {
    socketManager = new SocketManager(httpServer);
    return socketManager;
};
exports.initializeSocket = initializeSocket;
const getSocketManager = () => {
    if (!socketManager) {
        throw new Error('Socket manager not initialized. Call initializeSocket first.');
    }
    return socketManager;
};
exports.getSocketManager = getSocketManager;
//# sourceMappingURL=socket.js.map