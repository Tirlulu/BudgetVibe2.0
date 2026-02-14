import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/', categoryController.list);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.patch('/:id/active', categoryController.setActive);
router.delete('/:id', categoryController.remove);

export default router;
