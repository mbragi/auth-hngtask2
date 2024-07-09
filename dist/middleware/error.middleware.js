"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    res.status(statusCode).json({
        status: error.status || "Bad request",
        message: message,
        statusCode: statusCode || 500
    });
};
exports.errorHandler = errorHandler;
