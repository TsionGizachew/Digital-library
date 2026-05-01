"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const eventController = __importStar(require("../controllers/EventController"));
const middleware_1 = require("../middleware");
const upload_1 = require("../middleware/upload");
const types_1 = require("../types");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
router.use(middleware_1.authenticate);
router.use((0, middleware_1.authorize)(types_1.UserRole.ADMIN));
router.get('/dashboard', adminController.getDashboard);
router.get('/stats', adminController.getStats);
router.get('/activity', adminController.getSystemActivity);
router.get('/health', adminController.getSystemHealth);
router.get('/audit-log', middleware_1.validatePaginationQuery, adminController.getAuditLog);
router.get('/users', middleware_1.validatePaginationQuery, adminController.getAllUsers);
router.put('/users/:userId/promote', (0, middleware_1.validateObjectId)('userId'), middleware_1.handleValidationErrors, adminController.promoteUserToAdmin);
router.put('/users/:userId/demote', (0, middleware_1.validateObjectId)('userId'), middleware_1.handleValidationErrors, adminController.demoteAdminToUser);
router.put('/users/:userId/block', (0, middleware_1.validateObjectId)('userId'), middleware_1.handleValidationErrors, adminController.blockUser);
router.put('/users/:userId/unblock', (0, middleware_1.validateObjectId)('userId'), middleware_1.handleValidationErrors, adminController.unblockUser);
router.get('/users/:userId/borrowing-history', (0, middleware_1.validateObjectId)('userId'), middleware_1.handleValidationErrors, adminController.getUserBorrowingHistory);
router.put('/users/bulk-update', [
    (0, express_validator_1.body)('userIds').isArray().withMessage('User IDs must be an array'),
    (0, express_validator_1.body)('status').isIn(['active', 'blocked', 'pending']).withMessage('Invalid status'),
    middleware_1.handleValidationErrors,
], adminController.bulkUpdateUsers);
router.put('/users/:userId/reset-password', (0, middleware_1.validateObjectId)('userId'), [
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    middleware_1.handleValidationErrors,
], adminController.resetUserPassword);
router.get('/borrowing', adminController.getBorrowingRecords);
router.post('/borrowing/:recordId/approve', (0, middleware_1.validateObjectId)('recordId'), middleware_1.handleValidationErrors, adminController.approveBorrowingRequest);
router.post('/borrowing/:recordId/reject', (0, middleware_1.validateObjectId)('recordId'), [(0, express_validator_1.body)('reason').notEmpty().withMessage('Rejection reason is required')], middleware_1.handleValidationErrors, adminController.rejectBorrowingRequest);
router.post('/borrowing/:recordId/return', (0, middleware_1.validateObjectId)('recordId'), middleware_1.handleValidationErrors, adminController.returnBook);
router.get('/books', middleware_1.validatePaginationQuery, adminController.getAllBooks);
router.post('/books', middleware_1.validateBookCreation, adminController.createBook);
router.put('/books/:bookId/status', (0, middleware_1.validateObjectId)('bookId'), [
    (0, express_validator_1.body)('status').isIn(['available', 'booked', 'maintenance']).withMessage('Invalid status'),
    middleware_1.handleValidationErrors,
], adminController.updateBookStatus);
router.put('/books/bulk-update', [
    (0, express_validator_1.body)('bookIds').isArray().withMessage('Book IDs must be an array'),
    (0, express_validator_1.body)('status').isIn(['available', 'booked', 'maintenance']).withMessage('Invalid status'),
    middleware_1.handleValidationErrors,
], adminController.bulkUpdateBooks);
router.get('/export/users', adminController.exportUsers);
router.get('/export/books', adminController.exportBooks);
router.get('/events', eventController.getAllEvents);
router.post('/events', upload_1.upload.single('image'), eventController.createEvent);
router.get('/events/:eventId', (0, middleware_1.validateObjectId)('eventId'), middleware_1.handleValidationErrors, eventController.getEventById);
router.put('/events/:eventId', (0, middleware_1.validateObjectId)('eventId'), upload_1.upload.single('image'), middleware_1.handleValidationErrors, eventController.updateEvent);
router.delete('/events/:eventId', (0, middleware_1.validateObjectId)('eventId'), middleware_1.handleValidationErrors, eventController.deleteEvent);
router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', upload_1.upload.single('image'), adminController.createAnnouncement);
router.put('/announcements/:announcementId', (0, middleware_1.validateObjectId)('announcementId'), upload_1.upload.single('image'), middleware_1.handleValidationErrors, adminController.updateAnnouncement);
router.delete('/announcements/:announcementId', (0, middleware_1.validateObjectId)('announcementId'), middleware_1.handleValidationErrors, adminController.deleteAnnouncement);
router.put('/announcements/:announcementId/status', (0, middleware_1.validateObjectId)('announcementId'), middleware_1.handleValidationErrors, adminController.toggleAnnouncementStatus);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.post('/recommendations', [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    middleware_1.handleValidationErrors,
], adminController.createRecommendation);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map