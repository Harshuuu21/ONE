export interface AAProvider {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  description: string;
  supportedFIPsCount: number;
  isAvailable: boolean;
  isSandbox: boolean;
}

export interface AAInitiationResult {
  sessionId: string;
  correlationId: string;
  redirectUrl: string;
  provider: AAProvider;
  expiresAt: string;
}

export interface AAConnection {
  id: string;
  providerId: string;
  providerName: string;
  aaCustomerHandle?: string;
  status: 'PENDING' | 'ACTIVE' | 'FAILED' | 'DISCONNECTED';
  linkedAccounts?: any[];
  consents?: any[];
  updatedAt: string;
}

export type AAConnectionStatusType = 'PENDING' | 'ACTIVE' | 'FAILED' | 'DISCONNECTED';
