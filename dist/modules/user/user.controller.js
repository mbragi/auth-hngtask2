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
const user_service_1 = __importDefault(require("./user.service"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
class UserControllers {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.loadRoutes();
    }
    loadRoutes() {
        this.router.get(`${this.path}/health`, (req, res) => {
            res.status(200).json({ message: "User Service is working" });
        });
        this.router.get(`${this.path}/`, auth_middleware_1.verifyToken, this.getAll);
        this.router.get(`${this.path}/:userId`, auth_middleware_1.verifyToken, this.getOne);
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, email, orgId } = req.user;
                // const response = await userService.getAll({userId, email})
                res.status(200).json();
            }
            catch (error) {
                next(error);
            }
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { userId: user, email, orgId } = req.user;
                const response = yield user_service_1.default.getOne({ userId: userId, user, orgId });
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserControllers;
