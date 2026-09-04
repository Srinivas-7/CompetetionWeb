import { getFirestore } from 'firebase/firestore';
import { app, db as libDb } from '../lib/firebase';
import { isFirebaseConfigured } from './config';

let db = libDb || null;

export function getFirestoreDb() {
  if (db) return db;
  
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Firestore] Initialization warning:', err);
  }

  return db;
}

export { db };


