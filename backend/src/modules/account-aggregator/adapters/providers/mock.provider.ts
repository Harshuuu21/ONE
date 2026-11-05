import crypto from 'crypto';
import { IAAProvider } from '../interfaces/aa-provider.interface.js';
import {
  AAProviderMetadata,
  ConnectionInitiationResult,
  DiscoveredAccount,
  ConsentRequestResult,
} from '../../types/index.js';
import { AccountType, ConsentStatus } from '@prisma/client';
import { ENV } from '../../../../config/env.js';

export class MockAAProvider implements IAAProvider {
  private readonly providerId = 'SAHAMATI_MOCK';
  private readonly secretKey = 'mock_aa_signature_secret_key';

  getMetadata(): AAProviderMetadata {
    return {
      id: this.providerId,
      name: 'Sahamati AA Sandbox',
      shortName: 'Sahamati Sandbox',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      description: 'Official RBI-ReBIT compliant Account Aggregator testing sandbox for simulated multi-bank linking.',
      supportedFIPsCount: 28,
      isAvailable: true,
      isSandbox: true,
    };
  }

  async initiateConnection(params: {
    userId: string;
    userMobile: string;
    correlationId: string;
    redirectCallbackUrl: string;
  }): Promise<ConnectionInitiationResult> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes session

    // Hosted web redirection URL pointing to ONE's client AA gateway handler
    const redirectUrl = `${ENV.CLIENT_URL}/aa-gateway?provider=${this.providerId}&correlationId=${params.correlationId}&mobile=${encodeURIComponent(params.userMobile)}`;

    return {
      correlationId: params.correlationId,
      redirectUrl,
      expiresAt,
      providerId: this.providerId,
    };
  }

  async discoverAccounts(params: {
    userMobile: string;
    customerHandle?: string;
    correlationId?: string;
  }): Promise<DiscoveredAccount[]> {
    // Return realistic multi-bank accounts mapped to the mobile number
    // Clean, masked representation per RBI/ReBIT guidelines
    return [
      {
        fipId: 'FIP_HDFC',
        bankName: 'HDFC Bank',
        bankLogoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.SAVINGS,
        accountNumberMasked: 'XXXXXXXX4091',
        accountRefNumber: `HDFC_ACC_${params.userMobile.slice(-4)}_01`,
        balance: 142580.50,
      },
      {
        fipId: 'FIP_HDFC',
        bankName: 'HDFC Bank',
        bankLogoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.CHECKING,
        accountNumberMasked: 'XXXXXXXX9210',
        accountRefNumber: `HDFC_ACC_${params.userMobile.slice(-4)}_02`,
        balance: 45020.00,
      },
      {
        fipId: 'FIP_SBI',
        bankName: 'State Bank of India',
        bankLogoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.SAVINGS,
        accountNumberMasked: 'XXXXXXXX6534',
        accountRefNumber: `SBI_ACC_${params.userMobile.slice(-4)}_01`,
        balance: 89400.25,
      },
      {
        fipId: 'FIP_ICICI',
        bankName: 'ICICI Bank',
        bankLogoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.SAVINGS,
        accountNumberMasked: 'XXXXXXXX1182',
        accountRefNumber: `ICICI_ACC_${params.userMobile.slice(-4)}_01`,
        balance: 230150.00,
      },
      {
        fipId: 'FIP_AXIS',
        bankName: 'Axis Bank',
        bankLogoUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.SAVINGS,
        accountNumberMasked: 'XXXXXXXX7723',
        accountRefNumber: `AXIS_ACC_${params.userMobile.slice(-4)}_01`,
        balance: 62780.80,
      },
    ];
  }

  async createConsentRequest(params: {
    customerHandle: string;
    purpose: string;
    dataTypes: string[];
    dataRangeFrom: Date;
    dataRangeTo: Date;
    fetchFrequency: string;
    validUntil: Date;
    accounts: Array<{ fipId: string; accountRefNumber: string; accountNumberMasked: string }>;
    redirectCallbackUrl: string;
  }): Promise<ConsentRequestResult> {
    const consentHandle = `MOCK_REQ_${crypto.randomBytes(12).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    return {
      consentHandle,
      status: ConsentStatus.PENDING,
      redirectUrl: `${ENV.CLIENT_URL}/aa-gateway/consent?handle=${consentHandle}`,
      expiresAt,
    };
  }

  async getConsentStatus(consentHandle: string): Promise<{
    consentHandle: string;
    consentId?: string;
    status: ConsentStatus;
    signedAt?: Date;
  }> {
    return {
      consentHandle,
      consentId: `MOCK_CONSENT_${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      status: ConsentStatus.APPROVED,
      signedAt: new Date(),
    };
  }

  verifyCallbackSignature(headers: Record<string, any>, rawPayload: any): boolean {
    const signature = headers['x-aa-signature'] || headers['x-jws-signature'];
    if (!signature) {
      // In mock development, allow if explicitly set to test mode
      return true;
    }
    const expected = crypto
      .createHmac('sha256', this.secretKey)
      .update(typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload))
      .digest('hex');
    return signature === expected || signature === 'valid_mock_signature';
  }
}

