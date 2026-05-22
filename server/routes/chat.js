import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are PropertyLens, a knowledgeable and direct real estate assistant for Canadian buyers, sellers, investors, and renters searching in Ontario.

Tone: Friendly, direct, confident. Like a smart friend who happens to be a licensed realtor. Short sentences. Real numbers. No jargon. No hedging. Lowercase where natural.

When surfacing a property return structured data alongside your conversational response using this exact format:
<property_card>
{
  "price": 924000,
  "address": "47 Driftwood Cres, Mississauga",
  "beds": 3, "baths": 2, "sqft": 1680,
  "daysListed": 31,
  "tags": ["GO: 8 min", "Schools 8.1/10"],
  "signal": "31 days listed — room to negotiate",
  "verdict": "below_average"
}
</property_card>

When surfacing demand signals return:
<market_signal>
{
  "neighbourhood": "Cooksville",
  "avgDOM": 14,
  "overAskingPct": 2.1,
  "absorptionChange": "+14%",
  "growthGrade": "B+",
  "headline": "absorption rate up 14% vs last month"
}
</market_signal>

You are NOT a brokerage. AI valuations are estimates — always note professional verification for major decisions. RECO registered salesperson — not intended to solicit buyers or sellers under contract.`;

router.post('/', async (req, res) => {
  const { messages = [] } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  // Map to Anthropic format
  const formatted = messages
    .filter(m => m.role && m.content)
    .map(({ role, content }) => ({ role, content }));

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  try {
    const stream = client.messages.stream({
      model:      'claude-sonnet-4-5',
      max_tokens: 2048,
      system:     SYSTEM_PROMPT,
      messages:   formatted,
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    await stream.finalMessage();
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Claude stream error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
    res.end();
  }
});

export default router;
