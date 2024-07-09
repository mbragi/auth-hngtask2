"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(statusCode, message, status) {
        super(message);
        this.status = status;
        this.statusCode = statusCode;
    }
}
exports.default = HttpException;
