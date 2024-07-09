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
const user_service_1 = __importDefault(require("../modules/user/user.service")); // Adjust the import path as per your project structure
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('UserService', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up database or reset state before each test
        yield prisma.user.deleteMany();
        yield prisma.organisation.deleteMany();
    }), 10000);
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Disconnect Prisma client after all tests
        jest.setTimeout(10000); // Increase timeout to 10 seconds (10000 milliseconds)
        yield prisma.$disconnect();
    }));
    describe('getOne', () => {
        it('should retrieve user data for authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.setTimeout(10000);
            // Create mock data
            const newUser = yield prisma.user.create({
                data: {
                    userId: 'user1_id',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'hashedPassword',
                    phone: "09067391313"
                },
            });
            // Simulate authentication payload
            const payload = {
                userId: newUser.userId,
                user: newUser.userId, // Assuming user identifier for current user
                orgId: '', // You may adjust this depending on your implementation
            };
            // Call UserService method
            const response = yield user_service_1.default.getOne(payload);
            // Assert the response
            expect(response.message).toBe('Get user, successfull');
            expect(response.data.firstName).toBe('John');
            expect(response.data.lastName).toBe('Doe');
            expect(response.data.email).toBe('john.doe@example.com');
            expect(response.data.phone).toBe('09067391313');
        }));
    });
    // Additional tests for other methods like getAll can be added similarly
});
