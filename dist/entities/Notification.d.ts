import { Document } from 'mongoose';
import { IUser } from './User';
export interface Notification extends Document {
    user: IUser['_id'];
    message: string;
    read: boolean;
    createdAt: Date;
}
export declare const NotificationModel: import("mongoose").Model<Notification, {}, {}, {}, Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Notification.d.ts.map