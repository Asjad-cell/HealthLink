import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { createDefaultAdmin } from './utils/seedAdmin';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Connect to MongoDB and create default admin
connectDB()
  .then(() => createDefaultAdmin())
  .catch(err => {
    console.error('❌ DB Connection Failed:', err);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        process.env.CLIENT_URL || '',
        'https://health-link-seven.vercel.app' // Replace with your Vercel frontend URL
      ].filter(Boolean)
    : ['http://localhost:5173'], // Your local Vite dev server
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (_req, res) => {
  res.json({
    message: 'HealthLink API is running',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Graceful shutdown for SIGTERM (Railway)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('💀 Server terminated');
  });
});
