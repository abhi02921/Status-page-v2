// src/utils/env.ts
import dotenv from 'dotenv';

// Load environment variables from .env file, if available
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5001',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLERK_AUDIENCE: process.env.CLERK_AUDIENCE || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGO_DB_PORT: process.env.MONGO_DB_PORT || '3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
