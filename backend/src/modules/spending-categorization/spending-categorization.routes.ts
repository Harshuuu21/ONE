import { Router } from 'express';
import { CategorizationController } from './controllers/categorization.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  batchClassifySchema,
  overrideCategorySchema,
  rawTransactionInputSchema,
} from './validators/categorization.schema.js';

const router = Router();

// Category metadata endpoint
router.get('/categories', CategorizationController.listCategories);

// Categorization endpoints
router.post('/classify', validateRequest(rawTransactionInputSchema), CategorizationController.classify);
router.post('/batch-classify', validateRequest(batchClassifySchema), CategorizationController.batchClassify);

// Protected manual override endpoint
router.post('/override', requireAuth, validateRequest(overrideCategorySchema), CategorizationController.overrideCategory);

export default router;
