import { Router } from 'express';
import * as importController from '../controllers/importController.js';
import { validateRequest } from '../validation/middleware/validateRequest.js';
import {
  patchTransactionCategoryParamsSchema,
  patchTransactionCategoryBodySchema,
} from '../validation/schemas/importSchemas.js';

const router = Router();

router.get('/health', importController.getHealth);
router.post(
  '/credit-card',
  importController.uploadMiddleware,
  importController.handleMulterError,
  importController.postCreditCard
);
router.patch(
  '/transactions/:id/category',
  validateRequest({
    params: patchTransactionCategoryParamsSchema,
    body: patchTransactionCategoryBodySchema,
  }),
  importController.patchTransactionCategory
);

export default router;
