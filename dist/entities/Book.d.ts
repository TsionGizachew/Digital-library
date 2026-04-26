import mongoose, { Document } from 'mongoose';
import { BookStatus } from '../types/enums';
export interface IBook extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    author: string;
    isbn?: string;
    code?: string;
    description: string;
    category: string;
    status: BookStatus;
    coverImage?: string;
    publisher?: string;
    publishedDate?: Date;
    pageCount?: number;
    language: string;
    tags: string[];
    rating?: {
        average: number;
        count: number;
    };
    availability: {
        totalCopies: number;
        availableCopies: number;
        reservedCopies: number;
    };
    location?: {
        shelf: string;
        section: string;
        floor?: string;
    };
    metadata: {
        addedBy: mongoose.Types.ObjectId;
        lastUpdatedBy?: mongoose.Types.ObjectId;
        totalBookings: number;
        popularityScore: number;
    };
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    isAvailable(): boolean;
    updateAvailability(change: number): Promise<void>;
    calculatePopularityScore(): number;
}
export declare const Book: mongoose.Model<IBook, {}, {}, {}, mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Book.d.ts.map