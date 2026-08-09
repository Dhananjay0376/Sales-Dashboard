# Sales Dashboard

A Vite + React dashboard for the `get_sales_dashboard` Supabase RPC endpoint.

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173) — it should open automatically.

## What's inside

- `src/SalesDashboard.jsx` — the dashboard component (KPI cards, daily chart, monthly chart, leaderboard). Loads with sample data immediately.
- Click **"Connect live data"** inside the running app, paste your Supabase `apikey` (the `sb_publishable_...` key), and click **Fetch live**. Since this runs as a real local dev server (not inside any preview sandbox), the request goes out through your normal browser network — no artifact restrictions.
- `test-fetch.html` — a zero-dependency standalone page for testing the raw fetch call by itself. Open it directly in a browser (double-click it) if you want to debug the API call in isolation from React.

## Build for deployment

```bash
npm run build
```

Outputs a static `dist/` folder you can host anywhere (Vercel, Netlify, GitHub Pages, etc.).
