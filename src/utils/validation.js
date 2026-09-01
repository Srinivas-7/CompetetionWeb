/**
 * Validates whether the pandhal ID matches the format pandhal-01 to pandhal-21
 * 
 * @param {string} pandhalId 
 * @returns {boolean}
 */
export function isValidPandhalId(pandhalId) {
  return typeof pandhalId === 'string' && /^pandhal-(0[1-9]|1[0-9]|2[0-1])$/.test(pandhalId);
}

/**
 * Validates email format for unique voter verification
 * 
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidVoterEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
