import { SpendingCategory } from '../types/spending.types';

export interface FrontendDemoTransaction {
  id: string;
  title: string;
  merchant: string;
  amount: number;
  category: SpendingCategory;
  type: 'EXPENSE';
  date: string;
  daysAgo: number;
  note?: string;
}

/**
 * Balanced synthetic spending templates.
 * Designed so that 8-12 categories are active for This Month with balanced percentages (4% - 18%),
 * rather than a single category dominating with 90%+.
 */
const BASE_DEMO_TEMPLATES = [
  // --- THIS WEEK (0-6 days ago) ---
  {
    title: 'Swiggy Gourmet Delivery',
    merchant: 'Swiggy',
    amount: 580,
    category: 'FOOD' as SpendingCategory,
    daysAgo: 1,
    note: 'Dinner with friends',
  },
  {
    title: 'Daily Essentials & Dairy',
    merchant: 'Blinkit',
    amount: 640,
    category: 'GROCERIES' as SpendingCategory,
    daysAgo: 2,
    note: 'Milk, oats, bread, and fruits',
  },
  {
    title: 'City Commute Cab',
    merchant: 'Uber',
    amount: 320,
    category: 'TRANSPORT' as SpendingCategory,
    daysAgo: 2,
    note: 'Ride to coworking hub',
  },
  {
    title: 'Fuel Station Auto Refill',
    merchant: 'Indian Oil',
    amount: 1400,
    category: 'PETROL' as SpendingCategory,
    daysAgo: 3,
    note: 'Petrol tank refill',
  },
  {
    title: 'Pharmacy Vitamins & Bandages',
    merchant: 'Apollo Pharmacy',
    amount: 650,
    category: 'MEDICINE' as SpendingCategory,
    daysAgo: 3,
    note: 'Multivitamins and first-aid',
  },
  {
    title: 'Weekend Cinema Tickets',
    merchant: 'PVR Cinemas',
    amount: 780,
    category: 'OUTING' as SpendingCategory,
    daysAgo: 4,
    note: 'IMAX movie screening',
  },
  {
    title: 'Artisan Cold Brew & Croissant',
    merchant: 'Blue Tokai',
    amount: 340,
    category: 'FOOD' as SpendingCategory,
    daysAgo: 5,
    note: 'Morning coffee',
  },
  {
    title: 'Casual Summer Shirts',
    merchant: 'Amazon Retail',
    amount: 1450,
    category: 'SHOPPING' as SpendingCategory,
    daysAgo: 6,
    note: 'Cotton shirts and socks',
  },

  // --- EARLIER THIS MONTH (7-25 days ago) ---
  {
    title: 'Apartment Maintenance & Utilities',
    merchant: 'Society Dues',
    amount: 2200,
    category: 'RENT' as SpendingCategory,
    daysAgo: 8,
    note: 'Monthly society maintenance fee',
  },
  {
    title: 'Supermarket Weekly Cart',
    merchant: "Nature's Basket",
    amount: 1850,
    category: 'GROCERIES' as SpendingCategory,
    daysAgo: 10,
    note: 'Gourmet staples, spices, and veggies',
  },
  {
    title: 'Family Dinner at Cafe',
    merchant: 'Smoke House Deli',
    amount: 1650,
    category: 'FOOD' as SpendingCategory,
    daysAgo: 11,
    note: 'Weekend lunch',
  },
  {
    title: 'Index Fund SIP Allocation',
    merchant: 'Zerodha Coin',
    amount: 2500,
    category: 'INVESTMENT' as SpendingCategory,
    daysAgo: 12,
    note: 'Monthly Nifty 50 Index Fund',
  },
  {
    title: 'High-Speed Broadband Bill',
    merchant: 'Airtel Fiber',
    amount: 999,
    category: 'BILLS_UTILITIES' as SpendingCategory,
    daysAgo: 14,
    note: '200 Mbps broadband',
  },
  {
    title: 'Electricity Utility Bill',
    merchant: 'BESCOM Power',
    amount: 1250,
    category: 'BILLS_UTILITIES' as SpendingCategory,
    daysAgo: 15,
    note: 'Monthly power consumption',
  },
  {
    title: 'Music Streaming Recurring',
    merchant: 'Spotify Premium',
    amount: 119,
    category: 'SUBSCRIPTION' as SpendingCategory,
    daysAgo: 16,
    note: 'Individual monthly recurring',
  },
  {
    title: 'Apparel Store Shopping',
    merchant: 'Uniqlo India',
    amount: 2190,
    category: 'SHOPPING' as SpendingCategory,
    daysAgo: 18,
    note: 'Linen trousers and t-shirts',
  },
  {
    title: 'Arcade Bowling & Games',
    merchant: 'Smaaash Entertainment',
    amount: 950,
    category: 'ENTERTAINMENT' as SpendingCategory,
    daysAgo: 20,
    note: 'VR games and arcade tickets',
  },
  {
    title: 'Highway Fuel Station',
    merchant: 'Shell Petrol',
    amount: 1200,
    category: 'PETROL' as SpendingCategory,
    daysAgo: 22,
    note: 'Shell V-Power petrol',
  },
  {
    title: 'Organic Food Delivery',
    merchant: 'Zomato Dining',
    amount: 880,
    category: 'FOOD' as SpendingCategory,
    daysAgo: 24,
    note: 'Salad and healthy dinner bowl',
  },

  // --- LAST MONTH (28-55 days ago) ---
  {
    title: 'Weekend Boutique Stay',
    merchant: 'MakeMyTrip Hotels',
    amount: 3800,
    category: 'TRAVEL' as SpendingCategory,
    daysAgo: 34,
    note: 'Hill station weekend homestay',
  },
  {
    title: 'Apartment Maintenance & Utilities',
    merchant: 'Society Dues',
    amount: 2200,
    category: 'RENT' as SpendingCategory,
    daysAgo: 38,
    note: 'Previous month maintenance',
  },
  {
    title: 'Health Insurance Premium',
    merchant: 'HDFC ERGO Health',
    amount: 2400,
    category: 'INSURANCE' as SpendingCategory,
    daysAgo: 42,
    note: 'Quarterly health policy instalment',
  },
  {
    title: 'Online Tech Specialization',
    merchant: 'Coursera Inc',
    amount: 1800,
    category: 'EDUCATION' as SpendingCategory,
    daysAgo: 45,
    note: 'Cloud Architecture course',
  },
  {
    title: 'Family Gathering Dinner',
    merchant: 'Punjab Grill',
    amount: 2200,
    category: 'FOOD' as SpendingCategory,
    daysAgo: 48,
    note: 'Celebration dinner',
  },
  {
    title: 'Streaming Video 4K Plan',
    merchant: 'Netflix',
    amount: 649,
    category: 'SUBSCRIPTION' as SpendingCategory,
    daysAgo: 50,
    note: 'Monthly 4K plan',
  },

  // --- LAST 3 MONTHS (60-85 days ago) ---
  {
    title: 'Roundtrip Domestic Flight',
    merchant: 'IndiGo Airlines',
    amount: 4500,
    category: 'TRAVEL' as SpendingCategory,
    daysAgo: 65,
    note: 'Conference trip flight ticket',
  },
  {
    title: 'Mutual Fund Lump Sum',
    merchant: 'Groww Investments',
    amount: 3000,
    category: 'INVESTMENT' as SpendingCategory,
    daysAgo: 72,
    note: 'Mid-cap equity allocation',
  },
  {
    title: 'Annual Preventative Health Panel',
    merchant: 'Dr Lal PathLabs',
    amount: 1200,
    category: 'MEDICINE' as SpendingCategory,
    daysAgo: 78,
    note: 'Full body checkup',
  },
  {
    title: 'Software Engineering Books',
    merchant: 'Amazon Books',
    amount: 1100,
    category: 'EDUCATION' as SpendingCategory,
    daysAgo: 82,
    note: 'System design and distributed systems manuals',
  },

  // --- THIS YEAR (90-180 days ago) ---
  {
    title: 'Apartment Deep Cleaning',
    merchant: 'Urban Company',
    amount: 980,
    category: 'MISCELLANEOUS' as SpendingCategory,
    daysAgo: 110,
    note: 'Seasonal apartment deep clean',
  },
  {
    title: 'Motor Vehicle Comprehensive Cover',
    merchant: 'ICICI Lombard',
    amount: 2600,
    category: 'INSURANCE' as SpendingCategory,
    daysAgo: 140,
    note: 'Vehicle insurance renewal',
  },
];

const STORAGE_KEY = 'one_smart_spending_demo_dataset_v2';

/**
 * Generates synthetic transactions with natural date jitter
 */
export function generateFrontendDemoTransactions(): FrontendDemoTransaction[] {
  const now = Date.now();
  return BASE_DEMO_TEMPLATES.map((tpl, i) => {
    const jitterHours = (i * 7) % 24;
    const dateMs = now - tpl.daysAgo * 86400000 - jitterHours * 3600000;
    return {
      id: `fe-demo-${i + 1}-${Math.floor(dateMs / 1000)}`,
      title: tpl.title,
      merchant: tpl.merchant,
      amount: tpl.amount,
      category: tpl.category,
      type: 'EXPENSE',
      date: new Date(dateMs).toISOString(),
      daysAgo: tpl.daysAgo,
      note: tpl.note,
    };
  });
}

/**
 * Gets or initializes the user's persistent synthetic spending transactions
 */
export function getOrCreateFrontendDemoTransactions(): FrontendDemoTransaction[] {
  if (typeof window === 'undefined') {
    return generateFrontendDemoTransactions();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 20) {
        return parsed;
      }
    }
  } catch {
    // ignore json error
  }

  const fresh = generateFrontendDemoTransactions();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // ignore storage error
  }
  return fresh;
}

/**
 * Force regenerates a new synthetic spending dataset for testing
 */
export function regenerateFrontendDemoTransactions(): FrontendDemoTransaction[] {
  const fresh = generateFrontendDemoTransactions();
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
  }
  return fresh;
}
