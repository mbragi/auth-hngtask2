import jwt from 'jsonwebtoken';
import { generateToken } from '../shared/utils/jwt.utils';
import request from 'supertest';
import app from '../server';
import { PrismaClient } from '@prisma/client';


let server: any;
beforeAll((done) => {
    server = app.listen(4001, done); // Use a different port for testing
  });
  
  afterAll((done) => {
    server.close(done);
  });

describe('JWT Utils', () => {
    it('should generate a token with correct user details and expiration time', () => {
        const userId = '123';
        const email = 'test@example.com';
        const orgId = '456';

        const token = generateToken(userId, email, orgId);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        expect(decoded.userId).toEqual(userId);
        expect(decoded.email).toEqual(email);
        expect(decoded.orgId).toEqual(orgId);
        expect(decoded.exp).toBeDefined();
    });
});


const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', async () => {
        const res = await request(app)
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

        const organisation = await prisma.organisation.findFirst({
            where: { name: "John's Organisation" },
        });
        expect(organisation).not.toBeNull();
    });

    it('should log the user in successfully', async () => {
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.status).toBe('success');
        expect(loginRes.body.data).toHaveProperty('accessToken');
        expect(loginRes.body.data.user.email).toBe('john.doe@example.com');
    });

    it('should fail if required fields are missing', async () => {
        const res = await request(app)
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
    });

    it('should fail if there’s a duplicate email or userId', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
            });

        const res = await request(app)
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
    });
});
