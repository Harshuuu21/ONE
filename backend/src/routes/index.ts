import { Router } from 'express';
import authRoutes from '../modules/authentication/auth.routes.js';
import passkeyRoutes from '../modules/passkeys/passkey.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import accountRoutes from '../modules/accounts/account.routes.js';
import transactionRoutes from '../modules/transactions/transaction.routes.js';
import goalRoutes from '../modules/goals/goal.routes.js';
import tripRoutes from '../modules/trips/trip.routes.js';
import communityRoutes from '../modules/community/community.routes.js';
import consentRoutes from '../modules/consent/consent.routes.js';

const router = Router();

// Primary Authentication & Passkey WebAuthn
router.use('/auth/passkey', passkeyRoutes);
router.use('/auth', authRoutes);

// Protected Domain Modules
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/goals', goalRoutes);
router.use('/trips', tripRoutes);
router.use('/community', communityRoutes);
router.use('/consent', consentRoutes);

export default router;
