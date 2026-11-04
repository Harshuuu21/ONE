import type { BankConnection, AutoPayAuthorization } from '@/types';

export interface BankAccountDetails {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  accountType: 'savings' | 'checking';
  balance: number;
}

export type { BankConnection, AutoPayAuthorization };

