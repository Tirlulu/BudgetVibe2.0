import { Router } from 'express';
import * as resetController from '../controllers/resetController.js';

const router = Router();
router.post('/', resetController.postResetData);

export default router;
