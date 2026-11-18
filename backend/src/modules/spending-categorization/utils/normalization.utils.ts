/**
 * Normalization utilities for merchant names, strings, and UPI VPAs
 */

const BUSINESS_STOP_WORDS = new Set([
  'the',
  'and',
  'of',
  'in',
  'to',
  'for',
  'at',
  'by',
  'pvt',
  'ltd',
  'private',
  'limited',
  'llp',
  'inc',
  'corp',
  'corporation',
  'enterprises',
  'solutions',
  'services',
  'technologies',
  'india',
  'co',
  'company',
  'pay',
  'payments',
  'retail',
]);

const ABBREVIATION_MAP: Record<string, string> = {
  'private limited': 'pvt ltd',
  'private ltd': 'pvt ltd',
  'pvt. ltd.': 'pvt ltd',
  'pvt.ltd.': 'pvt ltd',
  'pvt.': 'pvt',
  'ltd.': 'ltd',
  'corp.': 'corp',
  'inc.': 'inc',
  'co.': 'co',
  'pharmacy': 'pharmacy',
  'medicals': 'medicals',
  'petrol pump': 'fuel station',
  'cng station': 'fuel station',
};

/**
 * Strips diacritics and normalizes unicode characters using NFKD form
 */
export function normalizeUnicode(str: string): string {
  if (!str) return '';
  return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalizes text: lowercasing, abbreviation expansion, whitespace collapsing, punctuation cleanup
 */
export function normalizeText(text: string | undefined | null): string {
  if (!text) return '';

  let normalized = normalizeUnicode(text.toLowerCase());

  // Replace common abbreviation phrases
  for (const [abbr, repl] of Object.entries(ABBREVIATION_MAP)) {
    normalized = normalized.split(abbr).join(repl);
  }

  // Remove punctuation except basic alphanumeric, spaces, and hyphens
  normalized = normalized.replace(/[^a-z0-9\s-]/g, ' ');

  // Collapse multiple whitespaces and trim
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Tokenizes normalized string into significant merchant keywords, filtering business stop-words
 */
export function extractKeywords(normalizedText: string): string[] {
  if (!normalizedText) return [];

  const tokens = normalizedText.split(/[\s-]+/);
  const keywords = tokens.filter(
    (token) => token.length >= 2 && !BUSINESS_STOP_WORDS.has(token)
  );

  return Array.from(new Set(keywords));
}

/**
 * Parses and normalizes a UPI ID (VPA)
 * Example: "APOLLO.pharmacy@UPI" -> { normalized: "apollo.pharmacy@upi", handle: "apollo.pharmacy", domain: "upi" }
 */
export function normalizeUpiId(rawUpi: string | undefined | null): {
  normalized?: string;
  handle?: string;
  domain?: string;
} {
  if (!rawUpi) return {};

  let clean = rawUpi.trim().toLowerCase();

  // Strip URI schema if present (e.g. "upi://pay?pa=swiggy@icici...")
  if (clean.includes('pa=')) {
    const match = clean.match(/pa=([^&]+)/);
    if (match) clean = match[1];
  }

  // Strip trailing slashes or parameters
  clean = clean.split(/[?#/]/)[0].trim();

  if (!clean.includes('@')) {
    return { normalized: clean, handle: clean };
  }

  const [handle, domain] = clean.split('@');
  return {
    normalized: `${handle}@${domain}`,
    handle,
    domain,
  };
}
