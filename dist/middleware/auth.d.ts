import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const checkOwnership: (resourceUserIdField?: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const isSuperAdmin: (req: Request) => boolean;
export declare const isAdmin: (req: Request) => boolean;
//# sourceMappingURL=auth.d.ts.map