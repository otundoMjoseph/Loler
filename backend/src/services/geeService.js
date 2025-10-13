import axios from 'axios';

/**
 * Returns a mock GEE tile URL shaped like a tile template.
 * Replace with real GEE REST maps (mapid/token) when available.
 */
export async function getSentinelMap(lat, lon, type) {
  const base = process.env.GEE_API || 'https://earthengine.googleapis.com/v1/projects/YOUR_PROJECT_ID/maps';
  const mapid = type === 'moisture' ? 'sentinel1_soil_moisture' : 'sentinel1_flood_risk';
  const tileUrl = `${base}/${mapid}/{z}/{x}/{y}?token=XYZ`;
  return { mapid, tileUrl, source: 'Sentinel-1', lat, lon, type };
}
