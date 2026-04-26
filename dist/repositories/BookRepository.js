"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const Book_1 = require("../entities/Book");
const types_1 = require("../types");
const pagination_1 = require("../utils/pagination");
const mongoose_1 = __importDefault(require("mongoose"));
class BookRepository {
    async create(bookData) {
        const book = new Book_1.Book(bookData);
        return await book.save();
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Book_1.Book.findById(id).populate('metadata.addedBy', 'name email');
    }
    async findByIdWithDetails(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Book_1.Book.findById(id)
            .populate('metadata.addedBy', 'name email')
            .populate('metadata.lastUpdatedBy', 'name email');
    }
    async update(id, updateData) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Book_1.Book.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true }).populate('metadata.addedBy', 'name email');
    }
    async delete(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return false;
        }
        const result = await Book_1.Book.findByIdAndDelete(id);
        return !!result;
    }
    async findAll(query) {
        const { page, limit, skip, sortBy, sortOrder } = pagination_1.PaginationUtil.parseQuery(query);
        const filter = {};
        if (query.category) {
            filter.category = query.category;
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.author) {
            const authorRegex = new RegExp(query.author, 'i');
            filter.author = authorRegex;
        }
        if (query.search) {
            const searchRegex = new RegExp(query.search, 'i');
            filter.$or = [
                { title: searchRegex },
                { author: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } },
            ];
        }
        const sort = pagination_1.PaginationUtil.buildSortObject(sortBy, sortOrder);
        const [books, totalBooks] = await Promise.all([
            Book_1.Book.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('metadata.addedBy', 'name email'),
            Book_1.Book.countDocuments(filter),
        ]);
        const pagination = pagination_1.PaginationUtil.calculatePagination(totalBooks, page, limit);
        return {
            books,
            pagination,
        };
    }
    async findByCategory(category, query) {
        const categoryQuery = {
            ...query,
            category,
        };
        return this.findAll(categoryQuery);
    }
    async findByStatus(status, query) {
        const statusQuery = {
            ...query,
            status,
        };
        return this.findAll(statusQuery);
    }
    async search(searchTerm, query) {
        const searchQuery = {
            ...query,
            search: searchTerm,
        };
        return this.findAll(searchQuery);
    }
    async findAvailable(query) {
        const availableQuery = {
            ...query,
            status: types_1.BookStatus.AVAILABLE,
        };
        return this.findAll(availableQuery);
    }
    async findPopular(query) {
        const { page, limit, skip } = pagination_1.PaginationUtil.parseQuery(query);
        const filter = { status: types_1.BookStatus.AVAILABLE };
        const sort = { 'metadata.popularityScore': -1, 'metadata.totalBookings': -1 };
        const [books, totalItems] = await Promise.all([
            Book_1.Book.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('metadata.addedBy', 'name email'),
            Book_1.Book.countDocuments(filter),
        ]);
        const pagination = pagination_1.PaginationUtil.calculatePagination(totalItems, page, limit);
        return {
            books,
            pagination,
        };
    }
    async findRecentlyAdded(query) {
        const { page, limit, skip } = pagination_1.PaginationUtil.parseQuery(query);
        const filter = { status: types_1.BookStatus.AVAILABLE };
        const sort = { createdAt: -1 };
        const [books, totalItems] = await Promise.all([
            Book_1.Book.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('metadata.addedBy', 'name email'),
            Book_1.Book.countDocuments(filter),
        ]);
        const pagination = pagination_1.PaginationUtil.calculatePagination(totalItems, page, limit);
        return {
            books,
            pagination,
        };
    }
    async updateAvailability(id, change) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return null;
        }
        const book = await Book_1.Book.findById(id);
        if (!book) {
            return null;
        }
        await book.updateAvailability(change);
        return book;
    }
    async incrementBookingCount(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return;
        }
        await Book_1.Book.findByIdAndUpdate(id, { $inc: { 'metadata.totalBookings': 1 } });
    }
    async getBookStats() {
        const [totalBooks, availableBooks, bookedBooks, maintenanceBooks, copyStats, allBooks] = await Promise.all([
            Book_1.Book.countDocuments({}),
            Book_1.Book.countDocuments({ status: types_1.BookStatus.AVAILABLE }),
            Book_1.Book.countDocuments({ status: types_1.BookStatus.BOOKED }),
            Book_1.Book.countDocuments({ status: types_1.BookStatus.MAINTENANCE }),
            Book_1.Book.aggregate([
                {
                    $match: {
                        'availability.totalCopies': { $type: 'number', $gte: 0, $lte: 1000 },
                        'availability.availableCopies': { $type: 'number', $gte: 0, $lte: 1000 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCopies: { $sum: '$availability.totalCopies' },
                        availableCopies: { $sum: '$availability.availableCopies' },
                    }
                }
            ]),
            Book_1.Book.find({}).select('title availability').limit(10)
        ]);
        const copies = copyStats[0] || { totalCopies: 0, availableCopies: 0 };
        console.log('📊 Book Stats Debug:');
        console.log('Total Books:', totalBooks);
        console.log('All Sample Books:', allBooks.map(b => ({
            title: b.title,
            totalCopies: b.availability?.totalCopies,
            totalCopiesType: typeof b.availability?.totalCopies,
            availableCopies: b.availability?.availableCopies,
            availableCopiesType: typeof b.availability?.availableCopies
        })));
        console.log('Aggregated Total Copies:', copies.totalCopies);
        console.log('Aggregated Available Copies:', copies.availableCopies);
        return {
            totalBooks,
            availableBooks,
            bookedBooks,
            maintenanceBooks,
            totalCopies: copies.totalCopies,
            availableCopies: copies.availableCopies,
            borrowedCopies: copies.totalCopies - copies.availableCopies,
        };
    }
    async getCategories() {
        const categories = await Book_1.Book.distinct('category');
        return categories.sort();
    }
    async getCategoryStats() {
        const stats = await Book_1.Book.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    available: {
                        $sum: {
                            $cond: [{ $eq: ['$status', types_1.BookStatus.AVAILABLE] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        return stats.map(stat => ({
            category: stat._id,
            totalBooks: stat.count,
            availableBooks: stat.available,
        }));
    }
    async findByISBN(isbn) {
        return await Book_1.Book.findOne({ isbn });
    }
    async exists(isbn) {
        const book = await Book_1.Book.findOne({ isbn });
        return !!book;
    }
    async countDocuments(filter = {}) {
        return await Book_1.Book.countDocuments(filter);
    }
    async getFeaturedBooks(query) {
        const popularBooks = await this.findPopular(query);
        const recentlyAddedBooks = await this.findRecentlyAdded(query);
        const recommendedBooks = await this.findPopular(query);
        return {
            popularBooks: popularBooks.books,
            recentlyAddedBooks: recentlyAddedBooks.books,
            recommendedBooks: recommendedBooks.books,
        };
    }
}
exports.BookRepository = BookRepository;
//# sourceMappingURL=BookRepository.js.map