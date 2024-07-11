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
const express_1 = require("express");
const organisation_service_1 = __importDefault(require("./organisation.service"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validator_util_1 = __importDefault(require("../../shared/utils/validator.util"));
const organisation_validation_1 = require("../../shared/validation/organisation.validation");
class OrgControllers {
    constructor() {
        this.path = '/organisations';
        this.router = (0, express_1.Router)();
        this.loadRoutes();
    }
    loadRoutes() {
        this.router.get(`${this.path}/health`, (req, res) => {
            res.status(200).json({ message: "Org Service is working" });
        });
        this.router.get(`${this.path}/`, auth_middleware_1.verifyToken, this.getAll);
        this.router.post(`${this.path}/`, (0, validator_util_1.default)(organisation_validation_1.orgValidationSchema), auth_middleware_1.verifyToken, this.create);
        this.router.patch(`${this.path}/:orgId/users`, auth_middleware_1.verifyToken, this.createUser);
        this.router.get(`${this.path}/:orgId`, auth_middleware_1.verifyToken, this.getOne);
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const response = yield organisation_service_1.default.getAll({ userId: userId });
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orgId } = req.params;
                const { userId } = req.user;
                const response = yield organisation_service_1.default.getOne({ orgId: orgId, userId });
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.user;
                const response = yield organisation_service_1.default.create(Object.assign({ userId: userId }, req.body));
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const { orgId } = req.params;
                const response = yield organisation_service_1.default.createUser({ orgId, userId });
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = OrgControllers;
