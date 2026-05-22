# PropertyLens

AI-powered real estate assistant for Ontario.

## Structure

```
propertylens/
├── client/   # React 18 + Vite + Tailwind (deploy to Vercel)
└── server/   # Node.js + Express API proxy (deploy to Railway)
```

## Quick start

```bash
# Client
cd client && npm install && npm run dev

# Server (separate terminal)
cd server && npm install && npm run dev
```

## Environment variables

### client/.env.local
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MAPBOX_TOKEN=
VITE_API_URL=http://localhost:3001
```

### server/.env
```
ANTHROPIC_API_KEY=
REPLIERS_API_KEY=
WALKSCORE_API_KEY=
RESEND_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## TODO before launch

- [ ] `BROKERAGE_NAME` — legal brokerage name (`client/src/constants/compliance.js`)
- [ ] `RECO_REG` — RECO registration number
- [ ] `BROKERAGE_ADDRESS` — brokerage office address
- [ ] `PREC_NAME` — PREC name if applicable
- [ ] Replace `client/public/images/brokerage-logo.png` with real brokerage logo
- [ ] Fill all environment variables above
- [ ] Set up Supabase project and run schema migrations
- [ ] Configure Resend sending domain
- [ ] Deploy client to Vercel, server to Railway

## Compliance

Operated by Mahesh Kumar, Salesperson, [BROKERAGE NAME], RECO Reg. #[RECO REG #].
Not intended to solicit buyers or sellers currently under contract.
