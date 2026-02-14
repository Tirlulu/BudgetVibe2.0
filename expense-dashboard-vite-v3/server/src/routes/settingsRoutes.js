import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = Router();
router.get('/seed', settingsController.getSeed);
router.post('/seed', settingsController.postSeed);

export default router;
