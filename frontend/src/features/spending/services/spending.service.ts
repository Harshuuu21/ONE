import { AuthApi } from '@/features/authentication/services/authApi';
import {
  CategoryCorrectionRequest,
  CategoryCorrectionResponse,
  PeriodFilter,
  SpendingCategoryMeta,
  SpendingDistributionResponse,
  SpendingSummaryResponse,
  UserMerchantMapping,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class SpendingService {
  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = AuthApi.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Fetches metadata for all 14 spending categories
   */
  static async getCategories(): Promise<SpendingCategoryMeta[]> {
    try {
      const res = await fetch(`${API_BASE}/spending/categories`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Computes category net spending distribution (S_c, S_T, P_c)
   */
  static async getDistribution(
    period: PeriodFilter = 'THIS_MONTH',
    startDate?: string,
    endDate?: string
  ): Promise<SpendingDistributionResponse | null> {
    try {
      const params = new URLSearchParams({ period });
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`${API_BASE}/spending/distribution?${params.toString()}`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
    } catch {
      // Fallback
    }
    return null;
  }

  /**
   * Computes period spending summary, savings rate, and top category
   */
  static async getSummary(
    period: PeriodFilter = 'THIS_MONTH',
    startDate?: string,
    endDate?: string
  ): Promise<SpendingSummaryResponse | null> {
    try {
      const params = new URLSearchParams({ period });
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`${API_BASE}/spending/summary?${params.toString()}`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
    } catch {
      // Fallback
    }
    return null;
  }

  /**
   * Corrects a transaction's category and optionally triggers merchant learning
   */
  static async correctCategory(
    transactionId: string,
    payload: CategoryCorrectionRequest
  ): Promise<CategoryCorrectionResponse> {
    const res = await fetch(`${API_BASE}/spending/transactions/${transactionId}/category`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update transaction category');
    }

    return json.data;
  }

  /**
   * Fetches user's confirmed merchant mappings
   */
  static async listMerchantMappings(): Promise<UserMerchantMapping[]> {
    try {
      const res = await fetch(`${API_BASE}/spending/merchant-mappings`, {
        headers: this.getHeaders(),
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Deletes a user merchant mapping rule
   */
  static async deleteMerchantMapping(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/spending/merchant-mappings/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });
    const json = await res.json();
    return Boolean(res.ok && json.success);
  }
}
