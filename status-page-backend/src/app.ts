// src/app.ts
import express from 'express';
import cors from 'cors';
import { requireAuth, clerkMiddleware } from '@clerk/express';
import mongoose from 'mongoose';
import serviceRoutes from './routes/service.routes';
import incidentRoutes from './routes/incident.routes';
import { ENV } from './utils/env';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Extend Express Request type to include io
declare global {
  namespace Express {
    interface Request {
      io: SocketIOServer;
    }
  }
}

const app = express();

// Create an HTTP server to integrate Socket.IO with Express
const httpServer = createServer(app);

// Setup Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Adjust this for security (use specific domain in production)
    methods: ['GET', 'POST'],
  },
});

// Attach the Socket.IO instance to requests
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.io = io;
  next();
});

// Middleware and Routes setup
app.use(cors());
app.use(requireAuth());
app.use(clerkMiddleware());
app.use(express.json());
app.use('/api', serviceRoutes);
app.use('/api', incidentRoutes);

// MongoDB connection function
export const connectDB = async () => {
  try {
    const mongoUri = ENV.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    throw error;
  }
};

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected via Socket.IO');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export { httpServer };
export default app;