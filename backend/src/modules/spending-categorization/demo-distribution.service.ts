import { prisma } from '../../config/database.js';
import { DemoDataService } from './demo-data.service.js';
import { SpendingAggregationService } from './spending-aggregation.service.js';
import {
  PeriodFilter,
  SpendingDistributionResponse,
} from '../spending-analytics/spending-analytics.types.js';

export class DemoDistributionService {
  /**
   * Retrieves spending distribution for a user
   * Automatically switches between REAL_TRANSACTION_DATA and DEMO_DATA based on availability
   */
  static async getSpendingDistribution(
    userId: string,
    period: PeriodFilter = 'THIS_MONTH',
    customStart?: string | Date,
    customEnd?: string | Date
  ): Promise<SpendingDistributionResponse> {
    // 1. Check if user has real, non-demo bank transactions
    let realTransactions: any[] = [];
    try {
      realTransactions = await prisma.transaction.findMany({
        where: {
          userId,
          isDemo: false,
        },
      });
    } catch {
      // Offline fallback
      realTransactions = [];
    }

    if (realTransactions.length > 0) {
      // User has real transactions -> compute actual spending distribution
      return SpendingAggregationService.aggregateDistribution(
        realTransactions,
        period,
        customStart,
        customEnd,
        false
      );
    }

    // 2. No real transactions exist -> Use isolated synthetic demo data
    const demoTransactions = await DemoDataService.getOrCreateDemoTransactions(userId);

    return SpendingAggregationService.aggregateDistribution(
      demoTransactions,
      period,
      customStart,
      customEnd,
      true
    );
  }

  /**
   * Development-only regeneration of user demo spending dataset
   */
  static async regenerateDemoDistribution(
    userId: string,
    period: PeriodFilter = 'THIS_MONTH'
  ): Promise<SpendingDistributionResponse> {
    const demoTransactions = await DemoDataService.regenerateDemoTransactions(userId);

    return SpendingAggregationService.aggregateDistribution(
      demoTransactions,
      period,
      undefined,
      undefined,
      true
    );
  }
}
