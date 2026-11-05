import { Router } from 'express';
import authRoutes from '../modules/authentication/auth.routes.js';
import passkeyRoutes from '../modules/passkeys/passkey.routes.js';
import aaRoutes from '../modules/account-aggregator/routes/aa.routes.js';
import bankAccountsRoutes from '../modules/bank-accounts/bank-accounts.routes.js';
import consentRoutes from '../modules/consent/consent.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import accountRoutes from '../modules/accounts/account.routes.js';
import transactionRoutes from '../modules/transactions/transaction.routes.js';
import goalRoutes from '../modules/goals/goal.routes.js';
import tripRoutes from '../modules/trips/trip.routes.js';
import communityRoutes from '../modules/community/community.routes.js';

const router = Router();

// Primary Authentication & Passkey WebAuthn
router.use('/auth/passkey', passkeyRoutes);
router.use('/auth', authRoutes);

// Account Aggregator (AA), Bank Linking, & Consent Management
router.use('/aa', aaRoutes);
router.use('/banks', bankAccountsRoutes);
router.use('/consents', consentRoutes);
router.use('/consent', consentRoutes); // Alias for compatibility

// Protected Financial Domain Modules
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/goals', goalRoutes);
router.use('/trips', tripRoutes);
router.use('/community', communityRoutes);

export default router;
