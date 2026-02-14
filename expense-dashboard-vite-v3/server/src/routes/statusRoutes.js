import { Router } from 'express';
import * as statusController from '../controllers/statusController.js';

const router = Router();
router.get('/', statusController.getStatus);

export default router;
