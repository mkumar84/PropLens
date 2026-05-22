import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/', async (req, res) => {
  const { lat, lng, address } = req.query;

  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

  const WALKSCORE_KEY = process.env.WALKSCORE_API_KEY;

  try {
    const wsUrl = `https://api.walkscore.com/score?format=json&address=${encodeURIComponent(address || '')}&lat=${lat}&lon=${lng}&transit=1&bike=1&wsapikey=${WALKSCORE_KEY}`;
    const { data } = await axios.get(wsUrl);

    res.json({
      walk:    data.walkscore   || null,
      transit: data.transit?.score || null,
      bike:    data.bike?.score    || null,
      description: data.description || '',
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Walk score error:', err.message);
    res.json({ walk: null, transit: null, bike: null });
  }
});

export default router;
