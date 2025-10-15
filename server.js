import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mapRoutes from './routes/mapRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.set('trust proxy', 1);
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/', mapRoutes);
app.use('/', reportRoutes);
app.use('/api/stats', statsRoutes);




const PORT = process.env.PORT || 8000;


app.get("/api/test", (req, res) => {
  res.json({ message: "Loler backend is running smoothly 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Loler backend is running smoothly 🚀" });
});


app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`));
