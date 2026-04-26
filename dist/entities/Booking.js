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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    bookId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book ID is required'],
    },
    status: {
        type: String,
        enum: Object.values(types_1.BookingStatus),
        default: types_1.BookingStatus.PENDING,
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    approvedDate: {
        type: Date,
    },
    rejectedDate: {
        type: Date,
    },
    borrowDate: {
        type: Date,
    },
    dueDate: {
        type: Date,
    },
    returnDate: {
        type: Date,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    rejectedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    borrowPeriodDays: {
        type: Number,
        required: [true, 'Borrow period is required'],
        min: [1, 'Borrow period must be at least 1 day'],
        max: [90, 'Borrow period cannot exceed 90 days'],
        default: 14,
    },
    renewalCount: {
        type: Number,
        min: 0,
        default: 0,
    },
    maxRenewals: {
        type: Number,
        min: 0,
        default: 2,
    },
    fineAmount: {
        type: Number,
        min: 0,
        default: 0,
    },
    finePaid: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    metadata: {
        requestSource: {
            type: String,
            enum: ['web', 'mobile', 'admin'],
            default: 'web',
        },
        ipAddress: {
            type: String,
            trim: true,
        },
        userAgent: {
            type: String,
            trim: true,
        },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
bookingSchema.index({ userId: 1 });
bookingSchema.index({ bookId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ requestDate: -1 });
bookingSchema.index({ dueDate: 1 });
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ bookId: 1, status: 1 });
bookingSchema.index({ userId: 1, bookId: 1, status: 1 }, {
    unique: true,
    partialFilterExpression: {
        status: { $in: [types_1.BookingStatus.PENDING, types_1.BookingStatus.APPROVED] }
    }
});
bookingSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});
bookingSchema.virtual('book', {
    ref: 'Book',
    localField: 'bookId',
    foreignField: '_id',
    justOne: true,
});
bookingSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === types_1.BookingStatus.APPROVED && !this.dueDate) {
        this.borrowDate = new Date();
        this.dueDate = new Date(Date.now() + this.borrowPeriodDays * 24 * 60 * 60 * 1000);
        this.approvedDate = new Date();
    }
    if (this.status === types_1.BookingStatus.OVERDUE || this.isOverdue()) {
        this.fineAmount = this.calculateFine();
        if (this.status !== types_1.BookingStatus.RETURNED) {
            this.status = types_1.BookingStatus.OVERDUE;
        }
    }
    next();
});
bookingSchema.methods.isOverdue = function () {
    if (!this.dueDate || this.status === types_1.BookingStatus.RETURNED) {
        return false;
    }
    return new Date() > this.dueDate;
};
bookingSchema.methods.calculateFine = function () {
    if (!this.dueDate || !this.isOverdue()) {
        return 0;
    }
    const overdueDays = Math.ceil((Date.now() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const finePerDay = 0.50;
    const maxFine = 25.00;
    return Math.min(overdueDays * finePerDay, maxFine);
};
bookingSchema.methods.canBeRenewed = function () {
    return (this.status === types_1.BookingStatus.APPROVED &&
        this.renewalCount < this.maxRenewals &&
        !this.isOverdue() &&
        this.fineAmount === 0);
};
bookingSchema.methods.getDaysUntilDue = function () {
    if (!this.dueDate) {
        return 0;
    }
    const diffTime = this.dueDate.getTime() - Date.now();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
bookingSchema.methods.approve = async function (adminId, notes) {
    this.status = types_1.BookingStatus.APPROVED;
    this.approvedBy = adminId;
    this.approvedDate = new Date();
    this.borrowDate = new Date();
    this.dueDate = new Date(Date.now() + this.borrowPeriodDays * 24 * 60 * 60 * 1000);
    if (notes) {
        this.adminNotes = notes;
    }
    await this.save();
};
bookingSchema.methods.reject = async function (adminId, reason) {
    this.status = types_1.BookingStatus.REJECTED;
    this.rejectedBy = adminId;
    this.rejectedDate = new Date();
    this.adminNotes = reason;
    await this.save();
};
bookingSchema.methods.markAsBorrowed = async function () {
    if (this.status !== types_1.BookingStatus.APPROVED) {
        throw new Error('Booking must be approved before it can be marked as borrowed');
    }
    this.borrowDate = new Date();
    await this.save();
};
bookingSchema.methods.markAsReturned = async function () {
    this.status = types_1.BookingStatus.RETURNED;
    this.returnDate = new Date();
    await this.save();
};
bookingSchema.methods.renew = async function (days) {
    if (!this.canBeRenewed()) {
        throw new Error('Booking cannot be renewed');
    }
    const renewalDays = days || this.borrowPeriodDays;
    this.renewalCount += 1;
    this.dueDate = new Date(this.dueDate.getTime() + renewalDays * 24 * 60 * 60 * 1000);
    await this.save();
};
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
//# sourceMappingURL=Booking.js.map