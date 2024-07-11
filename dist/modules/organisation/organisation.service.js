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
const response_utils_1 = __importDefault(require("../../shared/utils/response.utils"));
const prisma = new client_1.PrismaClient();
class OrganisationService {
    constructor() { }
    getOne(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const organisations = yield prisma.organisation.findFirst({
                where: {
                    orgId: payload.orgId,
                    AND: [
                        {
                            OR: [
                                { creatorId: payload.userId },
                                { users: { some: { userId: payload.userId } } }
                            ]
                        }
                    ]
                },
                select: {
                    orgId: true,
                    name: true,
                    description: true
                }
                //  include: {
                //     users: true
                //  }
            });
            if (!organisations) {
                throw new httpException_exception_1.default(400, "Client error", "Bad request");
            }
            const response = response_utils_1.default.buildResponse({ response: organisations, message: "get organisation successfully" });
            return response;
        });
    }
    getAll(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload);
            const organisations = yield prisma.organisation.findMany({
                where: {
                    OR: [
                        { creatorId: payload.userId },
                        { users: { some: { userId: payload.userId } } }
                    ]
                }
            });
            if (!organisations) {
                throw new httpException_exception_1.default(400, "Client error", "Bad request");
            }
            const response = { status: "Success", message: "get organisations successfully", organisations };
            return response;
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, userId, description } = payload;
            // console.log(payload);
            if (!name || !userId) {
                throw new httpException_exception_1.default(400, "Client error", "Bad request");
            }
            const organisation = yield prisma.organisation.create({
                data: {
                    name,
                    description,
                    creatorId: userId,
                    users: {
                        connect: [{ userId }]
                    }
                },
                select: {
                    orgId: true,
                    name: true,
                    description: true
                }
            });
            if (!organisation) {
                throw new httpException_exception_1.default(400, "Client error", "Bad request");
            }
            const response = response_utils_1.default.buildResponse({ response: organisation, message: "Organisation created successfully" });
            // edit
            return response;
        });
    }
    createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgId, userId } = payload;
            console.log(payload);
            if (!userId || !orgId) {
                throw new httpException_exception_1.default(400, "Client error", "Bad request");
            }
            const organisation = yield prisma.organisation.update({
                where: { orgId },
                data: {
                    users: {
                        connect: [{ userId: payload.userId }]
                    }
                }
            });
            if (!organisation) {
                throw new httpException_exception_1.default(400, "Client error", "Bad request");
            }
            // const response = responseUtils.buildResponse({ response: organisation, message: "User added to organisation successfully" })
            return { status: "Success", message: "User added to organisation successfully" };
        });
    }
}
exports.default = new OrganisationService();
