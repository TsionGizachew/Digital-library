import { IUser } from '../entities/User';
import { UserRole, UserStatus, PaginationQuery } from '../types';
export interface UpdateUserData {
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    preferences?: {
        emailNotifications?: boolean;
        smsNotifications?: boolean;
        favoriteCategories?: string[];
    };
}
export interface UserQuery extends PaginationQuery {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
}
export declare class UserService {
    private userRepository;
    constructor();
    getUserById(id: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser>;
    updateUser(id: string, updateData: UpdateUserData): Promise<IUser>;
    deleteUser(id: string): Promise<void>;
    getAllUsers(query: UserQuery): Promise<{
        users: (import("mongoose").FlattenMaps<IUser> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    updateUserStatus(id: string, status: UserStatus): Promise<IUser>;
    blockUser(id: string): Promise<IUser>;
    unblockUser(id: string): Promise<IUser>;
    getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        blockedUsers: number;
        adminUsers: number;
        regularUsers: number;
    }>;
    searchUsers(searchTerm: string, query: PaginationQuery): Promise<{
        users: (import("mongoose").FlattenMaps<IUser> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getUsersByRole(role: UserRole, query: PaginationQuery): Promise<{
        users: (import("mongoose").FlattenMaps<IUser> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    getUsersByStatus(status: UserStatus, query: PaginationQuery): Promise<{
        users: (import("mongoose").FlattenMaps<IUser> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: import("../utils/pagination").PaginationResult;
    }>;
    updateUserPreferences(id: string, preferences: {
        emailNotifications?: boolean;
        smsNotifications?: boolean;
        favoriteCategories?: string[];
    }): Promise<IUser>;
    addFavoriteCategory(id: string, category: string): Promise<IUser>;
    removeFavoriteCategory(id: string, category: string): Promise<IUser>;
    validateUserAccess(userId: string, requestingUserId: string, requestingUserRole: UserRole): Promise<void>;
    getFavoriteBooks(userId: string): Promise<[{
        type: import("mongoose").Schema.Types.ObjectId;
        ref: "Book";
    }]>;
    addFavoriteBook(userId: string, bookId: string): Promise<IUser>;
    removeFavoriteBook(userId: string, bookId: string): Promise<IUser>;
    toggleFavoriteBook(userId: string, bookId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserCount(): Promise<number>;
    resetPassword(userId: string, newPassword: string): Promise<IUser>;
}
//# sourceMappingURL=UserService.d.ts.map