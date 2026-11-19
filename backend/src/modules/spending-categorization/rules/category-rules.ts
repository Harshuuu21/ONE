import { SpendingCategory, SpendingCategoryConfig } from '../types/index.js';

export const SPENDING_CATEGORIES: Record<SpendingCategory, SpendingCategoryConfig> = {
  INVESTMENT: {
    id: 'INVESTMENT',
    displayName: 'Investment & Wealth',
    description: 'Equities, mutual funds, SIPs, fixed deposits, and securities',
    icon: 'TrendingUp',
    chartColor: '#10B981', // emerald-500
    isActive: true,
    displayOrder: 1,
  },
  MEDICINE: {
    id: 'MEDICINE',
    displayName: 'Medicine & Health',
    description: 'Pharmacies, medical diagnostics, hospitals, and clinics',
    icon: 'Activity',
    chartColor: '#EF4444', // red-500
    isActive: true,
    displayOrder: 2,
  },
  FOOD: {
    id: 'FOOD',
    displayName: 'Food & Dining',
    description: 'Restaurants, cafes, food delivery platforms, and dining out',
    icon: 'Utensils',
    chartColor: '#F59E0B', // amber-500
    isActive: true,
    displayOrder: 3,
  },
  GROCERIES: {
    id: 'GROCERIES',
    displayName: 'Groceries & Essentials',
    description: 'Supermarkets, quick-commerce delivery, dairy, and local kirana',
    icon: 'ShoppingBag',
    chartColor: '#84CC16', // lime-500
    isActive: true,
    displayOrder: 4,
  },
  PETROL: {
    id: 'PETROL',
    displayName: 'Fuel & Energy',
    description: 'Petrol pumps, diesel, CNG stations, and EV charging points',
    icon: 'Fuel',
    chartColor: '#F97316', // orange-500
    isActive: true,
    displayOrder: 5,
  },
  SHOPPING: {
    id: 'SHOPPING',
    displayName: 'Shopping & Apparel',
    description: 'Clothing, footwear, electronics, department stores, and retail',
    icon: 'Tag',
    chartColor: '#EC4899', // pink-500
    isActive: true,
    displayOrder: 6,
  },
  SUBSCRIPTION: {
    id: 'SUBSCRIPTION',
    displayName: 'Subscriptions & Digital',
    description: 'Streaming media, software SaaS, memberships, and digital content',
    icon: 'CreditCard',
    chartColor: '#8B5CF6', // purple-500
    isActive: true,
    displayOrder: 7,
  },
  TRANSPORT: {
    id: 'TRANSPORT',
    displayName: 'Transit & Commute',
    description: 'Cabs, auto-rickshaws, metro rail, buses, and train tickets',
    icon: 'Navigation',
    chartColor: '#06B6D4', // cyan-500
    isActive: true,
    displayOrder: 8,
  },
  OUTING: {
    id: 'OUTING',
    displayName: 'Entertainment & Outings',
    description: 'Cinema, concerts, sporting events, clubs, and leisure activities',
    icon: 'Film',
    chartColor: '#A855F7', // purple-400
    isActive: true,
    displayOrder: 9,
  },
  BILLS_UTILITIES: {
    id: 'BILLS_UTILITIES',
    displayName: 'Bills & Utilities',
    description: 'Electricity, water, piped gas, broadband, and mobile recharges',
    icon: 'Zap',
    chartColor: '#3B82F6', // blue-500
    isActive: true,
    displayOrder: 10,
  },
  EDUCATION: {
    id: 'EDUCATION',
    displayName: 'Education & Learning',
    description: 'Tuition, university fees, online certifications, and textbooks',
    icon: 'GraduationCap',
    chartColor: '#6366F1', // indigo-500
    isActive: true,
    displayOrder: 11,
  },
  RENT: {
    id: 'RENT',
    displayName: 'Rent & Housing',
    description: 'Apartment rent, maintenance dues, and property leases',
    icon: 'Home',
    chartColor: '#14B8A6', // teal-500
    isActive: true,
    displayOrder: 12,
  },
  INSURANCE: {
    id: 'INSURANCE',
    displayName: 'Insurance & Policies',
    description: 'Life insurance, health cover, motor vehicle insurance premiums',
    icon: 'Shield',
    chartColor: '#077A7D', // brand-teal
    isActive: true,
    displayOrder: 13,
  },
  MISCELLANEOUS: {
    id: 'MISCELLANEOUS',
    displayName: 'Miscellaneous',
    description: 'Unclassified, ambiguous, or general financial transactions',
    icon: 'HelpCircle',
    chartColor: '#64748B', // slate-500
    isActive: true,
    displayOrder: 14,
  },
};

export const ORDERED_CATEGORIES: SpendingCategoryConfig[] = Object.values(SPENDING_CATEGORIES).sort(
  (a, b) => a.displayOrder - b.displayOrder
);

export function getCategoryConfig(id: SpendingCategory): SpendingCategoryConfig {
  return SPENDING_CATEGORIES[id] || SPENDING_CATEGORIES.MISCELLANEOUS;
}

