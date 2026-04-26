"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const mongoose_1 = require("mongoose");
const AnnouncementSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        default: 'info',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    targetAudience: {
        type: String,
        enum: ['all', 'members', 'staff'],
        default: 'all',
    },
    image: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.Announcement = (0, mongoose_1.model)('Announcement', AnnouncementSchema);
//# sourceMappingURL=Announcement.js.map