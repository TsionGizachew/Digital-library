"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchQuery = exports.validatePaginationQuery = exports.validateBookingUpdate = exports.validateBookingCreation = exports.validateBookUpdate = exports.validateBookCreation = exports.validateUserUpdate = exports.validateUserLogin = exports.validateUserRegistration = exports.validateName = exports.validatePassword = exports.validateEmail = exports.validateObjectId = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const types_1 = require("../types");
const enums_1 = require("../types/enums");
const mongoose_1 = __importDefault(require("mongoose"));
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return next(new types_1.AppError(`Validation failed: ${errorMessages.join(', ')}`, 400));
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
const validateObjectId = (field) => {
    return (0, express_validator_1.param)(field)
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error(`Invalid ${field} format`);
        }
        return true;
    });
};
exports.validateObjectId = validateObjectId;
const validateEmail = () => {
    return (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address');
};
exports.validateEmail = validateEmail;
const validatePassword = () => {
    return (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
};
exports.validatePassword = validatePassword;
const validateName = () => {
    return (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces');
};
exports.validateName = validateName;
exports.validateUserRegistration = [
    (0, exports.validateName)(),
    (0, exports.validateEmail)(),
    (0, exports.validatePassword)(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(Object.values(enums_1.UserRole))
        .withMessage('Invalid user role'),
    exports.handleValidationErrors,
];
exports.validateUserLogin = [
    (0, exports.validateEmail)(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    exports.handleValidationErrors,
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('phoneNumber')
        .optional()
        .matches(/^\+?[\d\s-()]+$/)
        .withMessage('Please provide a valid phone number'),
    exports.handleValidationErrors,
];
exports.validateBookCreation = [
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('author')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Author must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    (0, express_validator_1.body)('category')
        .isIn([
        'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History',
        'Biography', 'Self-Help', 'Business', 'Health', 'Travel',
        'Cooking', 'Art', 'Music', 'Sports', 'Religion', 'Philosophy',
        'Psychology', 'Education', 'Children', 'Young Adult', 'Romance',
        'Mystery', 'Thriller', 'Horror', 'Fantasy', 'Science Fiction', 'Other'
    ])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('isbn')
        .optional()
        .matches(/^(?:\d{9}[\dX]|\d{13})$/)
        .withMessage('Please provide a valid ISBN'),
    (0, express_validator_1.body)('code')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Code must be between 1 and 50 characters'),
    (0, express_validator_1.body)('language')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Language cannot exceed 50 characters'),
    (0, express_validator_1.body)('pages')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('Page count must be between 1 and 10000'),
    (0, express_validator_1.body)('availability.totalCopies')
        .isInt({ min: 1 })
        .withMessage('Total copies must be at least 1'),
    (0, express_validator_1.body)('location.shelf')
        .trim()
        .notEmpty()
        .withMessage('Shelf location is required'),
    (0, express_validator_1.body)('location.section')
        .trim()
        .notEmpty()
        .withMessage('Section is required'),
    exports.handleValidationErrors,
];
exports.validateBookUpdate = [
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('author')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Author must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    exports.handleValidationErrors,
];
exports.validateBookingCreation = [
    (0, express_validator_1.body)('bookId')
        .notEmpty()
        .withMessage('Book ID is required')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid book ID format');
        }
        return true;
    }),
    (0, express_validator_1.body)('borrowPeriodDays')
        .optional()
        .isInt({ min: 1, max: 90 })
        .withMessage('Borrow period must be between 1 and 90 days'),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
    exports.handleValidationErrors,
];
exports.validateBookingUpdate = [
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(Object.values(types_1.BookingStatus))
        .withMessage('Invalid booking status'),
    (0, express_validator_1.body)('adminNotes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Admin notes cannot exceed 1000 characters'),
    exports.handleValidationErrors,
];
exports.validatePaginationQuery = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Limit must be between 1 and 1000'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isString()
        .withMessage('Sort by must be a string'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc'),
    exports.handleValidationErrors,
];
exports.validateSearchQuery = [
    ...exports.validatePaginationQuery.slice(0, -1),
    (0, express_validator_1.query)('search')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Search term cannot be empty'),
    (0, express_validator_1.query)('category')
        .optional()
        .isString()
        .withMessage('Category must be a string'),
    (0, express_validator_1.query)('status')
        .optional()
        .isString()
        .withMessage('Status must be a string'),
    exports.handleValidationErrors,
];
//# sourceMappingURL=validation.js.map