"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementRepository = void 0;
const Announcement_1 = require("../entities/Announcement");
class AnnouncementRepository {
    async findAll(options) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, status, type } = options;
        const query = {};
        if (search) {
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
        }
        if (status) {
            query.status = status;
        }
        if (type) {
            query.type = type;
        }
        const [announcements, total] = await Promise.all([
            Announcement_1.Announcement.find(query)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            Announcement_1.Announcement.countDocuments(query),
        ]);
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
        };
        return { announcements, pagination };
    }
    async findById(id) {
        return Announcement_1.Announcement.findById(id).exec();
    }
    async create(data) {
        return Announcement_1.Announcement.create(data);
    }
    async update(id, data) {
        return Announcement_1.Announcement.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        await Announcement_1.Announcement.findByIdAndDelete(id).exec();
    }
}
exports.AnnouncementRepository = AnnouncementRepository;
//# sourceMappingURL=AnnouncementRepository.js.map