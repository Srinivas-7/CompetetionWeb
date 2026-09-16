import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getAppCheck, type AppCheck } from 'firebase-admin/app-check';

export { FieldValue, Timestamp };

/**
 * Safely sanitizes the Firebase private key across environments:
 * Handles keys with literal newlines, escaped "\\n" strings, and surrounding quotes.
 */
function formatPrivateKey(key?: string): string {
  if (!key) return '';

  let cleaned = key.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }

  return cleaned.replace(/\\n/g, '\n');
}

let appInstance: App | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let appCheckInstance: AppCheck | null = null;

export function getAdminApp(): App | null {
  if (appInstance) return appInstance;
  try {
    if (getApps().length > 0) {
      appInstance = getApps()[0];
      return appInstance;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'bappatrail-fef2d';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';

    if (clientEmail && privateKeyRaw) {
      appInstance = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formatPrivateKey(privateKeyRaw),
        }),
      });
    } else {
      appInstance = initializeApp({ projectId });
    }
    return appInstance;
  } catch (err) {
    console.warn('[firebaseAdmin] Failed to initialize admin app:', err);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  try {
    const app = getAdminApp();
    if (!app) return null;
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('[firebaseAdmin] Failed to get Firestore admin instance:', err);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  if (authInstance) return authInstance;
  try {
    const app = getAdminApp();
    if (!app) return null;
    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    console.warn('[firebaseAdmin] Failed to get Auth admin instance:', err);
    return null;
  }
}

export function getAdminAppCheck(): AppCheck | null {
  if (appCheckInstance) return appCheckInstance;
  try {
    const app = getAdminApp();
    if (!app) return null;
    appCheckInstance = getAppCheck(app);
    return appCheckInstance;
  } catch (err) {
    console.warn('[firebaseAdmin] Failed to get AppCheck admin instance:', err);
    return null;
  }
}

