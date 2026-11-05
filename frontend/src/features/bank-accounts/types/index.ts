export type AccountType = 'SAVINGS' | 'CHECKING' | 'CREDIT' | 'INVESTMENT' | 'DEPOSIT';

export interface DiscoveredAccount {
  fipId: string;
  bankName: string;
  bankLogoUrl?: string;
  accountType: AccountType;
  accountNumberMasked: string;
  accountRefNumber: string;
  balance?: number;
  isAlreadyLinked?: boolean;
}

export interface LinkedBankAccount {
  id: string;
  fipId: string;
  bankName: string;
  bankLogoUrl?: string;
  accountType: AccountType;
  accountNumberMasked: string;
  accountRefNumber: string;
  currency: string;
  balance: number;
  status: 'LINKED' | 'DELINKED' | 'CONSENT_PENDING' | 'SYNC_FAILED';
  linkedAt: string;
  lastSyncedAt?: string;
}

export interface LinkedAccountsResponse {
  totalBalance: number;
  accountsCount: number;
  accounts: LinkedBankAccount[];
}
