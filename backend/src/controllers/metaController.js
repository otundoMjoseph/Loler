import mongoose from 'mongoose';
import { getGFS } from '../config/db.js';

export const health = async (req, res) => {
  const db = mongoose.connection.readyState === 1 ? 'up' : 'down';
  const gfs = getGFS() ? 'ready' : 'not-ready';
  res.json({ status: 'ok', db, gridfs: gfs, time: new Date().toISOString() });
};
