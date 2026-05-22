import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';

const router   = Router();
const client   = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const REPLIERS_KEY  = process.env.REPLIERS_API_KEY;
const REPLIERS_BASE = 'https://api.repliers.io';

router.post('/', async (req, res) => {
  const { address, postalCode, propertyType, beds, baths } = req.body;

  if (!address) return res.status(400).json({ error: 'address required' });

  try {
    // Fetch comparable solds from Repliers
    let comparables = [];
    try {
      const { data } = await axios.get(`${REPLIERS_BASE}/listings`, {
        headers: { 'REPLIERS-API-KEY': REPLIERS_KEY },
        params: {
          status: 'U',
          address,
          type:   propertyType || '',
          minBeds: beds ? Number(beds) - 1 : '',
          maxBeds: beds ? Number(beds) + 1 : '',
          resultsPerPage: 4,
        },
      });
      comparables = data.listings || [];
    } catch {
      // continue without comparables
    }

    const prompt = `Run a quick CMA for this Ontario property:
Address: ${address}
${postalCode ? `Postal: ${postalCode}` : ''}
Type: ${propertyType || 'not specified'}
Beds: ${beds || 'not specified'}, Baths: ${baths || 'not specified'}

${comparables.length > 0 ? `Comparable solds nearby:\n${JSON.stringify(comparables.slice(0, 4), null, 2)}` : 'No comparables available — use general market knowledge.'}

Provide:
1. Estimated price range (be specific — e.g. "$880K–$920K")
2. Key demand signals (avg DOM, over asking %, absorption trend)
3. A concise negotiation insight
4. Growth grade (A/B/C/D with + or -)

Be direct. Use real numbers. Keep it under 200 words.`;

    const message = await client.messages.create({
      model:      'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({
      analysis:    message.content[0].text,
      comparables: comparables.slice(0, 4),
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('CMA error:', err);
    res.status(500).json({ error: 'CMA generation failed' });
  }
});

export default router;
