import { Request, Response, NextFunction } from 'express';
export declare class BookingController {
    private bookingService;
    constructor();
    createBooking: (req: Request, res: Response, next: NextFunction) => void;
    getBookingById: (req: Request, res: Response, next: NextFunction) => void;
    updateBooking: (req: Request, res: Response, next: NextFunction) => void;
    deleteBooking: (req: Request, res: Response, next: NextFunction) => void;
    getAllBookings: (req: Request, res: Response, next: NextFunction) => void;
    getUserBookings: (req: Request, res: Response, next: NextFunction) => void;
    getUserBookingHistory: (req: Request, res: Response, next: NextFunction) => void;
    getPendingBookings: (req: Request, res: Response, next: NextFunction) => void;
    getOverdueBookings: (req: Request, res: Response, next: NextFunction) => void;
    approveBooking: (req: Request, res: Response, next: NextFunction) => void;
    rejectBooking: (req: Request, res: Response, next: NextFunction) => void;
    returnBook: (req: Request, res: Response, next: NextFunction) => void;
    renewBooking: (req: Request, res: Response, next: NextFunction) => void;
    cancelBooking: (req: Request, res: Response, next: NextFunction) => void;
    getBookingStats: (req: Request, res: Response, next: NextFunction) => void;
    getPopularBooks: (req: Request, res: Response, next: NextFunction) => void;
    getBookingsDueSoon: (req: Request, res: Response, next: NextFunction) => void;
    updateOverdueBookings: (req: Request, res: Response, next: NextFunction) => void;
    rateBooking: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=BookingController.d.ts.map