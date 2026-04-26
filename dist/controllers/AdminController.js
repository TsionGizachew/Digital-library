"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const AdminService_1 = require("../services/AdminService");
const asyncHandler_1 = require("../utils/asyncHandler");
const EventRepository_1 = require("../repositories/EventRepository");
const AnnouncementRepository_1 = require("../repositories/AnnouncementRepository");
const cloudinary_1 = require("../utils/cloudinary");
const Settings_1 = require("../entities/Settings");
const adminService = new AdminService_1.AdminService();
const eventRepository = new EventRepository_1.EventRepository();
const announcementRepository = new AnnouncementRepository_1.AnnouncementRepository();
class AdminController {
    constructor() {
        this.getDashboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getDashboardStats();
            res.status(200).json({ success: true, data });
        });
        this.getStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getSystemStats();
            res.status(200).json({ success: true, data });
        });
        this.getSystemActivity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getSystemActivity();
            res.status(200).json({ success: true, data });
        });
        this.getSystemHealth = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getSystemHealth();
            res.status(200).json({ success: true, data });
        });
        this.getAuditLog = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getAuditLog(req.query);
            res.status(200).json({ success: true, data });
        });
        this.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getAllUsers(req.query);
            res.status(200).json({ success: true, data });
        });
        this.promoteUserToAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.promoteUserToAdmin(req.params.userId);
            res.status(200).json({ success: true, data });
        });
        this.demoteAdminToUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.demoteAdminToUser(req.params.userId);
            res.status(200).json({ success: true, data });
        });
        this.blockUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.blockUser(req.params.userId);
            res.status(200).json({ success: true, data });
        });
        this.unblockUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.unblockUser(req.params.userId);
            res.status(200).json({ success: true, data });
        });
        this.getUserBorrowingHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getUserBorrowingHistory(req.params.userId);
            res.status(200).json({ success: true, data });
        });
        this.bulkUpdateUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await adminService.bulkUpdateUserStatus(req.body.userIds, req.body.status);
            res.status(200).json({ success: true });
        });
        this.resetUserPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { userId } = req.params;
            const { newPassword } = req.body;
            const data = await adminService.resetUserPassword(userId, newPassword);
            res.status(200).json({ success: true, data, message: 'Password reset successfully' });
        });
        this.getBorrowingRecords = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getBorrowingRecords(req.query);
            console.log("you are right you are here", data);
            res.status(200).json({ success: true, data });
        });
        this.approveBorrowingRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.approveBorrowingRequest(req.params.recordId, req.user.id);
            res.status(200).json({ success: true, data });
        });
        this.rejectBorrowingRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.rejectBorrowingRequest(req.params.recordId, req.body.reason, req.user.id);
            res.status(200).json({ success: true, data });
        });
        this.returnBook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.returnBook(req.params.recordId);
            res.status(200).json({ success: true, data });
        });
        this.getAllBooks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.getAllBooks(req.query);
            res.status(200).json({ success: true, data });
        });
        this.createBook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.createBook(req.body);
            res.status(201).json({ success: true, data });
        });
        this.updateBookStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.updateBookStatus(req.params.bookId, req.body.status);
            res.status(200).json({ success: true, data });
        });
        this.bulkUpdateBooks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await adminService.bulkUpdateBookStatus(req.body.bookIds, req.body.status);
            res.status(200).json({ success: true });
        });
        this.exportUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.exportUserData(req.query.format);
            res.status(200).json({ success: true, data });
        });
        this.exportBooks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const data = await adminService.exportBookData(req.query.format);
            res.status(200).json({ success: true, data });
        });
        this.getEvents = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { events } = await eventRepository.findAll(req.query);
            res.status(200).json({ success: true, data: events });
        });
        this.createEvent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const image = req.file ? await (0, cloudinary_1.uploadImage)(req.file.path) : undefined;
            const event = await eventRepository.create({ ...req.body, image });
            res.status(201).json({ success: true, data: event });
        });
        this.updateEvent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const image = req.file ? await (0, cloudinary_1.uploadImage)(req.file.path) : undefined;
            const event = await eventRepository.update(req.params.eventId, { ...req.body, image });
            res.status(200).json({ success: true, data: event });
        });
        this.deleteEvent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await eventRepository.delete(req.params.eventId);
            res.status(200).json({ success: true, message: 'Event deleted successfully' });
        });
        this.getAnnouncements = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { announcements } = await announcementRepository.findAll(req.query);
            res.status(200).json({ success: true, data: announcements });
        });
        this.createAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const image = req.file ? await (0, cloudinary_1.uploadImage)(req.file.path) : undefined;
            const announcement = await announcementRepository.create({ ...req.body, image });
            res.status(201).json({ success: true, data: announcement });
        });
        this.updateAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const image = req.file ? await (0, cloudinary_1.uploadImage)(req.file.path) : undefined;
            const announcement = await announcementRepository.update(req.params.announcementId, { ...req.body, image });
            res.status(200).json({ success: true, data: announcement });
        });
        this.deleteAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await announcementRepository.delete(req.params.announcementId);
            res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
        });
        this.toggleAnnouncementStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const announcement = await announcementRepository.findById(req.params.announcementId);
            if (announcement) {
                announcement.status = announcement.status === 'published' ? 'draft' : 'published';
                await announcement.save();
                res.status(200).json({ success: true, data: announcement });
            }
            else {
                res.status(404).json({ success: false, message: 'Announcement not found' });
            }
        });
        this.getSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            let settings = await Settings_1.Settings.findOne();
            if (!settings) {
                settings = await Settings_1.Settings.create({});
            }
            res.status(200).json({ success: true, data: settings });
        });
        this.updateSettings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            let settings = await Settings_1.Settings.findOne();
            if (!settings) {
                settings = await Settings_1.Settings.create(req.body);
            }
            else {
                Object.assign(settings, req.body);
                await settings.save();
            }
            res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
        });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map