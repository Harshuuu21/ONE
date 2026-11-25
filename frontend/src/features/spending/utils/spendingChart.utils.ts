import {
  CategorySpendingItem,
  DashboardCategoryName,
  PeriodFilter,
  SpendingCategory,
  SpendingCategoryVisualConfig,
  SpendingChartSlice,
} from '../types/spending.types';

/**
 * Centralized Category Configuration for all 14 Supported Categories
 * Strictly adheres to the color directions specified in the ONE Spending Intelligence Engine:
 * - Investment: Blue
 * - Medicine: Mint green
 * - Food: Teal
 * - Groceries: Green
 * - Petrol: Orange
 * - Shopping: Cyan
 * - Subscription: Indigo
 * - Transport: Sky blue
 * - Outing: Purple
 * - Bills & Utilities: Yellow
 * - Education: Violet
 * - Rent: Rose
 * - Insurance: Blue-grey
 * - Miscellaneous: Neutral grey
 */
export const SPENDING_CATEGORY_CONFIGS: Record<SpendingCategory, SpendingCategoryVisualConfig> = {
  INVESTMENT: {
    id: 'INVESTMENT',
    name: 'Investment',
    color: '#3B82F6', // Blue
    hoverColor: '#60A5FA',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    iconName: 'TrendingUp',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  MEDICINE: {
    id: 'MEDICINE',
    name: 'Medicine',
    color: '#10B981', // Mint green
    hoverColor: '#34D399',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    iconName: 'Activity',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  FOOD: {
    id: 'FOOD',
    name: 'Food',
    color: '#14B8A6', // Teal
    hoverColor: '#2DD4BF',
    glowColor: 'rgba(20, 184, 166, 0.5)',
    iconName: 'Utensils',
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  },
  GROCERIES: {
    id: 'GROCERIES',
    name: 'Groceries',
    color: '#22C55E', // Green
    hoverColor: '#4ADE80',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    iconName: 'ShoppingBag',
    bgClass: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  PETROL: {
    id: 'PETROL',
    name: 'Petrol',
    color: '#F97316', // Orange
    hoverColor: '#FB923C',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    iconName: 'Fuel',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  SHOPPING: {
    id: 'SHOPPING',
    name: 'Shopping',
    color: '#06B6D4', // Cyan
    hoverColor: '#22D3EE',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    iconName: 'Tag',
    bgClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  SUBSCRIPTION: {
    id: 'SUBSCRIPTION',
    name: 'Subscription',
    color: '#6366F1', // Indigo
    hoverColor: '#818CF8',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    iconName: 'CreditCard',
    bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  TRANSPORT: {
    id: 'TRANSPORT',
    name: 'Transport',
    color: '#0284C7', // Sky blue
    hoverColor: '#38BDF8',
    glowColor: 'rgba(2, 132, 199, 0.5)',
    iconName: 'Compass',
    bgClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  OUTING: {
    id: 'OUTING',
    name: 'Outing',
    color: '#A855F7', // Purple
    hoverColor: '#C084FC',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    iconName: 'Film',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  BILLS_UTILITIES: {
    id: 'BILLS_UTILITIES',
    name: 'Bills & Utilities',
    color: '#EAB308', // Yellow
    hoverColor: '#FACC15',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    iconName: 'Zap',
    bgClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  EDUCATION: {
    id: 'EDUCATION',
    name: 'Education',
    color: '#8B5CF6', // Violet
    hoverColor: '#A78BFA',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    iconName: 'GraduationCap',
    bgClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
  RENT: {
    id: 'RENT',
    name: 'Rent',
    color: '#F43F5E', // Rose
    hoverColor: '#FB7185',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    iconName: 'Home',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  INSURANCE: {
    id: 'INSURANCE',
    name: 'Insurance',
    color: '#0E7490', // Blue-grey / Cyan-slate
    hoverColor: '#06B6D4',
    glowColor: 'rgba(14, 116, 144, 0.5)',
    iconName: 'Shield',
    bgClass: 'bg-cyan-700/10 text-cyan-300 border-cyan-700/20',
  },
  ENTERTAINMENT: {
    id: 'ENTERTAINMENT',
    name: 'Entertainment',
    color: '#D946EF', // Fuchsia
    hoverColor: '#E879F9',
    glowColor: 'rgba(217, 70, 239, 0.5)',
    iconName: 'Gamepad2',
    bgClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  },
  TRAVEL: {
    id: 'TRAVEL',
    name: 'Travel',
    color: '#F59E0B', // Amber
    hoverColor: '#FBBF24',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    iconName: 'Plane',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  MISCELLANEOUS: {
    id: 'MISCELLANEOUS',
    name: 'Miscellaneous',
    color: '#64748B', // Neutral grey
    hoverColor: '#94A3B8',
    glowColor: 'rgba(100, 116, 139, 0.5)',
    iconName: 'HelpCircle',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

/**
 * Backward compatibility map for legacy names
 */
export const DASHBOARD_CATEGORY_CONFIGS = SPENDING_CATEGORY_CONFIGS;

/**
 * Maps any raw category string into one of the 14 standard SpendingCategory identifiers
 */
export function mapRawCategory(rawCategory?: string): SpendingCategory {
  if (!rawCategory) return 'MISCELLANEOUS';
  const clean = rawCategory.toUpperCase().trim();

  switch (clean) {
    case 'INVESTMENT':
    case 'INVESTMENTS':
    case 'WEALTH':
    case 'SAVINGS':
      return 'INVESTMENT';

    case 'MEDICINE':
    case 'HEALTH':
    case 'HEALTHCARE':
    case 'PHARMACY':
      return 'MEDICINE';

    case 'FOOD':
    case 'DINING':
    case 'RESTAURANTS':
    case 'CAFE':
      return 'FOOD';

    case 'GROCERIES':
    case 'GROCERY':
    case 'SUPERMARKET':
      return 'GROCERIES';

    case 'PETROL':
    case 'FUEL':
    case 'GAS':
      return 'PETROL';

    case 'SHOPPING':
    case 'APPAREL':
    case 'RETAIL':
    case 'ELECTRONICS':
    case 'ECOMMERCE':
      return 'SHOPPING';

    case 'SUBSCRIPTION':
    case 'SUBSCRIPTIONS':
    case 'DIGITAL':
    case 'SAAS':
    case 'STREAMING':
      return 'SUBSCRIPTION';

    case 'TRANSPORT':
    case 'COMMUTE':
    case 'TRANSIT':
    case 'CAB':
    case 'UBER':
    case 'OLA':
    case 'METRO':
    case 'TRAIN':
      return 'TRANSPORT';

    case 'OUTING':
    case 'ENTERTAINMENT':
    case 'LEISURE':
    case 'MOVIES':
    case 'CINEMA':
      return 'OUTING';

    case 'BILLS_UTILITIES':
    case 'BILLS':
    case 'UTILITIES':
    case 'ELECTRICITY':
    case 'WATER':
    case 'RECHARGE':
      return 'BILLS_UTILITIES';

    case 'EDUCATION':
    case 'TUITION':
    case 'COURSE':
    case 'BOOKS':
      return 'EDUCATION';

    case 'RENT':
    case 'HOUSING':
    case 'MAINTENANCE':
      return 'RENT';

    case 'INSURANCE':
    case 'POLICY':
    case 'PREMIUM':
      return 'INSURANCE';

    case 'ENTERTAINMENT':
    case 'GAMING':
    case 'THEMEPARK':
      return 'ENTERTAINMENT';

    case 'TRAVEL':
    case 'FLIGHT':
    case 'HOTEL':
    case 'HOLIDAY':
    case 'TRIP':
      return 'TRAVEL';

    case 'MISCELLANEOUS':
    default:
      return 'MISCELLANEOUS';
  }
}

/**
 * Aggregates backend category items into non-zero chart slices with reconciled 100% percentages
 * Note: Never displays zero-spending categories.
 */
export function calculateDonutSlices(
  backendCategories: CategorySpendingItem[]
): SpendingChartSlice[] {
  if (!backendCategories || backendCategories.length === 0) return [];

  // 1. Group net spend and transaction counts across all 16 categories
  const aggregated: Record<SpendingCategory, { netSpend: number; count: number }> = {
    INVESTMENT: { netSpend: 0, count: 0 },
    MEDICINE: { netSpend: 0, count: 0 },
    FOOD: { netSpend: 0, count: 0 },
    GROCERIES: { netSpend: 0, count: 0 },
    PETROL: { netSpend: 0, count: 0 },
    SHOPPING: { netSpend: 0, count: 0 },
    SUBSCRIPTION: { netSpend: 0, count: 0 },
    TRANSPORT: { netSpend: 0, count: 0 },
    OUTING: { netSpend: 0, count: 0 },
    BILLS_UTILITIES: { netSpend: 0, count: 0 },
    EDUCATION: { netSpend: 0, count: 0 },
    RENT: { netSpend: 0, count: 0 },
    INSURANCE: { netSpend: 0, count: 0 },
    ENTERTAINMENT: { netSpend: 0, count: 0 },
    TRAVEL: { netSpend: 0, count: 0 },
    MISCELLANEOUS: { netSpend: 0, count: 0 },
  };

  let totalNet = 0;

  for (const item of backendCategories) {
    const catId = mapRawCategory(item.categoryId || item.displayName);
    const net = Math.max(0, item.netSpend || 0);
    aggregated[catId].netSpend += net;
    aggregated[catId].count += item.transactionCount || 0;
    totalNet += net;
  }

  // If zero total spend, return empty slice array
  if (totalNet <= 0) return [];

  // 2. Filter to non-zero spending categories
  const activeEntries = (Object.keys(aggregated) as SpendingCategory[])
    .filter((catId) => aggregated[catId].netSpend > 0)
    .map((catId) => {
      const cfg = SPENDING_CATEGORY_CONFIGS[catId];
      const rawPct = (aggregated[catId].netSpend / totalNet) * 100;
      return {
        id: catId,
        categoryId: catId,
        name: cfg.name,
        color: cfg.color,
        hoverColor: cfg.hoverColor,
        glowColor: cfg.glowColor,
        iconName: cfg.iconName,
        transactionCount: aggregated[catId].count,
        rawPct,
      };
    });

  if (activeEntries.length === 0) return [];

  // Sort descending by raw percentage (largest segment first)
  activeEntries.sort((a, b) => b.rawPct - a.rawPct);

  // 3. Normalize rounded percentages so they sum to exactly 100%
  let sumRounded = 0;
  const slices: SpendingChartSlice[] = activeEntries.map((entry) => {
    const rounded = Math.round(entry.rawPct);
    sumRounded += rounded;
    return {
      id: entry.id,
      categoryId: entry.categoryId,
      name: entry.name,
      percentage: rounded,
      color: entry.color,
      hoverColor: entry.hoverColor,
      glowColor: entry.glowColor,
      iconName: entry.iconName,
      transactionCount: entry.transactionCount,
    };
  });

  // Reconcile rounding discrepancy on the largest category
  const diff = 100 - sumRounded;
  if (diff !== 0 && slices.length > 0) {
    slices[0].percentage += diff;
  }

  return slices;
}

/**
 * Calculates start and end timestamps for financial period filters
 */
export function getPeriodDateRange(period: PeriodFilter, now = new Date()) {
  const current = new Date(now);

  switch (period) {
    case 'THIS_WEEK': {
      const day = current.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const start = new Date(current);
      start.setDate(current.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case 'THIS_MONTH': {
      const start = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }

    case 'LAST_MONTH': {
      const start = new Date(current.getFullYear(), current.getMonth() - 1, 1, 0, 0, 0, 0);
      const end = new Date(current.getFullYear(), current.getMonth(), 0, 23, 59, 59, 999);
      return { start, end };
    }

    case 'LAST_3_MONTHS': {
      const start = new Date(current.getFullYear(), current.getMonth() - 2, 1, 0, 0, 0, 0);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }

    case 'THIS_YEAR': {
      const start = new Date(current.getFullYear(), 0, 1, 0, 0, 0, 0);
      const end = new Date(current.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start, end };
    }

    default: {
      const start = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
  }
}

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  THIS_WEEK: 'this week',
  THIS_MONTH: 'this month',
  LAST_MONTH: 'last month',
  LAST_3_MONTHS: 'the last 3 months',
  THIS_YEAR: 'this year',
  CUSTOM: 'this period',
};
