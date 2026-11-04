import type { Consent, PrivacyPreferences, PermissionSettings } from '@/types';

export interface ConsentRecord extends Consent {
  activeDate?: string;
}

export type { Consent, PrivacyPreferences, PermissionSettings };

