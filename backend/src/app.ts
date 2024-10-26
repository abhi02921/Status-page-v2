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
    origin: ENV.FRONTEND_URL, // Ensure you set this to your frontend domain for security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  transports: ['websocket', 'polling'],
});

// Attach the Socket.IO instance to requests (Socket.IO middleware)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.io = io;
  next();
});

// Middleware setup
app.use(cors());  // Apply CORS early to avoid issues with cross-origin requests
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to the API. No authentication required here.' });
});

// Clerk middleware should be applied before authentication
app.use(clerkMiddleware());
app.use(requireAuth());

// API Routes
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

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected via Socket.IO:', socket.id);
  console.log(socket.request);
  // You can add more event listeners here
  socket.on('custom_event', (data) => {
    console.log('Custom event received:', data);
    // Handle the event, e.g., emit to others, save data, etc.
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export HTTP server and app for further usage
export { httpServer };
export default app;
