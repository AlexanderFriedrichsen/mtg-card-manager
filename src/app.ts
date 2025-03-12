import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authenticate } from './middleware/auth';
import dotenv from 'dotenv';
// index keeps track of all the routes and exports befere here
import { cardRoutes } from './routes';
import { userRoutes } from './routes';

// is this the best place to put this?
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Card routes
app.use('/api/cards', cardRoutes);

// User routes
app.use('/api/users', userRoutes);

// Simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Test database connection
app.get('/db-test', async (req, res) => {
  try {
    // Just count the cards to test DB connection
    const count = await prisma.card.count();
    res.json({ status: 'ok', message: 'Database connection successful', cardCount: count });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Protected route example
app.get('/protected', authenticate, (req, res) => {
  res.json({ status: 'ok', message: 'You accessed a protected route' });
});

export default app;