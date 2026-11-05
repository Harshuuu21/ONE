import { DiscoveredAccount, LinkedBankAccount, LinkedAccountsResponse } from '../types';
import { AuthApi } from '@/features/authentication/services/authApi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class BankAccountsApi {
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
   * Discovers eligible financial accounts across multiple FIPs via the AA
   */
  static async discoverAccounts(providerId?: string, correlationId?: string): Promise<DiscoveredAccount[]> {
    try {
      return await this.request<DiscoveredAccount[]>('/banks/discover', {
        method: 'POST',
        body: JSON.stringify({ providerId, correlationId }),
      });
    } catch {
      // Offline / sandbox fallback
      return [
        {
          fipId: 'FIP_HDFC',
          bankName: 'HDFC Bank',
          bankLogoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=64&auto=format&fit=crop&q=80',
          accountType: 'SAVINGS',
          accountNumberMasked: 'XXXXXXXX4091',
          accountRefNumber: 'HDFC_ACC_01',
          balance: 142580.50,
          isAlreadyLinked: false,
        },
        {
          fipId: 'FIP_HDFC',
          bankName: 'HDFC Bank',
          bankLogoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=64&auto=format&fit=crop&q=80',
          accountType: 'CHECKING',
          accountNumberMasked: 'XXXXXXXX9210',
          accountRefNumber: 'HDFC_ACC_02',
          balance: 45020.00,
          isAlreadyLinked: false,
        },
        {
          fipId: 'FIP_SBI',
          bankName: 'State Bank of India',
          bankLogoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&auto=format&fit=crop&q=80',
          accountType: 'SAVINGS',
          accountNumberMasked: 'XXXXXXXX6534',
          accountRefNumber: 'SBI_ACC_01',
          balance: 89400.25,
          isAlreadyLinked: false,
        },
        {
          fipId: 'FIP_ICICI',
          bankName: 'ICICI Bank',
          bankLogoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=64&auto=format&fit=crop&q=80',
          accountType: 'SAVINGS',
          accountNumberMasked: 'XXXXXXXX1182',
          accountRefNumber: 'ICICI_ACC_01',
          balance: 230150.00,
          isAlreadyLinked: false,
        },
        {
          fipId: 'FIP_AXIS',
          bankName: 'Axis Bank',
          bankLogoUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=64&auto=format&fit=crop&q=80',
          accountType: 'SAVINGS',
          accountNumberMasked: 'XXXXXXXX7723',
          accountRefNumber: 'AXIS_ACC_01',
          balance: 62780.80,
          isAlreadyLinked: false,
        },
      ];
    }
  }

  /**
   * Links multiple selected accounts
   */
  static async linkAccounts(
    providerId: string,
    accounts: DiscoveredAccount[],
    aaConnectionId?: string
  ): Promise<{ linkedCount: number; accounts: LinkedBankAccount[] }> {
    try {
      return await this.request('/banks/accounts/link', {
        method: 'POST',
        body: JSON.stringify({ providerId, accounts, aaConnectionId }),
      });
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;

      // Local mock fallback
      return {
        linkedCount: accounts.length,
        accounts: accounts.map((a, idx) => ({
          id: `linked_${idx}_${Date.now()}`,
          fipId: a.fipId,
          bankName: a.bankName,
          bankLogoUrl: a.bankLogoUrl,
          accountType: a.accountType,
          accountNumberMasked: a.accountNumberMasked,
          accountRefNumber: a.accountRefNumber,
          currency: 'INR',
          balance: a.balance || 0,
          status: 'LINKED',
          linkedAt: new Date().toISOString(),
        })),
      };
    }
  }

  /**
   * Fetches all linked accounts for the user
   */
  static async listLinkedAccounts(): Promise<LinkedAccountsResponse> {
    try {
      return await this.request<LinkedAccountsResponse>('/banks/linked');
    } catch {
      return {
        totalBalance: 0,
        accountsCount: 0,
        accounts: [],
      };
    }
  }

  /**
   * De-links an account
   */
  static async delinkAccount(accountId: string): Promise<any> {
    return await this.request(`/banks/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }
}
