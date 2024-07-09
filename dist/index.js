"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const middleware_1 = require("./middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class App {
    constructor(constrollers) {
        this.app = (0, express_1.default)();
        this.initMiddlewares();
        this.initControllers(constrollers);
        this.initErrorHandlers();
    }
    listen() {
        this.app.listen(4000, () => {
            console.log("app is listening on port 400");
        });
    }
    initControllers(constrollers) {
        constrollers.forEach((controller) => {
            console.log(`/api/hngtask2${controller.path}`);
            this.app.use(`/api/hngtask2`, controller.router);
        });
    }
    initMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev'));
    }
    initErrorHandlers() {
        this.app.use(middleware_1.notFound);
        this.app.use(middleware_1.errorHandler);
    }
}
exports.default = App;
