import { Router } from 'express';
import axios from 'axios';

const router = Router();
const REPLIERS_KEY = process.env.REPLIERS_API_KEY;
const REPLIERS_BASE = 'https://api.repliers.io';

const headers = () => ({ 'REPLIERS-API-KEY': REPLIERS_KEY });

// GET /api/listings — standard search
router.get('/', async (req, res) => {
  try {
    const params = {
      status:   req.query.status   || 'A',
      type:     req.query.type     || '',
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || '',
      minBeds:  req.query.minBeds  || '',
      city:     req.query.city     || 'Toronto',
      pageNum:  req.query.page     || 1,
      resultsPerPage: req.query.limit || 20,
    };
    const { data } = await axios.get(`${REPLIERS_BASE}/listings`, {
      headers: headers(),
      params,
    });
    res.json({
      listings:    data.listings || [],
      count:       data.count    || 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Listings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// POST /api/listings/geo — geospatial / map search
router.post('/geo', async (req, res) => {
  try {
    const { bounds, zoom } = req.body;
    const { north, south, east, west } = bounds || {};
    const { data } = await axios.get(`${REPLIERS_BASE}/listings`, {
      headers: headers(),
      params: {
        status:       'A',
        maxLat:       north,
        minLat:       south,
        maxLng:       east,
        minLng:       west,
        cluster:      zoom < 12 ? 'true' : 'false',
        resultsPerPage: zoom < 12 ? 100 : 50,
      },
    });
    res.json({
      listings:    data.listings || data.clusters || [],
      clusters:    data.clusters || [],
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Geo listings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch geo listings' });
  }
});

// GET /api/listings/autocomplete — address autocomplete
router.get('/autocomplete', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (q.length < 2) return res.json({ results: [] });
    const { data } = await axios.get(`${REPLIERS_BASE}/autocomplete`, {
      headers: headers(),
      params: { q },
    });
    res.json({ results: data.results || data || [] });
  } catch (err) {
    console.error('Autocomplete error:', err.message);
    res.json({ results: [] });
  }
});

// GET /api/listings/:id — single listing
router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(`${REPLIERS_BASE}/listings/${req.params.id}`, {
      headers: headers(),
    });
    res.json(data);
  } catch (err) {
    console.error('Single listing error:', err.message);
    res.status(404).json({ error: 'Listing not found' });
  }
});

export default router;
