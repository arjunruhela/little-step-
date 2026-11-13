# Little Steps Backend

Node.js + Express + MongoDB backend for the Little Steps 24x7 childcare platform.

## Setup

1. Install Node.js 20+.
2. From `backend/` run:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a strong `JWT_SECRET`.
4. Seed demo data:
   ```bash
   npm run seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

API base URL: `http://localhost:5000/api`

Health check: `GET /api/health`

## Demo accounts

All demo accounts use `password123`.

- Admin: `admin@littlesteps.com`
- Parent: `parent@littlesteps.com`
- Provider: `provider@littlesteps.com`

## Main API areas

- `/api/auth`
- `/api/centers`
- `/api/bookings`
- `/api/parent`
- `/api/provider`
- `/api/admin`

Uploads are served under `/uploads`.

## Notes

Phase 1 uses simulated booking/subscription amounts; no real payment gateway is included. CCTV and medical integrations are intentionally out of scope.
