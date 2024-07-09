import userService from '../modules/user/user.service';// Adjust the import path as per your project structure
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('UserService', () => {
  beforeEach(async () => {
    // Clean up database or reset state before each test
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  }, 10000);

  afterAll(async () => {
    // Disconnect Prisma client after all tests
    jest.setTimeout(10000); // Increase timeout to 10 seconds (10000 milliseconds)
    await prisma.$disconnect();
  });

  describe('getOne', () => {
    it('should retrieve user data for authenticated user', async () => {

        jest.setTimeout(10000);
      // Create mock data
      const newUser = await prisma.user.create({
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
      const response = await userService.getOne(payload);

      // Assert the response
      expect(response.message).toBe('Get user, successfull');
      expect(response.data.firstName).toBe('John');
      expect(response.data.lastName).toBe('Doe');
      expect(response.data.email).toBe('john.doe@example.com');
      expect(response.data.phone).toBe('09067391313');

    });
  });

  // Additional tests for other methods like getAll can be added similarly
});
