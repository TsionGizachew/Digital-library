import winston from 'winston';
export declare const logger: winston.Logger;
export declare const morganStream: {
    write: (message: string) => void;
};
export declare const logError: (error: Error, context?: Record<string, any>) => void;
export declare const logInfo: (message: string, context?: Record<string, any>) => void;
export declare const logWarn: (message: string, context?: Record<string, any>) => void;
export declare const logDebug: (message: string, context?: Record<string, any>) => void;
//# sourceMappingURL=logger.d.ts.map