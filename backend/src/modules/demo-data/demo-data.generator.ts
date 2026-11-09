import { GeneratedDataSet, PersonaConfig, UserPersona } from './demo-data.types.js';
import { generateTransactions } from './generators/transaction.generator.js';
import { generateGoals } from './generators/goal.generator.js';
import { generateLoans } from './generators/loan.generator.js';
import { generateCommunities } from './generators/community.generator.js';
import { round2, randomInRange, randomInt } from './utils/random.utils.js';

export const PERSONA_CONFIGS: Record<UserPersona, PersonaConfig> = {
  STUDENT: {
    incomeRange: { min: 20000, max: 38000 },
    initialBalanceRange: { min: 8000, max: 18000 },
    incomeSources: [
      {
        title: 'Monthly Family Allowance',
        merchant: 'Parent IMPS Transfer',
        category: 'Allowance',
        frequencyDays: 30,
        minAmount: 14000,
        maxAmount: 22000,
        paymentMethod: 'BANK_TRANSFER',
      },
      {
        title: 'Academic Research Fellowship',
        merchant: 'Institute Grants Portal',
        category: 'Scholarship',
        frequencyDays: 30,
        minAmount: 7000,
        maxAmount: 12000,
        paymentMethod: 'BANK_TRANSFER',
      },
      {
        title: 'Campus Hackathon Prize Bounty',
        merchant: 'Devfolio Hacker Payout',
        category: 'Freelance',
        frequencyDays: 60,
        minAmount: 5000,
        maxAmount: 15000,
        paymentMethod: 'UPI',
      },
    ],
    recurringExpenses: [
      {
        title: 'Hostel Room & Mess Fee',
        merchant: 'Hall of Residence Account',
        category: 'Rent',
        frequencyDays: 30,
        minAmount: 5500,
        maxAmount: 8500,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    expenseCategories: [
      {
        category: 'Food',
        weight: 35,
        merchants: ['Swiggy', 'Zomato', 'Campus Cafeteria', 'Chaayos', 'Rolls King', 'Maggie Hotspot'],
        minAmount: 80,
        maxAmount: 380,
      },
      {
        category: 'Groceries',
        weight: 15,
        merchants: ['Zepto', 'Blinkit', 'Local Kirana Store', 'Mother Dairy'],
        minAmount: 100,
        maxAmount: 550,
      },
      {
        category: 'Education',
        weight: 15,
        merchants: ['Coursera', 'Udemy', 'College Book Depot', 'Notion Student'],
        minAmount: 299,
        maxAmount: 1499,
      },
      {
        category: 'Transport',
        weight: 15,
        merchants: ['Metro SmartCard', 'Uber Auto', 'Rapido Bike Taxi', 'RedBus'],
        minAmount: 40,
        maxAmount: 280,
      },
      {
        category: 'Entertainment',
        weight: 12,
        merchants: ['BookMyShow', 'Spotify Student', 'PVR INOX Cinemas', 'Steam Games'],
        minAmount: 119,
        maxAmount: 650,
      },
      {
        category: 'Shopping',
        weight: 8,
        merchants: ['Amazon India', 'Myntra', 'Fastrack', 'Decathlon'],
        minAmount: 399,
        maxAmount: 1800,
      },
    ],
    preferredGoals: ['M3 MacBook Air for Coding', 'Semester Emergency Reserve', 'Goa Graduation Road Trip'],
    loanProbability: 0.45,
    preferredLoans: [],
    preferredCommunities: [],
  },

  WORKING_PROFESSIONAL: {
    incomeRange: { min: 85000, max: 185000 },
    initialBalanceRange: { min: 65000, max: 140000 },
    incomeSources: [
      {
        title: 'Monthly Net Salary',
        merchant: 'TechCorp India Pvt Ltd',
        category: 'Salary',
        frequencyDays: 30,
        minAmount: 85000,
        maxAmount: 145000,
        paymentMethod: 'BANK_TRANSFER',
      },
      {
        title: 'Quarterly Variable Performance Bonus',
        merchant: 'TechCorp India Pvt Ltd',
        category: 'Salary',
        frequencyDays: 85,
        minAmount: 35000,
        maxAmount: 75000,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    recurringExpenses: [
      {
        title: 'Apartment Rent Transfer',
        merchant: 'Prestige Residency Society Account',
        category: 'Rent',
        frequencyDays: 30,
        minAmount: 22000,
        maxAmount: 32000,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    expenseCategories: [
      {
        category: 'Groceries',
        weight: 22,
        merchants: ['Blinkit', 'Zepto', 'Nature Basket', 'BigBasket', 'D-Mart Supermarket'],
        minAmount: 350,
        maxAmount: 1800,
      },
      {
        category: 'Food & Dining',
        weight: 22,
        merchants: ['Swiggy Gourmet', 'Zomato', 'Starbucks Coffee', 'Blue Tokai', 'Third Wave Coffee', 'Toit Brewpub'],
        minAmount: 250,
        maxAmount: 1600,
      },
      {
        category: 'Transport',
        weight: 15,
        merchants: ['Uber Premier', 'Fastag Highway Toll', 'Indian Oil Fuel Pump', 'Shell Petrol Station'],
        minAmount: 180,
        maxAmount: 1200,
      },
      {
        category: 'Shopping',
        weight: 15,
        merchants: ['Amazon India', 'Zara', 'Uniqlo India', 'Myntra Luxe', 'Apple Store Online'],
        minAmount: 600,
        maxAmount: 3500,
      },
      {
        category: 'Utilities',
        weight: 13,
        merchants: ['Bescom Power Bill', 'Airtel Xstream Fiber', 'Indane LPG', 'Cult.fit Gym Pass'],
        minAmount: 499,
        maxAmount: 1999,
      },
      {
        category: 'Subscriptions',
        weight: 13,
        merchants: ['Netflix Premium', 'YouTube Family', 'ChatGPT Plus', 'Apple One Premier'],
        minAmount: 499,
        maxAmount: 1499,
      },
    ],
    preferredGoals: ['6-Month Runway Emergency Fund', 'Tokyo & Kyoto Autumn Holiday', 'Electric Vehicle Downpayment'],
    loanProbability: 0.75,
    preferredLoans: [],
    preferredCommunities: [],
  },

  FREELANCER: {
    incomeRange: { min: 70000, max: 160000 },
    initialBalanceRange: { min: 45000, max: 110000 },
    incomeSources: [
      {
        title: 'Design Retainer - US Client',
        merchant: 'Stripe International Payout',
        category: 'Freelance Income',
        frequencyDays: 28,
        minAmount: 65000,
        maxAmount: 110000,
        paymentMethod: 'BANK_TRANSFER',
      },
      {
        title: 'Mobile App Sprint Milestone',
        merchant: 'FinTech Labs Escrow',
        category: 'Freelance Income',
        frequencyDays: 35,
        minAmount: 30000,
        maxAmount: 65000,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    recurringExpenses: [
      {
        title: 'Dedicated Studio & Desk Lease',
        merchant: 'WeWork India Coworking',
        category: 'Workspace',
        frequencyDays: 30,
        minAmount: 10000,
        maxAmount: 16000,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    expenseCategories: [
      {
        category: 'Software & Tools',
        weight: 20,
        merchants: ['Figma Professional', 'GitHub Pro', 'AWS Cloud Server', 'Midjourney AI', 'OpenAI API Bill'],
        minAmount: 600,
        maxAmount: 2800,
      },
      {
        category: 'Co-Working & Coffee',
        weight: 20,
        merchants: ['Blue Tokai Cafe', 'Third Wave Roasters', 'Starbucks Reserve', 'Araku Coffee'],
        minAmount: 250,
        maxAmount: 950,
      },
      {
        category: 'Food',
        weight: 20,
        merchants: ['Swiggy', 'Zomato Healthy', 'EatFit Bowls', 'FreshMenu'],
        minAmount: 180,
        maxAmount: 650,
      },
      {
        category: 'Groceries',
        weight: 18,
        merchants: ['Zepto Fresh', 'Blinkit', 'Nature’s Basket', 'Country Delight Milk'],
        minAmount: 250,
        maxAmount: 1400,
      },
      {
        category: 'Hardware & Gear',
        weight: 12,
        merchants: ['Keychron Keyboards', 'Croma Electronics', 'Amazon Business'],
        minAmount: 800,
        maxAmount: 4200,
      },
      {
        category: 'Transport',
        weight: 10,
        merchants: ['Uber India', 'Ola Cabs', 'Airtel 5G Recharge'],
        minAmount: 150,
        maxAmount: 850,
      },
    ],
    preferredGoals: ['4K Studio Camera & Lighting Rig', 'Freelance Tax & GST Reserve 2026', 'Quiet Season Cash Buffer'],
    loanProbability: 0.5,
    preferredLoans: [],
    preferredCommunities: [],
  },

  BUSINESS_OWNER: {
    incomeRange: { min: 200000, max: 480000 },
    initialBalanceRange: { min: 180000, max: 420000 },
    incomeSources: [
      {
        title: 'Merchant POS Daily Settlements',
        merchant: 'Pine Labs Merchant Payout',
        category: 'Business Revenue',
        frequencyDays: 14,
        minAmount: 90000,
        maxAmount: 180000,
        paymentMethod: 'BANK_TRANSFER',
      },
      {
        title: 'B2B Corporate Wholesale Invoice',
        merchant: 'Enterprise Client Wire',
        category: 'Business Revenue',
        frequencyDays: 25,
        minAmount: 120000,
        maxAmount: 260000,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    recurringExpenses: [
      {
        title: 'Commercial Office Space Lease',
        merchant: 'Commercial Complex Maintenance Trust',
        category: 'Commercial Rent',
        frequencyDays: 30,
        minAmount: 32000,
        maxAmount: 55000,
        paymentMethod: 'BANK_TRANSFER',
      },
    ],
    expenseCategories: [
      {
        category: 'Inventory & Supplies',
        weight: 25,
        merchants: ['Wholesale Distribution Hub', 'Udaan B2B Order', 'Packaging Materials Co.'],
        minAmount: 3500,
        maxAmount: 18000,
      },
      {
        category: 'Logistics & Dispatch',
        weight: 20,
        merchants: ['Delhivery Express', 'BlueDart Corporate', 'Porter Goods Mini-Truck', 'Shiprocket'],
        minAmount: 1200,
        maxAmount: 5500,
      },
      {
        category: 'Dining & Client Entertainment',
        weight: 18,
        merchants: ['ITC Gardenia Business Lunch', 'The Leela Dining', 'Starbucks Reserve', 'Zomato Corporate'],
        minAmount: 800,
        maxAmount: 3800,
      },
      {
        category: 'IT & Enterprise Software',
        weight: 15,
        merchants: ['Zoho One Suite', 'Google Workspace Enterprise', 'Tally Cloud License', 'AWS Hosting'],
        minAmount: 1500,
        maxAmount: 6000,
      },
      {
        category: 'Team Fuel & Travel',
        weight: 12,
        merchants: ['Indian Oil Fleet Card', 'Uber for Business', 'MakeMyTrip Corporate'],
        minAmount: 1200,
        maxAmount: 4500,
      },
      {
        category: 'Utilities & Power',
        weight: 10,
        merchants: ['Tata Power Commercial', 'Airtel Enterprise Fiber'],
        minAmount: 1800,
        maxAmount: 4800,
      },
    ],
    preferredGoals: ['Festive Season Inventory Expansion', 'Commercial Office Space Renovation', '3-Month Payroll Safety Reserve'],
    loanProbability: 0.8,
    preferredLoans: [],
    preferredCommunities: [],
  },
};

export class DemoDataGenerator {
  static readonly VERSION = '1.0.0';

  static generateDataSet(
    userId: string,
    persona: UserPersona = 'WORKING_PROFESSIONAL'
  ): GeneratedDataSet {
    const config = PERSONA_CONFIGS[persona] || PERSONA_CONFIGS.WORKING_PROFESSIONAL;

    // Pick opening balance
    const initialBalance = round2(
      randomInRange(config.initialBalanceRange.min, config.initialBalanceRange.max, 2)
    );

    // 1. Transactions (50 - 75 items over 75 days)
    const txCount = randomInt(50, 72);
    const { transactions, totalIncome, totalExpenses, closingBalance } = generateTransactions(
      userId,
      persona,
      config,
      initialBalance,
      75,
      txCount
    );

    // 2. Goals (2 - 4 goals)
    const goalCount = randomInt(2, 4);
    const goals = generateGoals(userId, persona, goalCount);

    // 3. Loans (0 - 2 loans)
    const loans = generateLoans(userId, persona);

    // 4. Communities (2 - 3 communities)
    const communityCount = randomInt(2, 3);
    const communities = generateCommunities(userId, persona, communityCount);

    return {
      persona,
      generatorVersion: this.VERSION,
      generatedAt: new Date(),
      initialBalance,
      closingBalance,
      totalIncome,
      totalExpenses,
      transactions,
      goals,
      loans,
      communities,
    };
  }
}
