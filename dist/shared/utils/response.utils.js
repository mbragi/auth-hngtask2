"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseUtils {
    buildResponse({ response, message }) {
        return {
            status: "success",
            message: message,
            // statusCode: 201,
            data: Object.assign({}, response),
        };
    }
}
exports.default = new ResponseUtils();
