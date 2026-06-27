export interface UserVerification {
  userId: string
  fullName: string
  email: string
  mobileNumber: string
  dateOfBirth: string
  identityVerified: boolean
  pan?: string
  aadhaar?: string
  updatedAt: string
}

export interface BankConnection {
  userId: string
  bankName: string
  accountMask: string // e.g., XXXXXXXX1234
  aaConnectionId: string
  status: 'pending' | 'verified' | 'failed' | 'disconnected'
  connectedAt: string
  lastSync: string
}

export interface Consent {
  userId: string
  consentId: string
  version: string
  purpose: string
  grantedAt: string
  revokedAt?: string
  status: 'active' | 'revoked'
}

export interface PermissionSettings {
  userId: string
  transactionHistory: boolean
  accountBalance: boolean
  monthlyStatements: boolean
  incomeCredits: boolean
  debitTransactions: boolean
  creditTransactions: boolean
  updatedAt: string
}

export interface AutoPayAuthorization {
  userId: string
  provider: 'upi_autopay' | 'emandate'
  mandateId?: string
  status: 'pending' | 'active' | 'failed' | 'revoked'
  authorizedAt?: string
}

export interface PrivacyPreferences {
  userId: string
  financialInsights: boolean
  transactionTracking: boolean
  investmentTracking: boolean
  loanTracking: boolean
  incomeAnalysis: boolean
  aiSpendingAnalysis: boolean
  marketingEmails: boolean
  deviceNotifications: boolean
  deviceCalendar: boolean
  updatedAt: string
}
