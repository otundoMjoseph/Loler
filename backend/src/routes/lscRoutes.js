import { Router } from 'express';
import { fertility } from '../controllers/lscController.js';
const router = Router();

router.get('/fertility', fertility);

export default router;
