import mongoose, { Document, Schema } from 'mongoose';
import { UserRole, UserStatus } from '../types';
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    profileImage?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    preferences?: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        favoriteCategories: string[];
    };
    favoriteBooks: [{
        type: Schema.Types.ObjectId;
        ref: 'Book';
    }];
    lastLogin?: Date;
    refreshTokens: string[];
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generatePasswordHash(password: string): Promise<string>;
    addRefreshToken(token: string): Promise<void>;
    removeRefreshToken(token: string): Promise<void>;
    clearRefreshTokens(): Promise<void>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map