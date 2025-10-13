import mongoose from 'mongoose';
import TileCache from '../models/TileCache.js';
import { getGFS } from '../config/db.js';

export async function saveRaster(lat, lon, layerType, tiffBuffer, pngBuffer) {
  const gfs = getGFS();
  const tiffId = new mongoose.Types.ObjectId();
  const pngId = new mongoose.Types.ObjectId();

  await new Promise((resolve, reject) => {
    const ws = gfs.createWriteStream({ _id: tiffId, filename: `${layerType}_${Date.now()}.tiff` });
    ws.write(tiffBuffer);
    ws.end();
    ws.on('close', resolve);
    ws.on('error', reject);
  });

  await new Promise((resolve, reject) => {
    const ws = gfs.createWriteStream({ _id: pngId, filename: `${layerType}_${Date.now()}.png` });
    ws.write(pngBuffer);
    ws.end();
    ws.on('close', resolve);
    ws.on('error', reject);
  });

  await TileCache.create({ lat, lon, layerType, tiffId, pngId });
}

export async function getCached(lat, lon, layerType) {
  return TileCache.findOne({ lat: Number(lat), lon: Number(lon), layerType });
}
