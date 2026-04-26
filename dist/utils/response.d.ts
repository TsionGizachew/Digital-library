import { Response } from 'express';
export declare class ResponseUtil {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number, pagination?: any): void;
    static created<T>(res: Response, data: T, message?: string): void;
    static updated<T>(res: Response, data: T, message?: string): void;
    static deleted(res: Response, message?: string): void;
    static paginated<T>(res: Response, data: T, pagination: any, message?: string): void;
}
//# sourceMappingURL=response.d.ts.map