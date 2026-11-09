import { randomUUID } from 'crypto';
import { GeneratedTransaction, PersonaConfig, UserPersona } from '../demo-data.types.js';
import { round2, randomInRange, randomInt, randomChoice, weightedChoice } from '../utils/random.utils.js';
import { distributeDatesOverDays } from '../utils/date.utils.js';

export function generateTransactions(
  userId: string,
  persona: UserPersona,
  config: PersonaConfig,
  initialBalance: number,
  daysSpan: number = 75,
  targetCount: number = 60
): {
  transactions: GeneratedTransaction[];
  totalIncome: number;
  totalExpenses: number;
  closingBalance: number;
} {
  const transactions: GeneratedTransaction[] = [];
  const now = new Date();
  const startTime = new Date(now.getTime() - daysSpan * 24 * 60 * 60 * 1000);

  // 1. Generate Scheduled Income Events (e.g., Salary/Allowance/Invoices)
  let incomeTotal = 0;
  for (const source of config.incomeSources) {
    let currentIncomeDate = new Date(startTime);
    currentIncomeDate.setDate(currentIncomeDate.getDate() + randomInt(1, 4));

    while (currentIncomeDate <= now) {
      const amount = round2(randomInRange(source.minAmount, source.maxAmount, 2));
      const tx: GeneratedTransaction = {
        id: randomUUID(),
        userId,
        transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-${randomInt(1000, 9999)}`,
        title: source.title,
        merchant: source.merchant,
        amount,
        category: source.category,
        type: 'INCOME',
        paymentMethod: source.paymentMethod,
        date: new Date(currentIncomeDate),
        status: 'COMPLETED',
        note: `Direct credit via ${source.paymentMethod}`,
        isDemo: true,
      };

      transactions.push(tx);
      incomeTotal = round2(incomeTotal + amount);

      currentIncomeDate = new Date(currentIncomeDate);
      currentIncomeDate.setDate(currentIncomeDate.getDate() + source.frequencyDays);
    }
  }

  // 2. Generate Scheduled Recurring Expenses (e.g. Rent / Society maintenance)
  let expenseTotal = 0;
  if (config.recurringExpenses && config.recurringExpenses.length > 0) {
    for (const rec of config.recurringExpenses) {
      let currentExpenseDate = new Date(startTime);
      currentExpenseDate.setDate(currentExpenseDate.getDate() + randomInt(3, 7));

      while (currentExpenseDate <= now) {
        const amount = round2(randomInRange(rec.minAmount, rec.maxAmount, 2));
        const tx: GeneratedTransaction = {
          id: randomUUID(),
          userId,
          transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-${randomInt(1000, 9999)}`,
          title: rec.title,
          merchant: rec.merchant,
          amount,
          category: rec.category,
          type: 'EXPENSE',
          paymentMethod: rec.paymentMethod,
          date: new Date(currentExpenseDate),
          status: 'COMPLETED',
          note: 'Scheduled monthly payment',
          isDemo: true,
        };

        transactions.push(tx);
        expenseTotal = round2(expenseTotal + amount);

        currentExpenseDate = new Date(currentExpenseDate);
        currentExpenseDate.setDate(currentExpenseDate.getDate() + rec.frequencyDays);
      }
    }
  }

  // 3. Generate Daily/Weekly Variable Expenses
  const paymentMethods: Array<{ item: 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CASH'; weight: number }> = [
    { item: 'UPI', weight: 65 },
    { item: 'CARD', weight: 25 },
    { item: 'BANK_TRANSFER', weight: 8 },
    { item: 'CASH', weight: 2 },
  ];

  const statuses: Array<{ item: 'COMPLETED' | 'PENDING' | 'FAILED'; weight: number }> = [
    { item: 'COMPLETED', weight: 94 },
    { item: 'PENDING', weight: 4 },
    { item: 'FAILED', weight: 2 },
  ];

  const categoryChoices = config.expenseCategories.map((c) => ({
    item: c,
    weight: c.weight,
  }));

  // Target variable expense budget: keep ~25-45% of total income saved
  const remainingBudget = Math.max(10000, (incomeTotal * 0.65) - expenseTotal);
  const avgPerTx = remainingBudget / targetCount;

  const dates = distributeDatesOverDays(targetCount, daysSpan);

  for (let i = 0; i < dates.length; i++) {
    const categoryConfig = weightedChoice(categoryChoices);
    const merchant = randomChoice(categoryConfig.merchants);

    // Scale slightly relative to category min/max and overall budget
    const rawAmount = randomInRange(categoryConfig.minAmount, categoryConfig.maxAmount, 2);
    // Smooth amount so it doesn't overshoot budget
    const factor = Math.min(1.2, Math.max(0.6, avgPerTx / ((categoryConfig.minAmount + categoryConfig.maxAmount) / 2)));
    const amount = round2(Math.max(categoryConfig.minAmount, rawAmount * factor));

    const paymentMethod = weightedChoice(paymentMethods);
    const status = weightedChoice(statuses);

    const tx: GeneratedTransaction = {
      id: randomUUID(),
      userId,
      transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}-${randomInt(10000, 99999)}`,
      title: `${categoryConfig.category} at ${merchant}`,
      merchant,
      amount,
      category: categoryConfig.category,
      type: 'EXPENSE',
      paymentMethod,
      date: dates[i],
      status,
      note: status === 'FAILED' ? 'Bank server timeout (Auto-reversed)' : undefined,
      isDemo: true,
    };

    transactions.push(tx);

    // Only COMPLETED expenses decrement the balance
    if (status === 'COMPLETED') {
      expenseTotal = round2(expenseTotal + amount);
    }
  }

  // Sort all transactions chronologically
  transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Deterministic Reconciliation: Closing = Opening + TotalCredits - TotalDebits
  const closingBalance = round2(initialBalance + incomeTotal - expenseTotal);

  return {
    transactions,
    totalIncome: incomeTotal,
    totalExpenses: expenseTotal,
    closingBalance,
  };
}
