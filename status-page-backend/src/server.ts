// src/server.ts
import { httpServer } from './app';
import { connectDB } from './app';
import { ENV } from './utils/env';

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start the HTTP server (which includes Socket.IO)
    httpServer.listen(ENV.PORT, () => {
      console.log(`Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();