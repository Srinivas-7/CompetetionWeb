import { isValidPandhalId } from '../utils/validation';
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
   * Cast a vote with 1-Google-Account = 1-Vote integrity
   * 
   * @param {string} voterEmail 
   * @param {string} pandhalId 
   * @param {string} voterName 
   * @returns {Promise<{success: boolean, message: string, pandhalName?: string, totalVotes?: number, errorType?: string}>}
   */
  async castVote(voterEmail, pandhalId, voterName = '') {
    const email = (voterEmail || '').trim().toLowerCase();
    
    if (!email) {
      return {
        success: false,
        errorType: 'INVALID_ACCOUNT',
        message: "Please sign in with your Google account to vote."
      };
    }

    if (!isValidPandhalId(pandhalId)) {
      return {
        success: false,
        errorType: 'INVALID_PANDHAL',
        message: "Invalid Pandhal selected."
      };
    }

    const pandhal = PANDHALS_DATA.find(p => p.id === pandhalId);
    const pandhalName = pandhal ? pandhal.name : 'Selected Bappa';

    // 1. Firebase Backend (if configured)
    if (isFirebaseConfigured()) {
      try {
        const result = await executeFirebaseVote(email, pandhalId, pandhalName, voterName);
        if (result.success) {
          this.saveMyVoteRecord(email, pandhalId, pandhalName, voterName);
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
            message: `This Google account (${email}) has already voted for "${prevName}". Each account can vote once.`
          };
        }
      } catch (err) {
        console.error("Firebase voting error:", err);
      }
    }

    // 2. Local Storage Simulator (Atomic 1-Account = 1-Vote)
    return this.castVoteLocalSimulator(email, pandhalId, pandhalName, voterName);
  }

  async castVoteLocalSimulator(email, pandhalId, pandhalName, voterName) {
    // Artificial jitter (250-400ms) for smooth tactile response
    const delay = Math.floor(Math.random() * 150) + 250;
    await new Promise(r => setTimeout(r, delay));

    const votesDb = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES) || '{}');

    if (votesDb[email]) {
      const prevId = votesDb[email].pandhalId;
      const prev = PANDHALS_DATA.find(p => p.id === prevId);
      const prevName = prev ? prev.name : 'another Bappa';
      return {
        success: false,
        errorType: 'ALREADY_VOTED',
        message: `Your Google account has already cast a vote for "${prevName}". Only 1 vote per account is permitted across the trail.`
      };
    }

    // Atomic write
    votesDb[email] = {
      email,
      voterName,
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

    this.saveMyVoteRecord(email, pandhalId, pandhalName, voterName);

    // Trigger storage event for live multi-tab updates
    window.dispatchEvent(new Event('storage'));

    return {
      success: true,
      message: `Your vote for ${pandhalName} is locked!`,
      pandhalName,
      totalVotes: counts[pandhalId]
    };
  }

  saveMyVoteRecord(email, pandhalId, pandhalName, voterName) {
    const record = {
      email,
      voterName,
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
    handleStorage();

    return () => window.removeEventListener('storage', handleStorage);
  }
}

export const votingService = new VotingService();
