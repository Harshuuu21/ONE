import {
  CategorySpendingItem,
  DashboardCategoryName,
  DashboardCategorySlice,
  PeriodFilter,
} from '../types';

export interface CategoryVisualConfig {
  name: DashboardCategoryName;
  id: string;
  color: string;
  hoverColor: string;
  glowColor: string;
  iconName: string;
  bgClass: string;
}

export const DASHBOARD_CATEGORY_CONFIGS: Record<DashboardCategoryName, CategoryVisualConfig> = {
  Investment: {
    name: 'Investment',
    id: 'INVESTMENT',
    color: '#3B82F6', // Blue
    hoverColor: '#60A5FA',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    iconName: 'TrendingUp',
    bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  Medicine: {
    name: 'Medicine',
    id: 'MEDICINE',
    color: '#10B981', // Mint green
    hoverColor: '#34D399',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    iconName: 'Activity',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  Food: {
    name: 'Food',
    id: 'FOOD',
    color: '#14B8A6', // Teal
    hoverColor: '#2DD4BF',
    glowColor: 'rgba(20, 184, 166, 0.5)',
    iconName: 'Utensils',
    bgClass: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  },
  Outing: {
    name: 'Outing',
    id: 'OUTING',
    color: '#A855F7', // Purple
    hoverColor: '#C084FC',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    iconName: 'Film',
    bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  Petrol: {
    name: 'Petrol',
    id: 'PETROL',
    color: '#F97316', // Orange
    hoverColor: '#FB923C',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    iconName: 'Fuel',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  Shopping: {
    name: 'Shopping',
    id: 'SHOPPING',
    color: '#06B6D4', // Cyan
    hoverColor: '#22D3EE',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    iconName: 'Tag',
    bgClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  Subscription: {
    name: 'Subscription',
    id: 'SUBSCRIPTION',
    color: '#6366F1', // Indigo
    hoverColor: '#818CF8',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    iconName: 'CreditCard',
    bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  Miscellaneous: {
    name: 'Miscellaneous',
    id: 'MISCELLANEOUS',
    color: '#64748B', // Neutral grey
    hoverColor: '#94A3B8',
    glowColor: 'rgba(100, 116, 139, 0.5)',
    iconName: 'HelpCircle',
    bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

/**
 * Maps any raw category code to one of the 8 canonical dashboard spending categories
 */
export function mapToDashboardCategory(rawCategory?: string): DashboardCategoryName {
  if (!rawCategory) return 'Miscellaneous';
  const clean = rawCategory.toUpperCase().trim();

  switch (clean) {
    case 'INVESTMENT':
    case 'INVESTMENTS':
    case 'WEALTH':
    case 'SAVINGS':
      return 'Investment';

    case 'MEDICINE':
    case 'HEALTH':
    case 'HEALTHCARE':
    case 'PHARMACY':
      return 'Medicine';

    case 'FOOD':
    case 'DINING':
    case 'GROCERIES':
    case 'GROCERY':
    case 'RESTAURANTS':
      return 'Food';

    case 'OUTING':
    case 'ENTERTAINMENT':
    case 'LEISURE':
    case 'MOVIES':
      return 'Outing';

    case 'PETROL':
    case 'FUEL':
    case 'COMMUTE':
    case 'TRANSPORT':
    case 'TRANSIT':
      return 'Petrol';

    case 'SHOPPING':
    case 'APPAREL':
    case 'RETAIL':
    case 'ELECTRONICS':
      return 'Shopping';

    case 'SUBSCRIPTION':
    case 'SUBSCRIPTIONS':
    case 'DIGITAL':
    case 'SAAS':
      return 'Subscription';

    case 'MISCELLANEOUS':
    case 'RENT':
    case 'BILLS_UTILITIES':
    case 'EDUCATION':
    case 'INSURANCE':
    default:
      return 'Miscellaneous';
  }
}

/**
 * Aggregates backend category items into the 8 dashboard categories and computes normalized percentages
 */
export function transformToDashboardSlices(
  backendCategories: CategorySpendingItem[]
): DashboardCategorySlice[] {
  if (!backendCategories || backendCategories.length === 0) return [];

  // 1. Group net spend and transaction counts into the 8 categories
  const aggregated: Record<
    DashboardCategoryName,
    { netSpend: number; count: number }
  > = {
    Investment: { netSpend: 0, count: 0 },
    Medicine: { netSpend: 0, count: 0 },
    Food: { netSpend: 0, count: 0 },
    Outing: { netSpend: 0, count: 0 },
    Petrol: { netSpend: 0, count: 0 },
    Shopping: { netSpend: 0, count: 0 },
    Subscription: { netSpend: 0, count: 0 },
    Miscellaneous: { netSpend: 0, count: 0 },
  };

  let totalNet = 0;

  for (const item of backendCategories) {
    const targetCat = mapToDashboardCategory(item.categoryId || item.displayName);
    const net = Math.max(0, item.netSpend || 0);
    aggregated[targetCat].netSpend += net;
    aggregated[targetCat].count += item.transactionCount || 0;
    totalNet += net;
  }

  // If zero total spending, return empty slice array
  if (totalNet <= 0) return [];

  // 2. Filter to only categories with non-zero spending
  const activeEntries = (Object.keys(aggregated) as DashboardCategoryName[])
    .filter((name) => aggregated[name].netSpend > 0)
    .map((name) => {
      const cfg = DASHBOARD_CATEGORY_CONFIGS[name];
      const rawPct = (aggregated[name].netSpend / totalNet) * 100;
      return {
        id: cfg.id,
        name,
        color: cfg.color,
        hoverColor: cfg.hoverColor,
        glowColor: cfg.glowColor,
        iconName: cfg.iconName,
        transactionCount: aggregated[name].count,
        rawPct,
        netSpend: aggregated[name].netSpend,
      };
    });

  if (activeEntries.length === 0) return [];

  // Sort descending by raw percentage (largest segment first)
  activeEntries.sort((a, b) => b.rawPct - a.rawPct);

  // 3. Normalize rounded percentages so they sum to exactly 100%
  let sumRounded = 0;
  const slices: DashboardCategorySlice[] = activeEntries.map((entry) => {
    const rounded = Math.round(entry.rawPct);
    sumRounded += rounded;
    return {
      id: entry.id,
      name: entry.name,
      percentage: rounded,
      color: entry.color,
      hoverColor: entry.hoverColor,
      glowColor: entry.glowColor,
      iconName: entry.iconName,
      transactionCount: entry.transactionCount,
    };
  });

  // Reconcile rounding discrepancy on the largest category if needed
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
