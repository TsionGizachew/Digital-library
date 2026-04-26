import mongoose, { Document } from 'mongoose';
export interface ISettings extends Document {
    library: {
        name: string;
        address: string;
        phone: string;
        email: string;
        website: string;
    };
    borrowing: {
        maxBooksPerUser: number;
        defaultBorrowPeriodDays: number;
        maxRenewals: number;
        finePerDay: number;
    };
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        overdueReminders: boolean;
    };
    system: {
        maintenanceMode: boolean;
        allowRegistration: boolean;
        requireEmailVerification: boolean;
    };
    updatedAt: Date;
}
export declare const Settings: mongoose.Model<ISettings, {}, {}, {}, mongoose.Document<unknown, {}, ISettings, {}, {}> & ISettings & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Settings.d.ts.map