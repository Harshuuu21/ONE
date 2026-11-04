import { Router } from 'express';
import { AccountController } from './account.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { createAccountSchema } from './account.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', AccountController.listAccounts);
router.post('/', validateRequest(createAccountSchema), AccountController.createAccount);
router.delete('/:id', AccountController.disconnectAccount);

export default router;

