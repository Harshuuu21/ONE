/**
 * Normalizes and formats Indian 10-digit mobile numbers
 */
export function validateIndianMobile(raw: string): { isValid: boolean; normalized: string; error?: string } {
  const digits = raw.replace(/\D/g, '');

  let tenDigit = '';
  if (digits.length === 10) {
    tenDigit = digits;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    tenDigit = digits.substring(2);
  } else {
    return {
      isValid: false,
      normalized: '',
      error: 'Please enter a 10-digit mobile number',
    };
  }

  // Accept any valid 10 digits
  if (!/^\d{10}$/.test(tenDigit)) {
    return {
      isValid: false,
      normalized: '',
      error: 'Please enter a valid 10-digit mobile number',
    };
  }

  return {
    isValid: true,
    normalized: `+91${tenDigit}`,
  };
}

/**
 * Formats a 10-digit string into readable chunks: 98765 43210
 */
export function formatMobileDisplay(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

