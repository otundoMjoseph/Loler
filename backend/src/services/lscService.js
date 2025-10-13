import axios from 'axios';

export async function getFertilityData(lat, lon) {
  const url = `${process.env.ISDA_API}?lat=${lat}&lon=${lon}`;
  try {
    const res = await axios.get(url, { timeout: 15000 });
    return {
      pH: res.data.pH,
      organic_carbon: res.data.organic_carbon,
      nitrogen: res.data.nitrogen,
      phosphorus: res.data.phosphorus,
      source: 'ISDA LSC Hub'
    };
  } catch (e) {
    return { error: 'Failed to fetch fertility data' };
  }
}
