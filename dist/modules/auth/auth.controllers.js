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
const auth_service_1 = __importDefault(require("./auth.service"));
const validator_util_1 = __importDefault(require("../../shared/utils/validator.util"));
const user_validation_1 = require("../../shared/validation/user.validation");
class AuthControllers {
    constructor() {
        this.path = '/auth';
        this.router = (0, express_1.Router)();
        this.loadRoutes();
    }
    loadRoutes() {
        this.router.get(`${this.path}/`, (req, res) => {
            res.status(200).json({ message: "Auth Service is working" });
        });
        this.router.post(`${this.path}/register`, (0, validator_util_1.default)(user_validation_1.userValidationSchema), this.signUp);
        this.router.post(`${this.path}/login`, this.signin);
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield auth_service_1.default.signUp(req.body);
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield auth_service_1.default.signIn(req.body);
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthControllers;
