export declare class SocketService {
    private socketManager;
    constructor();
    notifyBookingCreated(booking: any): Promise<void>;
    notifyBookingApproved(booking: any): Promise<void>;
    notifyBookingRejected(booking: any): Promise<void>;
    notifyBookingReturned(booking: any): Promise<void>;
    notifyBookingRenewed(booking: any): Promise<void>;
    notifyBookAvailabilityChanged(book: any): Promise<void>;
    notifyBookAdded(book: any): Promise<void>;
    notifyBookUpdated(book: any): Promise<void>;
    notifyUserStatusChanged(user: any): Promise<void>;
    notifyUserRegistered(user: any): Promise<void>;
    sendSystemNotification(message: string, type?: 'info' | 'warning' | 'error', targetUsers?: string[]): Promise<void>;
    sendMaintenanceNotification(startTime: Date, endTime: Date): Promise<void>;
    sendBookingReminders(): Promise<void>;
    sendOverdueNotifications(): Promise<void>;
    broadcastStatistics(stats: any): Promise<void>;
    getConnectedUsersCount(): number;
    isUserConnected(userId: string): boolean;
    sendDirectMessage(userId: string, message: string, type?: string): Promise<void>;
    broadcastToAdmins(event: string, data: any): Promise<void>;
    sendEmergencyNotification(message: string): Promise<void>;
    notifyNewAnnouncement(announcement: any): Promise<void>;
}
//# sourceMappingURL=SocketService.d.ts.map