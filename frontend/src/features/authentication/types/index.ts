// Clean Domain Types for ONE Authentication & Passkey Architecture

export interface AuthUser {
  id: string;
  mobileNumber: string;
  firstName?: string | null;
  lastName?: string | null;
  isMobileVerified: boolean;
  onboardingStep: string;
  reputationScore: number;
  reputationTitle: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OtpRequestResponse {
  mobileNumber: string;
  expiresInSeconds: number;
  cooldownSeconds: number;
  devMockOtp?: string;
}

export interface OtpVerifyResponse {
  user: AuthUser;
  isNewUser: boolean;
  hasPasskey: boolean;
  nextStep: 'PASSKEY_LOGIN' | 'AA_ONBOARDING' | 'PASSKEY_REGISTRATION' | 'DASHBOARD';
  tokens: AuthTokens;
}

export interface IdentifyResponse {
  exists: boolean;
  hasPasskey: boolean;
  mobileNumber: string;
  userId?: string;
  firstName?: string | null;
}

export type AuthFlowStep = 
  | 'MOBILE_INPUT'
  | 'OTP_INPUT'
  | 'PASSKEY_PROMPT'
  | 'PASSKEY_REGISTER'
  | 'RECOVERY';
