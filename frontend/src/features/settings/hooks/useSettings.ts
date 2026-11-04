'use client';

import { useState } from 'react';
import { SettingsService } from '../services/settings.service';
import type { SettingsTab, UserAccountDetails } from '../types';

export function useSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Account');
  const [account] = useState<UserAccountDetails>(SettingsService.getAccountDetails());

  return {
    activeTab,
    setActiveTab,
    account,
  };
}

