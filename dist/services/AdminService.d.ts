import { UserStatus, BookStatus } from '../types';
export interface AdminDashboardStats {
    users: {
        total: number;
        active: number;
        blocked: number;
        admins: number;
        newThisMonth: number;
    };
    books: {
        total: number;
        available: number;
        booked: number;
        maintenance: number;
        newThisMonth: number;
    };
    bookings: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        overdue: number;
    };
    categories: Array<{
        category: string;
        totalBooks: number;
        availableBooks: number;
    }>;
}
export interface SystemActivity {
    recentUsers: any[];
    recentBooks: any[];
    recentBookings: any[];
    popularBooks: any[];
}
export declare class AdminService {
    private userService;
    private bookService;
    private userRepository;
    private bookRepository;
    private bookingRepository;
    private announcementRepository;
    private eventRepository;
    private socketService;
    constructor();
    getDashboardStats(): Promise<AdminDashboardStats>;
    getDashboardChartsData(): Promise<any>;
    getSystemActivity(): Promise<SystemActivity>;
    getAllBooks(query: any): Promise<any>;
    getBorrowingRecords(query: any): Promise<any>;
    promoteUserToAdmin(userId: string): Promise<any>;
    demoteAdminToUser(userId: string): Promise<any>;
    bulkUpdateBookStatus(bookIds: string[], status: BookStatus): Promise<void>;
    bulkUpdateUserStatus(userIds: string[], status: UserStatus): Promise<void>;
    getSystemHealth(): Promise<{
        database: {
            status: string;
            message: string;
        };
        server: {
            status: string;
            uptime: number;
        };
        memory: {
            used: number;
            total: number;
            percentage: number;
        };
    }>;
    getSystemStats(): Promise<any>;
    getAllUsers(query: any): Promise<any>;
    blockUser(userId: string): Promise<any>;
    unblockUser(userId: string): Promise<any>;
    resetUserPassword(userId: string, newPassword: string): Promise<any>;
    createBook(bookData: any): Promise<any>;
    updateBookStatus(bookId: string, status: BookStatus): Promise<any>;
    exportUserData(format?: 'json' | 'csv'): Promise<any>;
    exportBookData(format?: 'json' | 'csv'): Promise<any>;
    getAuditLog(query: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        action?: string;
        userId?: string;
    }): Promise<any>;
    validateAdminAccess(userId: string): Promise<void>;
    approveBorrowingRequest(recordId: string, adminId: string): Promise<any>;
    rejectBorrowingRequest(recordId: string, reason: string, adminId: string): Promise<any>;
    returnBook(recordId: string): Promise<any>;
    getUserBorrowingHistory(userId: string): Promise<any>;
    getAnnouncements(query: any): Promise<any>;
    createAnnouncement(announcementData: any, adminId: string): Promise<any>;
    updateAnnouncement(announcementId: string, announcementData: any): Promise<any>;
    deleteAnnouncement(announcementId: string): Promise<void>;
    toggleAnnouncementStatus(announcementId: string, status: string): Promise<any>;
    getEvents(query: any): Promise<any>;
    createEvent(eventData: any, adminId: string): Promise<any>;
    updateEvent(eventId: string, eventData: any): Promise<any>;
    deleteEvent(eventId: string): Promise<void>;
    generateReport(): Promise<any>;
    createRecommendation(data: {
        title: string;
        description: string;
        priority: string;
    }, userId: string): Promise<any>;
}
//# sourceMappingURL=AdminService.d.ts.map