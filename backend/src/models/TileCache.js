import mongoose from 'mongoose';

const tileSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  layerType: { type: String, index: true }, // moisture|flood|fertility
  tiffId: String,
  pngId: String,
  createdAt: { type: Date, default: Date.now, expires: 86400 * (Number(process.env.CACHE_DAYS || 3)) }
});

tileSchema.index({ lat: 1, lon: 1, layerType: 1 });

export default mongoose.model('TileCache', tileSchema);
