export type ConsentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED' | 'PAUSED';

export type ConsentEventType =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'PAUSED'
  | 'RESUMED';

export interface ConsentEvent {
  id: string;
  consentId: string;
  eventType: ConsentEventType;
  actor: string;
  reason?: string;
  createdAt: string;
  payload?: Record<string, any>;
}

export interface ConsentRecord {
  id: string;
  consentHandle: string;
  consentId?: string;
  purpose: string;
  dataTypes: string[];
  status: ConsentStatus;
  dataRangeFrom: string;
  dataRangeTo: string;
  fetchFrequency: string;
  validUntil: string;
  accounts: string[];
  grantedAt?: string;
  revokedAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
  events?: ConsentEvent[];
  aaConnection?: {
    id: string;
    providerName: string;
    providerId: string;
  };
}

export interface RequestConsentParams {
  providerId: string;
  purpose?: string;
  dataTypes?: string[];
  dataRangeFrom?: string;
  dataRangeTo?: string;
  fetchFrequency?: string;
  durationDays?: number;
  accountIds: string[];
}

export interface RequestConsentResponse {
  consentId: string;
  consentHandle: string;
  status: ConsentStatus;
  redirectUrl: string;
  validUntil: string;
}
