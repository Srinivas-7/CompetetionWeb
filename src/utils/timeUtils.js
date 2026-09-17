/**
 * Time utility for Gajotsav 2026 Competition
 * Handles IST (Asia/Kolkata) timezone calculations and 1:00 PM voting deadline
 */

// Voting deadline: 1:00 PM IST (13:00:00)
export const VOTING_DEADLINE_HOUR_IST = 13;
export const VOTING_DEADLINE_DATE = "2026-09-17"; // 17 September 2026

/**
 * Returns true if current time is after 1:00 PM IST on or after the voting end date.
 * Also returns true if URL hash is #results or #thankyou for testing/direct access.
 */
export function isVotingClosed() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('results') || hash.includes('thankyou') || hash.includes('thank-you')) {
      return true;
    }
    if (window.location.search.includes('ended=true') || window.location.search.includes('after1pm=true')) {
      return true;
    }
  }

  try {
    const now = new Date();
    // Format to Asia/Kolkata date and time
    const istDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
    const istHourString = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false });
    const istHour = parseInt(istHourString, 10);

    // If date is today (or later) and hour >= 13 (1:00 PM IST)
    if (istDateString > VOTING_DEADLINE_DATE) {
      return true;
    }
    if (istDateString === VOTING_DEADLINE_DATE && istHour >= VOTING_DEADLINE_HOUR_IST) {
      return true;
    }
  } catch (e) {
    // Fallback if Intl fails
    const now = new Date();
    if (now.getHours() >= 13) return true;
  }

  return false;
}

/**
 * Returns a human-friendly formatted IST timestamp
 */
export function getFormattedISTTimestamp() {
  try {
    return new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }) + ' IST';
  } catch (e) {
    return new Date().toLocaleString() + ' IST';
  }
}
