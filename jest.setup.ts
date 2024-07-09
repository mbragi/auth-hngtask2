import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Optionally log to confirm loading
console.log('JWT_SECRET:', process.env.JWT_SECRET);
