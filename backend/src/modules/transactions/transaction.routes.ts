import { Router } from 'express';
import { TransactionController } from './transaction.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createTransactionSchema } from './transaction.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', TransactionController.listTransactions);
router.post('/', validateRequest(createTransactionSchema), TransactionController.createTransaction);

export default router;

