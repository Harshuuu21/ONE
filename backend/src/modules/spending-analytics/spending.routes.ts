import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { SpendingController } from './controllers/spending.controller.js';
import {
  categoryCorrectionSchema,
  createMerchantMappingSchema,
  deleteMerchantMappingSchema,
  spendingDistributionSchema,
  spendingSummarySchema,
  spendingTransactionsSchema,
} from './spending-analytics.schema.js';

const router = Router();

// 1. List All Configured Spending Categories (Public / Protected metadata)
router.get('/categories', SpendingController.listCategories);

// 2. Spending Analytics Distribution & Visual Breakdown
router.get(
  '/distribution',
  requireAuth,
  validateRequest(spendingDistributionSchema),
  SpendingController.getDistribution
);

// 2b. Development-Only Demo Spending Data Regeneration
router.post(
  '/demo/regenerate',
  requireAuth,
  SpendingController.regenerateDemoData
);

// 3. Top-Level Spending & Savings Financial Summary
router.get(
  '/summary',
  requireAuth,
  validateRequest(spendingSummarySchema),
  SpendingController.getSummary
);

// 4. Period Filtered Spending Transactions
router.get(
  '/transactions',
  requireAuth,
  validateRequest(spendingTransactionsSchema),
  SpendingController.getTransactions
);

// 5. User Category Correction & Merchant Learning
router.patch(
  '/transactions/:id/category',
  requireAuth,
  validateRequest(categoryCorrectionSchema),
  SpendingController.correctCategory
);

// 6. Merchant Information & Custom Mapping Details
router.get(
  '/merchant/:id',
  requireAuth,
  SpendingController.getMerchantDetails
);

// 7. User-Specific Merchant Learning Mappings CRUD
router.get(
  '/merchant-mappings',
  requireAuth,
  SpendingController.listMerchantMappings
);

router.post(
  '/merchant-mappings',
  requireAuth,
  validateRequest(createMerchantMappingSchema),
  SpendingController.createMerchantMapping
);

router.delete(
  '/merchant-mappings/:id',
  requireAuth,
  validateRequest(deleteMerchantMappingSchema),
  SpendingController.deleteMerchantMapping
);

export default router;
