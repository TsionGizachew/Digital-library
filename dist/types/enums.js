"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = exports.BookStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPERADMIN"] = "superadmin";
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var BookStatus;
(function (BookStatus) {
    BookStatus["AVAILABLE"] = "available";
    BookStatus["BOOKED"] = "booked";
    BookStatus["RESERVED"] = "reserved";
    BookStatus["MAINTENANCE"] = "maintenance";
    BookStatus["REMOVED"] = "removed";
})(BookStatus || (exports.BookStatus = BookStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["APPROVED"] = "approved";
    BookingStatus["REJECTED"] = "rejected";
    BookingStatus["RETURNED"] = "returned";
    BookingStatus["OVERDUE"] = "overdue";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
//# sourceMappingURL=enums.js.map