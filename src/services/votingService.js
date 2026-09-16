import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, db, getAppCheckToken } from '../lib/firebase';
import {
  doc,
  onSnapshot,
  collectionGroup,
  collection,
  getDocs
} from 'firebase/firestore';

const EVENT_ID = 'ganapathi_chaturthi_2026';

class VotingService {
  constructor() {
    this.currentUid = null;
    this.myVoteCache = null;
    this.countsCache = {};
    this.subscribers = new Set();
    this.activeFirestoreUnsubscribe = null;

    PANDHALS_DATA.forEach((p) => {
      this.countsCache[p.id] = 0;
    });

    // Remove legacy unscoped cache keys to prevent cross-account leakage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bappatrail_my_vote_cache');
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Retrieves the current user's vote from cache
   */
  getMyVote(uid) {
    if (!uid) return null;
    try {
      const stored = localStorage.getItem(`bappatrail_vote_${uid}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Caches the user's vote locally
   */
  setMyVote(voteRecord, uid) {
    if (!uid) return;
    try {
      this.myVoteCache = voteRecord;
      localStorage.setItem(`bappatrail_vote_${uid}`, JSON.stringify(voteRecord));
    } catch {
      // Ignored
    }
  }

  /**
   * Clears the user's vote from cache
   */
  clearMyVote(uid) {
    if (!uid) return;
    try {
      this.myVoteCache = null;
      localStorage.removeItem(`bappatrail_vote_${uid}`);
    } catch {
      // Ignored
    }
  }

  /**
   * Subscribes to the authenticated user's individual voter record in Firestore.
   * Multiplexes across all components so only 1 single onSnapshot listener exists in the browser.
   * 
   * @param {string} uid - Firebase Auth User UID
   * @param {function} callback - Receives { pandhalId, pandhalName, votedAt } or null
   * @returns {function} Unsubscribe cleanup function
   */
  subscribeUserVote(uid, callback) {
    if (!uid) {
      if (this.activeFirestoreUnsubscribe) {
        this.activeFirestoreUnsubscribe();
        this.activeFirestoreUnsubscribe = null;
      }
      this.currentUid = null;
      this.myVoteCache = null;
      this.subscribers.clear();
      callback(null);
      return () => { };
    }

    // UID changed: reset existing listener
    if (this.currentUid !== uid) {
      if (this.activeFirestoreUnsubscribe) {
        this.activeFirestoreUnsubscribe();
        this.activeFirestoreUnsubscribe = null;
      }
      this.currentUid = uid;
      this.myVoteCache = this.getMyVote(uid);
      this.subscribers.clear();
    }

    this.subscribers.add(callback);

    // Initial emit for instant UI render from scoped local storage
    callback(this.myVoteCache);

    // Start single shared onSnapshot listener if not already running
    if (!this.activeFirestoreUnsubscribe && db) {
      try {
        const voterDocRef = doc(db, 'voters', `${EVENT_ID}_${uid}`);
        this.activeFirestoreUnsubscribe = onSnapshot(
          voterDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const voteData = {
                pandhalId: data.pandhalId,
                pandhalName: data.pandhalName || data.pandhalId,
                votedAt: data.votedAt,
              };
              this.setMyVote(voteData, uid);
              this.subscribers.forEach((cb) => {
                try { cb(voteData); } catch { /* ignore */ }
              });
            } else {
              this.clearMyVote(uid);
              this.subscribers.forEach((cb) => {
                try { cb(null); } catch { /* ignore */ }
              });
            }
          },
          (err) => {
            console.warn('[VotingService] subscribeUserVote warning:', err?.message || err);
            const cached = this.getMyVote(uid);
            this.subscribers.forEach((cb) => {
              try { cb(cached); } catch { /* ignore */ }
            });
          }
        );
      } catch (err) {
        console.warn('[VotingService] subscribeUserVote error:', err);
      }
    }

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.activeFirestoreUnsubscribe) {
        this.activeFirestoreUnsubscribe();
        this.activeFirestoreUnsubscribe = null;
      }
    };
  }

  /**
   * Casts a verified vote exclusively via the secure Serverless API Endpoint (/api/vote).
   * All database writes are atomic, server-verified, and enforced via Firebase Admin SDK.
   * 
   * @param {string} voterEmail - Devotee email
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
      const idToken = await currentUser.getIdToken(false);
      const appCheckToken = await getAppCheckToken();

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      };

      if (appCheckToken) {
        requestHeaders['X-Firebase-AppCheck'] = appCheckToken;
      }

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
        this.setMyVote(voteRecord, currentUser.uid);

        if (!data.idempotent && this.countsCache[pandhalId] !== undefined) {
          this.countsCache[pandhalId] += 1;
        }

        return {
          success: true,
          message: data.message || `Your vote for ${pandhalName} is successfully locked!`,
          pandhalId,
          pandhalName,
          idempotent: Boolean(data.idempotent),
        };
      }

      if (response.status === 409) {
        const previousPandhalName = data.previousPandhalName || 'another Bappa';
        const previousPandhalId = data.previousPandhalId;
        this.setMyVote({
          pandhalId: previousPandhalId || 'unknown',
          pandhalName: previousPandhalName,
        }, currentUser.uid);

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
        if (data.error === 'GOOGLE_SIGN_IN_REQUIRED') {
          return {
            success: false,
            errorType: 'GOOGLE_SIGN_IN_REQUIRED',
            message: data.message || 'To ensure fair community voting, please sign in with your Google account. Past votes remain securely counted.',
          };
        }

        return {
          success: false,
          errorType: 'INVALID_TOKEN',
          message: data.message || 'Your sign-in session expired. Please sign in again with Google.',
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          errorType: 'VOTING_NOT_STARTED',
          message: data.message || 'Voting has not officially started yet.',
        };
      }

      // Unexpected status code from /api/vote (e.g. 500, 502, 503)
      return {
        success: false,
        errorType: 'SERVER_ERROR',
        message: data.message || `We couldn't confirm your vote for "${pandhalName}" due to a temporary server issue. Your vote was NOT recorded. Please try again.`,
        pandhalId,
        pandhalName
      };
    } catch (err) {
      console.warn('[VotingService] Network vote error:', err);
      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: `We couldn't confirm your vote for "${pandhalName}" due to a network error. Your vote was NOT recorded. Please check your connection and retry.`,
        pandhalId,
        pandhalName
      };
    }
  }

  /**
   * Fetches latest aggregated live counts.
   * 1. Primary: Serverless edge endpoint (/api/counters) with Edge CDN caching (zero client reads).
   * 2. Resilient Fallback: Direct Firestore read if serverless endpoint is offline or in local fallback.
   * 
   * @returns {Promise<{counts: Record<string, number>, totalVotes: number}>}
   */
  async fetchLiveCounts() {
    // 1. Primary: Serverless Edge endpoint with CDN caching
    try {
      const response = await fetch('/api/counters');
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success && data.counts && !data.fallback) {
          this.countsCache = { ...this.countsCache, ...data.counts };
          return {
            counts: this.countsCache,
            totalVotes: typeof data.totalVotes === 'number' ? data.totalVotes : 0,
          };
        }
      }
    } catch (err) {
      // API endpoint unavailable or running in local dev
    }

    // 2. Resilient Client Fallback: If API returned fallback or failed, query Firestore directly
    if (db) {
      try {
        const [shardsSnapshot, countersSnapshot] = await Promise.all([
          getDocs(collectionGroup(db, 'shards')).catch(() => null),
          getDocs(collection(db, 'counters')).catch(() => null),
        ]);

        const directCounts = {};
        PANDHALS_DATA.forEach((p) => {
          directCounts[p.id] = 0;
        });

        if (shardsSnapshot) {
          shardsSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const count = typeof data.count === 'number' ? data.count : 0;
            const pathSegments = docSnap.ref.path.split('/');
            const pandhalId = pathSegments[1];

            if (pandhalId && directCounts[pandhalId] !== undefined) {
              directCounts[pandhalId] += count;
            }
          });
        }

        if (countersSnapshot) {
          countersSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const pandhalId = docSnap.id;
            const topTotal = typeof data.totalVotes === 'number'
              ? data.totalVotes
              : (typeof data.count === 'number' ? data.count : 0);

            if (pandhalId && directCounts[pandhalId] !== undefined) {
              directCounts[pandhalId] = Math.max(directCounts[pandhalId], topTotal);
            }
          });
        }

        let total = 0;
        Object.values(directCounts).forEach((v) => {
          total += (v || 0);
        });

        this.countsCache = { ...this.countsCache, ...directCounts };
        return { counts: this.countsCache, totalVotes: total };
      } catch (firestoreErr) {
        console.warn('[VotingService] Direct Firestore fallback note:', firestoreErr);
      }
    }

    let total = 0;
    Object.values(this.countsCache).forEach((v) => { total += (v || 0); });
    return { counts: this.countsCache, totalVotes: total };
  }
}

export const votingService = new VotingService();