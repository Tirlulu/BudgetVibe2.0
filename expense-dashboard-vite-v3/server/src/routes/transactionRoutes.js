import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { validateRequest } from '../validation/middleware/validateRequest.js';
import {
  listTransactionsQuerySchema,
  patchTransactionParamsSchema,
  patchTransactionBodySchema,
  bulkCategoryBodySchema,
} from '../validation/schemas/transactionSchemas.js';

const router = Router();

router.get(
  '/',
  validateRequest({ query: listTransactionsQuerySchema }),
  transactionController.list
);
router.delete('/', transactionController.deleteAll);
router.patch(
  '/bulk-category',
  validateRequest({ body: bulkCategoryBodySchema }),
  transactionController.bulkUpdateCategory
);
router.patch(
  '/:id',
  validateRequest({
    params: patchTransactionParamsSchema,
    body: patchTransactionBodySchema,
  }),
  transactionController.updateCategory
);

export default router;
