import { Router } from 'express';
import * as expensesController from '../controllers/expensesController.js';

const router = Router();

router.get('/recurring', expensesController.getRecurring);

export default router;
