# CausalFunnel Analytics

A simple full-stack user analytics application: a lightweight tracking script
captures `page_view` and `click` events on a webpage, an Express API stores
them in MongoDB, and a Next.js dashboard displays session journeys and a
click heatmap.

## Live demo

- **Dashboard:** https://causalfunnel-analytics-qwkz70ufg.vercel.app/
- **API:** https://causalfunnel-analytics-ib1b.onrender.com
- **Tracker demo page:** https://causalfunnel-analytics-ib1b.onrender.com/demo.html#

> Visit the demo page above and click around, then check the dashboard —
> the tracker is live and will record your session in real time.

> **Note:** the backend is hosted on Render's free tier, which spins down
> after inactivity. The first request after idle time may take 30–60
> seconds to respond while the server wakes up.

## Tech stack

| Layer | Technology |
|---|---|
| Tracking script | Vanilla JavaScript (no dependencies, no build step) |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, accessed via Mongoose |
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Hosting | Render (backend + tracker), Vercel (frontend) |

## Project structure

```
causalfunnel-analytics/
├── backend/      Express API + Mongoose models
├── frontend/     Next.js dashboard
└── tracker/      Vanilla JS tracking script + demo page
```

## Setup — running locally

### Prerequisites
- Node.js (LTS)
- A MongoDB Atlas account (free tier is sufficient), or a local MongoDB instance

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string/causalfunnel?retryWrites=true&w=majority
```

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

### 3. Tracker demo page

```bash
cd tracker
npx serve . -p 5500
```

Visit `http://localhost:5500/demo.html`, click around, and refresh the
dashboard to see the session appear.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/events` | Ingest a single event |
| `GET` | `/api/sessions` | List all sessions with event counts |
| `GET` | `/api/sessions/:sessionId/events` | Ordered event timeline for one session |
| `GET` | `/api/heatmap?page_url=...` | Click coordinates for a given page |
| `GET` | `/api/events/pages` | Distinct page URLs (used to populate the heatmap dropdown) |

## Assumptions and trade-offs

- **Session identity persists indefinitely.** The session ID is stored in
  `localStorage`, not a cookie with an expiry, so it persists across visits
  on the same browser rather than expiring after inactivity. This makes it
  closer to a long-lived visitor ID than a true time-boxed "session," which
  was a deliberate simplification for this assignment's scope.
- **Page identity ignores hash fragments and query strings.** The tracker
  normalizes `page_url` to origin + pathname, so `/demo.html`,
  `/demo.html#`, and `/demo.html?ref=x` are all treated as the same page.
  This keeps heatmap data from fragmenting across what a user would
  consider one page.
- **`x`/`y` are not conditionally required.** The schema allows them to be
  optional rather than enforcing "required if `event_type` is `click`."
  This was a conscious scope cut — a custom Mongoose validator could add
  this, but isn't necessary for the assignment's requirements.
- **CORS is fully open** (`cors()` with no origin restriction) on the
  deployed API. Fine for a demo; a production system would restrict this
  to the dashboard's actual domain.
- **The heatmap renders raw coordinates on an empty box**, not an actual
  screenshot or live render of the tracked page. The assignment explicitly
  allows "dots or simple grid," so this was kept intentionally simple.
- **No custom error boundary** for the dashboard's server-rendered pages —
  if the API is unreachable, Next.js's default error handling is used
  rather than a custom-designed fallback UI.
- **Render's free tier cold-starts.** The backend may take up to a minute
  to respond after a period of inactivity; this is a hosting trade-off,
  not an application bug.

## Possible future improvements

- Conditional schema validation for click coordinates
- A real screenshot/iframe rendering under the heatmap dots, scaled to
  viewport size
- Session expiry (true session semantics rather than persistent visitor ID)
- Restricted CORS origin in production
- Custom error and loading states throughout the dashboard
