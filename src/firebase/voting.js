import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  onSnapshot, 
  getDoc,
  collection
} from 'firebase/firestore';
import { getFirestoreDb } from './firestore';

/**
 * Executes atomic 1-Phone = 1-Vote transaction on Firestore.
 * 
 * @param {string} phone - Normalized 10-digit phone number
 * @param {string} pandhalId - Target pandhal ID
 * @param {string} pandhalName - Target pandhal name
 * @returns {Promise<{success: boolean, error?: string, totalVotes?: number}>}
 */
export async function executeFirebaseVote(phone, pandhalId, pandhalName) {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }

  const voteDocRef = doc(db, 'votes', phone);
  const counterDocRef = doc(db, 'counters', 'live');

  try {
    const result = await runTransaction(db, async (transaction) => {
      // 1. Check if phone already voted
      const voteDoc = await transaction.get(voteDocRef);
      if (voteDoc.exists()) {
        const existingData = voteDoc.data();
        throw new Error(`ALREADY_VOTED:${existingData.pandhalId}`);
      }

      // 2. Read live counter document
      const counterDoc = await transaction.get(counterDocRef);
      const currentCount = counterDoc.exists() && counterDoc.data()[pandhalId] 
        ? counterDoc.data()[pandhalId] 
        : 0;

      const newCount = currentCount + 1;

      // 3. Atomically write vote record
      transaction.set(voteDocRef, {
        phone: phone,
        pandhalId: pandhalId,
        pandhalName: pandhalName,
        votedAt: serverTimestamp(),
        userAgent: navigator.userAgent
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
    console.warn("Firestore live counter subscription warning:", err);
  });
}
