import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
export interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
    userEmail?: string;
}
export declare class SocketManager {
    private io;
    private connectedUsers;
    constructor(httpServer: HttpServer);
    private setupMiddleware;
    private setupEventHandlers;
    emitBookingCreated(booking: any): void;
    emitBookingUpdated(booking: any, previousStatus?: string): void;
    emitBookAvailabilityChanged(book: any): void;
    emitUserStatusChanged(user: any): void;
    emitSystemNotification(message: string, type?: 'info' | 'warning' | 'error', targetUsers?: string[]): void;
    emitBookingReminder(booking: any): void;
    emitOverdueNotification(booking: any): void;
    private getBookingStatusMessage;
    private getUserStatusMessage;
    getConnectedUsersCount(): number;
    getIO(): SocketIOServer;
    isUserConnected(userId: string): boolean;
    sendToUser(userId: string, event: string, data: any): void;
    sendToAdmins(event: string, data: any): void;
}
export declare const initializeSocket: (httpServer: HttpServer) => SocketManager;
export declare const getSocketManager: () => SocketManager;
//# sourceMappingURL=socket.d.ts.map