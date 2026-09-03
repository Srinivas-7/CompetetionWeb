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
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '4px solid #EADECB',
            borderTopColor: 'var(--maroon-primary)',
            animation: 'spinSlow 0.8s linear infinite',
            marginBottom: '18px'
          }}
        />
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '4px', color: 'var(--maroon-primary)' }}>
          CONNECTING TO BAPPA TRAIL
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
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
          color: 'var(--text-primary)',
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
            background: '#FFFFFF',
            border: '1.5px solid #EADECB',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(91, 20, 20, 0.08)',
            position: 'relative'
          }}
        >
          {/* Top Badge */}
          <div style={{ marginBottom: '16px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: '#FDF6E2',
                color: 'var(--maroon-primary)',
                border: '1.5px solid var(--gold-primary)',
                boxShadow: '0 2px 8px rgba(200, 157, 71, 0.25)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.74rem',
                letterSpacing: '0.06em',
                padding: '5px 12px',
                borderRadius: 'var(--radius-pill)',
                textTransform: 'uppercase'
              }}
            >
              ★ CHATURTHI 2026 OFFICIAL TRAIL ★
            </span>
          </div>

          {/* Cute Bal Ganesha Logo Badge */}
          <div style={{ marginBottom: '16px' }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Cute Bal Ganesha Mascot" 
              style={{
                width: '96px',
                height: '96px',
                display: 'block',
                margin: '0 auto',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--gold-primary)',
                boxShadow: '0 8px 24px rgba(107, 20, 20, 0.25)'
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
              textTransform: 'uppercase',
              color: 'var(--maroon-primary)'
            }}
          >
            BAPPA<span style={{ color: 'var(--gold-primary)' }}>TRAIL</span>
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
                background: '#FEE2E2',
                border: '1px solid #EF4444',
                color: '#991B1B',
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
              background: '#FFFFFF',
              color: '#1A1A1A',
              border: '1.5px solid #EADECB',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
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
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--maroon-primary)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 20, 20, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#EADECB';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(2px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
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
            <span>SIGN IN WITH GOOGLE</span>
          </button>

          {/* Privacy Note */}
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            One-tap Google verification guarantees 1 verified vote per devotee.
          </p>
        </div>
      </div>
    );
  }

  // 3. User is Authenticated -> Render App
  return <>{children}</>;
}
