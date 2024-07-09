import jwt from 'jsonwebtoken';
import { generateToken } from '../shared/utils/jwt.utils';

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
