import mongoose, { Document } from 'mongoose';
import { BookingStatus } from '../types';
export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    bookId: mongoose.Types.ObjectId;
    status: BookingStatus;
    requestDate: Date;
    approvedDate?: Date;
    rejectedDate?: Date;
    borrowDate?: Date;
    dueDate?: Date;
    returnDate?: Date;
    notes?: string;
    adminNotes?: string;
    approvedBy?: mongoose.Types.ObjectId;
    rejectedBy?: mongoose.Types.ObjectId;
    borrowPeriodDays: number;
    renewalCount: number;
    maxRenewals: number;
    fineAmount: number;
    finePaid: boolean;
    rating?: number;
    metadata: {
        requestSource: 'web' | 'mobile' | 'admin';
        ipAddress?: string;
        userAgent?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    user?: any;
    book?: any;
    isOverdue(): boolean;
    calculateFine(): number;
    canBeRenewed(): boolean;
    getDaysUntilDue(): number;
    approve(adminId: mongoose.Types.ObjectId, notes?: string): Promise<void>;
    reject(adminId: mongoose.Types.ObjectId, reason: string): Promise<void>;
    markAsBorrowed(): Promise<void>;
    markAsReturned(): Promise<void>;
    renew(days?: number): Promise<void>;
}
export declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, {}> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Booking.d.ts.map