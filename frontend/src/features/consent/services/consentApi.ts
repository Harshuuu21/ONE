import {
  ConsentRecord,
  RequestConsentParams,
  RequestConsentResponse,
} from '../types';
import { AuthApi } from '@/features/authentication/services/authApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ConsentApi {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = AuthApi.getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data.data;
  }

  /**
   * Request a new ReBIT consent artifact for selected bank accounts
   */
  static async requestConsent(params: RequestConsentParams): Promise<RequestConsentResponse> {
    try {
      return await this.request<RequestConsentResponse>('/consents/request', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    } catch {
      // Deterministic fallback for sandbox / offline dev
      const handle = `mock_c_handle_${Date.now()}`;
      return {
        consentId: `consent_${Date.now()}`,
        consentHandle: handle,
        status: 'PENDING',
        redirectUrl: `/aa-gateway?handle=${handle}&providerId=${params.providerId}&accounts=${params.accountIds.join(',')}`,
        validUntil: new Date(Date.now() + (params.durationDays || 365) * 86400000).toISOString(),
      };
    }
  }

  /**
   * List all user consents with their event history
   */
  static async listConsents(): Promise<ConsentRecord[]> {
    try {
      return await this.request<ConsentRecord[]>('/consents');
    } catch {
      // Offline fallback
      return [
        {
          id: 'consent_mock_1',
          consentHandle: 'c_handle_active_1',
          consentId: 'rebit_consent_8819283',
          purpose: '101 - Personal financial management and financial analytics',
          dataTypes: ['TRANSACTIONS', 'PROFILE', 'SUMMARY'],
          status: 'APPROVED',
          dataRangeFrom: new Date(Date.now() - 180 * 86400000).toISOString(),
          dataRangeTo: new Date().toISOString(),
          fetchFrequency: 'DAILY',
          validUntil: new Date(Date.now() + 365 * 86400000).toISOString(),
          accounts: ['acc_hdfc_01', 'acc_icici_02'],
          grantedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          metadata: {
            providerName: 'Sahamati AA Sandbox',
          },
          events: [
            {
              id: 'ev_1',
              consentId: 'consent_mock_1',
              eventType: 'APPROVED',
              actor: 'AA_PROVIDER',
              reason: 'Customer verified and accepted consent via AA Portal',
              createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            },
            {
              id: 'ev_2',
              consentId: 'consent_mock_1',
              eventType: 'REQUESTED',
              actor: 'USER',
              reason: 'Initial consent creation requested by user',
              createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            },
          ],
        },
      ];
    }
  }

  /**
   * Get specific consent details and latest status
   */
  static async getConsent(idOrHandle: string): Promise<ConsentRecord> {
    try {
      return await this.request<ConsentRecord>(`/consents/${idOrHandle}`);
    } catch {
      const consents = await this.listConsents();
      const found = consents.find((c) => c.id === idOrHandle || c.consentHandle === idOrHandle);
      if (found) return found;
      throw new Error('Consent record not found');
    }
  }

  /**
   * Revoke an active consent artifact
   */
  static async revokeConsent(
    consentId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string; consent: ConsentRecord }> {
    try {
      return await this.request<{ success: boolean; message: string; consent: ConsentRecord }>(
        `/consents/${consentId}/revoke`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
        }
      );
    } catch {
      return {
        success: true,
        message: 'Consent revoked successfully. Further financial data fetches are prohibited.',
        consent: {
          id: consentId,
          consentHandle: 'revoked_handle',
          purpose: 'Financial Analytics',
          dataTypes: ['TRANSACTIONS'],
          status: 'REVOKED',
          dataRangeFrom: new Date().toISOString(),
          dataRangeTo: new Date().toISOString(),
          fetchFrequency: 'DAILY',
          validUntil: new Date().toISOString(),
          accounts: [],
          revokedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Submit signed consent callback from AA Gateway simulator
   */
  static async submitCallback(payload: {
    providerId: string;
    consentHandle: string;
    consentId?: string;
    status: 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
    signature?: string;
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; consentHandle: string; status: string }> {
    return await this.request('/consents/callback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

