# CausalFunnel Analytics

A lightweight, self-contained web analytics and session tracking platform. This project captures user interactions (page views and button/link clicks) on any webpage, aggregates them into sessions, and visualizes them on a dashboard featuring user journey timelines and page click heatmaps.

## 🔗 Live Deployments

* **Frontend Dashboard (Vercel):** `[Vercel Production URL]`
* **Backend API (Render):** `https://causalfunnel-analytics-ib1b.onrender.com`
* **Static Sandbox Demo:** `https://causalfunnel-analytics-ib1b.onrender.com/demo.html`
* **Telemetry Script:** `https://causalfunnel-analytics-ib1b.onrender.com/tracker.js`

---

## 🛠 Technology Stack

### 1. Tracker (`tracker/`)
* **Vanilla JavaScript:** Embedded on the client site with zero dependencies, wrapped inside an IIFE (Immediately Invoked Function Expression) to protect the host global namespace.
* **Telemetry API:** Utilizes standard browser APIs (`fetch` with keep-alive, viewport sizing, and event listener hooks).

### 2. Backend (`backend/`)
* **Node.js & Express:** Lightweight routing framework.
* **Mongoose & MongoDB Atlas:** Remote document-based storage for events data, using basic indexing and compound keys.

### 3. Frontend Dashboard (`frontend/`)
* **Next.js (App Router):** Modern React framework utilising **Server Components** for fast, server-rendered session summaries, and **Client Components** for interactive components (timelines and canvas plotting).
* **Tailwind CSS:** Responsive, utility-first styling.

---

## 🚀 Setup & Execution

### Prerequisites
* Ensure **Node.js (v18+)** is installed.
* Retrieve a MongoDB Atlas Connection URI.

### 1. Backend Server Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a configuration file `backend/.env` containing:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_atlas_connection_uri
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 2. Next.js Dashboard Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local environment file `frontend/.env.local` containing:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
4. Run the frontend server:
   ```bash
   npm run dev
   ```
5. View the dashboard at [http://localhost:3000](http://localhost:3000).

### 3. Static Tracker Server (Demo)
1. Navigate to the tracker directory:
   ```bash
   cd ../tracker
   ```
2. Run the static file server to serve the tracker sandbox:
   ```bash
   npx serve . -p 5500
   ```
3. Visit [http://localhost:5500/demo.html](http://localhost:5500/demo.html) in your browser and click on buttons/links to generate tracking data.

*Alternatively, you can visit the publicly hosted demo sandbox directly on Render at: [https://causalfunnel-analytics-ib1b.onrender.com/demo.html](https://causalfunnel-analytics-ib1b.onrender.com/demo.html)*

---

## 🧠 Design Decisions & Trade-offs

* **CORS Port Adjustments (Mac Specific):** The backend default port was moved from `5000` to `5001`. On macOS, system-level processes (`ControlCenter`/AirPlay Receiver) bind to port 5000 by default, which blocks Node applications. Moving to port `5001` resolved this conflict seamlessly.
* **URL Normalization in Tracker:** To prevent a single page's analytics from fragmenting into multiple buckets (e.g. `demo.html`, `demo.html#`, and `demo.html?ref=email` appearing as separate pages), the tracker sanitizes the URL via `window.location.origin + window.location.pathname` before posting events. This groups scroll fragment clicks together under a unified path.
* **Deterministic Locale Date-times:** To solve React hydration warnings where dates rendered on the Node server (e.g., US locale) did not match the client's locale format, we explicitly pinned the locale configuration in `toLocaleString()` calls to `'en-GB'`.
* **Fail-Safe Client Ingestion:** The tracker script wraps network requests in a `.catch()` block to log failures without throwing unhandled exceptions. In an analytics setting, a failed tracking call should never interfere with or crash the host website's primary features (e.g., a checkout flow).
* **Simplified Heatmap Plotting:** The heatmap overlay is plotted on a relative-positioned gray box canvas directly mapping the `x` and `y` coordinate pairs, rather than embedding complex viewport tracking iframes.
