import { getFertilityData } from '../services/lscService.js';

export const fertility = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat, lon required' });
  const data = await getFertilityData(lat, lon);
  res.json(data);
};
