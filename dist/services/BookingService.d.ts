import { BookingQuery } from '../repositories/BookingRepository';
import { IBooking } from '../entities/Booking';
import { BookingStatus, PaginationQuery } from '../types';
export interface CreateBookingData {
    userId: string;
    bookId: string;
    borrowPeriodDays?: number;
    notes?: string;
    metadata?: {
        requestSource?: 'web' | 'mobile' | 'admin';
        ipAddress?: string;
        userAgent?: string;
    };
}
export interface UpdateBookingData {
    status?: BookingStatus;
    adminNotes?: string;
    borrowPeriodDays?: number;
    notes?: string;
}
export declare class BookingService {
    private bookingRepository;
    private bookService;
    private socketService;
    constructor();
    private getSocketService;
    createBooking(data: CreateBookingData): Promise<IBooking>;
    getBookingById(id: string): Promise<IBooking>;
    updateBooking(id: string, updateData: UpdateBookingData): Promise<IBooking>;
    deleteBooking(id: string): Promise<void>;
    getAllBookings(query: BookingQuery): Promise<{
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
    getUserBookings(userId: string, query: BookingQuery): Promise<{
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
    getBookBookings(bookId: string, query: PaginationQuery): Promise<{
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
    getPendingBookings(query: PaginationQuery): Promise<{
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
    getOverdueBookings(query: PaginationQuery): Promise<{
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
    approveBooking(id: string, adminId: string, notes?: string): Promise<IBooking>;
    rejectBooking(id: string, adminId: string, reason: string): Promise<IBooking>;
    returnBook(id: string): Promise<IBooking>;
    renewBooking(id: string, additionalDays?: number): Promise<IBooking>;
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
    getBookingsDueSoon(days?: number, userId?: string): Promise<any>;
    getRecentUserBookings(userId: string, days?: number): Promise<any>;
    updateOverdueBookings(): Promise<number>;
    validateUserBookingAccess(bookingId: string, userId: string, userRole: string): Promise<void>;
    cancelBooking(id: string, userId: string): Promise<IBooking>;
    rateBooking(id: string, userId: string, rating: number): Promise<IBooking>;
}
//# sourceMappingURL=BookingService.d.ts.map