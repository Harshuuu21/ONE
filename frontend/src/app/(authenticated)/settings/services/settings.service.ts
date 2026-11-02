import { user } from '@/lib/one-data';
import type { UserAccountDetails } from '../types';

export class SettingsService {
  static getAccountDetails(): UserAccountDetails {
    return {
      name: user.name,
      email: 'maya@example.com',
      reputationScore: user.reputationScore,
      tier: 'Tier 1',
      verified: true,
    };
  }

  static async updatePreferences(data: Record<string, any>): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300));
    return true;
  }
}

