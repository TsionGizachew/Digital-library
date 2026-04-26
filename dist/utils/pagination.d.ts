import { PaginationQuery } from '../types';
export interface PaginationOptions {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export interface PaginationResult {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export declare class PaginationUtil {
    static parseQuery(query: PaginationQuery): PaginationOptions;
    static calculatePagination(totalItems: number, currentPage: number, itemsPerPage: number): PaginationResult;
    static buildSortObject(sortBy: string, sortOrder: 'asc' | 'desc'): Record<string, 1 | -1>;
    static buildSearchFilter(searchTerm?: string, searchFields?: string[]): Record<string, any>;
    static buildDateRangeFilter(startDate?: string, endDate?: string, dateField?: string): Record<string, any>;
    static combineFilters(...filters: Record<string, any>[]): Record<string, any>;
}
//# sourceMappingURL=pagination.d.ts.map