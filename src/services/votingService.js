import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, appCheck } from '../lib/firebase';
import { getFirestoreDb } from '../firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

const EVENT_ID = 'ganapathi_chaturthi_2026';

class VotingService {
  constructor() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bappatrail_cast_votes');
        localStorage.removeItem('bappatrail_pandhal_votes');
        localStorage.removeItem('bappatrail_my_vote');
      } catch {}
    }
  }

  /**
   * Checks the user's vote record directly from Firestore or cache.
   * If an administrator deletes the voter document, returns null.
   * 
   * @param {string} uid - Firebase Auth User UID
   * @param {function} callback - Receives { pandhalId, pandhalName, votedAt } or null
   * @returns {function} Cleanup function
   */
  subscribeUserVote(uid, callback) {
    if (!uid) {
      callback(null);
      return () => {};
    }

    let isActive = true;

    const checkVote = async () => {
      const db = getFirestoreDb();
      if (!db || !isActive) return;

      try {
        const voterDocRef = doc(db, 'voters', `${EVENT_ID}_${uid}`);
        const docSnap = await getDoc(voterDocRef);

        if (isActive) {
          if (docSnap.exists()) {
            const data = docSnap.data();
            callback({
              pandhalId: data.pandhalId,
              pandhalName: data.pandhalName || data.pandhalId,
              votedAt: data.votedAt,
            });
          } else {
            callback(null);
          }
        }
      } catch (err) {
        if (isActive) callback(null);
      }
    };

    checkVote();

    // Check again on tab focus / visibility change
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && isActive) {
        checkVote();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isActive = false;
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }

  /**
   * Cast a vote through the secure /api/vote serverless endpoint.
   * Enforces server-side ID token verification, deterministic sharding, and atomic idempotency.
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

    try {
      const idToken = await currentUser.getIdToken(true);
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (appCheck && typeof window !== 'undefined') {
        try {
          const { getToken } = await import('firebase/app-check');
          const appCheckResult = await getToken(appCheck, false);
          if (appCheckResult?.token) {
            headers['X-Firebase-AppCheck'] = appCheckResult.token;
          }
        } catch {}
      }

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
        return {
          success: true,
          message: data.message || `Your vote for ${pandhalName} is locked!`,
          pandhalName,
          totalVotes: data.totalVotes,
          idempotent: data.idempotent,
        };
      }

      if (response.status === 409) {
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

      return {
        success: false,
        errorType: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to submit vote to server. Please try again.',
      };
    } catch (networkError) {
      console.error('[VotingService] Network error during vote submission:', networkError);

      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: 'Network connection lost while recording vote. Please check your internet connection and try again.',
      };
    }
  }

  async fetchWithRetry(url, options, maxRetries = 2) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(url, options);
        if (res.status < 500 && res.status !== 429) {
          return res;
        }
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

  /**
   * Subscribes to live counts via /api/counters endpoint with smart 20s polling.
   * Pauses automatically when tab is hidden (document.visibilityState === 'hidden').
   * 
   * @param {function} callback - Receives { [pandhalId]: number }
   * @returns {function} Cleanup function
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
          }
        }
      } catch (err) {
        // Polling error silently handled
      }
    };

    // Initial fetch
    fetchCounts();

    // Smart polling: every 20 seconds, only when tab is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && isActive) {
        fetchCounts();
      }
    }, 20000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        fetchCounts();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      isActive = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }
}

export const votingService = new VotingService();
