"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    status: {
        type: String,
        enum: ['upcoming', 'past', 'cancelled'],
        default: 'upcoming',
    },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
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
exports.Event = (0, mongoose_1.model)('Event', EventSchema);
//# sourceMappingURL=Event.js.map