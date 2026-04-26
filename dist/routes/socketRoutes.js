"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SocketController_1 = require("../controllers/SocketController");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const socketController = new SocketController_1.SocketController();
router.use(middleware_1.authenticate);
router.get('/status', socketController.getConnectionStatus);
router.get('/events', socketController.getSocketEvents);
router.get('/user/:userId/connection', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('userId'), middleware_1.handleValidationErrors, socketController.checkUserConnection);
router.post('/notification/system', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required'),
    (0, express_validator_1.body)('type').optional().isIn(['info', 'warning', 'error']).withMessage('Invalid notification type'),
    (0, express_validator_1.body)('targetUsers').optional().isArray().withMessage('Target users must be an array'),
    middleware_1.handleValidationErrors,
], socketController.sendSystemNotification);
router.post('/notification/maintenance', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('startTime').isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
    (0, express_validator_1.body)('endTime').isISO8601().withMessage('End time must be a valid ISO 8601 date'),
    middleware_1.handleValidationErrors,
], socketController.sendMaintenanceNotification);
router.post('/notification/emergency', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('message').notEmpty().withMessage('Emergency message is required'),
    middleware_1.handleValidationErrors,
], socketController.sendEmergencyNotification);
router.post('/message/direct/:userId', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('userId'), [
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required'),
    (0, express_validator_1.body)('type').optional().isString().withMessage('Type must be a string'),
    middleware_1.handleValidationErrors,
], socketController.sendDirectMessage);
router.post('/broadcast/admins', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('event').notEmpty().withMessage('Event is required'),
    (0, express_validator_1.body)('data').notEmpty().withMessage('Data is required'),
    middleware_1.handleValidationErrors,
], socketController.broadcastToAdmins);
router.post('/broadcast/statistics', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('stats').notEmpty().withMessage('Statistics data is required'),
    middleware_1.handleValidationErrors,
], socketController.broadcastStatistics);
router.post('/reminders/bookings', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), socketController.sendBookingReminders);
router.post('/notifications/overdue', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), socketController.sendOverdueNotifications);
exports.default = router;
//# sourceMappingURL=socketRoutes.js.map