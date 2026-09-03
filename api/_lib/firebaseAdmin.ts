import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getAppCheck, type AppCheck } from 'firebase-admin/app-check';

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

export function getAdminApp(): App {
  if (appInstance) return appInstance;
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
    // Default application default credentials fallback
    appInstance = initializeApp({
      projectId,
    });
  }

  return appInstance;
}

export const adminApp: App = getAdminApp();
export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
export const adminAppCheck: AppCheck = getAppCheck(adminApp);
