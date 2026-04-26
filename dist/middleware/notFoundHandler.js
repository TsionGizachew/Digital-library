"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const types_1 = require("../types");
const notFoundHandler = (req, res, next) => {
    const err = new types_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFoundHandler.js.map