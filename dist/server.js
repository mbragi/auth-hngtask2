"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const auth_controllers_1 = __importDefault(require("./modules/auth/auth.controllers"));
const organisation_controller_1 = __importDefault(require("./modules/organisation/organisation.controller"));
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const app = new _1.default([new auth_controllers_1.default(), new organisation_controller_1.default(), new user_controller_1.default()]);
app.listen();
