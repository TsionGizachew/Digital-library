"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationUtil = void 0;
class PaginationUtil {
    static parseQuery(query) {
        const page = Math.max(1, parseInt(query.page?.toString() || '1', 10));
        const limit = Math.min(500, Math.max(1, parseInt(query.limit?.toString() || '500', 10)));
        const skip = (page - 1) * limit;
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
        return {
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
        };
    }
    static calculatePagination(totalItems, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;
        return {
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage,
            hasNextPage,
            hasPrevPage,
        };
    }
    static buildSortObject(sortBy, sortOrder) {
        return {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };
    }
    static buildSearchFilter(searchTerm, searchFields = []) {
        if (!searchTerm || searchFields.length === 0) {
            return {};
        }
        const searchRegex = new RegExp(searchTerm, 'i');
        return {
            $or: searchFields.map(field => ({
                [field]: searchRegex,
            })),
        };
    }
    static buildDateRangeFilter(startDate, endDate, dateField = 'createdAt') {
        const filter = {};
        if (startDate || endDate) {
            filter[dateField] = {};
            if (startDate) {
                filter[dateField].$gte = new Date(startDate);
            }
            if (endDate) {
                filter[dateField].$lte = new Date(endDate);
            }
        }
        return filter;
    }
    static combineFilters(...filters) {
        return filters.reduce((combined, filter) => {
            return { ...combined, ...filter };
        }, {});
    }
}
exports.PaginationUtil = PaginationUtil;
//# sourceMappingURL=pagination.js.map