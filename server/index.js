import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter         from './routes/chat.js';
import listingsRouter     from './routes/listings.js';
import cmaRouter          from './routes/cma.js';
import leadsRouter        from './routes/leads.js';
import neighbourhoodRouter from './routes/neighbourhood.js';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

app.use('/api/chat',          chatRouter);
app.use('/api/listings',      listingsRouter);
app.use('/api/cma',           cmaRouter);
app.use('/api/leads',         leadsRouter);
app.use('/api/neighbourhood', neighbourhoodRouter);

app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => console.log(`PropertyLens API running on :${PORT}`));
