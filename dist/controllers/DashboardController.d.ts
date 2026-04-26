import { Request, Response, NextFunction } from 'express';
export declare class DashboardController {
    private adminService;
    private bookService;
    private userService;
    private bookingService;
    private reportService;
    constructor();
    getOverview: (req: Request, res: Response, next: NextFunction) => void;
    getBorrowedBooks: (req: Request, res: Response, next: NextFunction) => void;
    getReservedBooks: (req: Request, res: Response, next: NextFunction) => void;
    getReadingHistory: (req: Request, res: Response, next: NextFunction) => void;
    getNotifications: (req: Request, res: Response, next: NextFunction) => void;
    getFavoriteBooks: (req: Request, res: Response, next: NextFunction) => void;
    sendReminder: (req: Request, res: Response, next: NextFunction) => void;
    renewBook: (req: Request, res: Response, next: NextFunction) => void;
    returnBook: (req: Request, res: Response, next: NextFunction) => void;
    cancelReservation: (req: Request, res: Response, next: NextFunction) => void;
    getChartsData: (req: Request, res: Response, next: NextFunction) => void;
    generateReport: (req: Request, res: Response, next: NextFunction) => void;
    getHomePageStats: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=DashboardController.d.ts.map