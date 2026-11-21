export type SpendingCategory =
  | 'INVESTMENT'
  | 'MEDICINE'
  | 'FOOD'
  | 'GROCERIES'
  | 'PETROL'
  | 'SHOPPING'
  | 'SUBSCRIPTION'
  | 'TRANSPORT'
  | 'OUTING'
  | 'BILLS_UTILITIES'
  | 'EDUCATION'
  | 'RENT'
  | 'INSURANCE'
  | 'MISCELLANEOUS';

export type PeriodFilter =
  | 'THIS_WEEK'
  | 'THIS_MONTH'
  | 'LAST_MONTH'
  | 'LAST_3_MONTHS'
  | 'THIS_YEAR'
  | 'CUSTOM';

export interface SpendingCategoryMeta {
  id: SpendingCategory;
  displayName: string;
  description: string;
  icon: string;
  chartColor: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CategorySpendingItem {
  categoryId: SpendingCategory;
  displayName: string;
  icon: string;
  chartColor: string;
  grossSpend: number;
  refunds: number;
  netSpend: number;
  percentage: number;
  transactionCount: number;
}

export interface SpendingDistributionResponse {
  period: PeriodFilter;
  startDate: string;
  endDate: string;
  totalNetSpend: number;
  totalIncome: number;
  totalTransactions: number;
  categories: CategorySpendingItem[];
}

export interface SpendingSummaryResponse {
  period: PeriodFilter;
  startDate: string;
  endDate: string;
  totalSpend: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number;
  topCategory: {
    categoryId: SpendingCategory;
    displayName: string;
    amount: number;
    percentage: number;
  } | null;
  averageDailySpend: number;
  eligibleTransactionCount: number;
}

export interface CategoryCorrectionRequest {
  newCategory: SpendingCategory;
  rememberMerchantMapping?: boolean;
}

export interface CategoryCorrectionResponse {
  transactionId: string;
  previousCategory: string;
  originalPredictedCategory: string;
  finalCategory: SpendingCategory;
  isManuallyCorrected: boolean;
  correctionTimestamp: string;
  merchantMappingCreated: boolean;
  merchantIdentifier?: string;
  message: string;
}

export interface UserMerchantMapping {
  id: string;
  userId: string;
  merchantIdentifier?: string;
  merchantKey: string;
  assignedCategory: SpendingCategory;
  confirmationCount: number;
  lastConfirmedAt: string;
  isAmbiguousPersonalVpa: boolean;
}

export type DashboardCategoryName =
  | 'Investment'
  | 'Medicine'
  | 'Food'
  | 'Groceries'
  | 'Petrol'
  | 'Shopping'
  | 'Subscription'
  | 'Transport'
  | 'Outing'
  | 'Bills & Utilities'
  | 'Education'
  | 'Rent'
  | 'Insurance'
  | 'Miscellaneous';

export interface SpendingCategoryVisualConfig {
  id: SpendingCategory;
  name: DashboardCategoryName;
  color: string;
  hoverColor: string;
  glowColor: string;
  iconName: string;
  bgClass: string;
}

export interface SpendingChartSlice {
  id: string;
  categoryId: SpendingCategory;
  name: DashboardCategoryName;
  percentage: number; // 0 - 100
  color: string;
  hoverColor: string;
  glowColor: string;
  iconName: string;
  transactionCount: number;
}

export type DashboardCategorySlice = SpendingChartSlice;
