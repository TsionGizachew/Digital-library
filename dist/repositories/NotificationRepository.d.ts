import { Notification } from '../entities/Notification';
export declare class NotificationRepository {
    create(userId: string, message: string): Promise<Notification>;
    findByUserId(userId: string): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<Notification | null>;
}
//# sourceMappingURL=NotificationRepository.d.ts.map