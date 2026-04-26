import { Document } from 'mongoose';
export interface IAnnouncement extends Document {
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'error';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'draft' | 'published' | 'archived';
    publishDate: Date;
    expiryDate?: Date;
    authorId: string;
    authorName: string;
    targetAudience: 'all' | 'members' | 'staff';
    image?: string;
}
export declare const Announcement: import("mongoose").Model<IAnnouncement, {}, {}, {}, Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Announcement.d.ts.map