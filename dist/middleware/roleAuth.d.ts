import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/enums';
export declare const requireRole: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireSuperAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const canManageUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=roleAuth.d.ts.map