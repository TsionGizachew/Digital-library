import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    private userService;
    constructor();
    getProfile: (req: Request, res: Response, next: NextFunction) => void;
    updateProfile: (req: Request, res: Response, next: NextFunction) => void;
    getUserById: (req: Request, res: Response, next: NextFunction) => void;
    getAllUsers: (req: Request, res: Response, next: NextFunction) => void;
    updateUser: (req: Request, res: Response, next: NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: NextFunction) => void;
    blockUser: (req: Request, res: Response, next: NextFunction) => void;
    unblockUser: (req: Request, res: Response, next: NextFunction) => void;
    getUserStats: (req: Request, res: Response, next: NextFunction) => void;
    searchUsers: (req: Request, res: Response, next: NextFunction) => void;
    getUsersByRole: (req: Request, res: Response, next: NextFunction) => void;
    getUsersByStatus: (req: Request, res: Response, next: NextFunction) => void;
    updatePreferences: (req: Request, res: Response, next: NextFunction) => void;
    addFavoriteCategory: (req: Request, res: Response, next: NextFunction) => void;
    removeFavoriteCategory: (req: Request, res: Response, next: NextFunction) => void;
    getFavoriteBooks: (req: Request, res: Response, next: NextFunction) => void;
    addFavoriteBook: (req: Request, res: Response, next: NextFunction) => void;
    removeFavoriteBook: (req: Request, res: Response, next: NextFunction) => void;
    toggleFavoriteBook: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=UserController.d.ts.map