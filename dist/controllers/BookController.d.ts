import { Request, Response, NextFunction } from 'express';
export declare class BookController {
    private bookService;
    constructor();
    createBook: (req: Request, res: Response, next: NextFunction) => void;
    getBookById: (req: Request, res: Response, next: NextFunction) => void;
    updateBook: (req: Request, res: Response, next: NextFunction) => void;
    deleteBook: (req: Request, res: Response, next: NextFunction) => void;
    getAllBooks: (req: Request, res: Response, next: NextFunction) => void;
    getAvailableBooks: (req: Request, res: Response, next: NextFunction) => void;
    getPopularBooks: (req: Request, res: Response, next: NextFunction) => void;
    getRecentlyAddedBooks: (req: Request, res: Response, next: NextFunction) => void;
    searchBooks: (req: Request, res: Response, next: NextFunction) => void;
    getBooksByCategory: (req: Request, res: Response, next: NextFunction) => void;
    getBooksByStatus: (req: Request, res: Response, next: NextFunction) => void;
    updateBookStatus: (req: Request, res: Response, next: NextFunction) => void;
    getBookStats: (req: Request, res: Response, next: NextFunction) => void;
    getCategories: (req: Request, res: Response, next: NextFunction) => void;
    getCategoryStats: (req: Request, res: Response, next: NextFunction) => void;
    checkBookAvailability: (req: Request, res: Response, next: NextFunction) => void;
    getBookByISBN: (req: Request, res: Response, next: NextFunction) => void;
    getFeaturedBooks: (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=BookController.d.ts.map