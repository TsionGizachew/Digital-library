"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const Booking_1 = require("../entities/Booking");
const types_1 = require("../types");
const utils_1 = require("../utils");
const mongoose_1 = require("mongoose");
class BookingRepository {
    buildQuery(query) {
        const dbQuery = {};
        if (query.status) {
            dbQuery.status = query.status;
        }
        if (query.userId && mongoose_1.Types.ObjectId.isValid(query.userId)) {
            dbQuery.userId = new mongoose_1.Types.ObjectId(query.userId);
        }
        if (query.bookId && mongoose_1.Types.ObjectId.isValid(query.bookId)) {
            dbQuery.bookId = new mongoose_1.Types.ObjectId(query.bookId);
        }
        if (query.search) {
            const searchRegex = new RegExp((0, utils_1.escapeRegExp)(query.search), 'i');
            dbQuery.$or = [{ 'user.name': searchRegex }, { 'book.title': searchRegex }];
        }
        return dbQuery;
    }
    async findAll(query) {
        console.log("this query ", query);
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const dbQuery = this.buildQuery(query);
        console.log("this query dbquery ", dbQuery);
        const [records, totalItems] = await Promise.all([
            Booking_1.Booking
                .find(dbQuery)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email')
                .populate('book', 'title author'),
            Booking_1.Booking.countDocuments(dbQuery),
        ]);
        console.log("this query records ", records);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            records,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async findById(id) {
        return await Booking_1.Booking.findById(id);
    }
    async findByIdWithDetails(id) {
        return await Booking_1.Booking
            .findById(id)
            .populate('user', 'name email')
            .populate('book', 'title author');
    }
    async findByUserId(userId, query) {
        const { page = 1, limit = 1000, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const dbQuery = {
            userId: new mongoose_1.Types.ObjectId(userId),
            status: query.status || { $in: [types_1.BookingStatus.APPROVED, types_1.BookingStatus.OVERDUE] },
        };
        const [records, totalItems] = await Promise.all([
            Booking_1.Booking
                .find(dbQuery)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit)
                .populate('book', 'title author coverImage'),
            Booking_1.Booking.countDocuments(dbQuery),
        ]);
        const totalPages = Math.ceil(totalItems / limit);
        const formattedRecords = records.map((booking) => ({
            id: booking._id,
            title: booking.book.title,
            author: booking.book.author,
            coverImage: booking.book.coverImage,
            status: booking.status,
            borrowedDate: booking.borrowDate,
            returnedDate: booking.returnDate,
            reservedDate: booking.createdAt,
            dueDate: booking.dueDate,
            borrowPeriodDays: booking.borrowPeriodDays,
        }));
        return {
            records: formattedRecords,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }
    async findByBookId(bookId, query) {
        return await this.findAll({ ...query, bookId });
    }
    async findPendingBookings(query) {
        return await this.findAll({ ...query, status: types_1.BookingStatus.PENDING });
    }
    async findOverdueBookings(query) {
        return await this.findAll({ ...query, status: types_1.BookingStatus.OVERDUE });
    }
    async findActiveBookingForUserAndBook(userId, bookId) {
        return await Booking_1.Booking.findOne({
            user: userId,
            book: bookId,
            status: { $in: [types_1.BookingStatus.PENDING, types_1.BookingStatus.APPROVED, types_1.BookingStatus.OVERDUE] },
        });
    }
    async create(data) {
        const booking = new Booking_1.Booking(data);
        await booking.save();
        return booking;
    }
    async update(id, data) {
        return await Booking_1.Booking.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        const result = await Booking_1.Booking.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
    async aggregate(pipeline) {
        return await Booking_1.Booking.aggregate(pipeline);
    }
    async getBookingStats() {
        const stats = await Booking_1.Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const result = {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            returned: 0,
            overdue: 0,
        };
        stats.forEach((stat) => {
            result[stat._id] = stat.count;
            result.total += stat.count;
        });
        return result;
    }
    async getUserBookingHistory(userId, query) {
        return await this.findAll({
            ...query,
            userId,
            status: types_1.BookingStatus.RETURNED,
        });
    }
    async getPopularBooks(query) {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        return await Booking_1.Booking.aggregate([
            { $group: { _id: '$book', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            { $unwind: '$bookDetails' },
            {
                $project: {
                    book: '$bookDetails',
                    borrowCount: '$count',
                },
            },
        ]);
    }
    async findBookingsDueSoon(days, userId) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);
        const query = {
            status: types_1.BookingStatus.APPROVED,
            dueDate: { $lte: dueDate },
        };
        if (userId) {
            query.user = userId;
        }
        return await Booking_1.Booking
            .find(query)
            .populate('user', 'name email')
            .populate('book', 'title');
    }
    async findRecentUserBookings(userId, days) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);
        return await Booking_1.Booking
            .find({
            user: userId,
            createdAt: { $gte: sinceDate },
        })
            .populate('user', 'name email')
            .populate('book', 'title')
            .sort({ createdAt: 'desc' });
    }
    async updateOverdueBookings() {
        const now = new Date();
        const result = await Booking_1.Booking.updateMany({
            status: types_1.BookingStatus.APPROVED,
            dueDate: { $lt: now },
        }, {
            $set: { status: types_1.BookingStatus.OVERDUE },
        });
        return result.modifiedCount;
    }
}
exports.BookingRepository = BookingRepository;
//# sourceMappingURL=BookingRepository.js.map