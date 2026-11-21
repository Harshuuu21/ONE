export * from './spendingChart.utils';

// Backward compatibility helper
import { calculateDonutSlices, mapRawCategory } from './spendingChart.utils';
import { CategorySpendingItem, DashboardCategoryName, DashboardCategorySlice } from '../types';

export const transformToDashboardSlices = (
  backendCategories: CategorySpendingItem[]
): DashboardCategorySlice[] => {
  return calculateDonutSlices(backendCategories);
};

export const mapToDashboardCategory = (rawCategory?: string): DashboardCategoryName => {
  const cat = mapRawCategory(rawCategory);
  return (cat.charAt(0) + cat.slice(1).toLowerCase()) as DashboardCategoryName;
};
