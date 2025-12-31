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
const PORT = Number(process.env.PORT) || 5000;  // ✅ Convert to number

connectDB().then(() => {
  createDefaultAdmin();
});

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CLIENT_URL || '',
        'https://*.vercel.app',
        'https://healthlink-production.up.railway.app'
      ].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'HealthLink API is running',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('❌ Unhandled Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received');
  server.close(() => {
    console.log('💀 Process terminated');
  });
});