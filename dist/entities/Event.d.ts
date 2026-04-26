import { Document } from 'mongoose';
export interface IEvent extends Document {
    title: string;
    description: string;
    date: Date;
    location: string;
    organizer: string;
    status: 'upcoming' | 'past' | 'cancelled';
    authorId: string;
    authorName: string;
    image?: string;
}
export declare const Event: import("mongoose").Model<IEvent, {}, {}, {}, Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Event.d.ts.map