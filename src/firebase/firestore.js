import { getFirestore } from 'firebase/firestore';
import { app } from '../lib/firebase';
import { isFirebaseConfigured } from './config';

let db = null;

export function getFirestoreDb() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!db) {
    try {
      db = getFirestore(app);
    } catch (err) {
      console.warn('[Firestore] Initialization warning:', err);
    }
  }

  return db;
}

