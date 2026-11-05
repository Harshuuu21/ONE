import { Router } from 'express';
import { BankAccountsController } from './bank-accounts.controller.js';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { discoverAccountsSchema, linkAccountsSchema } from './bank-accounts.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/discover', validateRequest(discoverAccountsSchema), BankAccountsController.discoverAccounts);
router.get('/linked', BankAccountsController.listLinkedAccounts);
router.post('/accounts/link', validateRequest(linkAccountsSchema), BankAccountsController.linkAccounts);
router.delete('/accounts/:id', BankAccountsController.delinkAccount);

export default router;
