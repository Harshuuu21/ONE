import { AccountType, ConsentStatus, LinkedAccountStatus } from '@prisma/client';

export interface AAProviderMetadata {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  description: string;
  supportedFIPsCount: number;
  isAvailable: boolean;
  isSandbox: boolean;
}

export interface DiscoveredAccount {
  fipId: string;
  bankName: string;
  bankLogoUrl?: string;
  accountType: AccountType;
  accountNumberMasked: string;
  accountRefNumber: string;
  balance?: number;
}

export interface ConnectionInitiationResult {
  correlationId: string;
  redirectUrl: string;
  expiresAt: Date;
  providerId: string;
}

export interface ConsentRequestParams {
  userId: string;
  providerId: string;
  customerHandle?: string;
  purpose: string;
  dataTypes: string[];
  dataRangeFrom: Date;
  dataRangeTo: Date;
  fetchFrequency: string;
  validUntil: Date;
  accountIds: string[];
}

export interface ConsentRequestResult {
  consentHandle: string;
  status: ConsentStatus;
  redirectUrl?: string;
  expiresAt: Date;
}

export interface CallbackPayload {
  providerId: string;
  correlationId?: string;
  consentHandle?: string;
  consentId?: string;
  status: string;
  timestamp: string;
  accounts?: DiscoveredAccount[];
  metadata?: Record<string, any>;
}
