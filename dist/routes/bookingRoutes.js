"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookingController_1 = require("../controllers/BookingController");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const bookingController = new BookingController_1.BookingController();
router.use(middleware_1.authenticate);
router.post('/', middleware_1.validateBookingCreation, bookingController.createBooking);
router.get('/my', middleware_1.validatePaginationQuery, bookingController.getUserBookings);
router.get('/my/history', middleware_1.validatePaginationQuery, bookingController.getUserBookingHistory);
router.get('/stats', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), bookingController.getBookingStats);
router.get('/pending', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), middleware_1.validatePaginationQuery, bookingController.getPendingBookings);
router.get('/overdue', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), middleware_1.validatePaginationQuery, bookingController.getOverdueBookings);
router.get('/due-soon', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), bookingController.getBookingsDueSoon);
router.get('/popular-books', middleware_1.validatePaginationQuery, bookingController.getPopularBooks);
router.put('/update-overdue', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), bookingController.updateOverdueBookings);
router.get('/', (0, middleware_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.SUPERADMIN), middleware_1.validatePaginationQuery, bookingController.getAllBookings);
router.get('/:id', (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, bookingController.getBookingById);
router.put('/:id', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.validateBookingUpdate, bookingController.updateBooking);
router.delete('/:id', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, bookingController.deleteBooking);
router.put('/:id/approve', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), [
    (0, express_validator_1.body)('notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
    middleware_1.handleValidationErrors,
], bookingController.approveBooking);
router.put('/:id/reject', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), [
    (0, express_validator_1.body)('reason').notEmpty().withMessage('Rejection reason is required')
        .isLength({ max: 1000 }).withMessage('Reason cannot exceed 1000 characters'),
    middleware_1.handleValidationErrors,
], bookingController.rejectBooking);
router.put('/:id/return', (0, middleware_1.authorize)(types_1.UserRole.ADMIN), (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, bookingController.returnBook);
router.put('/:id/renew', (0, middleware_1.validateObjectId)('id'), [
    (0, express_validator_1.body)('additionalDays').optional().isInt({ min: 1, max: 30 })
        .withMessage('Additional days must be between 1 and 30'),
    middleware_1.handleValidationErrors,
], bookingController.renewBooking);
router.put('/:id/cancel', (0, middleware_1.validateObjectId)('id'), middleware_1.handleValidationErrors, bookingController.cancelBooking);
router.put('/:id/rate', (0, middleware_1.validateObjectId)('id'), [
    (0, express_validator_1.body)('rating').notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    middleware_1.handleValidationErrors,
], bookingController.rateBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map