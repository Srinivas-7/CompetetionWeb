import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export function AuthGate({ children }) {
  const { 
    user, 
    loading, 
    error, 
    signInWithGoogle, 
    handleGoogleCredentialResponse, 
    isAuthenticated 
  } = useAuth();
  
  const oneTapInitialized = useRef(false);

  // Initialize Google One Tap ONLY if a valid VITE_FIREBASE_GOOGLE_CLIENT_ID is provided
  useEffect(() => {
    if (isAuthenticated || loading || oneTapInitialized.current) return;

    const clientId = import.meta.env.VITE_FIREBASE_GOOGLE_CLIENT_ID;
    if (!clientId) return; // Do not initialize One Tap with a dummy or missing client ID

    const checkAndInitOneTap = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: true,
            cancel_on_tap_outside: false
          });

          window.google.accounts.id.prompt();
          oneTapInitialized.current = true;
        } catch (err) {
          console.warn('[Google One Tap] Prompt info:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      checkAndInitOneTap();
    } else {
      const timer = setTimeout(checkAndInitOneTap, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

  // 1. Loading Spinner during initial session check
  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '4px solid rgba(255, 0, 127, 0.2)',
            borderTopColor: 'var(--neon-pink)',
            animation: 'spinSlow 0.8s linear infinite',
            marginBottom: '18px'
          }}
        />
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px' }}>
          CONNECTING TO BAPPA TRAIL
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--neon-lime)' }}>
          Verifying your Google session…
        </p>
      </div>
    );
  }

  // 2. Auth Wall Gate (User MUST sign in with Google to enter)
  if (!isAuthenticated) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'var(--bg-page)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="max-card"
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '36px 24px',
            textAlign: 'center',
            background: '#141726',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
        >
          {/* Top Badge */}
          <div style={{ marginBottom: '16px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: '#f59e0b',
                color: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: '0.06em',
                padding: '5px 12px',
                borderRadius: '6px'
              }}
            >
              ★ CHATURTHI 2026 OFFICIAL TRAIL ★
            </span>
          </div>

          {/* Logo Badge with Bright Yellow Bolt */}
          <div style={{ marginBottom: '16px' }}>
            <img 
              src="/favicon.svg" 
              alt="Bappa Trail" 
              style={{
                width: '78px',
                height: '78px',
                display: 'block',
                margin: '0 auto',
                filter: 'drop-shadow(0 4px 16px rgba(245, 158, 11, 0.35))'
              }}
            />
          </div>

          {/* Title */}
          <h1 
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 2.3rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 8px',
              textTransform: 'uppercase'
            }}
          >
            BAPPA<span style={{ color: 'var(--neon-pink)' }}>TRAIL</span>
          </h1>

          <p 
            style={{
              fontSize: '0.96rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              margin: '0 0 28px',
              fontWeight: 600
            }}
          >
            Enjoy, vote for your beloved Bappa, and visit them across the grand trail.
          </p>

          {/* Error Message */}
          {error && (
            <div 
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.84rem',
                fontWeight: 700,
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              {error}
            </div>
          )}

          {/* 1-Tap Google Sign In Button */}
          <button
            onClick={() => signInWithGoogle().catch((err) => console.error(err))}
            style={{
              width: '100%',
              background: '#ffffff',
              color: '#000000',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-pill)',
              padding: '15px 20px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px',
              transition: 'transform 0.12s ease, box-shadow 0.12s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(2px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
            }}
          >
            {/* Google G Logo SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Creative Micro Badges */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                margin: '0 auto'
              }}
            >
              <span style={{ color: 'var(--neon-yellow)', fontWeight: 700 }}>1 Devotee</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>1 Sacred Vote</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
              <span style={{ color: 'var(--neon-lime)', fontWeight: 700 }}>Zero Spam</span>
            </div>

            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255, 0, 127, 0.08)',
                border: '1px solid rgba(255, 0, 127, 0.25)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                margin: '0 auto'
              }}
            >
              <span style={{ color: '#ffffff', fontWeight: 600 }}>1-Tap Instant Entry</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
              <span style={{ color: 'var(--neon-pink)', fontWeight: 700 }}>Pure Festive Energy</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authenticated -> Render the entire dashboard/website
  return <>{children}</>;
}
