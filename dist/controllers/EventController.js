"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = exports.getEventById = exports.deleteEvent = exports.updateEvent = exports.createEvent = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const EventRepository_1 = require("../repositories/EventRepository");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = __importDefault(require("../utils/AppError"));
const response_1 = require("../utils/response");
const eventRepository = new EventRepository_1.EventRepository();
const notificationRepository = new NotificationRepository_1.NotificationRepository();
const userRepository = new UserRepository_1.UserRepository();
exports.createEvent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title, description, date, location, organizer, authorId, authorName } = req.body;
    const imageUrl = req.file
        ? req.file.path
        : 'https://res.cloudinary.com/dtkg4wfr2/image/upload/v1721898579/digital-library/events/default-event_axo12k.jpg';
    const event = await eventRepository.create({
        title,
        description,
        date,
        location,
        organizer,
        status: 'upcoming',
        authorId,
        authorName,
        image: imageUrl,
    });
    const { users } = await userRepository.findAll({});
    for (const user of users) {
        if (user && user._id) {
            await notificationRepository.create(user._id.toString(), `New event: ${title}`);
        }
        else {
            console.warn('Attempted to create notification for a user with a missing ID.');
        }
    }
    response_1.ResponseUtil.created(res, event, 'Event created successfully');
});
exports.updateEvent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location, organizer, status } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;
    const updatedEvent = await eventRepository.update(id, {
        title,
        description,
        date,
        location,
        organizer,
        status,
        image: imageUrl,
    });
    if (!updatedEvent) {
        throw new AppError_1.default('Event not found', 404);
    }
    response_1.ResponseUtil.updated(res, updatedEvent, 'Event updated successfully');
});
exports.deleteEvent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await eventRepository.delete(id);
    response_1.ResponseUtil.deleted(res, 'Event deleted successfully');
});
exports.getEventById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const event = await eventRepository.findById(id);
    if (!event) {
        throw new AppError_1.default('Event not found', 404);
    }
    response_1.ResponseUtil.success(res, event);
});
exports.getAllEvents = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { events } = await eventRepository.findAll(req.query);
    response_1.ResponseUtil.success(res, events, 'Events retrieved successfully');
});
//# sourceMappingURL=EventController.js.map