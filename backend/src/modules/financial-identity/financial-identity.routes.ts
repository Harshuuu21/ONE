import { Router } from 'express';
import { FinancialIdentityController } from './financial-identity.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  updateFinancialProfileSchema,
  completeOnboardingSchema,
} from './financial-identity.validation.js';

const router = Router();

// All financial-identity endpoints require authentication
router.use(requireAuth);

router.get('/profile', FinancialIdentityController.getProfile);
router.put('/profile', validateRequest(updateFinancialProfileSchema), FinancialIdentityController.updateProfile);
router.post('/complete', validateRequest(completeOnboardingSchema), FinancialIdentityController.completeOnboarding);
router.get('/recommendations', FinancialIdentityController.getRecommendations);

export default router;

