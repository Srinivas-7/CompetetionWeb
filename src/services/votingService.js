import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth, db } from '../lib/firebase';
import { getFirestoreDb } from '../firebase/firestore';
import { 
  doc, 
  collection,
  onSnapshot, 
  collectionGroup,
  runTransaction, 
  serverTimestamp, 
  increment,
  getDocs,
  query,
  where
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
        localStorage.removeItem('bappatrail_cast_votes');
        localStorage.removeItem('bappatrail_pandhal_votes');
        localStorage.removeItem('bappatrail_my_vote');
      } catch {}
    }
  }

  /**
   * Returns currently cached vote
   */
  getMyVote() {
    return this.myVoteCache;
  }

  /**
   * Subscribes to the user's vote record in real-time directly from Firestore.
   * If an administrator deletes the voter document, callback receives null.
   * 
   * @param {string} uid - Firebase Auth User UID
   * @param {function} callback - Receives { pandhalId, pandhalName, votedAt } or null
   * @returns {function} Cleanup function
   */
  subscribeUserVote(uid, callback) {
    if (!uid) {
      this.myVoteCache = null;
      callback(null);
      return () => {};
    }

    const firestoreInstance = db || getFirestoreDb();
    if (!firestoreInstance) {
      callback(null);
      return () => {};
    }

    try {
      const voterDocRef = doc(firestoreInstance, 'voters', `${EVENT_ID}_${uid}`);
      const unsubscribe = onSnapshot(
        voterDocRef,
        async (docSnap) => {
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
            // Fallback check for alternate doc ID
            try {
              const fallbackRef = doc(firestoreInstance, 'voters', uid);
              const fallbackSnap = await runTransaction(firestoreInstance, async (tx) => tx.get(fallbackRef)).catch(() => null);
              if (fallbackSnap && fallbackSnap.exists()) {
                const data = fallbackSnap.data();
                const voteData = {
                  pandhalId: data.pandhalId,
                  pandhalName: data.pandhalName || data.pandhalId,
                  votedAt: data.votedAt,
                };
                this.myVoteCache = voteData;
                callback(voteData);
                return;
              }
            } catch {}

            this.myVoteCache = null;
            callback(null);
          }
        },
        (err) => {
          console.warn('[VotingService] subscribeUserVote warning:', err);
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
   * Casts a vote directly into Firestore with atomic uniqueness and synchronized counters.
   * 
   * @param {string} voterEmail 
   * @param {string} pandhalId 
   * @param {string} voterName 
   * @returns {Promise<{success: boolean, message: string, pandhalName?: string, totalVotes?: number, errorType?: string}>}
   */
  async castVote(voterEmail, pandhalId, voterName = '') {
    const currentUser = auth.currentUser;
    const email = (currentUser?.email || voterEmail || '').trim().toLowerCase();

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

    const firestoreInstance = db || getFirestoreDb();
    if (!firestoreInstance) {
      return {
        success: false,
        errorType: 'DATABASE_ERROR',
        message: 'Unable to connect to the database. Please check your Firebase configuration.',
      };
    }

    const uid = currentUser.uid;
    const voterDocId = `${EVENT_ID}_${uid}`;
    const voterDocRef = doc(firestoreInstance, 'voters', voterDocId);
    const pandhalDocRef = doc(firestoreInstance, 'counters', pandhalId);
    const shardIdx = getDeterministicShardIndex(uid, pandhalId);
    const shardDocRef = doc(firestoreInstance, 'counters', pandhalId, 'shards', `shard_${shardIdx}`);

    try {
      const txResult = await runTransaction(firestoreInstance, async (transaction) => {
        const voterSnap = await transaction.get(voterDocRef);
        
        if (voterSnap.exists()) {
          const existingData = voterSnap.data();
          if (existingData?.pandhalId === pandhalId) {
            return {
              status: 'IDEMPOTENT_SUCCESS',
              pandhalId,
              pandhalName: existingData.pandhalName || pandhalName,
            };
          }
          return {
            status: 'ALREADY_VOTED',
            previousPandhalId: existingData?.pandhalId,
            previousPandhalName: existingData?.pandhalName || 'another Bappa',
          };
        }

        // 1. Atomically Write voter uniqueness record
        transaction.set(voterDocRef, {
          uid: uid,
          email: email || currentUser.email || '',
          displayName: voterName || currentUser.displayName || email.split('@')[0] || 'Devotee',
          pandhalId: pandhalId,
          pandhalName: pandhalName,
          votedAt: serverTimestamp(),
          eventId: EVENT_ID
        });

        // 2. Atomically Increment top-level pandhal counter document
        transaction.set(pandhalDocRef, {
          pandhalId: pandhalId,
          pandhalName: pandhalName,
          count: increment(1),
          totalVotes: increment(1),
          lastUpdated: serverTimestamp()
        }, { merge: true });

        // 3. Atomically Increment deterministic shard counter document
        transaction.set(shardDocRef, {
          count: increment(1),
          lastUpdated: serverTimestamp()
        }, { merge: true });

        return {
          status: 'SUCCESS',
          pandhalId,
          pandhalName,
        };
      });

      if (txResult.status === 'ALREADY_VOTED') {
        return {
          success: false,
          errorType: 'ALREADY_VOTED',
          message: `Your Google account has already voted for "${txResult.previousPandhalName}". Only 1 vote per account is allowed.`,
        };
      }

      this.myVoteCache = {
        pandhalId,
        pandhalName,
        votedAt: new Date().toISOString()
      };

      // Optimistically update countsCache so UI reflects instantly
      if (this.countsCache[pandhalId] !== undefined) {
        this.countsCache[pandhalId] += 1;
      }

      return {
        success: true,
        message: `Your vote for ${pandhalName} is successfully locked!`,
        pandhalName,
        idempotent: txResult.status === 'IDEMPOTENT_SUCCESS',
      };
    } catch (dbError) {
      console.error('[VotingService] Firestore voting transaction error:', dbError);
      return {
        success: false,
        errorType: dbError?.code || 'TRANSACTION_FAILED',
        message: dbError?.message || 'Database connection error while recording vote. Please try again.',
      };
    }
  }

  /**
   * Subscribes to live counts directly from Firestore with multi-source resilient synchronization.
   * Listens to top-level `/counters` documents, `/counters/.../shards`, and verifies with `/voters`.
   * 
   * @param {function} callback - Receives { [pandhalId]: number }
   * @returns {function} Cleanup function
   */
  subscribeLiveCounts(callback) {
    const firestoreInstance = db || getFirestoreDb();
    if (!firestoreInstance) {
      const initial = {};
      PANDHALS_DATA.forEach((p) => { initial[p.id] = 0; });
      callback(initial);
      return () => {};
    }

    const topCounts = {};
    const shardCounts = {};
    const voterCounts = {};

    PANDHALS_DATA.forEach((p) => {
      topCounts[p.id] = 0;
      shardCounts[p.id] = 0;
      voterCounts[p.id] = 0;
    });

    const notifyCombinedCounts = () => {
      const merged = {};
      PANDHALS_DATA.forEach((p) => {
        const top = topCounts[p.id] || 0;
        const shard = shardCounts[p.id] || 0;
        const voter = voterCounts[p.id] || 0;
        // Take the maximum verified count across all synchronization sources
        merged[p.id] = Math.max(top, shard, voter);
      });
      this.countsCache = merged;
      callback(merged);
    };

    // 1. Real-time Listener on top-level /counters (21 documents)
    let unsubTopLevel = null;
    try {
      const countersCol = collection(firestoreInstance, 'counters');
      unsubTopLevel = onSnapshot(
        countersCol,
        (snapshot) => {
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const pid = docSnap.id;
            const count = typeof data?.count === 'number' 
              ? data.count 
              : (typeof data?.totalVotes === 'number' ? data.totalVotes : 0);
            if (topCounts[pid] !== undefined) {
              topCounts[pid] = count;
            }
          });
          notifyCombinedCounts();
        },
        (err) => {
          console.warn('[VotingService] Top-level counters listener notice:', err);
        }
      );
    } catch (err) {
      console.warn('[VotingService] Setup top-level counters error:', err);
    }

    // 2. Real-time Listener on collectionGroup('shards')
    let unsubShards = null;
    try {
      const shardsQuery = collectionGroup(firestoreInstance, 'shards');
      unsubShards = onSnapshot(
        shardsQuery,
        (snapshot) => {
          const tempShards = {};
          PANDHALS_DATA.forEach((p) => { tempShards[p.id] = 0; });

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const count = typeof data?.count === 'number' ? data.count : 0;
            const pathSegments = docSnap.ref.path.split('/');
            const pandhalId = pathSegments[1];

            if (pandhalId && tempShards[pandhalId] !== undefined) {
              tempShards[pandhalId] += count;
            }
          });

          Object.keys(tempShards).forEach((k) => {
            shardCounts[k] = tempShards[k];
          });
          notifyCombinedCounts();
        },
        (err) => {
          console.warn('[VotingService] Shards listener notice:', err);
        }
      );
    } catch (err) {
      console.warn('[VotingService] Setup shards listener error:', err);
    }

    // 3. Direct Voter Document Sync (Scans /voters once on load to ensure all recorded votes count)
    const scanVoters = async () => {
      try {
        const votersCol = collection(firestoreInstance, 'voters');
        const snap = await getDocs(votersCol);
        if (snap && !snap.empty) {
          const tempVoters = {};
          PANDHALS_DATA.forEach((p) => { tempVoters[p.id] = 0; });
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            if (data?.pandhalId && tempVoters[data.pandhalId] !== undefined) {
              tempVoters[data.pandhalId] += 1;
            }
          });
          Object.keys(tempVoters).forEach((k) => {
            voterCounts[k] = tempVoters[k];
          });
          notifyCombinedCounts();
        }
      } catch (err) {
        // Handled silently if voter collection read permissions are scoped
      }
    };
    scanVoters();

    // Initial baseline broadcast
    notifyCombinedCounts();

    return () => {
      if (typeof unsubTopLevel === 'function') unsubTopLevel();
      if (typeof unsubShards === 'function') unsubShards();
    };
  }
}

export const votingService = new VotingService();


