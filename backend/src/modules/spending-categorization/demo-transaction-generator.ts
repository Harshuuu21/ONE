import { SpendingCategory } from './types/index.js';

export interface SyntheticTransactionTemplate {
  title: string;
  merchant: string;
  amount: number;
  category: SpendingCategory;
  paymentMethod: 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CASH';
  daysAgo: number;
  note?: string;
  isRefund?: boolean;
}

export interface DemoTransactionRecord {
  id: string;
  userId: string;
  title: string;
  merchant: string;
  amount: number;
  category: SpendingCategory;
  type: 'EXPENSE' | 'INCOME';
  paymentMethod: string;
  status: 'COMPLETED';
  date: Date;
  isDemo: true;
  note?: string;
  originalPredictedCategory: SpendingCategory;
  confidenceScore: number;
  classificationMethod: string;
}

/**
 * Generates realistic synthetic transaction records spanning different date windows:
 * - This Week (0-6 days ago)
 * - This Month (7-25 days ago)
 * - Last Month (30-55 days ago)
 * - Last 3 Months (60-85 days ago)
 * - This Year (90-180 days ago)
 *
 * Designed to ensure that changing the period filter produces noticeably different
 * dynamic category distributions with 8-12 active categories initially and all 16 across the year.
 */
export class DemoTransactionGenerator {
  private static readonly TEMPLATES: SyntheticTransactionTemplate[] = [
    // --- THIS WEEK (0-6 days ago) ---
    {
      title: 'Swiggy Dinner Order',
      merchant: 'Swiggy',
      amount: 420,
      category: 'FOOD',
      paymentMethod: 'UPI',
      daysAgo: 1,
      note: 'Gourmet meal delivery',
    },
    {
      title: 'Quick Kirana Delivery',
      merchant: 'Blinkit',
      amount: 680,
      category: 'GROCERIES',
      paymentMethod: 'UPI',
      daysAgo: 2,
      note: 'Fresh milk, fruits, and bread',
    },
    {
      title: 'City Commute Cab',
      merchant: 'Uber',
      amount: 340,
      category: 'TRANSPORT',
      paymentMethod: 'UPI',
      daysAgo: 2,
      note: 'Office to downtown',
    },
    {
      title: 'Fuel Station Refill',
      merchant: 'Indian Oil',
      amount: 1500,
      category: 'PETROL',
      paymentMethod: 'CARD',
      daysAgo: 3,
      note: 'Petrol pump auto refill',
    },
    {
      title: 'Pharmacy Health Supplies',
      merchant: 'Apollo Pharmacy',
      amount: 620,
      category: 'MEDICINE',
      paymentMethod: 'UPI',
      daysAgo: 4,
      note: 'First aid and multivitamins',
    },
    {
      title: 'Weekend Cinema Tickets',
      merchant: 'PVR Cinemas',
      amount: 850,
      category: 'OUTING',
      paymentMethod: 'CARD',
      daysAgo: 5,
      note: 'IMAX movie screening',
    },
    {
      title: 'Artisan Cafe Coffee',
      merchant: 'Blue Tokai Cafe',
      amount: 280,
      category: 'FOOD',
      paymentMethod: 'UPI',
      daysAgo: 5,
      note: 'Cold brew and croissant',
    },
    {
      title: 'Online Fashion Purchase',
      merchant: 'Amazon Retail',
      amount: 1650,
      category: 'SHOPPING',
      paymentMethod: 'CARD',
      daysAgo: 6,
      note: 'Casual linen shirts',
    },

    // --- EARLIER THIS MONTH (7-25 days ago) ---
    {
      title: 'Apartment Monthly Rent',
      merchant: 'Prestige Housing',
      amount: 18500,
      category: 'RENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 8,
      note: 'Monthly residence lease payment',
    },
    {
      title: 'Mutual Fund SIP Contribution',
      merchant: 'Zerodha Coin',
      amount: 5000,
      category: 'INVESTMENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 10,
      note: 'Monthly Nifty 50 Index SIP',
    },
    {
      title: 'Supermarket Weekly Pantry',
      merchant: "Nature's Basket",
      amount: 2450,
      category: 'GROCERIES',
      paymentMethod: 'CARD',
      daysAgo: 12,
      note: 'Organic groceries and staples',
    },
    {
      title: 'Electricity Utility Bill',
      merchant: 'BESCOM Power',
      amount: 1780,
      category: 'BILLS_UTILITIES',
      paymentMethod: 'UPI',
      daysAgo: 14,
      note: 'Monthly electricity bill',
    },
    {
      title: 'Fiber Internet Subscription',
      merchant: 'JioFiber',
      amount: 999,
      category: 'BILLS_UTILITIES',
      paymentMethod: 'UPI',
      daysAgo: 15,
      note: 'High-speed broadband plan',
    },
    {
      title: 'Digital Music Streaming',
      merchant: 'Spotify Premium',
      amount: 119,
      category: 'SUBSCRIPTION',
      paymentMethod: 'CARD',
      daysAgo: 16,
      note: 'Individual monthly recurring',
    },
    {
      title: 'Arcade Gaming Zone',
      merchant: 'Smaaash Entertainment',
      amount: 1100,
      category: 'ENTERTAINMENT',
      paymentMethod: 'CARD',
      daysAgo: 18,
      note: 'Bowling and VR gaming credits',
    },
    {
      title: 'Apparel Store Shopping',
      merchant: 'Uniqlo India',
      amount: 2990,
      category: 'SHOPPING',
      paymentMethod: 'CARD',
      daysAgo: 21,
      note: 'Winter jackets and thermal wear',
    },
    {
      title: 'Highway Fuel Station',
      merchant: 'Shell Petrol Pump',
      amount: 1800,
      category: 'PETROL',
      paymentMethod: 'CARD',
      daysAgo: 24,
      note: 'V-Power petrol tank refill',
    },

    // --- LAST MONTH (30-55 days ago) ---
    {
      title: 'Apartment Monthly Rent',
      merchant: 'Prestige Housing',
      amount: 18500,
      category: 'RENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 38,
      note: 'Previous month residence rent',
    },
    {
      title: 'Family Weekend Resort Stay',
      merchant: 'MakeMyTrip Hotels',
      amount: 7200,
      category: 'TRAVEL',
      paymentMethod: 'CARD',
      daysAgo: 40,
      note: 'Hill station boutique resort booking',
    },
    {
      title: 'Health Insurance Annual Premium',
      merchant: 'HDFC ERGO Health',
      amount: 4800,
      category: 'INSURANCE',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 42,
      note: 'Individual comprehensive health cover',
    },
    {
      title: 'Data Science Online Course',
      merchant: 'Coursera Inc',
      amount: 3200,
      category: 'EDUCATION',
      paymentMethod: 'CARD',
      daysAgo: 45,
      note: 'Professional specialization certification',
    },
    {
      title: 'Fine Dining Restaurant',
      merchant: 'Punjab Grill',
      amount: 2100,
      category: 'FOOD',
      paymentMethod: 'CARD',
      daysAgo: 48,
      note: 'Family celebration dinner',
    },
    {
      title: 'Streaming Video Subscription',
      merchant: 'Netflix India',
      amount: 649,
      category: 'SUBSCRIPTION',
      paymentMethod: 'CARD',
      daysAgo: 50,
      note: '4K Premium plan auto debit',
    },
    {
      title: 'PC Gaming Library Purchase',
      merchant: 'Steam Games',
      amount: 1450,
      category: 'ENTERTAINMENT',
      paymentMethod: 'CARD',
      daysAgo: 53,
      note: 'Multiplayer adventure bundle',
    },

    // --- LAST 3 MONTHS (60-85 days ago) ---
    {
      title: 'Domestic Flight Tickets',
      merchant: 'IndiGo Airlines',
      amount: 6400,
      category: 'TRAVEL',
      paymentMethod: 'CARD',
      daysAgo: 68,
      note: 'Roundtrip vacation flight',
    },
    {
      title: 'Equity Index Lump Sum',
      merchant: 'Groww Investments',
      amount: 7500,
      category: 'INVESTMENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 74,
      note: 'Tax saver ELSS allocation',
    },
    {
      title: 'Diagnostic Health Checkup',
      merchant: 'Dr Lal PathLabs',
      amount: 1450,
      category: 'MEDICINE',
      paymentMethod: 'UPI',
      daysAgo: 78,
      note: 'Annual preventive blood panel',
    },
    {
      title: 'Technical Certification Books',
      merchant: 'Amazon Books',
      amount: 1850,
      category: 'EDUCATION',
      paymentMethod: 'CARD',
      daysAgo: 82,
      note: 'Software engineering architecture textbooks',
    },

    // --- THIS YEAR (90-180 days ago) ---
    {
      title: 'Home Deep Cleaning Service',
      merchant: 'Urban Company',
      amount: 1400,
      category: 'MISCELLANEOUS',
      paymentMethod: 'UPI',
      daysAgo: 110,
      note: 'Seasonal apartment deep cleaning',
    },
    {
      title: 'Vehicle Insurance Renewal',
      merchant: 'ICICI Lombard',
      amount: 3800,
      category: 'INSURANCE',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 140,
      note: 'Comprehensive car insurance policy',
    },
  ];

  /**
   * Generates synthetic demo transactions for a specific user
   */
  static generateTransactions(userId: string): DemoTransactionRecord[] {
    const now = Date.now();
    const records: DemoTransactionRecord[] = [];

    this.TEMPLATES.forEach((tpl, idx) => {
      // Calculate realistic date with slight jitter for natural time-of-day
      const dateMs = now - tpl.daysAgo * 86400000 + (idx % 8) * 3600000;
      const txDate = new Date(dateMs);

      records.push({
        id: `demo-tx-${userId}-${idx + 1}`,
        userId,
        title: tpl.title,
        merchant: tpl.merchant,
        amount: tpl.amount,
        category: tpl.category,
        type: 'EXPENSE',
        paymentMethod: tpl.paymentMethod,
        status: 'COMPLETED',
        date: txDate,
        isDemo: true,
        note: tpl.note,
        originalPredictedCategory: tpl.category,
        confidenceScore: 95.0,
        classificationMethod: 'SYNTHETIC_DEMO_ENGINE',
      });
    });

    return records;
  }
}
