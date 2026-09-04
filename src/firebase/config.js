export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxqgieHExe8CpvjfZZebh3yt22R7-_Tg4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bappatrail-fef2d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bappatrail-fef2d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bappatrail-fef2d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "707993544116",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:707993544116:web:a5cbdcad3860b2806bbee1"
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    !firebaseConfig.apiKey.includes("YOUR_API_KEY")
  );
};
