import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, db, getAppCheckToken } from '../lib/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

const EVENT_ID = 'ganapathi_chaturthi_2026';

class VotingService {
  constructor() {
    this.myVoteCache = null;
    this.countsCache = {};
    PANDHALS_DATA.forEach((p) => {
      this.countsCache[p.id] = 0;
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bappatrail_cast_votes');
        localStorage.removeItem('bappatrail_pandhal_votes');
        localStorage.removeItem('bappatrail_my_vote');
      } catch {}
    }
  }

  /**
   * Returns currently cached vote record for the active user
   */
  getMyVote() {
    return this.myVoteCache;
  }

  /**
   * Sets cached vote record
   */
  setMyVote(voteData) {
    this.myVoteCache = voteData;
  }

  /**
   * Subscribes to the authenticated user's individual voter record in Firestore.
   * Security rules permit reading only the user's own voter document (/voters/{EVENT_ID}_{UID}).
   * 
   * @param {string} uid - Firebase Auth User UID
   * @param {function} callback - Receives { pandhalId, pandhalName, votedAt } or null
   * @returns {function} Unsubscribe cleanup function
   */
  subscribeUserVote(uid, callback) {
    if (!uid) {
      this.myVoteCache = null;
      callback(null);
      return () => {};
    }

    if (!db) {
      callback(null);
      return () => {};
    }

    try {
      const voterDocRef = doc(db, 'voters', `${EVENT_ID}_${uid}`);
      const unsubscribe = onSnapshot(
        voterDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const voteData = {
              pandhalId: data.pandhalId,
              pandhalName: data.pandhalName || data.pandhalId,
              votedAt: data.votedAt,
            };
            this.myVoteCache = voteData;
            callback(voteData);
          } else {
            this.myVoteCache = null;
            callback(null);
          }
        },
        (err) => {
          console.warn('[VotingService] subscribeUserVote warning:', err?.message || err);
          callback(this.myVoteCache);
        }
      );

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (err) {
      console.warn('[VotingService] subscribeUserVote error:', err);
      callback(null);
      return () => {};
    }
  }

  /**
   * Casts a verified vote via the secure serverless backend endpoint (/api/vote).
   * Validates Firebase ID token cryptographically server-side, executes an atomic
   * 1-account-1-vote Firestore transaction across 10 deterministic shards, and returns
   * the verified server result.
   * 
   * @param {string} voterEmail - Devotee email (for display/reference)
   * @param {string} pandhalId - Target pandhal ID (pandhal-01 ... pandhal-21)
   * @param {string} voterName - Voter display name
   * @returns {Promise<{success: boolean, message: string, pandhalId?: string, pandhalName?: string, errorType?: string, idempotent?: boolean}>}
   */
  async castVote(voterEmail, pandhalId, voterName = '') {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.uid) {
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
      // 1. Obtain fresh cryptographically signed Firebase ID token
      const idToken = await currentUser.getIdToken(false);

      // 2. Obtain Firebase App Check token (if configured)
      const appCheckToken = await getAppCheckToken(false);

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      };

      if (appCheckToken) {
        requestHeaders['X-Firebase-AppCheck'] = appCheckToken;
      }

      // 3. Call backend /api/vote serverless function
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          idToken,
          pandhalId,
          pandhalName,
          voterName: currentUser.displayName || voterName || 'Devotee',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        const voteRecord = {
          pandhalId,
          pandhalName,
          votedAt: new Date().toISOString(),
        };
        this.myVoteCache = voteRecord;

        return {
          success: true,
          message: data.message || `Your vote for ${pandhalName} is successfully locked!`,
          pandhalId,
          pandhalName,
          idempotent: Boolean(data.idempotent),
        };
      }

      if (response.status === 409) {
        // Already voted for another pandhal
        const previousPandhalName = data.previousPandhalName || 'another Bappa';
        const previousPandhalId = data.previousPandhalId;
        this.myVoteCache = {
          pandhalId: previousPandhalId || 'unknown',
          pandhalName: previousPandhalName,
        };

        return {
          success: false,
          errorType: 'ALREADY_VOTED',
          message: data.message || `Your Google account has already voted for "${previousPandhalName}". Only 1 vote per account is allowed.`,
          previousPandhalId,
          previousPandhalName,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          errorType: 'RATE_LIMIT_EXCEEDED',
          message: data.message || 'Too many rapid voting attempts. Please wait a few moments.',
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          errorType: 'INVALID_TOKEN',
          message: data.message || 'Your sign-in session expired. Please sign in again with Google.',
        };
      }

      return {
        success: false,
        errorType: data.error || 'VOTE_FAILED',
        message: data.message || 'Unable to record your vote right now. Please try again.',
      };
    } catch (err) {
      console.error('[VotingService] Network/API vote error:', err);
      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: 'Network connection issue. Please check your connection and try again.',
      };
    }
  }

  /**
   * Fetches latest aggregated shard counts from the serverless edge endpoint (/api/counters).
   * Edge-cached for 20s (stale-while-revalidate=60s).
   * 
   * @returns {Promise<{counts: Record<string, number>, totalVotes: number}>}
   */
  async fetchLiveCounts() {
    try {
      const response = await fetch('/api/counters');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.counts) {
          this.countsCache = { ...this.countsCache, ...data.counts };
          return {
            counts: this.countsCache,
            totalVotes: typeof data.totalVotes === 'number' ? data.totalVotes : 0,
          };
        }
      }
    } catch (err) {
      console.warn('[VotingService] fetchLiveCounts warning:', err);
    }

    let total = 0;
    Object.values(this.countsCache).forEach((v) => { total += (v || 0); });
    return { counts: this.countsCache, totalVotes: total };
  }
}

export const votingService = new VotingService();
