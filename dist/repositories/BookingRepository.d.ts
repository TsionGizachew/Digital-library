import { IBooking } from '../entities/Booking';
import { BookingStatus, PaginationQuery } from '../types';
export interface BookingQuery extends PaginationQuery {
    status?: BookingStatus;
    userId?: string;
    bookId?: string;
    search?: string;
}
export declare class BookingRepository {
    private buildQuery;
    findAll(query: BookingQuery): Promise<{
        records: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findById(id: string): Promise<IBooking | null>;
    findByIdWithDetails(id: string): Promise<IBooking | null>;
    findByUserId(userId: string, query: BookingQuery): Promise<{
        records: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findByBookId(bookId: string, query: PaginationQuery): Promise<{
        records: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findPendingBookings(query: PaginationQuery): Promise<{
        records: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findOverdueBookings(query: PaginationQuery): Promise<{
        records: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    findActiveBookingForUserAndBook(userId: string, bookId: string): Promise<IBooking | null>;
    create(data: Partial<IBooking>): Promise<IBooking>;
    update(id: string, data: Partial<IBooking>): Promise<IBooking | null>;
    delete(id: string): Promise<boolean>;
    aggregate(pipeline: any[]): Promise<any[]>;
    getBookingStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        returned: number;
        overdue: number;
    }>;
    getUserBookingHistory(userId: string, query: PaginationQuery): Promise<{
        records: any;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: any;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    getPopularBooks(query: PaginationQuery): Promise<any>;
    findBookingsDueSoon(days: number): Promise<any>;
    findRecentUserBookings(userId: string, days: number): Promise<any>;
    updateOverdueBookings(): Promise<number>;
}
//# sourceMappingURL=BookingRepository.d.ts.map