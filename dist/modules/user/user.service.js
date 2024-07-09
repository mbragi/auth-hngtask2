"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const response_utils_1 = __importDefault(require("../../shared/utils/response.utils"));
const prisma = new client_1.PrismaClient();
class UserService {
    constructor() { }
    getOne(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, user: currentUser, orgId } = payload;
            const user = yield prisma.user.findFirst({
                where: {
                    userId: currentUser,
                },
                include: {
                    organisations: true
                }
            });
            const response = response_utils_1.default.buildResponse({ response: user, message: "Get user, successfull" });
            return response;
        });
    }
    getAll(payload) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new UserService();
