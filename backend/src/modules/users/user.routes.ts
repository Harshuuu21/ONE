import { Router } from 'express';
import { UserController } from './user.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { updateUserSchema } from './user.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/profile', UserController.getProfile);
router.patch('/profile', validateRequest(updateUserSchema), UserController.updateProfile);

export default router;

