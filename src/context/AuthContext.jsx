import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle as firebaseGoogleSignIn, 
  signInWithGoogleCredential,
  checkRedirectAuth,
  signOut as firebaseSignOut 
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  handleGoogleCredentialResponse: async () => {},
  logout: async () => {},
  isAuthenticated: false
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is returning from a Google redirect sign-in
    checkRedirectAuth()
      .then((redirectUser) => {
        if (redirectUser) {
          setUser(redirectUser);
        }
      })
      .catch((err) => {
        console.warn('[AuthContext] Redirect auth check:', err);
      });

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error('[AuthContext] Auth state change error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const loggedUser = await firebaseGoogleSignIn();
      if (loggedUser) {
        setUser(loggedUser);
      }
      return loggedUser;
    } catch (err) {
      console.warn('[AuthContext] Google sign-in note:', err);
      // Don't set error if redirect is in progress
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in encountered an issue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    try {
      setLoading(true);
      setError(null);
      const loggedUser = await signInWithGoogleCredential(response.credential);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error('[AuthContext] Google credential sign-in error:', err);
      setError(err.message || 'Google credential sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await firebaseSignOut();
      setUser(null);
    } catch (err) {
      console.error('[AuthContext] Logout failed:', err);
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        handleGoogleCredentialResponse,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
