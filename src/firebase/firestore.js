import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config';

let app = null;
let db = null;

export function getFirestoreDb() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!app) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }

  if (!db) {
    db = getFirestore(app);
  }

  return db;
}
