"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.optionalAuth = exports.authorize = exports.authenticate = exports.notFoundHandler = exports.catchAsync = exports.errorHandler = void 0;
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorHandler_1.errorHandler; } });
Object.defineProperty(exports, "catchAsync", { enumerable: true, get: function () { return errorHandler_1.catchAsync; } });
var notFoundHandler_1 = require("./notFoundHandler");
Object.defineProperty(exports, "notFoundHandler", { enumerable: true, get: function () { return notFoundHandler_1.notFoundHandler; } });
var auth_1 = require("./auth");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return auth_1.authenticate; } });
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return auth_1.authorize; } });
Object.defineProperty(exports, "optionalAuth", { enumerable: true, get: function () { return auth_1.optionalAuth; } });
Object.defineProperty(exports, "checkOwnership", { enumerable: true, get: function () { return auth_1.checkOwnership; } });
__exportStar(require("./validation"), exports);
//# sourceMappingURL=index.js.map