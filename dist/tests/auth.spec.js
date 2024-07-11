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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_utils_1 = require("../shared/utils/jwt.utils");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const client_1 = require("@prisma/client");
let server;
beforeAll((done) => {
    server = server_1.default.listen(4001, done); // Use a different port for testing
});
afterAll((done) => {
    server.close(done);
});
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
const prisma = new client_1.PrismaClient();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.deleteMany();
    yield prisma.organisation.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            phone: '1234567890',
        });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.user.firstName).toBe('John');
        expect(res.body.data.user.lastName).toBe('Doe');
        expect(res.body.data.user.email).toBe('john.doe@example.com');
        expect(res.body.data.user.phone).toBe('1234567890');
        const organisation = yield prisma.organisation.findFirst({
            where: { name: "John's Organisation" },
        });
        expect(organisation).not.toBeNull();
    }));
    it('should log the user in successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginRes = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/login')
            .send({
            email: 'john.doe@example.com',
            password: 'password123',
        });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.status).toBe('success');
        expect(loginRes.body.data).toHaveProperty('accessToken');
        expect(loginRes.body.data.user.email).toBe('john.doe@example.com');
    }));
    it('should fail if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '1234567890',
        });
        expect(res.status).toBe(422);
        expect(res.body.errors).toContainEqual({
            field: 'firstName',
            message: 'First name is required',
        });
        expect(res.body.errors).toContainEqual({
            field: 'lastName',
            message: 'Last name is required',
        });
        expect(res.body.errors).toContainEqual({
            field: 'email',
            message: 'Email is required',
        });
        expect(res.body.errors).toContainEqual({
            field: 'password',
            message: 'Password is required',
        });
    }));
    it('should fail if there’s a duplicate email or userId', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            phone: '1234567890',
        });
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/auth/register')
            .send({
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            phone: '1234567890',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Registration unsuccessful');
    }));
});
