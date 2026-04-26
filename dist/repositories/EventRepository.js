"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const Event_1 = require("../entities/Event");
class EventRepository {
    async findAll(options) {
        const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'asc', search, status } = options;
        const query = {};
        if (search) {
            query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
        }
        if (status) {
            query.status = status;
        }
        const [events, total] = await Promise.all([
            Event_1.Event.find(query)
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            Event_1.Event.countDocuments(query),
        ]);
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
        };
        return { events, pagination };
    }
    async findById(id) {
        return Event_1.Event.findById(id).exec();
    }
    async create(data) {
        return Event_1.Event.create(data);
    }
    async update(id, data) {
        return Event_1.Event.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        await Event_1.Event.findByIdAndDelete(id).exec();
    }
}
exports.EventRepository = EventRepository;
//# sourceMappingURL=EventRepository.js.map