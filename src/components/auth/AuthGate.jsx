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

  // Initialize Google One Tap when available to automatically surface the user's active Google account
  useEffect(() => {
    if (isAuthenticated || loading || oneTapInitialized.current) return;

    const clientId = import.meta.env.VITE_FIREBASE_GOOGLE_CLIENT_ID || '707993544116-web.apps.googleusercontent.com';

    const checkAndInitOneTap = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: true, // Automatically logs in if only one Google account is active
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
            background: '#101322',
            border: '2.5px solid #ffffff',
            borderRadius: '28px',
            boxShadow: '8px 8px 0px var(--neon-pink)',
            position: 'relative'
          }}
        >
          {/* Top Badge */}
          <div style={{ marginBottom: '16px' }}>
            <span 
              className="animate-wiggle"
              style={{
                display: 'inline-block',
                background: 'var(--neon-yellow)',
                color: '#000000',
                border: '2px solid #000000',
                boxShadow: '3px 3px 0px var(--neon-pink)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: '0.08em',
                padding: '5px 12px',
                borderRadius: '6px',
                transform: 'rotate(-2deg)'
              }}
            >
              ★ CHATURTHI 2026 OFFICIAL TRAIL ★
            </span>
          </div>

          {/* Logo */}
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--gradient-hyper)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 900,
              border: '2px solid #ffffff',
              boxShadow: '4px 4px 0px var(--neon-pink)',
              margin: '0 auto 18px'
            }}
          >
            ⚡
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
            BAPPA<span style={{ color: 'var(--neon-lime)' }}>TRAIL</span>
          </h1>

          <p 
            style={{
              fontSize: '0.94rem',
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              margin: '0 0 28px'
            }}
          >
            Sign in with your Google account to unlock full 4K pandhal photo collections and cast your verified community vote.
          </p>

          {/* Error Message */}
          {error && (
            <div 
              style={{
                background: 'rgba(255, 0, 85, 0.15)',
                border: '1.5px solid var(--neon-pink)',
                color: '#ffcce0',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.84rem',
                fontWeight: 700,
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* 1-Tap Google Sign In Button */}
          <button
            onClick={() => signInWithGoogle().catch(() => {})}
            style={{
              width: '100%',
              background: '#ffffff',
              color: '#000000',
              border: '2.5px solid #000000',
              boxShadow: '5px 5px 0px var(--neon-pink), 9px 9px 0px var(--neon-lime)',
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
              e.currentTarget.style.transform = 'translate(3px, 3px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px var(--neon-pink)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '5px 5px 0px var(--neon-pink), 9px 9px 0px var(--neon-lime)';
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

          {/* Micro Value Chips */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>🔒</span>
              <span>1 Google Account = 1 Verified Community Vote</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>⚡</span>
              <span>Uses your active device Gmail session seamlessly</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authenticated -> Render the entire dashboard/website
  return <>{children}</>;
}
