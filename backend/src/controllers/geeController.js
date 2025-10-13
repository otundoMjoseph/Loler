import mongoose from 'mongoose';
import axios from 'axios';
import { getSentinelMap } from '../services/geeService.js';
import { tiffToPng } from '../services/conversionService.js';
import { getCached, saveRaster } from '../services/cacheService.js';
import { getGFS } from '../config/db.js';

export const getLayer = async (req, res) => {
  const { lat, lon, type } = req.query;
  if (!lat || !lon || !type) return res.status(400).json({ error: 'lat, lon, type required' });

  try {
    const cached = await getCached(lat, lon, type);
    if (cached) {
      return res.json({
        cached: true,
        pngUrl: `${req.protocol}://${req.get('host')}/gee/png/${cached.pngId}`,
        tiffUrl: `${req.protocol}://${req.get('host')}/gee/tiff/${cached.tiffId}`
      });
    }

    const data = await getSentinelMap(lat, lon, type);
    const tiffRes = await axios.get(data.tileUrl, { responseType: 'arraybuffer' });
    const tiffBuffer = Buffer.from(tiffRes.data);
    const pngBuffer = await tiffToPng(tiffBuffer);
    await saveRaster(Number(lat), Number(lon), type, tiffBuffer, pngBuffer);

    return res.json({ cached: false, tileUrl: data.tileUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to get layer' });
  }
};

export const streamPng = async (req, res) => {
  const { id } = req.params;
  const gfs = getGFS();
  try {
    const oid = new mongoose.Types.ObjectId(id);
    const file = await gfs.files.findOne({ _id: oid });
    if (!file) return res.status(404).json({ error: 'PNG not found' });
    res.set('Content-Type', 'image/png');
    gfs.createReadStream({ _id: oid }).pipe(res);
  } catch {
    res.status(400).json({ error: 'Invalid PNG ID' });
  }
};

export const streamTiff = async (req, res) => {
  const { id } = req.params;
  const gfs = getGFS();
  try {
    const oid = new mongoose.Types.ObjectId(id);
    const file = await gfs.files.findOne({ _id: oid });
    if (!file) return res.status(404).json({ error: 'TIFF not found' });
    res.set('Content-Type', 'image/tiff');
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    gfs.createReadStream({ _id: oid }).pipe(res);
  } catch {
    res.status(400).json({ error: 'Invalid TIFF ID' });
  }
};
