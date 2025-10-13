import cron from 'node-cron';
import axios from 'axios';
import mongoose from 'mongoose';
import TileCache from '../models/TileCache.js';
import { getGFS } from '../config/db.js';
import { getSentinelMap } from './geeService.js';
import { tiffToPng } from './conversionService.js';

export function startScheduler() {
  const schedule = process.env.CRON_SCHEDULE || '0 0 * * 0';
  console.log('Scheduler armed with cron:', schedule);
  cron.schedule(schedule, async () => {
    console.log('Weekly refresh job started');
    try {
      const gfs = getGFS();
      const tiles = await TileCache.find({ layerType: { $in: ['moisture','flood'] } });
      for (const tile of tiles) {
        const data = await getSentinelMap(tile.lat, tile.lon, tile.layerType);
        // Fetch TIFF (placeholder hits tile URL)
        const tiffRes = await axios.get(data.tileUrl, { responseType: 'arraybuffer' });
        const tiffBuffer = Buffer.from(tiffRes.data);
        const pngBuffer = await tiffToPng(tiffBuffer);

        // Remove old
        if (tile.tiffId) await gfs.remove({ _id: new mongoose.Types.ObjectId(tile.tiffId) }, () => {});
        if (tile.pngId) await gfs.remove({ _id: new mongoose.Types.ObjectId(tile.pngId) }, () => {});

        // Save new
        const tiffId = new mongoose.Types.ObjectId();
        const pngId = new mongoose.Types.ObjectId();

        await new Promise((resolve, reject) => {
          const ws = gfs.createWriteStream({ _id: tiffId, filename: `${tile.layerType}_${Date.now()}.tiff` });
          ws.write(tiffBuffer); ws.end();
          ws.on('close', resolve); ws.on('error', reject);
        });

        await new Promise((resolve, reject) => {
          const ws = gfs.createWriteStream({ _id: pngId, filename: `${tile.layerType}_${Date.now()}.png` });
          ws.write(pngBuffer); ws.end();
          ws.on('close', resolve); ws.on('error', reject);
        });

        tile.tiffId = tiffId;
        tile.pngId = pngId;
        await tile.save();
        console.log('Refreshed tile', tile._id.toString());
      }
      console.log('Weekly refresh complete');
    } catch (e) {
      console.error('Refresh error:', e.message);
    }
  });
}
