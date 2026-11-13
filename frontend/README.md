# Little Steps Frontend

React + Vite + Tailwind frontend for the Little Steps childcare platform.

## Run

1. Copy `.env.example` to `.env` if needed.
2. Set `VITE_API_URL=http://localhost:5000/api`.
3. Run:

```bash
npm install
npm run dev
```

The frontend expects the Little Steps backend on port 5000.

## Main routes

- `/` landing page
- `/search` childcare discovery
- `/centers/:id` center details and plans
- `/login`, `/register`
- `/parent` parent dashboard
- `/bookings/new` booking request
- `/provider` provider dashboard
- `/admin` admin dashboard
