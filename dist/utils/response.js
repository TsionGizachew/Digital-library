"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message = 'Success', statusCode = 200, pagination) {
        const response = {
            success: true,
            message,
            data,
        };
        if (pagination) {
            response.pagination = pagination;
        }
        res.status(statusCode).json(response);
    }
    static created(res, data, message = 'Resource created successfully') {
        this.success(res, data, message, 201);
    }
    static updated(res, data, message = 'Resource updated successfully') {
        this.success(res, data, message, 200);
    }
    static deleted(res, message = 'Resource deleted successfully') {
        this.success(res, null, message, 200);
    }
    static paginated(res, data, pagination, message = 'Success') {
        this.success(res, data, message, 200, pagination);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.js.map