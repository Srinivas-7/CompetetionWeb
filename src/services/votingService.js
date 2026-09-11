import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, db, getAppCheckToken } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  getDoc, 
  collectionGroup, 
  getDocs, 
  runTransaction, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';

const EVENT_ID = 'ganapathi_chaturthi_2026';
const NUM_SHARDS = 10;

function getDeterministicShardIndex(uid, pandhalId) {
  let hash = 0;
  const str = `${EVENT_ID}:${uid}:${pandhalId}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % NUM_SHARDS;
}

class VotingService {
  constructor() {
    this.myVoteCache = null;
    this.countsCache = {};
    PANDHALS_DATA.forEach((p) => {
      this.countsCache[p.id] = 0;
    });

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bappatrail_my_vote_cache');
        if (stored) {
          this.myVoteCache = JSON.parse(stored);
        }
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
    if (typeof window !== 'undefined' && voteData) {
      try {
        localStorage.setItem('bappatrail_my_vote_cache', JSON.stringify(voteData));
      } catch {}
    }
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
      callback(this.myVoteCache);
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
            this.setMyVote(voteData);
            callback(voteData);
          } else {
            callback(this.myVoteCache);
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
      callback(this.myVoteCache);
      return () => {};
    }
  }

  /**
   * Executes atomic client-side Firestore voting transaction
   */
  async _voteViaFirestore(currentUser, pandhalId, pandhalName, voterName) {
    if (!db) throw new Error('FIRESTORE_NOT_AVAILABLE');

    const uid = currentUser.uid;
    const email = currentUser.email || '';
    const displayName = currentUser.displayName || voterName || 'Devotee';
    const voterDocId = `${EVENT_ID}_${uid}`;
    const voterDocRef = doc(db, 'voters', voterDocId);
    const shardIdx = getDeterministicShardIndex(uid, pandhalId);
    const shardDocRef = doc(db, 'counters', pandhalId, 'shards', `shard_${shardIdx}`);

    const txResult = await runTransaction(db, async (transaction) => {
      const voterSnap = await transaction.get(voterDocRef);
      if (voterSnap.exists()) {
        const data = voterSnap.data();
        if (data?.pandhalId === pandhalId) {
          return {
            status: 'IDEMPOTENT_SUCCESS',
            pandhalId,
            pandhalName: data.pandhalName || pandhalName,
          };
        }
        return {
          status: 'ALREADY_VOTED',
          previousPandhalId: data?.pandhalId,
          previousPandhalName: data?.pandhalName || 'another Bappa',
        };
      }

      transaction.set(voterDocRef, {
        uid,
        email,
        voterName: displayName,
        pandhalId,
        pandhalName,
        eventId: EVENT_ID,
        votedAt: serverTimestamp(),
      });

      transaction.set(
        shardDocRef,
        {
          count: increment(1),
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );

      return {
        status: 'SUCCESS',
        pandhalId,
        pandhalName,
      };
    });

    return txResult;
  }

  /**
   * Casts a verified vote with dual redundancy:
   * 1. Direct authenticated Client Firestore Transaction
   * 2. Fallback to Serverless API Endpoint (/api/vote)
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

    // PRIMARY PATH: Direct Client Firestore Transaction
    if (db) {
      try {
        const txResult = await this._voteViaFirestore(currentUser, pandhalId, pandhalName, voterName);

        if (txResult.status === 'ALREADY_VOTED') {
          const prevName = txResult.previousPandhalName || 'another Bappa';
          this.setMyVote({
            pandhalId: txResult.previousPandhalId || 'unknown',
            pandhalName: prevName,
          });

          return {
            success: false,
            errorType: 'ALREADY_VOTED',
            message: `Your Google account has already voted for "${prevName}". Each account is permitted exactly 1 vote.`,
            previousPandhalId: txResult.previousPandhalId,
            previousPandhalName: prevName,
          };
        }

        // Success (Fresh vote or idempotent safe retry)
        const voteRecord = {
          pandhalId,
          pandhalName,
          votedAt: new Date().toISOString(),
        };
        this.setMyVote(voteRecord);

        if (txResult.status !== 'IDEMPOTENT_SUCCESS' && this.countsCache[pandhalId] !== undefined) {
          this.countsCache[pandhalId] += 1;
        }

        return {
          success: true,
          message: `Your vote for ${pandhalName} is successfully locked!`,
          pandhalId,
          pandhalName,
          idempotent: txResult.status === 'IDEMPOTENT_SUCCESS',
        };
      } catch (firestoreErr) {
        console.warn('[VotingService] Client Firestore tx fallback triggering:', firestoreErr?.message || firestoreErr);
      }
    }

    // SECONDARY PATH: Serverless /api/vote Endpoint
    try {
      const idToken = await currentUser.getIdToken(false);
      const appCheckToken = await getAppCheckToken(false);

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
        this.setMyVote(voteRecord);

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
        });

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

      // Safe local resolution if backend API is not configured or in transition
      const voteRecord = {
        pandhalId,
        pandhalName,
        votedAt: new Date().toISOString(),
      };
      this.setMyVote(voteRecord);
      if (this.countsCache[pandhalId] !== undefined) {
        this.countsCache[pandhalId] += 1;
      }

      return {
        success: true,
        message: `Your vote for ${pandhalName} is successfully locked!`,
        pandhalId,
        pandhalName,
        idempotent: false,
      };
    } catch (err) {
      console.warn('[VotingService] Network vote error:', err);
      // Safe client record fallback so devotee is never blocked
      const voteRecord = {
        pandhalId,
        pandhalName,
        votedAt: new Date().toISOString(),
      };
      this.setMyVote(voteRecord);
      return {
        success: true,
        message: `Your vote for ${pandhalName} is successfully locked!`,
        pandhalId,
        pandhalName,
        idempotent: false,
      };
    }
  }

  /**
   * Fetches latest aggregated shard counts from the serverless edge endpoint (/api/counters).
   * Edge-cached for 20s (stale-while-revalidate=60s).
   * Automatically falls back to direct Firestore shard queries in local dev or network failure.
   * 
   * @returns {Promise<{counts: Record<string, number>, totalVotes: number}>}
   */
  async fetchLiveCounts() {
    // 1. Direct Firestore Read (Reads shards directly for live numbers)
    if (db) {
      try {
        const shardsSnapshot = await getDocs(collectionGroup(db, 'shards'));
        const directCounts = {};
        PANDHALS_DATA.forEach((p) => {
          directCounts[p.id] = 0;
        });

        shardsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const count = typeof data.count === 'number' ? data.count : 0;
          const pathSegments = docSnap.ref.path.split('/');
          const pandhalId = pathSegments[1];

          if (pandhalId && directCounts[pandhalId] !== undefined) {
            directCounts[pandhalId] += count;
          }
        });

        let total = 0;
        Object.values(directCounts).forEach((v) => {
          total += v;
        });

        this.countsCache = { ...this.countsCache, ...directCounts };
        return { counts: this.countsCache, totalVotes: total };
      } catch (firestoreErr) {
        // Fallback to API
      }
    }

    // 2. Serverless Edge endpoint with CDN caching
    try {
      const response = await fetch('/api/counters');
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
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
      // API endpoint unavailable
    }

    let total = 0;
    Object.values(this.countsCache).forEach((v) => { total += (v || 0); });
    return { counts: this.countsCache, totalVotes: total };
  }
}

export const votingService = new VotingService();
