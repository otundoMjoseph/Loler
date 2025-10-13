# LOLER Backend

Node.js + Express + MongoDB (GridFS) backend for LOLER.

## Run (local)

```bash
cp .env.example .env
npm install
npm run dev
```

## Endpoints

- `GET /gee/layer?lat=&lon=&type=moisture|flood|fertility`
- `GET /gee/png/:id`
- `GET /gee/tiff/:id`
- `GET /lsc/fertility?lat=&lon=`
- `GET /meta/health`

## Notes
- GEE tile URL is a placeholder. Integrate real GEE map endpoints + auth.
- GridFS stores PNG/TIFF; TTL deletes old tiles beyond `CACHE_DAYS`.
