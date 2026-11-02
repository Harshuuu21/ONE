'use client';

import { useState } from 'react';
import { WalletService } from '../services/wallet.service';
import type { WalletStanding, LendingRequest } from '../types';

export function useWallet() {
  const [standing] = useState<WalletStanding>(WalletService.getStanding());
  const [requests] = useState<LendingRequest[]>(WalletService.getLendingRequests());
  const [selectedRequest, setSelectedRequest] = useState<LendingRequest | null>(null);

  return {
    standing,
    requests,
    selectedRequest,
    setSelectedRequest,
  };
}

