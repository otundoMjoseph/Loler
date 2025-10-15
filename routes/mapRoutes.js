import express from 'express'; import { getMapData } from '../controllers/mapController.js'; const router = express.Router(); router.post('/get-map-data', getMapData); export default router;
