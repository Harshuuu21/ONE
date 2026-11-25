/**
 * Global Indian Rupee (INR) Currency Utility for ONE.
 *
 * Standardizes currency representation using:
 * - Locale: 'en-IN'
 * - Currency: 'INR'
 * - Symbol: '₹'
 * - Proper Indian numbering format (e.g., ₹1,000, ₹10,000, ₹1,00,000, ₹10,00,000, ₹1,00,00,000)
 */

export interface CurrencyFormatOptions {
  /**
   * Minimum fraction digits to display.
   * Defaults to 0 for integers, 2 for floating-point amounts or when showDecimals is true.
   */
  minimumFractionDigits?: number;

  /**
   * Maximum fraction digits to display.
   * Defaults to 0 for integers, 2 for floating-point amounts or when showDecimals is true.
   */
  maximumFractionDigits?: number;

  /**
   * Force 2 decimal places (useful for bank balances, accounts, and financial ledgers).
   */
  showDecimals?: boolean;

  /**
   * Sign display behavior ('auto' | 'always' | 'exceptZero' | 'never').
   */
  signDisplay?: 'auto' | 'always' | 'exceptZero' | 'never';
}

/**
 * Formats a monetary amount into Indian Rupee format with Indian number grouping.
 *
 * Examples:
 * - formatCurrency(100) -> "₹100"
 * - formatCurrency(1000) -> "₹1,000"
 * - formatCurrency(10000) -> "₹10,000"
 * - formatCurrency(100000) -> "₹1,00,000"
 * - formatCurrency(1000000) -> "₹10,00,000"
 * - formatCurrency(10000000) -> "₹1,00,00,000"
 * - formatCurrency(12500.5) -> "₹12,500.50"
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options?: CurrencyFormatOptions
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }

  const numericAmount = typeof amount === 'number' ? amount : Number(amount);
  const isInteger = Number.isInteger(numericAmount);

  const minDigits =
    options?.minimumFractionDigits !== undefined
      ? options.minimumFractionDigits
      : options?.showDecimals || !isInteger
      ? 2
      : 0;

  const maxDigits =
    options?.maximumFractionDigits !== undefined
      ? options.maximumFractionDigits
      : options?.showDecimals || !isInteger
      ? 2
      : 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
    signDisplay: options?.signDisplay ?? 'auto',
  }).format(numericAmount);
}

/**
 * Formats currency with guaranteed two decimal places (e.g., ₹1,000.00).
 */
export function formatCurrencyWithDecimals(amount: number | string | null | undefined): string {
  return formatCurrency(amount, { showDecimals: true });
}

/**
 * Alias for backward compatibility across existing ONE feature modules.
 */
export const currency = (amount: number | string | null | undefined): string => formatCurrency(amount);

/**
 * Alias for formatCurrency.
 */
export const formatRupee = formatCurrency;
