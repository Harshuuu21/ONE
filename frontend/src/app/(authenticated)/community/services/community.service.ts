import { conversations, lendingRequests } from '@/lib/one-data';
import type { Conversation, LendingRequest } from '../types';

export class CommunityService {
  static getFeed(): Conversation[] {
    return conversations;
  }

  static getLendingRequests(): LendingRequest[] {
    return lendingRequests;
  }

  static async submitBorrowRequest(amount: number, purpose: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400));
    return true;
  }
}

