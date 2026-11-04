'use client';

import { useState } from 'react';
import { CommunityService } from '../services/community.service';
import type { CommunityTab, Conversation, LendingRequest } from '../types';

export function useCommunity() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
  const [feed] = useState<Conversation[]>(CommunityService.getFeed());
  const [lendingPool] = useState<LendingRequest[]>(CommunityService.getLendingRequests());

  return {
    activeTab,
    setActiveTab,
    feed,
    lendingPool,
  };
}

