export type SettingsTab =
  | 'Account'
  | 'Preferences'
  | 'Notifications'
  | 'Security'
  | 'Connections'
  | 'Permissions & Data';

export interface UserAccountDetails {
  name: string;
  email: string;
  reputationScore: number;
  tier: string;
  verified: boolean;
}

