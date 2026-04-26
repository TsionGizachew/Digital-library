import { TokenPayload, AuthTokens } from '../types';
export declare class JWTUtil {
    static generateAccessToken(payload: Omit<TokenPayload, 'tokenType'>): string;
    static generateRefreshToken(payload: Omit<TokenPayload, 'tokenType'>): string;
    static generateTokenPair(payload: Omit<TokenPayload, 'tokenType'>): AuthTokens;
    static verifyAccessToken(token: string): TokenPayload;
    static verifyRefreshToken(token: string): TokenPayload;
    static decodeToken(token: string): TokenPayload | null;
    static getTokenExpiration(token: string): Date | null;
    static isTokenExpired(token: string): boolean;
}
//# sourceMappingURL=jwt.d.ts.map