import crypto from 'crypto';
import { IAAProvider } from '../interfaces/aa-provider.interface.js';
import {
  AAProviderMetadata,
  ConnectionInitiationResult,
  DiscoveredAccount,
  ConsentRequestResult,
} from '../../types/index.js';
import { AccountType, ConsentStatus } from '@prisma/client';

export class OneMoneyAAProvider implements IAAProvider {
  private readonly providerId = 'ONEMONEY';
  private readonly baseUrl = process.env.ONEMONEY_BASE_URL || 'https://sandbox.onemoney.in';
  private readonly clientId = process.env.ONEMONEY_CLIENT_ID || '';
  private readonly clientSecret = process.env.ONEMONEY_CLIENT_SECRET || '';

  getMetadata(): AAProviderMetadata {
    return {
      id: this.providerId,
      name: 'OneMoney (CAMS) AA',
      shortName: 'OneMoney',
      logoUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&auto=format&fit=crop&q=80',
      description: 'OneMoney Account Aggregator platform supporting over 30+ public and private banks.',
      supportedFIPsCount: 30,
      isAvailable: true,
      isSandbox: process.env.NODE_ENV !== 'production' || !this.clientId,
    };
  }

  async initiateConnection(params: {
    userId: string;
    userMobile: string;
    correlationId: string;
    redirectCallbackUrl: string;
  }): Promise<ConnectionInitiationResult> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const redirectUrl = this.clientId
      ? `${this.baseUrl}/consent-webview?session=${params.correlationId}&callback=${encodeURIComponent(params.redirectCallbackUrl)}`
      : `${process.env.CLIENT_URL || 'http://localhost:3000'}/aa-gateway?provider=${this.providerId}&correlationId=${params.correlationId}&mobile=${encodeURIComponent(params.userMobile)}`;

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
    return [
      {
        fipId: 'FIP_SBI',
        bankName: 'State Bank of India',
        bankLogoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.SAVINGS,
        accountNumberMasked: 'XXXXXXXX6534',
        accountRefNumber: `ONEMONEY_SBI_${params.userMobile.slice(-4)}_01`,
        balance: 89400.25,
      },
      {
        fipId: 'FIP_AXIS',
        bankName: 'Axis Bank',
        bankLogoUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=64&auto=format&fit=crop&q=80',
        accountType: AccountType.SAVINGS,
        accountNumberMasked: 'XXXXXXXX7723',
        accountRefNumber: `ONEMONEY_AXIS_${params.userMobile.slice(-4)}_01`,
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
    const consentHandle = `ONEMONEY_REQ_${crypto.randomBytes(12).toString('hex')}`;
    return {
      consentHandle,
      status: ConsentStatus.PENDING,
      redirectUrl: `${this.baseUrl}/webview/${consentHandle}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
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
      consentId: `ONEMONEY_CONSENT_${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      status: ConsentStatus.APPROVED,
      signedAt: new Date(),
    };
  }

  verifyCallbackSignature(headers: Record<string, any>, rawPayload: any): boolean {
    const signature = headers['x-onemoney-signature'];
    if (!this.clientSecret) return true;
    if (!signature) return false;

    const hmac = crypto
      .createHmac('sha256', this.clientSecret)
      .update(typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload))
      .digest('hex');

    return signature === hmac;
  }
}

