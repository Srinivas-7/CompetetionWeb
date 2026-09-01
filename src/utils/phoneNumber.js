/**
 * Normalizes input string to a clean 10-digit Indian phone number.
 * Removes spaces, dashes, +91 prefixes.
 * 
 * @param {string} rawPhone 
 * @returns {string} 10-digit clean phone string
 */
export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return '';
  const digits = rawPhone.replace(/\D/g, '');
  return digits.slice(-10);
}

/**
 * Formats a 10-digit phone number for clean UI display: "98765 43210"
 * 
 * @param {string} phone 
 * @returns {string} Formatted string
 */
export function formatPhoneNumber(phone) {
  const clean = normalizePhoneNumber(phone);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}
