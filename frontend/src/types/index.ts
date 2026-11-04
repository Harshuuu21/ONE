// Centralized Shared Types for ONE Application
import { trip } from '@/lib/one-data';

export type Trip = typeof trip;

export type {
  Insight,
  PillarId,
  Goal,
  LendingRequest,
  CalendarEvent,
  Transaction,
  Conversation,
} from '@/lib/one-data';

export type {
  UserVerification,
  BankConnection,
  Consent,
  PrivacyPreferences,
  PermissionSettings,
  AutoPayAuthorization,
} from '@/lib/firebase-models';

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  accountType?: 'savings' | 'checking';
  balance?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

export interface UserProfile {
  name: string;
  firstName: string;
  email?: string;
  joinedYear: number;
  reputationTitle: string;
  reputationScore: number;
}
