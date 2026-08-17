# AegisGuard — Anti-Bot Middleware Prototype

AegisGuard is a **MERN-stack anti-bot gateway**. It sits in front of a public digital service and analyzes interaction behavior before a request is allowed through.

This prototype is **not** a government portal. It is a middleware demonstration of three detection mechanisms:

1. Mouse movement dynamics
2. Keyboard typing dynamics
3. Invisible honeypot field

All scoring is calculated in **Node.js**. Risk scores are never hardcoded.

## Architecture

```text
USER / BOT
    │
    ▼
AegisGuard Gateway
    ├── Mouse Analysis
    ├── Keyboard Analysis
    └── Honeypot Detection
            │
            ▼
      Risk Engine (0–100)
         /         \
      ALLOW       BLOCK
        │
        ▼
 Protected Service (simulated)
```

## Stack (MERN only)

| Layer     | Technology        |
| --------- | ----------------- |
| Frontend  | React + Vite      |
| Styling   | Tailwind CSS      |
| Backend   | Node.js + Express |
| Database  | MongoDB + Mongoose |

## Project structure

```text
server/                 Express API + detection algorithms
  controllers/
  models/
  routes/
  services/             mouse, keyboard, honeypot, risk engine
  utils/statistics.js
  config/weights.js
  server.js

client/                 React middleware demo
  src/components/
  src/services/api.js
  src/utils/botSimulator.js
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

If MongoDB is unavailable, analysis still runs. Persistence is skipped and a warning is logged.

## Setup

```bash
# Backend
cd server
copy .env.example .env
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## API

| Method | Path                 | Purpose                                      |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/api/health`        | Gateway health                               |
| POST   | `/api/session/start` | Create session + dynamic honeypot field name |
| POST   | `/api/analyze`       | Run mouse + keyboard + honeypot + risk       |

`POST /api/analyze` never accepts typed key values. Only key-down / key-up timestamps are sent.

## Demo flow

1. Interact with the protected-service form (move the mouse, type).
2. Click **Continue Request** to send telemetry through the real pipeline.
3. Click **Simulate Bot** to generate mechanical mouse/keyboard data and fill the honeypot, then run the **same** backend algorithms.

## Privacy

- Actual typed characters are never sent or stored.
- Name / email form values stay in the browser.
- MongoDB stores session id, derived features, scores, and the allow/block decision only.

## Configurable weights

Edit `server/config/weights.js` or set environment variables:

- `WEIGHT_MOUSE` (default `0.40`)
- `WEIGHT_KEYBOARD` (default `0.35`)
- `WEIGHT_HONEYPOT` (default `0.25`)
- `HONEYPOT_BOOST` (default `0.25`)
- `RISK_THRESHOLD` (default `50`)
