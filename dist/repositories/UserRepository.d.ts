import { IUser } from '../entities/User';
import { UserRole, UserStatus, PaginationQuery } from '../types';
import mongoose from 'mongoose';
export declare class UserRepository {
    create(userData: Partial<IUser>): Promise<IUser>;
    findById(id: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findByEmailWithPassword(email: string): Promise<IUser | null>;
    findByIdWithRefreshTokens(id: string): Promise<IUser | null>;
    findByResetToken(hashedToken: string): Promise<IUser | null>;
    update(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
    findAll(query: PaginationQuery & {
        role?: UserRole;
        status?: UserStatus;
        search?: string;
    }): Promise<{
        users: (mongoose.FlattenMaps<IUser> & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    updateLastLogin(id: string): Promise<void>;
    addRefreshToken(id: string, token: string): Promise<void>;
    removeRefreshToken(id: string, token: string): Promise<void>;
    clearRefreshTokens(id: string): Promise<void>;
    updateStatus(id: string, status: UserStatus): Promise<IUser | null>;
    countByRole(role: UserRole): Promise<number>;
    countByStatus(status: UserStatus): Promise<number>;
    exists(email: string): Promise<boolean>;
    createAdmin(adminData: {
        name: string;
        email: string;
        password: string;
    }): Promise<IUser>;
    aggregate(pipeline: any[]): Promise<any[]>;
    countDocuments(filter?: any): Promise<number>;
}
//# sourceMappingURL=UserRepository.d.ts.map