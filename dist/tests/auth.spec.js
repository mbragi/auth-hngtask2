"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_utils_1 = require("../shared/utils/jwt.utils");
describe('JWT Utils', () => {
    it('should generate a token with correct user details and expiration time', () => {
        const userId = '123';
        const email = 'test@example.com';
        const orgId = '456';
        const token = (0, jwt_utils_1.generateToken)(userId, email, orgId);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toEqual(userId);
        expect(decoded.email).toEqual(email);
        expect(decoded.orgId).toEqual(orgId);
        expect(decoded.exp).toBeDefined();
    });
});
