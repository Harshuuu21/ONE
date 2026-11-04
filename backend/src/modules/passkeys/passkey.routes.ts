import { Router } from 'express';
import { PasskeyController } from './passkey.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  registerOptionsSchema,
  registerVerifySchema,
  loginOptionsSchema,
  loginVerifySchema,
} from './passkey.schema.js';

const router = Router();

// Passkey Registration (requires active authenticated session)
router.post(
  '/register/options',
  requireAuth,
  validateRequest(registerOptionsSchema),
  PasskeyController.registerOptions
);

router.post(
  '/register/verify',
  requireAuth,
  validateRequest(registerVerifySchema),
  PasskeyController.registerVerify
);

// Passkey Login / Authentication (public endpoints)
router.post(
  '/login/options',
  validateRequest(loginOptionsSchema),
  PasskeyController.loginOptions
);

router.post(
  '/login/verify',
  validateRequest(loginVerifySchema),
  PasskeyController.loginVerify
);

// Passkey Management
router.get('/', requireAuth, PasskeyController.listPasskeys);
router.delete('/:id', requireAuth, PasskeyController.deletePasskey);

export default router;
