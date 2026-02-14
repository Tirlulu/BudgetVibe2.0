import { Router } from 'express';
import * as importController from '../controllers/importController.js';

const router = Router();

router.get('/health', importController.getHealth);
router.post(
  '/credit-card',
  importController.uploadMiddleware,
  importController.handleMulterError,
  importController.postCreditCard
);
router.patch('/transactions/:id/category', importController.patchTransactionCategory);

export default router;
