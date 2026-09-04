import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signInWithCredential,
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  type Auth, 
  type User 
} from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

// Client-side Firebase configuration from VITE_ environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxqgieHExe8CpvjfZZebh3yt22R7-_Tg4";
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bappatrail-fef2d.firebaseapp.com";
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "bappatrail-fef2d";
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bappatrail-fef2d.firebasestorage.app";
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "707993544116";
const appId = import.meta.env.VITE_FIREBASE_APP_ID || "1:707993544116:web:a5cbdcad3860b2806bbee1";

if (!apiKey || apiKey.includes('DummyKey')) {
  console.error(
    '[Firebase Error] Invalid or missing VITE_FIREBASE_API_KEY. Please ensure your Firebase Web API Key is properly configured in .env.local or Vercel Environment Variables.'
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// 1. Singleton App Initialization
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Client-side Auth
export const auth: Auth = getAuth(app);

// 3. Client-side Firestore
export const db: Firestore = getFirestore(app);

// 3. Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google with popup + redirect fallback
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // If popup is blocked by COOP or closed on mobile, fallback to redirect
    console.warn('[Firebase Auth] Popup error, falling back to redirect:', error?.message);
    await signInWithRedirect(auth, googleProvider);
    throw error;
  }
}

/**
 * Check and resolve any redirect sign-in result on page load
 */
export async function checkRedirectAuth(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error) {
    console.warn('[Firebase Auth] Redirect result error:', error);
    return null;
  }
}

/**
 * Sign in with a Google One Tap credential ID token
 */
export async function signInWithGoogleCredential(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

/**
 * Sign out of current Google session
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// 4. App Check Initialization (reCAPTCHA v3)
let appCheckInstance: AppCheck | null = null;
if (typeof window !== 'undefined') {
  const recaptchaSiteKey = import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey && !recaptchaSiteKey.includes('Dummy')) {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      console.warn('[Firebase AppCheck] Initialization warning:', err);
    }
  }
}
export const appCheck = appCheckInstance;
