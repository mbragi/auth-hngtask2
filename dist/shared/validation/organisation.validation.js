"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.orgValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional().allow(null, '')
});
