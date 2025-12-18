import 'dotenv/config';
import connectDB from './config/database.js';
import app from './app.js';

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle internal server events
    server.on('error', (err) => {
      console.error('Server error:', err);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const server = await startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(err);
  // In serverless, we log and let the function finish or time out
  // server.close() is not strictly needed for serverless functions
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(err);
  // Manual exit is risky in serverless; prefer logging for visibility
});

// Graceful shutdown signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Cleaning up...');
});

