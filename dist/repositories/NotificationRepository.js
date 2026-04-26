"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const Notification_1 = require("../entities/Notification");
class NotificationRepository {
    async create(userId, message) {
        const notification = new Notification_1.NotificationModel({ user: userId, message });
        return notification.save();
    }
    async findByUserId(userId) {
        return Notification_1.NotificationModel.find({ user: userId }).sort({ createdAt: -1 });
    }
    async markAsRead(notificationId) {
        return Notification_1.NotificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=NotificationRepository.js.map