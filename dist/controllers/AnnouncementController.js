"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAnnouncementById = exports.getAllAnnouncements = exports.createAnnouncement = void 0;
const AnnouncementRepository_1 = require("../repositories/AnnouncementRepository");
const cloudinary_1 = require("../utils/cloudinary");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = __importDefault(require("../utils/AppError"));
const fs_1 = __importDefault(require("fs"));
const announcementRepository = new AnnouncementRepository_1.AnnouncementRepository();
const notificationRepository = new NotificationRepository_1.NotificationRepository();
const userRepository = new UserRepository_1.UserRepository();
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, priority, status, publishDate, expiryDate, authorId, authorName, targetAudience } = req.body;
        let imageUrl;
        if (req.file) {
            try {
                const cloudinaryUrl = await (0, cloudinary_1.uploadImage)(req.file.path);
                fs_1.default.unlinkSync(req.file.path);
                imageUrl = cloudinaryUrl;
            }
            catch (error) {
                throw new AppError_1.default('Error uploading image', 500);
            }
        }
        else {
            imageUrl = 'https://res.cloudinary.com/dtkg4wfr2/image/upload/v1721898579/digital-library/announcements/default-announcement_y12j4g.jpg';
        }
        const announcement = await announcementRepository.create({
            title,
            content,
            type,
            priority,
            status,
            publishDate,
            expiryDate,
            authorId,
            authorName,
            targetAudience,
            image: imageUrl,
        });
        const { users } = await userRepository.findAll({});
        for (const user of users) {
            await notificationRepository.create(user.id, `New announcement: ${title}`);
        }
        res.status(201).json(announcement);
    }
    catch (error) {
        throw new AppError_1.default('Error creating announcement', 500);
    }
};
exports.createAnnouncement = createAnnouncement;
const getAllAnnouncements = async (req, res) => {
    try {
        const { announcements } = await announcementRepository.findAll(req.query);
        res.status(200).json({
            success: true,
            message: 'Announcements retrieved successfully',
            data: announcements,
        });
    }
    catch (error) {
        throw new AppError_1.default('Error fetching announcements', 500);
    }
};
exports.getAllAnnouncements = getAllAnnouncements;
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await announcementRepository.findById(req.params.id);
        if (!announcement) {
            throw new AppError_1.default('Announcement not found', 404);
        }
        res.status(200).json(announcement);
    }
    catch (error) {
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default('Error fetching announcement', 500);
    }
};
exports.getAnnouncementById = getAnnouncementById;
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, priority, status, publishDate, expiryDate, authorId, authorName, targetAudience } = req.body;
        let imageUrl;
        if (req.file) {
            try {
                const cloudinaryUrl = await (0, cloudinary_1.uploadImage)(req.file.path);
                fs_1.default.unlinkSync(req.file.path);
                imageUrl = cloudinaryUrl;
            }
            catch (error) {
                throw new AppError_1.default('Error uploading image', 500);
            }
        }
        const updatedAnnouncement = await announcementRepository.update(id, {
            title,
            content,
            type,
            priority,
            status,
            publishDate,
            expiryDate,
            authorId,
            authorName,
            targetAudience,
            image: imageUrl,
        });
        if (!updatedAnnouncement) {
            throw new AppError_1.default('Announcement not found', 404);
        }
        res.status(200).json(updatedAnnouncement);
    }
    catch (error) {
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default('Error updating announcement', 500);
    }
};
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        await announcementRepository.delete(id);
        res.status(200).json({ message: 'Announcement deleted successfully' });
    }
    catch (error) {
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default('Error deleting announcement', 500);
    }
};
exports.deleteAnnouncement = deleteAnnouncement;
//# sourceMappingURL=AnnouncementController.js.map