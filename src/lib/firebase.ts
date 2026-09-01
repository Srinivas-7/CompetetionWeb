import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  type Auth, 
  type User 
} from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

// Client-side Firebase configuration from VITE_ environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 1. Singleton App Initialization
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Client-side Auth
export const auth: Auth = getAuth(app);

// 3. Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always lets user choose their active Gmail account seamlessly
});

/**
 * Sign in with Google Popup (or Redirect on mobile webviews)
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // If popup was blocked on some mobile browsers, fallback to redirect
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
      console.warn('[Firebase Auth] Popup blocked/closed, attempting redirect...');
      await signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
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
  if (recaptchaSiteKey) {
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
