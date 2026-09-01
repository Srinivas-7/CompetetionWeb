import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle as firebaseGoogleSignIn, 
  signInWithGoogleCredential,
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
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error('[AuthContext] Google sign-in failed:', err);
      setError(err.message || 'Google sign-in failed');
      throw err;
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
