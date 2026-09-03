import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, appCheck } from '../lib/firebase';
import { getFirestoreDb } from '../firebase/firestore';
import { doc, onSnapshot, getDoc, collectionGroup, getDocs } from 'firebase/firestore';

const EVENT_ID = 'ganapathi_chaturthi_2026';

class VotingService {
  constructor() {
    // Clear any legacy mock votes from local storage on startup
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bappatrail_cast_votes');
        localStorage.removeItem('bappatrail_pandhal_votes');
      } catch {}
    }
  }

  /**
   * Subscribes in real-time to the current authenticated user's vote record in Firebase.
   * If the user is deleted or has not voted, returns null.
   * 
   * @param {string} uid - Firebase Auth User UID
   * @param {function} callback - Receives { pandhalId, pandhalName, votedAt } or null
   * @returns {function} Unsubscribe function
   */
  subscribeUserVote(uid, callback) {
    if (!uid) {
      callback(null);
      return () => {};
    }

    const db = getFirestoreDb();
    if (!db) {
      callback(null);
      return () => {};
    }

    try {
      const voterDocRef = doc(db, 'voters', `${EVENT_ID}_${uid}`);

      const unsubscribe = onSnapshot(voterDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          callback({
            pandhalId: data.pandhalId,
            pandhalName: data.pandhalName || data.pandhalId,
            votedAt: data.votedAt,
          });
        } else {
          // Document does not exist in Firebase -> User has 0 recorded votes
          callback(null);
        }
      }, (err) => {
        console.warn('[VotingService] Live user vote listener info:', err);
        callback(null);
      });

      return unsubscribe;
    } catch (err) {
      console.warn('[VotingService] Error subscribing to user vote:', err);
      callback(null);
      return () => {};
    }
  }

  /**
   * Cast a vote with secure serverless token verification and distributed sharding.
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

    // 1. Primary Path: POST to Serverless /api/vote with cryptographic Firebase ID token
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

      // Execute request with retry mechanism (exponential backoff)
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

      // Server rejected vote with specific status code
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

  /**
   * Subscribes to live counts via /api/counters and direct Firestore fallback.
   * 
   * @param {function} callback - Receives { [pandhalId]: number }
   * @returns {function} Unsubscribe function
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
        // Fallback to direct Firestore read if /api/counters is unavailable
      }

      // Direct Firestore fallback
      if (isActive) {
        const db = getFirestoreDb();
        if (db) {
          try {
            const shardsSnap = await getDocs(collectionGroup(db, 'shards'));
            if (!shardsSnap.empty && isActive) {
              const counts = {};
              PANDHALS_DATA.forEach(p => counts[p.id] = 0);
              shardsSnap.forEach(docSnap => {
                const count = docSnap.data().count || 0;
                const pathParts = docSnap.ref.path.split('/');
                const pId = pathParts[1];
                if (pId && counts[pId] !== undefined) {
                  counts[pId] += count;
                }
              });
              callback(counts);
            }
          } catch (err) {
            console.warn('[VotingService] Direct Firestore counters fetch info:', err);
          }
        }
      }
    };

    // Initial fetch
    fetchCounts();

    // Smart polling: poll every 15s when active, pause when hidden
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchCounts();
      }
    }, 15000);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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
