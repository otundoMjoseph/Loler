import { Router } from 'express';
import { getLayer, streamPng, streamTiff } from '../controllers/geeController.js';
const router = Router();

router.get('/layer', getLayer);
router.get('/png/:id', streamPng);
router.get('/tiff/:id', streamTiff);

export default router;
