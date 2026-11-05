import {
  AAProviderMetadata,
  ConnectionInitiationResult,
  DiscoveredAccount,
  ConsentRequestResult,
} from '../../types/index.js';
import { ConsentStatus } from '@prisma/client';

export interface IAAProvider {
  /**
   * Returns metadata & display properties for this AA provider
   */
  getMetadata(): AAProviderMetadata;

  /**
   * Initiates a connection session and creates the secure hosted redirection URL
   */
  initiateConnection(params: {
    userId: string;
    userMobile: string;
    correlationId: string;
    redirectCallbackUrl: string;
  }): Promise<ConnectionInitiationResult>;

  /**
   * Discovers eligible financial accounts across integrated FIPs
   */
  discoverAccounts(params: {
    userMobile: string;
    customerHandle?: string;
    correlationId?: string;
  }): Promise<DiscoveredAccount[]>;

  /**
   * Initiates the ReBIT consent request for specified bank accounts
   */
  createConsentRequest(params: {
    customerHandle: string;
    purpose: string;
    dataTypes: string[];
    dataRangeFrom: Date;
    dataRangeTo: Date;
    fetchFrequency: string;
    validUntil: Date;
    accounts: Array<{ fipId: string; accountRefNumber: string; accountNumberMasked: string }>;
    redirectCallbackUrl: string;
  }): Promise<ConsentRequestResult>;

  /**
   * Fetches latest consent state from the AA provider
   */
  getConsentStatus(consentHandle: string): Promise<{
    consentHandle: string;
    consentId?: string;
    status: ConsentStatus;
    signedAt?: Date;
  }>;

  /**
   * Cryptographically verifies callback signatures according to provider specifications
   */
  verifyCallbackSignature(headers: Record<string, any>, rawPayload: any): boolean;
}
