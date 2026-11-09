import { Router } from 'express';
import { DemoDataController } from './demo-data.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { initializeDemoDataSchema, resetDemoDataSchema } from './demo-data.validation.js';

const router = Router();

// All demo-data management endpoints require authentication
router.use(requireAuth);

router.post('/initialize', validateRequest(initializeDemoDataSchema), DemoDataController.initialize);
router.get('/status', DemoDataController.getStatus);
router.get('/summary', DemoDataController.getSummary);
router.post('/reset', validateRequest(resetDemoDataSchema), DemoDataController.reset);

export default router;
