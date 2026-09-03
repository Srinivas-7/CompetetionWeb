import { isValidPandhalId } from '../utils/validation';
import { APP_CONFIG } from '../utils/constants';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, appCheck } from '../lib/firebase';
import { isFirebaseConfigured } from '../firebase/config';

class VotingService {
  constructor() {
    this.initLocalStore();
  }

  initLocalStore() {
    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES)) {
      const counts = {};
      PANDHALS_DATA.forEach((p) => {
        counts[p.id] = 0;
      });
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES, JSON.stringify(counts));
    }

    if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES)) {
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES, JSON.stringify({}));
    }
  }

  /**
   * Cast a vote with secure serverless token verification, distributed sharding, and atomic idempotency.
   * 
   * @param {string} voterEmail 
   * @param {string} pandhalId 
   * @param {string} voterName 
   * @returns {Promise<{success: boolean, message: string, pandhalName?: string, totalVotes?: number, errorType?: string}>}
   */
  async castVote(voterEmail, pandhalId, voterName = '') {
    const currentUser = auth.currentUser;
    const email = (currentUser?.email || voterEmail || '').trim().toLowerCase();

    if (!currentUser || !email) {
      return {
        success: false,
        errorType: 'INVALID_ACCOUNT',
        message: 'Please sign in with your Google account to vote.',
      };
    }

    if (!isValidPandhalId(pandhalId)) {
      return {
        success: false,
        errorType: 'INVALID_PANDHAL',
        message: 'Invalid Pandhal selected.',
      };
    }

    const pandhal = PANDHALS_DATA.find((p) => p.id === pandhalId);
    const pandhalName = pandhal ? pandhal.name : 'Selected Bappa';

    // 1. Production Path: POST to Serverless /api/vote with cryptographic Firebase ID token
    try {
      const idToken = await currentUser.getIdToken(true);
      
      const headers = {
        'Content-Type': 'application/json',
      };

      // Optional App Check Token header
      if (appCheck && typeof window !== 'undefined') {
        try {
          const { getToken } = await import('firebase/app-check');
          const appCheckResult = await getToken(appCheck, false);
          if (appCheckResult?.token) {
            headers['X-Firebase-AppCheck'] = appCheckResult.token;
          }
        } catch {
          // App check token fetch failure is non-blocking
        }
      }

      // Execute request with retry mechanism (exponential backoff) for transient network hiccups
      const response = await this.fetchWithRetry('/api/vote', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idToken,
          pandhalId,
          pandhalName,
          voterName: voterName || currentUser.displayName || '',
        }),
      }, 2);

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        // CONFIRMED BY SERVER: Save voter record locally for instant UI state
        this.saveMyVoteRecord(email, pandhalId, pandhalName, voterName || currentUser.displayName);
        
        // Notify any active local storage listeners
        window.dispatchEvent(new Event('storage'));

        return {
          success: true,
          message: data.message || `Your vote for ${pandhalName} is locked!`,
          pandhalName,
          totalVotes: data.totalVotes,
          idempotent: data.idempotent,
        };
      }

      // Server rejected vote with specific status code
      if (response.status === 409) {
        // Already voted for another pandhal
        if (data.previousPandhalId) {
          this.saveMyVoteRecord(email, data.previousPandhalId, data.previousPandhalName || 'Another Bappa', voterName);
        }
        return {
          success: false,
          errorType: 'ALREADY_VOTED',
          message: data.message || 'You have already voted for a different Bappa. Only 1 vote per Google account is allowed.',
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          errorType: 'RATE_LIMIT',
          message: data.message || 'Too many requests. Please wait a few moments and try again.',
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          errorType: 'AUTH_EXPIRED',
          message: 'Your Google sign-in has expired. Please sign in again.',
        };
      }

      // If the API endpoint is not found (404, e.g., local standalone vite preview), fallback gracefully
      if (response.status === 404 && !isFirebaseConfigured()) {
        console.warn('[VotingService] /api/vote returned 404. Falling back to local simulator.');
        return this.castVoteLocalSimulator(email, pandhalId, pandhalName, voterName);
      }

      return {
        success: false,
        errorType: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to submit vote to server. Please try again.',
      };
    } catch (networkError) {
      console.error('[VotingService] Network error during vote submission:', networkError);

      // In local dev without backend, fallback if Firebase is not fully active
      if (!isFirebaseConfigured()) {
        return this.castVoteLocalSimulator(email, pandhalId, pandhalName, voterName);
      }

      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: 'Network connection lost while recording vote. Please check your internet connection and try again.',
      };
    }
  }

  /**
   * Helper for robust network requests with exponential backoff & jitter
   */
  async fetchWithRetry(url, options, maxRetries = 2) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(url, options);
        // Do not retry 4xx client errors (bad request, conflict, auth)
        if (res.status < 500 && res.status !== 429) {
          return res;
        }
        // If 5xx server error and we have retries left, backoff
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 300 + Math.random() * 200;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        return res;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 300 + Math.random() * 200;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
      }
    }
    throw lastError || new Error('Network request failed');
  }

  async castVoteLocalSimulator(email, pandhalId, pandhalName, voterName) {
    const delay = Math.floor(Math.random() * 150) + 200;
    await new Promise((r) => setTimeout(r, delay));

    const votesDb = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES) || '{}');

    if (votesDb[email]) {
      const prevId = votesDb[email].pandhalId;
      const prev = PANDHALS_DATA.find((p) => p.id === prevId);
      const prevName = prev ? prev.name : 'another Bappa';
      return {
        success: false,
        errorType: 'ALREADY_VOTED',
        message: `Your Google account has already cast a vote for "${prevName}". Only 1 vote per account is permitted.`,
      };
    }

    votesDb[email] = {
      email,
      voterName,
      pandhalId,
      pandhalName,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CAST_VOTES, JSON.stringify(votesDb));

    const counts = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES) || '{}');
    counts[pandhalId] = (counts[pandhalId] || 0) + 1;
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES, JSON.stringify(counts));

    this.saveMyVoteRecord(email, pandhalId, pandhalName, voterName);
    window.dispatchEvent(new Event('storage'));

    return {
      success: true,
      message: `Your vote for ${pandhalName} is locked!`,
      pandhalName,
      totalVotes: counts[pandhalId],
    };
  }

  saveMyVoteRecord(email, pandhalId, pandhalName, voterName) {
    const record = {
      email,
      voterName,
      pandhalId,
      pandhalName,
      votedAt: new Date().toISOString(),
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

  /**
   * Subscribes to live counts via cached /api/counters aggregation with smart polling.
   */
  subscribeLiveCounts(callback) {
    let isActive = true;

    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/counters');
        if (res.ok) {
          const data = await res.json();
          if (data && data.counts && isActive) {
            callback(data.counts);
            return;
          }
        }
      } catch {
        // Ignore background polling errors
      }

      // Local storage fallback
      if (isActive) {
        const localCounts = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PANDHAL_VOTES) || '{}');
        callback(localCounts);
      }
    };

    // Initial fetch
    fetchCounts();

    // Smart polling: poll every 20s when active, pause when hidden
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCounts();
      }
    }, 20000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCounts();
      }
    };

    const handleStorage = () => {
      if (isActive) fetchCounts();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      isActive = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('storage', handleStorage);
    };
  }
}

export const votingService = new VotingService();
