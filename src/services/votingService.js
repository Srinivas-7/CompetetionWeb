import { isValidPandhalId } from '../utils/validation';
import { PANDHALS_DATA } from '../data/pandhals';
import { auth } from '../lib/firebase';
import { getFirestoreDb } from '../firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { executeFirebaseVote, subscribeToFirebaseCounters } from '../firebase/voting';

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
   * Cast a vote with atomic Firestore transaction directly using the user's Google Auth session.
   * Zero private keys or service accounts required.
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
      // Execute direct atomic Firestore transaction via authenticated Client SDK
      const result = await executeFirebaseVote(email, pandhalId, pandhalName, voterName || currentUser.displayName || '');

      if (result.success) {
        return {
          success: true,
          message: result.message || `Your vote for ${pandhalName} is locked!`,
          pandhalName,
          totalVotes: result.totalVotes,
        };
      }

      if (result.error === 'ALREADY_VOTED') {
        return {
          success: false,
          errorType: 'ALREADY_VOTED',
          message: result.message || 'You have already voted for a different Bappa. Only 1 vote per Google account is allowed.',
        };
      }

      return {
        success: false,
        errorType: result.error || 'VOTE_FAILED',
        message: result.message || 'Unable to record vote. Please try again.',
      };
    } catch (err) {
      console.error('[VotingService] Error during vote submission:', err);

      if (err.message && err.message.includes('permission')) {
        return {
          success: false,
          errorType: 'PERMISSION_DENIED',
          message: 'Firestore permission error. Please make sure the Firestore Security Rules are published in Firebase Console.',
        };
      }

      return {
        success: false,
        errorType: 'NETWORK_ERROR',
        message: 'Connection issue while saving vote. Please check your internet connection and try again.',
      };
    }
  }

  /**
   * Subscribes to live counts via direct Firestore live snapshot listener.
   * 
   * @param {function} callback - Receives { [pandhalId]: number }
   * @returns {function} Unsubscribe function
   */
  subscribeLiveCounts(callback) {
    return subscribeToFirebaseCounters(callback);
  }
}

export const votingService = new VotingService();
