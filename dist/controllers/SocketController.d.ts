import { Request, Response, NextFunction } from 'express';
export declare class SocketController {
    private socketService;
    constructor();
    private getSocketService;
    getConnectionStatus: (req: Request, res: Response, next: NextFunction) => void;
    sendSystemNotification: (req: Request, res: Response, next: NextFunction) => void;
    sendMaintenanceNotification: (req: Request, res: Response, next: NextFunction) => void;
    sendDirectMessage: (req: Request, res: Response, next: NextFunction) => void;
    broadcastToAdmins: (req: Request, res: Response, next: NextFunction) => void;
    sendEmergencyNotification: (req: Request, res: Response, next: NextFunction) => void;
    sendBookingReminders: (req: Request, res: Response, next: NextFunction) => void;
    sendOverdueNotifications: (req: Request, res: Response, next: NextFunction) => void;
    broadcastStatistics: (req: Request, res: Response, next: NextFunction) => void;
    checkUserConnection: (req: Request, res: Response, next: NextFunction) => void;
    getSocketEvents: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=SocketController.d.ts.map