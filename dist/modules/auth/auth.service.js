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
const httpException_exception_1 = __importDefault(require("../../shared/exceptions/httpException.exception"));
const client_1 = require("@prisma/client");
const bcrypt_util_1 = require("../../shared/utils/bcrypt.util");
const response_utils_1 = __importDefault(require("../../shared/utils/response.utils"));
const jwt_utils_1 = require("../../shared/utils/jwt.utils");
const prisma = new client_1.PrismaClient();
class AuthService {
    constructor() {
        this.bcrypt = new bcrypt_util_1.bcryptUtils();
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const userExists = yield prisma.user.findUnique({
                where: { email }
            });
            // console.log(userExists)
            if (userExists)
                throw new httpException_exception_1.default(422, "Registration unsuccessful", "Bad Request");
            const hashPassword = yield this.bcrypt.hashPassword({ password, saltRounds: 12 });
            payload.password = hashPassword;
            // console.log(hashPassword)
            const user = yield prisma.user.create({
                data: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password,
                    phone: payload.phone,
                    organisations: {
                        create: {
                            name: `${payload.firstName}'s organisation`
                        }
                    }
                },
                include: {
                    organisations: true
                }
            });
            const organisation = yield prisma.organisation.update({
                where: { orgId: user.organisations[0].orgId },
                data: { creatorId: user.userId }
            });
            console.log(organisation);
            console.log("new user created", user);
            const accessToken = (0, jwt_utils_1.generateToken)(user.userId, user.email, user.organisations[0].orgId);
            const response = response_utils_1.default.buildResponse({ response: { accessToken, user }, message: "Registeration Successfull" });
            return response;
        });
    }
    signIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            if (!email || !password)
                throw new httpException_exception_1.default(422, "Authentication failed", "Bad request");
            const userExists = yield prisma.user.findUnique({
                where: { email },
                include: {
                    organisations: true
                }
            });
            if (!userExists)
                throw new httpException_exception_1.default(401, "User not found", "Bad request");
            const isPasswordValid = yield this.bcrypt.compare(password, userExists.password);
            if (!isPasswordValid)
                throw new httpException_exception_1.default(401, "Authentication failed", "Bad request");
            const accessToken = (0, jwt_utils_1.generateToken)(userExists.userId, userExists.email, userExists.organisations[0].orgId);
            const response = response_utils_1.default.buildResponse({ response: { accessToken, user: userExists }, message: "Login successful" });
            return response;
        });
    }
}
exports.default = new AuthService();
