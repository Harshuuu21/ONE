import { lendingRequests, lendingYou } from '@/lib/one-data';
import type { WalletStanding, LendingRequest } from '../types';

export class WalletService {
  static getStanding(): WalletStanding {
    return lendingYou;
  }

  static getLendingRequests(): LendingRequest[] {
    return lendingRequests;
  }

  static async backRequest(requestId: string, amount: number): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400));
    return true;
  }
}

