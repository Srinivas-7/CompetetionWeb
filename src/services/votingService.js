import { validatePhoneNumber, isValidPandhalId } from '../utils/validation';
import { APP_CONFIG } from '../utils/constants';
import { PANDHALS_DATA } from '../data/pandhals';
import { executeFirebaseVote, subscribeToFirebaseCounters } from '../firebase/voting';
import { isFirebaseConfigured } from '../firebase/config';

class VotingService {
  constructor() {
    this.initLocalStore();
  }

  initLocalStore() {
    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES)) {
      const counts = {};
      PANDHALS_DATA.forEach(p => {
        counts[p.id] = p.initialVotes;
      });
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES, JSON.stringify(counts));
    }

    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES)) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES, JSON.stringify({}));
    }
  }

  /**
   * Cast a vote with 1-phone-number = 1-vote integrity
   * 
   * @param {string} rawPhone 
   * @param {string} pandhalId 
   * @returns {Promise<{success: boolean, message: string, pandhalName?: string, totalVotes?: number, errorType?: string}>}
   */
  async castVote(rawPhone, pandhalId) {
    // 1. Phone validation
    const validation = validatePhoneNumber(rawPhone);
    if (!validation.isValid) {
      return {
        success: false,
        errorType: 'INVALID_PHONE',
        message: validation.error
      };
    }
    const phone = validation.phone;

    // 2. Pandhal validation
    if (!isValidPandhalId(pandhalId)) {
      return {
        success: false,
        errorType: 'INVALID_PANDHAL',
        message: "Invalid Pandhal selected."
      };
    }

    const pandhal = PANDHALS_DATA.find(p => p.id === pandhalId);
    const pandhalName = pandhal ? pandhal.name : 'Selected Bappa';

    // 3. Execution (Firebase or Local Simulator)
    if (isFirebaseConfigured()) {
      try {
        const result = await executeFirebaseVote(phone, pandhalId, pandhalName);
        if (result.success) {
          this.saveMyVoteRecord(phone, pandhalId, pandhalName);
          return {
            success: true,
            message: `Your vote for ${pandhalName} is locked!`,
            pandhalName,
            totalVotes: result.totalVotes
          };
        } else if (result.error === 'ALREADY_VOTED') {
          const prev = PANDHALS_DATA.find(p => p.id === result.previousPandhalId);
          const prevName = prev ? prev.name : 'another Bappa';
          return {
            success: false,
            errorType: 'ALREADY_VOTED',
            message: `This phone number (${phone}) has already voted for "${prevName}". Each number can vote once.`
          };
        }
      } catch (err) {
        console.error("Firebase voting error:", err);
        return {
          success: false,
          errorType: 'NETWORK_ERROR',
          message: "Bappa is taking a little longer to arrive. Please check your connection and try again."
        };
      }
    }

    // 4. Local Simulator (Atomic Simulation)
    return this.castVoteLocalSimulator(phone, pandhalId, pandhalName);
  }

  async castVoteLocalSimulator(phone, pandhalId, pandhalName) {
    // Artificial jitter (350-700ms) to test 0.50s loading transition
    const delay = Math.floor(Math.random() * 350) + 350;
    await new Promise(r => setTimeout(r, delay));

    const votesDb = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES) || '{}');

    if (votesDb[phone]) {
      const prevId = votesDb[phone].pandhalId;
      const prev = PANDHALS_DATA.find(p => p.id === prevId);
      const prevName = prev ? prev.name : 'another Bappa';
      return {
        success: false,
        errorType: 'ALREADY_VOTED',
        message: `This phone number has already cast a vote for "${prevName}". Only 1 vote per phone number is permitted across the trail.`
      };
    }

    // Atomic write
    votesDb[phone] = {
      phone,
      pandhalId,
      pandhalName,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES, JSON.stringify(votesDb));

    // Update Counts
    const counts = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES) || '{}');
    const pandhal = PANDHALS_DATA.find(p => p.id === pandhalId);
    counts[pandhalId] = (counts[pandhalId] || (pandhal ? pandhal.initialVotes : 0)) + 1;
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES, JSON.stringify(counts));

    this.saveMyVoteRecord(phone, pandhalId, pandhalName);

    // Trigger storage event for live multi-tab updates
    window.dispatchEvent(new Event('storage'));

    return {
      success: true,
      message: `Your vote for ${pandhalName} is locked!`,
      pandhalName,
      totalVotes: counts[pandhalId]
    };
  }

  saveMyVoteRecord(phone, pandhalId, pandhalName) {
    const record = {
      phone,
      pandhalId,
      pandhalName,
      votedAt: new Date().toISOString()
    };
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.MY_VOTE, JSON.stringify(record));
  }

  getMyVote() {
    try {
      return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.MY_VOTE) || 'null');
    } catch {
      return null;
    }
  }

  subscribeLiveCounts(callback) {
    if (isFirebaseConfigured()) {
      return subscribeToFirebaseCounters(callback);
    }

    // Local subscription
    const handleStorage = () => {
      const counts = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES) || '{}');
      callback(counts);
    };

    window.addEventListener('storage', handleStorage);
    // Initial emit
    handleStorage();

    return () => window.removeEventListener('storage', handleStorage);
  }
}

export const votingService = new VotingService();
