import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import geeRoutes from './routes/geeRoutes.js';
import lscRoutes from './routes/lscRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import { startScheduler } from './services/schedulerService.js';

dotenv.config();
const app = express();

// DB
await connectDB();

// Middleware
app.use(express.json({ limit: '2mb' }));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || '*').split(','),
  credentials: true
}));

// Basic rate limit on heavy endpoints
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/gee', limiter);

// Routes
app.use('/gee', geeRoutes);
app.use('/lsc', lscRoutes);
app.use('/meta', metaRoutes);

// Start scheduler
startScheduler();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`LOLER backend listening on :${PORT}`));
