import { Router } from 'express';
import * as expensesController from '../controllers/expensesController.js';
import { validateRequest } from '../validation/middleware/validateRequest.js';
import { getRecurringQuerySchema } from '../validation/schemas/expensesSchemas.js';

const router = Router();

router.get('/recurring', validateRequest({ query: getRecurringQuerySchema }), expensesController.getRecurring);

export default router;
