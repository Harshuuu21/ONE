import type { BankConnection, BankAccount } from '@/types';

export interface AccountAggregatorState {
  connectedBanks: BankConnection[];
  isConnecting: boolean;
  selectedAccountId?: string;
}

export type { BankConnection, BankAccount };

