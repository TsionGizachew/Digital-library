import { SocketService } from './SocketService';
import { IUser } from '../entities/User';
import { AuthTokens, UserRole } from '../types';
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResult {
    user: Omit<IUser, 'password' | 'refreshTokens'>;
    tokens: AuthTokens;
}
export declare class AuthService {
    private userRepository;
    private socketService;
    constructor();
    setSocketService(socketService: SocketService): void;
    register(data: RegisterData): Promise<AuthResult>;
    login(data: LoginData): Promise<AuthResult>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    logout(userId: string, refreshToken: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    createDefaultAdmin(): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map