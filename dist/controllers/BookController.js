"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const BookService_1 = require("../services/BookService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
const types_1 = require("../types");
class BookController {
    constructor() {
        this.createBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const userId = req.user?.id;
            console.log(req);
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const bookData = req.body;
            const book = await this.bookService.createBook(bookData, userId);
            response_1.ResponseUtil.created(res, book, 'Book created successfully');
        });
        this.getBookById = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const book = await this.bookService.getBookById(id);
            response_1.ResponseUtil.success(res, book, 'Book retrieved successfully');
        });
        this.updateBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new types_1.AppError('User not authenticated', 401));
            }
            const updateData = req.body;
            const updatedBook = await this.bookService.updateBook(id, updateData, userId);
            response_1.ResponseUtil.updated(res, updatedBook, 'Book updated successfully');
        });
        this.deleteBook = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            await this.bookService.deleteBook(id);
            response_1.ResponseUtil.deleted(res, 'Book deleted successfully');
        });
        this.getAllBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            console.log('[User Book Controller] Getting all books. Query:', req.query);
            try {
                const query = req.query;
                const result = await this.bookService.getAllBooks(query);
                console.log(`[User Book Controller] Found ${result.books.length} books.`);
                console.log('[User Book Controller] Sample book data:', result.books.length > 0 ? result.books[0] : 'No books found');
                response_1.ResponseUtil.paginated(res, result.books, result.pagination, 'Books retrieved successfully');
            }
            catch (error) {
                console.error('[User Book Controller] Error in getAllBooks:', error);
                next(error);
            }
        });
        this.getAvailableBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const query = req.query;
            const result = await this.bookService.getAvailableBooks(query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, 'Available books retrieved successfully');
        });
        this.getPopularBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const query = req.query;
            const result = await this.bookService.getPopularBooks(query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, 'Popular books retrieved successfully');
        });
        this.getRecentlyAddedBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const query = req.query;
            const result = await this.bookService.getRecentlyAddedBooks(query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, 'Recently added books retrieved successfully');
        });
        this.searchBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { search } = req.query;
            if (!search || typeof search !== 'string') {
                return next(new types_1.AppError('Search term is required', 400));
            }
            const result = await this.bookService.searchBooks(search, req.query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, 'Book search completed successfully');
        });
        this.getBooksByCategory = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { category } = req.params;
            const result = await this.bookService.getBooksByCategory(category, req.query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, `Books in category ${category} retrieved successfully`);
        });
        this.getBooksByStatus = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { status } = req.params;
            if (!Object.values(types_1.BookStatus).includes(status)) {
                return next(new types_1.AppError('Invalid book status', 400));
            }
            const result = await this.bookService.getBooksByStatus(status, req.query);
            response_1.ResponseUtil.paginated(res, result.books, result.pagination, `Books with status ${status} retrieved successfully`);
        });
        this.updateBookStatus = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const { status } = req.body;
            if (!Object.values(types_1.BookStatus).includes(status)) {
                return next(new types_1.AppError('Invalid book status', 400));
            }
            const updatedBook = await this.bookService.updateBookStatus(id, status);
            response_1.ResponseUtil.updated(res, updatedBook, 'Book status updated successfully');
        });
        this.getBookStats = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const stats = await this.bookService.getBookStats();
            response_1.ResponseUtil.success(res, stats, 'Book statistics retrieved successfully');
        });
        this.getCategories = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const categories = await this.bookService.getCategories();
            response_1.ResponseUtil.success(res, categories, 'Categories retrieved successfully');
        });
        this.getCategoryStats = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const stats = await this.bookService.getCategoryStats();
            response_1.ResponseUtil.success(res, stats, 'Category statistics retrieved successfully');
        });
        this.checkBookAvailability = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { id } = req.params;
            const availability = await this.bookService.checkBookAvailability(id);
            response_1.ResponseUtil.success(res, availability, 'Book availability checked successfully');
        });
        this.getBookByISBN = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const { isbn } = req.params;
            const book = await this.bookService.getBookByISBN(isbn);
            response_1.ResponseUtil.success(res, book, 'Book retrieved by ISBN successfully');
        });
        this.getFeaturedBooks = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
            const result = await this.bookService.getFeaturedBooks(req.query);
            response_1.ResponseUtil.success(res, result, 'Featured books retrieved successfully');
        });
        this.bookService = new BookService_1.BookService();
    }
}
exports.BookController = BookController;
//# sourceMappingURL=BookController.js.map