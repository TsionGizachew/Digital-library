import { IBook } from '../entities/Book';
import { BookStatus, PaginationQuery } from '../types';
import mongoose from 'mongoose';
export interface BookQuery extends PaginationQuery {
    search?: string;
    category?: string;
    status?: BookStatus;
    author?: string;
}
export declare class BookRepository {
    create(bookData: Partial<IBook>): Promise<IBook>;
    findById(id: string): Promise<IBook | null>;
    findByIdWithDetails(id: string): Promise<IBook | null>;
    update(id: string, updateData: Partial<IBook>): Promise<IBook | null>;
    delete(id: string): Promise<boolean>;
    findAll(query: BookQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    findByCategory(category: string, query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    findByStatus(status: BookStatus, query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    search(searchTerm: string, query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    findAvailable(query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    findPopular(query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    findRecentlyAdded(query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    updateAvailability(id: string, change: number): Promise<IBook | null>;
    incrementBookingCount(id: string): Promise<void>;
    getBookStats(): Promise<{
        totalBooks: number;
        availableBooks: number;
        bookedBooks: number;
        maintenanceBooks: number;
        totalCopies: any;
        availableCopies: any;
        borrowedCopies: number;
    }>;
    getCategories(): Promise<string[]>;
    getCategoryStats(): Promise<{
        category: any;
        totalBooks: any;
        availableBooks: any;
    }[]>;
    findByISBN(isbn: string): Promise<IBook | null>;
    exists(isbn: string): Promise<boolean>;
    countDocuments(filter?: any): Promise<number>;
    getFeaturedBooks(query: any): Promise<{
        popularBooks: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        recentlyAddedBooks: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        recommendedBooks: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
//# sourceMappingURL=BookRepository.d.ts.map