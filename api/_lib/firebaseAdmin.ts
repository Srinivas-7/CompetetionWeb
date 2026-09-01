import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getAppCheck, type AppCheck } from 'firebase-admin/app-check';

/**
 * Safely sanitizes the Firebase private key across environments:
 * Handles keys with literal newlines, escaped "\\n" strings, and surrounding quotes.
 */
function formatPrivateKey(key?: string): string {
  if (!key) {
    throw new Error(
      'Missing FIREBASE_PRIVATE_KEY environment variable. Make sure it is set in Vercel or .env.local.'
    );
  }

  // Remove wrapping quotes if present
  let cleaned = key.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }

  // Convert escaped literal '\n' characters into real newline bytes
  return cleaned.replace(/\\n/g, '\n');
}

/**
 * Initialize Firebase Admin SDK as a singleton to reuse instances across
 * Vercel Serverless Function hot invocations.
 */
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      'Firebase Admin credentials incomplete. Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.'
    );
  }

  const privateKey = formatPrivateKey(privateKeyRaw);

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// 1. Singleton Admin App Instance
export const adminApp: App = getAdminApp();

// 2. Firestore Admin Instance (Bypasses security rules for server-mediated writes/reads)
export const adminDb: Firestore = getFirestore(adminApp);

// 3. Auth Admin Instance (For verifying user tokens and anonymous sessions)
export const adminAuth: Auth = getAuth(adminApp);

// 4. App Check Admin Instance (For verifying client authenticity & reCAPTCHA tokens)
export const adminAppCheck: AppCheck = getAppCheck(adminApp);
