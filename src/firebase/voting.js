import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { getFirestoreDb } from './firestore';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth } from '../lib/firebase';

/**
 * Executes atomic 1-Google-Account = 1-Vote transaction on Firestore.
 * 
 * @param {string} email - Voter email address
 * @param {string} pandhalId - Target pandhal ID
 * @param {string} pandhalName - Target pandhal name
 * @param {string} voterName - Voter display name
 * @returns {Promise<{success: boolean, error?: string, totalVotes?: number}>}
 */
export async function executeFirebaseVote(email, pandhalId, pandhalName, voterName = '') {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }

  // Use authenticated UID as primary key with sanitized email fallback
  const voterKey = auth.currentUser?.uid || (email ? email.replace(/[^a-zA-Z0-9_-]/g, '_') : null);
  if (!voterKey) {
    throw new Error("NO_VOTER_IDENTITY");
  }

  const voteDocRef = doc(db, 'votes', voterKey);
  const counterDocRef = doc(db, 'counters', 'live');

  try {
    const result = await runTransaction(db, async (transaction) => {
      // 1. Check if voter already cast a ballot
      const voteDoc = await transaction.get(voteDocRef);
      if (voteDoc.exists()) {
        const existingData = voteDoc.data();
        throw new Error(`ALREADY_VOTED:${existingData.pandhalId}`);
      }

      // 2. Read live counter document
      const counterDoc = await transaction.get(counterDocRef);
      const currentCount = counterDoc.exists() && counterDoc.data()[pandhalId] !== undefined
        ? counterDoc.data()[pandhalId] 
        : 0;

      const newCount = currentCount + 1;

      // 3. Atomically write vote record
      transaction.set(voteDocRef, {
        voterId: voterKey,
        voterEmail: email || auth.currentUser?.email || '',
        voterName: voterName || auth.currentUser?.displayName || '',
        pandhalId: pandhalId,
        pandhalName: pandhalName,
        votedAt: serverTimestamp(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      });

      // 4. Atomically increment counter
      transaction.set(counterDocRef, {
        [pandhalId]: newCount,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      return { newCount };
    });

    return {
      success: true,
      totalVotes: result.newCount
    };
  } catch (error) {
    if (error.message && error.message.startsWith('ALREADY_VOTED:')) {
      const prevId = error.message.split(':')[1];
      return {
        success: false,
        error: 'ALREADY_VOTED',
        previousPandhalId: prevId
      };
    }
    throw error;
  }
}

/**
 * Subscribes to live vote counts from Firestore
 * 
 * @param {function} onUpdate 
 * @returns {function} Unsubscribe function
 */
export function subscribeToFirebaseCounters(onUpdate) {
  const db = getFirestoreDb();
  if (!db) return () => {};

  const counterDocRef = doc(db, 'counters', 'live');
  return onSnapshot(counterDocRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data());
    }
  }, (err) => {
    console.warn("[Firestore] Live counter subscription info:", err);
  });
}

