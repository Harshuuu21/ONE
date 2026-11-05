import { Router } from 'express';
import { AuthenticationController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { requestOtpSchema, verifyOtpSchema, refreshTokenSchema } from './auth.schema.js';
import { otpRequestLimiter, otpVerifyLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Mobile & OTP
router.post(
  '/otp/request',
  otpRequestLimiter,
  validateRequest(requestOtpSchema),
  AuthenticationController.requestOtp
);
router.post(
  '/otp/verify',
  otpVerifyLimiter,
  validateRequest(verifyOtpSchema),
  AuthenticationController.verifyOtp
);
router.post('/identify', AuthenticationController.identify);

// Sessions
router.post('/refresh', validateRequest(refreshTokenSchema), AuthenticationController.refreshToken);
router.post('/logout', AuthenticationController.logout);
router.post('/logout-all', requireAuth, AuthenticationController.logoutAll);
router.get('/sessions', requireAuth, AuthenticationController.listSessions);

export default router;

