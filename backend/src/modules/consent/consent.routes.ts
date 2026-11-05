import { Router } from 'express';
import { ConsentController } from './consent.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { requestConsentSchema, consentCallbackSchema } from './consent.schema.js';

const router = Router();

// Callback endpoint (authenticated via cryptographic signature)
router.post('/callback', validateRequest(consentCallbackSchema), ConsentController.handleCallback);

// Authenticated Consent Endpoints
router.use(requireAuth);

router.post('/request', validateRequest(requestConsentSchema), ConsentController.requestConsent);
router.get('/', ConsentController.listConsents);
router.get('/:id', ConsentController.getConsent);
router.post('/:id/revoke', ConsentController.revokeConsent);

export default router;
