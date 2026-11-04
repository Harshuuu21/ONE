import { Router } from 'express';
import { ConsentController } from './consent.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createConsentSchema, updateConsentSchema } from './consent.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', ConsentController.listConsents);
router.post('/', validateRequest(createConsentSchema), ConsentController.grantConsent);
router.patch('/:id/status', validateRequest(updateConsentSchema), ConsentController.updateConsentStatus);

export default router;

