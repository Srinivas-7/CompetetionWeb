import { normalizePhoneNumber } from './phoneNumber';

/**
 * Strict Indian Mobile Phone Validation (10 digits starting with 6, 7, 8, or 9)
 * 
 * @param {string} rawPhone 
 * @returns {{isValid: boolean, error: string | null, phone: string}}
 */
export function validatePhoneNumber(rawPhone) {
  const phone = normalizePhoneNumber(rawPhone);

  if (!phone) {
    return {
      isValid: false,
      error: "Please enter your 10-digit mobile number.",
      phone: ""
    };
  }

  if (phone.length !== 10) {
    return {
      isValid: false,
      error: "Mobile number must be exactly 10 digits.",
      phone: phone
    };
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return {
      isValid: false,
      error: "Please enter a valid mobile number starting with 6, 7, 8, or 9.",
      phone: phone
    };
  }

  return {
    isValid: true,
    error: null,
    phone: phone
  };
}

/**
 * Validates whether the pandhal ID matches the format pandhal-01 to pandhal-21
 * 
 * @param {string} pandhalId 
 * @returns {boolean}
 */
export function isValidPandhalId(pandhalId) {
  return typeof pandhalId === 'string' && /^pandhal-(0[1-9]|1[0-9]|2[0-1])$/.test(pandhalId);
}
