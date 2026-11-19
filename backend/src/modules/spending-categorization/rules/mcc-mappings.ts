import { MCCMappingRecord } from '../types/index.js';

/**
 * Authoritative ISO 18245 Merchant Category Code (MCC) Table
 * Strictly uses real, standardized banking MCC codes.
 */
export const MCC_MAPPINGS: Record<string, MCCMappingRecord> = {
  // --- MEDICINE ---
  '5912': {
    code: '5912',
    description: 'Drug Stores and Pharmacies',
    category: 'MEDICINE',
    isBroad: false,
  },
  '8062': {
    code: '8062',
    description: 'Hospitals',
    category: 'MEDICINE',
    isBroad: false,
  },
  '8099': {
    code: '8099',
    description: 'Medical Services and Health Practitioners - Not Elsewhere Classified',
    category: 'MEDICINE',
    isBroad: false,
  },

  // --- FOOD ---
  '5812': {
    code: '5812',
    description: 'Eating Places and Restaurants',
    category: 'FOOD',
    isBroad: false,
  },
  '5814': {
    code: '5814',
    description: 'Fast Food Restaurants',
    category: 'FOOD',
    isBroad: false,
  },

  // --- GROCERIES ---
  '5411': {
    code: '5411',
    description: 'Grocery Stores and Supermarkets',
    category: 'GROCERIES',
    isBroad: false,
  },
  '5499': {
    code: '5499',
    description: 'Miscellaneous Food Stores - Convenience Stores and Specialty Markets',
    category: 'GROCERIES',
    isBroad: false,
  },

  // --- PETROL ---
  '5541': {
    code: '5541',
    description: 'Service Stations (Fuel Dispensing)',
    category: 'PETROL',
    isBroad: false,
  },
  '5542': {
    code: '5542',
    description: 'Automated Fuel Dispensers',
    category: 'PETROL',
    isBroad: false,
  },

  // --- SHOPPING ---
  '5651': {
    code: '5651',
    description: 'Family Clothing Stores',
    category: 'SHOPPING',
    isBroad: false,
  },
  '5691': {
    code: '5691',
    description: "Men's and Women's Clothing Stores",
    category: 'SHOPPING',
    isBroad: false,
  },
  '5732': {
    code: '5732',
    description: 'Electronic Sales',
    category: 'SHOPPING',
    isBroad: false,
  },
  '5311': {
    code: '5311',
    description: 'Department Stores (E-commerce / Multi-category Retailers)',
    category: 'SHOPPING',
    isBroad: true, // Broad: e.g. Amazon / Flipkart sells groceries, electronics, digital subscriptions
    alternativeCategories: ['GROCERIES', 'SUBSCRIPTION'],
  },
  '5999': {
    code: '5999',
    description: 'Miscellaneous and Specialty Retail Stores',
    category: 'SHOPPING',
    isBroad: true,
  },

  // --- SUBSCRIPTION ---
  '4899': {
    code: '4899',
    description: 'Cable, Satellite, and Other Pay Television/Radio Services',
    category: 'SUBSCRIPTION',
    isBroad: false,
  },
  '5815': {
    code: '5815',
    description: 'Digital Goods - Media, Books, Movies, Music',
    category: 'SUBSCRIPTION',
    isBroad: false,
  },

  // --- TRANSPORT ---
  '4111': {
    code: '4111',
    description: 'Local and Suburban Commuter Passenger Transportation',
    category: 'TRANSPORT',
    isBroad: false,
  },
  '4121': {
    code: '4121',
    description: 'Taxicabs and Limousines (Ride-Hailing / Cabs)',
    category: 'TRANSPORT',
    isBroad: false,
  },
  '4011': {
    code: '4011',
    description: 'Railroads - Passenger (IRCTC / Metro)',
    category: 'TRANSPORT',
    isBroad: false,
  },

  // --- OUTING ---
  '7832': {
    code: '7832',
    description: 'Motion Picture Theaters',
    category: 'OUTING',
    isBroad: false,
  },
  '7999': {
    code: '7999',
    description: 'Recreation Services - Not Elsewhere Classified',
    category: 'OUTING',
    isBroad: false,
  },

  // --- BILLS_UTILITIES ---
  '4900': {
    code: '4900',
    description: 'Electric, Gas, Sanitary and Water Utilities',
    category: 'BILLS_UTILITIES',
    isBroad: false,
  },
  '4814': {
    code: '4814',
    description: 'Telecommunication Services (Broadband, Mobile Postpaid/Prepaid)',
    category: 'BILLS_UTILITIES',
    isBroad: false,
  },

  // --- EDUCATION ---
  '8211': {
    code: '8211',
    description: 'Elementary and Secondary Schools',
    category: 'EDUCATION',
    isBroad: false,
  },
  '8220': {
    code: '8220',
    description: 'Colleges, Junior Colleges, Universities',
    category: 'EDUCATION',
    isBroad: false,
  },
  '8299': {
    code: '8299',
    description: 'Schools and Educational Services - Not Elsewhere Classified',
    category: 'EDUCATION',
    isBroad: false,
  },

  // --- RENT ---
  '6513': {
    code: '6513',
    description: 'Real Estate Agents and Managers - Rentals',
    category: 'RENT',
    isBroad: false,
  },

  // --- INSURANCE ---
  '6300': {
    code: '6300',
    description: 'Insurance Underwriting, Premiums',
    category: 'INSURANCE',
    isBroad: false,
  },

  // --- INVESTMENT ---
  '6211': {
    code: '6211',
    description: 'Security Brokers/Dealers (Stock Exchanges, Mutual Fund Portals)',
    category: 'INVESTMENT',
    isBroad: false,
  },
  '6012': {
    code: '6012',
    description: 'Financial Institutions - Merchandise and Services',
    category: 'INVESTMENT',
    isBroad: true,
    alternativeCategories: ['BILLS_UTILITIES'],
  },
};

export function lookupMcc(mcc: string | number | undefined): MCCMappingRecord | null {
  if (!mcc) return null;
  const normalized = String(mcc).trim().padStart(4, '0');
  return MCC_MAPPINGS[normalized] || null;
}

