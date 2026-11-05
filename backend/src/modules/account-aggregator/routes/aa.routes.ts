import { Router } from 'express';
import { AAController } from '../controllers/aa.controller.js';
import { requireAuth } from '../../../middleware/authMiddleware.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { initiateConnectionSchema, aaCallbackSchema } from '../validators/aa.schema.js';

const router = Router();

// Provider discovery (publicly queryable to populate provider selector)
router.get('/providers', AAController.getProviders);

// Callback endpoint for AA webhook / post-redirect notification (authenticated via cryptographic signature)
router.post('/callback', validateRequest(aaCallbackSchema), AAController.handleCallback);

// Authenticated AA session management
router.post(
  '/connections/initiate',
  requireAuth,
  validateRequest(initiateConnectionSchema),
  AAController.initiateConnection
);

router.get('/connections', requireAuth, AAController.listConnections);
router.get('/connections/:id/status', requireAuth, AAController.getConnectionStatus);

export default router;
