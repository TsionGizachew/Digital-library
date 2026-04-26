import { BookQuery } from '../repositories/BookRepository';
import { IBook } from '../entities/Book';
import { BookStatus, PaginationQuery } from '../types';
import mongoose from 'mongoose';
export interface CreateBookData {
    id: string;
    title: string;
    author: string;
    description: string;
    category: string;
    isbn?: string;
    code?: string;
    publisher?: string;
    publishedDate?: Date;
    pageCount?: number;
    language?: string;
    tags?: string[];
    coverImage?: string;
    availability: {
        totalCopies: number;
        availableCopies: number;
    };
    location: {
        shelf: string;
        section: string;
        floor?: string;
    };
}
export interface UpdateBookData {
    title?: string;
    author?: string;
    description?: string;
    category?: string;
    isbn?: string;
    code?: string;
    publisher?: string;
    publishedDate?: Date;
    pageCount?: number;
    language?: string;
    tags?: string[];
    coverImage?: string;
    status?: BookStatus;
    availability?: {
        totalCopies?: number;
        availableCopies?: number;
        reservedCopies?: number;
    };
    location?: {
        shelf?: string;
        section?: string;
        floor?: string;
    };
}
export declare class BookService {
    private bookRepository;
    private socketService;
    constructor();
    private getSocketService;
    createBook(data: CreateBookData, addedBy: string): Promise<IBook>;
    getBookById(id: string): Promise<IBook>;
    updateBook(id: string, updateData: UpdateBookData, updatedBy: string): Promise<IBook>;
    deleteBook(id: string): Promise<void>;
    getAllBooks(query: BookQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getAvailableBooks(query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getPopularBooks(query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getRecentlyAddedBooks(query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    searchBooks(searchTerm: string, query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getBooksByCategory(category: string, query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getBooksByStatus(status: BookStatus, query: PaginationQuery): Promise<{
        books: (mongoose.Document<unknown, {}, IBook, {}, {}> & IBook & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    updateBookStatus(id: string, status: BookStatus): Promise<IBook>;
    updateBookAvailability(id: string, change: number): Promise<IBook>;
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
    checkBookAvailability(id: string): Promise<{
        available: boolean;
        availableCopies: number;
    }>;
    reserveBook(id: string): Promise<IBook>;
    releaseBook(id: string): Promise<IBook>;
    getBookByISBN(isbn: string): Promise<IBook>;
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
    getBookCount(): Promise<number>;
    getCategoryCount(): Promise<number>;
}
//# sourceMappingURL=BookService.d.ts.map