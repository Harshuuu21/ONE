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
 * - Last Month (28-55 days ago)
 * - Last 3 Months (60-85 days ago)
 * - This Year (90-180 days ago)
 *
 * Balanced amounts ensure 8-12 colorful, distinct categories are displayed in the initial
 * distribution rather than one single category dominating with 90%+.
 */
export class DemoTransactionGenerator {
  private static readonly TEMPLATES: SyntheticTransactionTemplate[] = [
    // --- THIS WEEK (0-6 days ago) ---
    {
      title: 'Swiggy Dinner Order',
      merchant: 'Swiggy',
      amount: 580,
      category: 'FOOD',
      paymentMethod: 'UPI',
      daysAgo: 1,
      note: 'Gourmet meal delivery',
    },
    {
      title: 'Quick Kirana Delivery',
      merchant: 'Blinkit',
      amount: 640,
      category: 'GROCERIES',
      paymentMethod: 'UPI',
      daysAgo: 2,
      note: 'Fresh milk, fruits, and bread',
    },
    {
      title: 'City Commute Cab',
      merchant: 'Uber',
      amount: 320,
      category: 'TRANSPORT',
      paymentMethod: 'UPI',
      daysAgo: 2,
      note: 'Office to downtown',
    },
    {
      title: 'Fuel Station Refill',
      merchant: 'Indian Oil',
      amount: 1400,
      category: 'PETROL',
      paymentMethod: 'CARD',
      daysAgo: 3,
      note: 'Petrol pump auto refill',
    },
    {
      title: 'Pharmacy Health Supplies',
      merchant: 'Apollo Pharmacy',
      amount: 650,
      category: 'MEDICINE',
      paymentMethod: 'UPI',
      daysAgo: 3,
      note: 'First aid and multivitamins',
    },
    {
      title: 'Weekend Cinema Tickets',
      merchant: 'PVR Cinemas',
      amount: 780,
      category: 'OUTING',
      paymentMethod: 'CARD',
      daysAgo: 4,
      note: 'IMAX movie screening',
    },
    {
      title: 'Artisan Cafe Coffee',
      merchant: 'Blue Tokai Cafe',
      amount: 340,
      category: 'FOOD',
      paymentMethod: 'UPI',
      daysAgo: 5,
      note: 'Cold brew and croissant',
    },
    {
      title: 'Online Fashion Purchase',
      merchant: 'Amazon Retail',
      amount: 1450,
      category: 'SHOPPING',
      paymentMethod: 'CARD',
      daysAgo: 6,
      note: 'Casual linen shirts',
    },

    // --- EARLIER THIS MONTH (7-25 days ago) ---
    {
      title: 'Apartment Maintenance Dues',
      merchant: 'Prestige Housing',
      amount: 2200,
      category: 'RENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 8,
      note: 'Monthly residence society maintenance fee',
    },
    {
      title: 'Supermarket Weekly Staples',
      merchant: "Nature's Basket",
      amount: 1850,
      category: 'GROCERIES',
      paymentMethod: 'CARD',
      daysAgo: 10,
      note: 'Organic groceries and pantry refill',
    },
    {
      title: 'Family Lunch at Cafe',
      merchant: 'Smoke House Deli',
      amount: 1650,
      category: 'FOOD',
      paymentMethod: 'CARD',
      daysAgo: 11,
      note: 'Weekend family lunch',
    },
    {
      title: 'Mutual Fund SIP Contribution',
      merchant: 'Zerodha Coin',
      amount: 2500,
      category: 'INVESTMENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 12,
      note: 'Monthly Nifty 50 Index SIP',
    },
    {
      title: 'Fiber Internet Subscription',
      merchant: 'Airtel Fiber',
      amount: 999,
      category: 'BILLS_UTILITIES',
      paymentMethod: 'UPI',
      daysAgo: 14,
      note: 'High-speed broadband plan',
    },
    {
      title: 'Electricity Utility Bill',
      merchant: 'BESCOM Power',
      amount: 1250,
      category: 'BILLS_UTILITIES',
      paymentMethod: 'UPI',
      daysAgo: 15,
      note: 'Monthly electricity bill',
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
      title: 'Apparel Store Shopping',
      merchant: 'Uniqlo India',
      amount: 2190,
      category: 'SHOPPING',
      paymentMethod: 'CARD',
      daysAgo: 18,
      note: 'Linen trousers and shirts',
    },
    {
      title: 'Arcade Gaming Zone',
      merchant: 'Smaaash Entertainment',
      amount: 950,
      category: 'ENTERTAINMENT',
      paymentMethod: 'CARD',
      daysAgo: 20,
      note: 'Bowling and VR gaming credits',
    },
    {
      title: 'Highway Fuel Station',
      merchant: 'Shell Petrol Pump',
      amount: 1200,
      category: 'PETROL',
      paymentMethod: 'CARD',
      daysAgo: 22,
      note: 'V-Power petrol tank refill',
    },
    {
      title: 'Organic Food Delivery',
      merchant: 'Zomato Dining',
      amount: 880,
      category: 'FOOD',
      paymentMethod: 'CARD',
      daysAgo: 24,
      note: 'Salad and healthy dinner bowl',
    },

    // --- LAST MONTH (28-55 days ago) ---
    {
      title: 'Weekend Boutique Resort Stay',
      merchant: 'MakeMyTrip Hotels',
      amount: 3800,
      category: 'TRAVEL',
      paymentMethod: 'CARD',
      daysAgo: 34,
      note: 'Hill station boutique resort booking',
    },
    {
      title: 'Apartment Maintenance Dues',
      merchant: 'Prestige Housing',
      amount: 2200,
      category: 'RENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 38,
      note: 'Previous month residence dues',
    },
    {
      title: 'Health Insurance Premium',
      merchant: 'HDFC ERGO Health',
      amount: 2400,
      category: 'INSURANCE',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 42,
      note: 'Individual comprehensive health cover',
    },
    {
      title: 'Data Science Online Course',
      merchant: 'Coursera Inc',
      amount: 1800,
      category: 'EDUCATION',
      paymentMethod: 'CARD',
      daysAgo: 45,
      note: 'Professional specialization certification',
    },
    {
      title: 'Fine Dining Restaurant',
      merchant: 'Punjab Grill',
      amount: 2200,
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

    // --- LAST 3 MONTHS (60-85 days ago) ---
    {
      title: 'Domestic Flight Tickets',
      merchant: 'IndiGo Airlines',
      amount: 4500,
      category: 'TRAVEL',
      paymentMethod: 'CARD',
      daysAgo: 65,
      note: 'Roundtrip vacation flight',
    },
    {
      title: 'Equity Index Lump Sum',
      merchant: 'Groww Investments',
      amount: 3000,
      category: 'INVESTMENT',
      paymentMethod: 'BANK_TRANSFER',
      daysAgo: 72,
      note: 'Tax saver ELSS allocation',
    },
    {
      title: 'Diagnostic Health Checkup',
      merchant: 'Dr Lal PathLabs',
      amount: 1200,
      category: 'MEDICINE',
      paymentMethod: 'UPI',
      daysAgo: 78,
      note: 'Annual preventive blood panel',
    },
    {
      title: 'Technical Certification Books',
      merchant: 'Amazon Books',
      amount: 1100,
      category: 'EDUCATION',
      paymentMethod: 'CARD',
      daysAgo: 82,
      note: 'Software engineering architecture textbooks',
    },

    // --- THIS YEAR (90-180 days ago) ---
    {
      title: 'Home Deep Cleaning Service',
      merchant: 'Urban Company',
      amount: 980,
      category: 'MISCELLANEOUS',
      paymentMethod: 'UPI',
      daysAgo: 110,
      note: 'Seasonal apartment deep cleaning',
    },
    {
      title: 'Vehicle Insurance Renewal',
      merchant: 'ICICI Lombard',
      amount: 2600,
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
      const jitterMs = (idx * 7) % 24 * 3600000;
      const dateMs = now - tpl.daysAgo * 86400000 - jitterMs;
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
