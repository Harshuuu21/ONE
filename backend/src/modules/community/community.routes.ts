import { Router } from 'express';
import { CommunityController } from './community.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createLendingRequestSchema, contributeLendingSchema } from './community.schema.js';

const router = Router();

router.get('/pool', CommunityController.listPoolRequests);
router.post('/request', requireAuth, validateRequest(createLendingRequestSchema), CommunityController.createRequest);
router.post('/request/:id/contribute', requireAuth, validateRequest(contributeLendingSchema), CommunityController.contribute);

export default router;

