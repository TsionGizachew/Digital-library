"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const BookRepository_1 = require("../repositories/BookRepository");
const SocketService_1 = require("./SocketService");
const types_1 = require("../types");
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = require("crypto");
class BookService {
    constructor() {
        this.bookRepository = new BookRepository_1.BookRepository();
        try {
            this.socketService = new SocketService_1.SocketService();
        }
        catch (error) {
        }
    }
    getSocketService() {
        try {
            if (!this.socketService) {
                this.socketService = new SocketService_1.SocketService();
            }
            return this.socketService;
        }
        catch (error) {
            return null;
        }
    }
    async createBook(data, addedBy) {
        if (data.isbn) {
            const existingBook = await this.bookRepository.findByISBN(data.isbn);
            if (existingBook) {
                throw new types_1.AppError('A book with this ISBN already exists', 409);
            }
        }
        console.log("Creating book...");
        const code = data.code ?? `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const id = (0, crypto_1.randomUUID)();
        const totalCopies = data.availability?.totalCopies ?? 1;
        const bookData = {
            ...data,
            code,
            availability: {
                totalCopies,
                availableCopies: totalCopies,
                reservedCopies: 0,
            },
            metadata: {
                addedBy: new mongoose_1.default.Types.ObjectId(addedBy),
                totalBookings: 0,
                popularityScore: 0,
            },
        };
        const book = await this.bookRepository.create(bookData);
        console.log("Book created successfully:", book);
        const socketService = this.getSocketService();
        if (socketService) {
            await socketService.notifyBookAdded(book);
        }
        return book;
    }
    async getBookById(id) {
        const book = await this.bookRepository.findByIdWithDetails(id);
        if (!book) {
            throw new types_1.AppError('Book not found', 404);
        }
        return book;
    }
    async updateBook(id, updateData, updatedBy) {
        const existingBook = await this.bookRepository.findById(id);
        if (!existingBook) {
            throw new types_1.AppError('Book not found', 404);
        }
        if (updateData.isbn && updateData.isbn !== existingBook.isbn) {
            const isbnExists = await this.bookRepository.exists(updateData.isbn);
            if (isbnExists) {
                throw new types_1.AppError('A book with this ISBN already exists', 409);
            }
        }
        const updatedBookData = {
            ...updateData,
            metadata: {
                ...existingBook.metadata,
                lastUpdatedBy: new mongoose_1.default.Types.ObjectId(updatedBy),
            },
        };
        if (updateData.availability) {
            updatedBookData.availability = {
                totalCopies: updateData.availability.totalCopies ?? existingBook.availability.totalCopies,
                availableCopies: updateData.availability.availableCopies ?? existingBook.availability.availableCopies,
                reservedCopies: updateData.availability.reservedCopies ?? existingBook.availability.reservedCopies,
            };
        }
        const updatedBook = await this.bookRepository.update(id, updatedBookData);
        if (!updatedBook) {
            throw new types_1.AppError('Failed to update book', 500);
        }
        return updatedBook;
    }
    async deleteBook(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new types_1.AppError('Book not found', 404);
        }
        const deleted = await this.bookRepository.delete(id);
        if (!deleted) {
            throw new types_1.AppError('Failed to delete book', 500);
        }
    }
    async getAllBooks(query) {
        return await this.bookRepository.findAll(query);
    }
    async getAvailableBooks(query) {
        return await this.bookRepository.findAvailable(query);
    }
    async getPopularBooks(query) {
        return await this.bookRepository.findPopular(query);
    }
    async getRecentlyAddedBooks(query) {
        return await this.bookRepository.findRecentlyAdded(query);
    }
    async searchBooks(searchTerm, query) {
        if (!searchTerm || searchTerm.trim().length === 0) {
            throw new types_1.AppError('Search term is required', 400);
        }
        return await this.bookRepository.search(searchTerm.trim(), query);
    }
    async getBooksByCategory(category, query) {
        return await this.bookRepository.findByCategory(category, query);
    }
    async getBooksByStatus(status, query) {
        return await this.bookRepository.findByStatus(status, query);
    }
    async updateBookStatus(id, status) {
        console.log("here from update");
        const book = await this.bookRepository.findById(id);
        if (!book) {
            console.log("this id i dont found ", id);
            throw new types_1.AppError('Book not found', 404);
        }
        const updatedBook = await this.bookRepository.update(id, { status });
        if (!updatedBook) {
            throw new types_1.AppError('Failed to update book status', 500);
        }
        return updatedBook;
    }
    async updateBookAvailability(id, change) {
        const book = await this.bookRepository.updateAvailability(id, change);
        if (!book) {
            throw new types_1.AppError('Book not found or failed to update availability', 404);
        }
        return book;
    }
    async getBookStats() {
        return await this.bookRepository.getBookStats();
    }
    async getCategories() {
        return await this.bookRepository.getCategories();
    }
    async getCategoryStats() {
        return await this.bookRepository.getCategoryStats();
    }
    async checkBookAvailability(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new types_1.AppError('Book not found', 404);
        }
        return {
            available: book.isAvailable(),
            availableCopies: book.availability.availableCopies,
        };
    }
    async reserveBook(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new types_1.AppError('Book not found', 404);
        }
        if (!book.isAvailable()) {
            throw new types_1.AppError('Book is not available for reservation', 400);
        }
        const updatedBook = await this.bookRepository.updateAvailability(id, -1);
        if (!updatedBook) {
            throw new types_1.AppError('Failed to reserve book', 500);
        }
        await this.bookRepository.incrementBookingCount(id);
        return updatedBook;
    }
    async releaseBook(id) {
        const book = await this.bookRepository.findById(id);
        if (!book) {
            throw new types_1.AppError('Book not found', 404);
        }
        const updatedBook = await this.bookRepository.updateAvailability(id, 1);
        if (!updatedBook) {
            throw new types_1.AppError('Failed to release book', 500);
        }
        return updatedBook;
    }
    async getBookByISBN(isbn) {
        const book = await this.bookRepository.findByISBN(isbn);
        if (!book) {
            throw new types_1.AppError('Book not found', 404);
        }
        return book;
    }
    async getFeaturedBooks(query) {
        const popularBooks = await this.getPopularBooks(query);
        const recentlyAddedBooks = await this.getRecentlyAddedBooks(query);
        const recommendedBooks = await this.getPopularBooks(query);
        return {
            popularBooks: popularBooks.books,
            recentlyAddedBooks: recentlyAddedBooks.books,
            recommendedBooks: recommendedBooks.books,
        };
    }
    async getBookCount() {
        return await this.bookRepository.countDocuments();
    }
    async getCategoryCount() {
        const categories = await this.bookRepository.getCategories();
        return categories.length;
    }
}
exports.BookService = BookService;
//# sourceMappingURL=BookService.js.map