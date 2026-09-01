export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ganapathi-trail.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ganapathi-trail",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ganapathi-trail.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
    firebaseConfig.projectId !== "ganapathi-trail"
  );
};
