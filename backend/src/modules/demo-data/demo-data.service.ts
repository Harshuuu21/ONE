import { prisma } from '../../config/database.js';
import { DemoDataGenerator } from './demo-data.generator.js';
import {
  DemoDataStatusResponse,
  DemoDataSummaryResponse,
  GeneratedDataSet,
  UserPersona,
} from './demo-data.types.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/index.js';
import { round2 } from './utils/random.utils.js';

// In-memory fallback repository when PostgreSQL is offline or unauthenticated in development
const inMemoryDemoData = new Map<string, GeneratedDataSet>();
const inMemoryLocks = new Set<string>();

export class DemoDataService {
  /**
   * Initializes personalized demo financial data for a user.
   * Enforces atomic database transactions, concurrency locking, and idempotency.
   */
  static async initializeDemoData(
    userId: string,
    requestedPersona?: UserPersona,
    force: boolean = false
  ): Promise<DemoDataSummaryResponse> {
    // 1. Concurrency Check
    if (inMemoryLocks.has(userId)) {
      throw new BadRequestError('Demo data generation is currently in progress for this user.');
    }

    try {
      inMemoryLocks.add(userId);

      // 2. Check if already initialized in DB
      let existingProfile: any = null;
      try {
        existingProfile = await prisma.demoDataProfile.findUnique({
          where: { userId },
        });
      } catch (dbErr: any) {
        console.warn('[DemoDataService] DB check warning (using memory check):', dbErr.message);
      }

      if (!existingProfile && inMemoryDemoData.has(userId)) {
        const memData = inMemoryDemoData.get(userId)!;
        existingProfile = {
          status: 'COMPLETED',
          persona: memData.persona,
        };
      }

      if (existingProfile && existingProfile.status === 'COMPLETED' && !force) {
        // Return existing summary idempotently
        return await this.getDemoDataSummary(userId);
      }

      // 3. Determine persona
      const persona: UserPersona = requestedPersona || (await this.detectUserPersona(userId));

      // 4. Generate the complete dataset
      const dataSet = DemoDataGenerator.generateDataSet(userId, persona);

      // 5. Persist to DB or Fallback Memory
      let persistedSuccessfully = false;

      try {
        await prisma.$transaction(
          async (tx) => {
            // Upsert profile in INITIALIZING status
            await tx.demoDataProfile.upsert({
              where: { userId },
              create: {
                userId,
                persona,
                status: 'INITIALIZING',
                generatorVersion: dataSet.generatorVersion,
                initialBalance: dataSet.initialBalance,
                closingBalance: dataSet.closingBalance,
                totalIncome: dataSet.totalIncome,
                totalExpenses: dataSet.totalExpenses,
              },
              update: {
                persona,
                status: 'INITIALIZING',
                generatorVersion: dataSet.generatorVersion,
                initialBalance: dataSet.initialBalance,
                closingBalance: dataSet.closingBalance,
                totalIncome: dataSet.totalIncome,
                totalExpenses: dataSet.totalExpenses,
                updatedAt: new Date(),
              },
            });

            // Clean up any existing demo records for this user
            await tx.transaction.deleteMany({ where: { userId, isDemo: true } });
            await tx.goal.deleteMany({ where: { userId, isDemo: true } });
            await tx.loan.deleteMany({ where: { userId, isDemo: true } });
            await tx.community.deleteMany({ where: { userId, isDemo: true } });

            // Create transactions
            for (const t of dataSet.transactions) {
              await tx.transaction.create({
                data: {
                  id: t.id,
                  userId,
                  transactionRef: t.transactionRef,
                  title: t.title,
                  merchant: t.merchant,
                  amount: t.amount,
                  category: t.category,
                  type: t.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
                  paymentMethod: t.paymentMethod,
                  status: t.status,
                  date: t.date,
                  note: t.note,
                  source: 'DEMO',
                  isDemo: true,
                },
              });
            }

            // Create goals
            for (const g of dataSet.goals) {
              await tx.goal.create({
                data: {
                  id: g.id,
                  userId,
                  title: g.title,
                  description: g.description,
                  targetAmount: g.targetAmount,
                  currentAmount: g.currentAmount,
                  category: g.category,
                  deadline: g.deadline,
                  status: g.status,
                  isCompleted: g.status === 'COMPLETED',
                  isDemo: true,
                },
              });
            }

            // Create loans & repayments
            for (const l of dataSet.loans) {
              const loan = await tx.loan.create({
                data: {
                  id: l.id,
                  userId,
                  type: l.type,
                  lenderName: l.lenderName,
                  principal: l.principal,
                  interestRate: l.interestRate,
                  tenureMonths: l.tenureMonths,
                  monthlyEmi: l.monthlyEmi,
                  startDate: l.startDate,
                  endDate: l.endDate,
                  outstandingBalance: l.outstandingBalance,
                  nextPaymentDate: l.nextPaymentDate,
                  status: l.status,
                  isDemo: true,
                },
              });

              for (const r of l.repayments) {
                await tx.loanRepayment.create({
                  data: {
                    id: r.id,
                    loanId: loan.id,
                    installmentNumber: r.installmentNumber,
                    amount: r.amount,
                    principalComponent: r.principalComponent,
                    interestComponent: r.interestComponent,
                    remainingBalance: r.remainingBalance,
                    dueDate: r.dueDate,
                    paidDate: r.paidDate,
                    status: r.status,
                    isDemo: true,
                  },
                });
              }
            }

            // Create communities & contributions
            for (const c of dataSet.communities) {
              const community = await tx.community.create({
                data: {
                  id: c.id,
                  userId,
                  name: c.name,
                  description: c.description,
                  category: c.category,
                  adminName: c.adminName,
                  memberCount: c.memberCount,
                  membersSnapshot: c.membersSnapshot as any,
                  sharedGoal: c.sharedGoal,
                  targetAmount: c.targetAmount,
                  totalContributions: c.totalContributions,
                  progress: c.progress,
                  isDemo: true,
                },
              });

              for (const cb of c.contributions) {
                await tx.communityContribution.create({
                  data: {
                    id: cb.id,
                    communityId: community.id,
                    contributorName: cb.contributorName,
                    isUserContribution: cb.isUserContribution,
                    amount: cb.amount,
                    date: cb.date,
                    note: cb.note,
                    isDemo: true,
                  },
                });
              }
            }

            // Mark profile as COMPLETED
            await tx.demoDataProfile.update({
              where: { userId },
              data: {
                status: 'COMPLETED',
                generatedAt: new Date(),
              },
            });
          },
          {
            timeout: 25000,
          }
        );

        persistedSuccessfully = true;
      } catch (dbErr: any) {
        console.warn(
          '[DemoDataService] Database persistence failed, switching to memory fallback:',
          dbErr.message
        );
      }

      // Always save to memory store for quick synchronous offline lookup
      inMemoryDemoData.set(userId, dataSet);

      return this.buildSummaryFromDataSet(dataSet);
    } finally {
      inMemoryLocks.delete(userId);
    }
  }

  /**
   * Retrieves initialization status and record counts.
   */
  static async getDemoDataStatus(userId: string): Promise<DemoDataStatusResponse> {
    try {
      const profile = await prisma.demoDataProfile.findUnique({
        where: { userId },
      });

      if (profile && profile.status === 'COMPLETED') {
        const [txCount, goalsCount, loansCount, commCount] = await Promise.all([
          prisma.transaction.count({ where: { userId, isDemo: true } }),
          prisma.goal.count({ where: { userId, isDemo: true } }),
          prisma.loan.count({ where: { userId, isDemo: true } }),
          prisma.community.count({ where: { userId, isDemo: true } }),
        ]);

        return {
          isInitialized: true,
          status: 'COMPLETED',
          persona: profile.persona as UserPersona,
          generatedAt: profile.generatedAt.toISOString(),
          generatorVersion: profile.generatorVersion,
          recordCounts: {
            transactions: txCount,
            goals: goalsCount,
            loans: loansCount,
            communities: commCount,
          },
        };
      }
    } catch (err: any) {
      console.warn('[DemoDataService] Status DB query failed, checking memory:', err.message);
    }

    if (inMemoryDemoData.has(userId)) {
      const mem = inMemoryDemoData.get(userId)!;
      return {
        isInitialized: true,
        status: 'COMPLETED',
        persona: mem.persona,
        generatedAt: mem.generatedAt.toISOString(),
        generatorVersion: mem.generatorVersion,
        recordCounts: {
          transactions: mem.transactions.length,
          goals: mem.goals.length,
          loans: mem.loans.length,
          communities: mem.communities.length,
        },
      };
    }

    return {
      isInitialized: false,
      status: 'NOT_INITIALIZED',
    };
  }

  /**
   * Retrieves high-level financial summary, metrics, and latest records.
   */
  static async getDemoDataSummary(userId: string): Promise<DemoDataSummaryResponse> {
    try {
      const profile = await prisma.demoDataProfile.findUnique({
        where: { userId },
      });

      if (profile && profile.status === 'COMPLETED') {
        const [transactions, goals, loans, communities] = await Promise.all([
          prisma.transaction.findMany({
            where: { userId, isDemo: true },
            orderBy: { date: 'desc' },
          }),
          prisma.goal.findMany({
            where: { userId, isDemo: true },
            orderBy: { createdAt: 'desc' },
          }),
          prisma.loan.findMany({
            where: { userId, isDemo: true },
            include: { repayments: { orderBy: { installmentNumber: 'asc' } } },
          }),
          prisma.community.findMany({
            where: { userId, isDemo: true },
            include: { contributions: { orderBy: { date: 'desc' } } },
          }),
        ]);

        const mappedDataSet: GeneratedDataSet = {
          persona: profile.persona as UserPersona,
          generatorVersion: profile.generatorVersion,
          generatedAt: profile.generatedAt,
          initialBalance: Number(profile.initialBalance),
          closingBalance: Number(profile.closingBalance),
          totalIncome: Number(profile.totalIncome),
          totalExpenses: Number(profile.totalExpenses),
          transactions: transactions.map((t) => ({
            id: t.id,
            userId: t.userId,
            transactionRef: t.transactionRef || t.id,
            title: t.title,
            merchant: t.merchant || 'Merchant',
            amount: Number(t.amount),
            category: t.category,
            type: t.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
            paymentMethod: (t.paymentMethod as any) || 'UPI',
            date: t.date,
            status: (t.status as any) || 'COMPLETED',
            note: t.note || undefined,
            isDemo: t.isDemo,
          })),
          goals: goals.map((g) => {
            const targetAmount = Number(g.targetAmount);
            const currentAmount = Number(g.currentAmount);
            return {
              id: g.id,
              userId: g.userId,
              title: g.title,
              description: g.description || '',
              targetAmount,
              currentAmount,
              category: g.category,
              deadline: g.deadline || new Date(),
              status: g.status as any,
              progressPercentage: round2((currentAmount / targetAmount) * 100),
              isDemo: g.isDemo,
            };
          }),
          loans: loans.map((l) => ({
            id: l.id,
            userId: l.userId,
            type: l.type as any,
            lenderName: l.lenderName,
            principal: Number(l.principal),
            interestRate: Number(l.interestRate),
            tenureMonths: l.tenureMonths,
            monthlyEmi: Number(l.monthlyEmi),
            startDate: l.startDate,
            endDate: l.endDate,
            outstandingBalance: Number(l.outstandingBalance),
            nextPaymentDate: l.nextPaymentDate,
            status: l.status as any,
            isDemo: l.isDemo,
            repayments: l.repayments.map((r) => ({
              id: r.id,
              loanId: r.loanId,
              installmentNumber: r.installmentNumber,
              amount: Number(r.amount),
              principalComponent: Number(r.principalComponent),
              interestComponent: Number(r.interestComponent),
              remainingBalance: Number(r.remainingBalance),
              dueDate: r.dueDate,
              paidDate: r.paidDate || undefined,
              status: r.status as any,
              isDemo: r.isDemo,
            })),
          })),
          communities: communities.map((c) => ({
            id: c.id,
            userId: c.userId,
            name: c.name,
            description: c.description,
            category: c.category,
            adminName: c.adminName,
            memberCount: c.memberCount,
            membersSnapshot: (c.membersSnapshot as any) || [],
            sharedGoal: c.sharedGoal,
            targetAmount: Number(c.targetAmount),
            totalContributions: Number(c.totalContributions),
            progress: Number(c.progress),
            isDemo: c.isDemo,
            contributions: c.contributions.map((cb) => ({
              id: cb.id,
              communityId: cb.communityId,
              contributorName: cb.contributorName,
              isUserContribution: cb.isUserContribution,
              amount: Number(cb.amount),
              date: cb.date,
              note: cb.note || undefined,
              isDemo: cb.isDemo,
            })),
          })),
        };

        return this.buildSummaryFromDataSet(mappedDataSet);
      }
    } catch (err: any) {
      console.warn('[DemoDataService] DB Summary failed, falling back to memory:', err.message);
    }

    if (inMemoryDemoData.has(userId)) {
      return this.buildSummaryFromDataSet(inMemoryDemoData.get(userId)!);
    }

    // Auto-generate if not initialized yet
    return await this.initializeDemoData(userId);
  }

  /**
   * Safely purges demo records (WHERE isDemo = true) and generates a fresh dataset.
   * Real user data is NEVER deleted.
   */
  static async resetDemoData(
    userId: string,
    requestedPersona?: UserPersona
  ): Promise<DemoDataSummaryResponse> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany({ where: { userId, isDemo: true } });
        await tx.goal.deleteMany({ where: { userId, isDemo: true } });
        await tx.loan.deleteMany({ where: { userId, isDemo: true } });
        await tx.community.deleteMany({ where: { userId, isDemo: true } });
        await tx.demoDataProfile.deleteMany({ where: { userId } });
      });
    } catch (dbErr: any) {
      console.warn('[DemoDataService] DB purge warning:', dbErr.message);
    }

    inMemoryDemoData.delete(userId);

    // Re-initialize freshly
    return await this.initializeDemoData(userId, requestedPersona, true);
  }

  /**
   * Helper to detect persona from user attributes or default.
   */
  private static async detectUserPersona(userId: string): Promise<UserPersona> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });

      // Default persona is WORKING_PROFESSIONAL
      return 'WORKING_PROFESSIONAL';
    } catch {
      return 'WORKING_PROFESSIONAL';
    }
  }

  /**
   * Formats a GeneratedDataSet into the unified API summary response.
   */
  private static buildSummaryFromDataSet(dataSet: GeneratedDataSet): DemoDataSummaryResponse {
    const netSavings = round2(dataSet.totalIncome - dataSet.totalExpenses);
    const savingsRate =
      dataSet.totalIncome > 0
        ? round2(Math.max(0, (netSavings / dataSet.totalIncome) * 100))
        : 0;

    // Aggregate category expenses
    const categoryTotals = new Map<string, number>();
    for (const t of dataSet.transactions) {
      if (t.type === 'EXPENSE' && t.status === 'COMPLETED') {
        const current = categoryTotals.get(t.category) || 0;
        categoryTotals.set(t.category, round2(current + t.amount));
      }
    }

    const topCategories = Array.from(categoryTotals.entries())
      .map(([category, totalSpent]) => ({
        category,
        totalSpent,
        percentage:
          dataSet.totalExpenses > 0
            ? round2((totalSpent / dataSet.totalExpenses) * 100)
            : 0,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    const totalLoanDebt = dataSet.loans.reduce(
      (acc, l) => round2(acc + (l.status === 'ACTIVE' ? l.outstandingBalance : 0)),
      0
    );

    const monthlyEmiTotal = dataSet.loans.reduce(
      (acc, l) => round2(acc + (l.status === 'ACTIVE' ? l.monthlyEmi : 0)),
      0
    );

    return {
      persona: dataSet.persona,
      status: 'COMPLETED',
      generatedAt: dataSet.generatedAt.toISOString(),
      generatorVersion: dataSet.generatorVersion,
      financials: {
        initialBalance: dataSet.initialBalance,
        closingBalance: dataSet.closingBalance,
        totalIncome: dataSet.totalIncome,
        totalExpenses: dataSet.totalExpenses,
        netSavings,
        savingsRatePercentage: savingsRate,
      },
      metrics: {
        transactionsCount: dataSet.transactions.length,
        completedTransactionsCount: dataSet.transactions.filter(
          (t) => t.status === 'COMPLETED'
        ).length,
        goalsCount: dataSet.goals.length,
        activeLoansCount: dataSet.loans.filter((l) => l.status === 'ACTIVE').length,
        totalLoanDebt,
        monthlyEmiTotal,
        communitiesCount: dataSet.communities.length,
      },
      topCategories,
      goals: dataSet.goals,
      loans: dataSet.loans,
      communities: dataSet.communities,
      recentTransactions: dataSet.transactions.slice(-15).reverse(),
    };
  }
}
