import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  increment,
  getDocs,
  collectionGroup
} from 'firebase/firestore';
import { getFirestoreDb } from './firestore';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth } from '../lib/firebase';

const EVENT_ID = 'ganapathi_chaturthi_2026';
const NUM_SHARDS = 10;

/**
 * Deterministic SHA-256 based uniform shard assignment.
 */
function getDeterministicShardIndex(uid, pandhalId) {
  let hash = 0;
  const str = `${EVENT_ID}:${uid}:${pandhalId}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % NUM_SHARDS;
}

/**
 * Executes atomic 1-Google-Account = 1-Vote transaction.
 * Produces exactly TWO writes:
 * 1. Voter document (/voters/{EVENT_ID}_{UID})
 * 2. Deterministic shard document (/counters/{pandhalId}/shards/shard_{shardIndex})
 * 
 * @param {string} email - Voter email address
 * @param {string} pandhalId - Target pandhal ID
 * @param {string} pandhalName - Target pandhal name
 * @param {string} voterName - Voter display name
 * @returns {Promise<{success: boolean, error?: string, totalVotes?: number, message?: string}>}
 */
export async function executeFirebaseVote(email, pandhalId, pandhalName, voterName = '') {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }

  const currentUser = auth.currentUser;
  const uid = currentUser?.uid;
  if (!uid) {
    throw new Error("NO_VOTER_IDENTITY");
  }

  const voterDocId = `${EVENT_ID}_${uid}`;
  const voterDocRef = doc(db, 'voters', voterDocId);
  const shardIdx = getDeterministicShardIndex(uid, pandhalId);
  const shardDocRef = doc(db, 'counters', pandhalId, 'shards', `shard_${shardIdx}`);

  try {
    const result = await runTransaction(db, async (transaction) => {
      // 1. Check if voter already cast a ballot
      const voterSnap = await transaction.get(voterDocRef);
      if (voterSnap.exists()) {
        const existingData = voterSnap.data();
        if (existingData?.pandhalId === pandhalId) {
          return { status: 'IDEMPOTENT_SUCCESS', pandhalId };
        }
        return { status: 'ALREADY_VOTED', previousPandhalId: existingData?.pandhalId, previousPandhalName: existingData?.pandhalName };
      }

      // 2. Atomically write voter uniqueness record (Write #1)
      transaction.set(voterDocRef, {
        uid: uid,
        email: email || currentUser.email || '',
        displayName: voterName || currentUser.displayName || '',
        pandhalId: pandhalId,
        pandhalName: pandhalName,
        votedAt: serverTimestamp(),
        eventId: EVENT_ID
      });

      // 3. Atomically increment deterministic shard counter (Write #2)
      transaction.set(shardDocRef, {
        count: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });

      return { status: 'SUCCESS' };
    });

    if (result.status === 'ALREADY_VOTED') {
      return {
        success: false,
        error: 'ALREADY_VOTED',
        message: `Your Google account has already voted for "${result.previousPandhalName || 'another Bappa'}". Each account is permitted 1 vote.`,
        previousPandhalId: result.previousPandhalId
      };
    }

    return {
      success: true,
      message: `Your vote for ${pandhalName} is successfully locked!`
    };
  } catch (error) {
    console.error("[Firestore] Voting transaction error:", error);
    throw error;
  }
}
