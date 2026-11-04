import type { LendingRequest } from '@/types';

export interface WalletStanding {
  trustCircle: number;
  activelyBacking: number;
  totalBacked: number;
  onTimeRate: number;
}

export type { LendingRequest };

