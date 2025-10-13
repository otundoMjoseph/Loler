# LOLER

LOLER is a full-stack soil intelligence demo: React + MapLibre frontend and Node.js + MongoDB backend with GridFS caching, weekly refresh, and PNG/TIFF streaming.

## Quick Start (Docker recommended)

```bash
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:8000

> Ensure Docker is installed. The compose file also launches MongoDB.

## Quick Start (Local dev without Docker)

Backend:
```bash
cd backend
cp .env.example .env   # edit values as needed
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Features
- Sentinel/ISDA integration points (mock GEE tile URLs, easy to swap to real ones)
- MongoDB GridFS caching of GeoTIFF + PNG previews
- `/gee/png/:id` and `/gee/tiff/:id` streaming routes
- Weekly refresh scheduler (cron) with configurable interval
- Clean React MapLibre UI with layer toggles

---

**Note:** The GEE URLs are placeholders. Replace `GEE_API` and implement real auth/tile URLs in `backend/src/services/geeService.js` when you have your project + tokens.
