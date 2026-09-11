import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function Hero({ onExploreClick, totalVotes = 0 }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      {/* 1. Sticky Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: '#FBF7F0',
          borderBottom: '2.5px solid var(--maroon-dark)',
          padding: '10px 16px'
        }}
      >
        <div 
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Bappa Utsav Logo" 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                objectFit: 'cover',
                border: '2px solid var(--maroon-dark)',
                boxShadow: '2px 2px 0px var(--maroon-dark)',
                display: 'block',
                flexShrink: 0
              }}
            />
            <div>
              <span 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.96rem',
                  letterSpacing: '-0.03em',
                  color: 'var(--maroon-primary)',
                  whiteSpace: 'nowrap'
                }}
              >
                BAPPA<span style={{ color: 'var(--gold-primary)' }}> UTSAV</span>
              </span>
            </div>
          </div>

          {/* Right User Profile + Live Pill + Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Logged in Google User Pill */}
            {user && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  border: '1.5px solid var(--maroon-dark)',
                  boxShadow: '2px 2px 0px var(--maroon-dark)',
                  borderRadius: '4px',
                  padding: '3px 8px 3px 4px',
                  cursor: 'pointer'
                }}
                onClick={logout}
                title={`Signed in as ${user.email}. Click to sign out.`}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    style={{ width: '22px', height: '22px', borderRadius: '2px', border: '1px solid var(--maroon-dark)' }}
                  />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8, color: 'var(--maroon-primary)' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    color: 'var(--maroon-primary)', 
                    maxWidth: '85px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--maroon-dark)' }}>✕</span>
              </div>
            )}

            <button
              onClick={onExploreClick}
              className="btn-3d-pink"
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span>VOTE</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section 
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '32px 16px 28px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Official Utsav Sticker */}
        <div style={{ marginBottom: '20px' }}>
          <span 
            className="brutal-badge"
            style={{
              background: '#FDF6E2',
              color: 'var(--maroon-primary)',
              border: '2px solid var(--maroon-dark)',
              boxShadow: '3px 3px 0px var(--maroon-dark)',
              fontSize: '0.76rem',
              letterSpacing: '0.08em',
              padding: '6px 14px',
              borderRadius: '4px'
            }}
          >
            ★ BAPPA UTSAV 2026 ★
          </span>
        </div>

        {/* Regal Gajotsava Logo Emblem Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div 
            style={{
              position: 'relative',
              background: '#FFFFFF',
              borderRadius: '6px',
              padding: '8px',
              border: '2.5px solid var(--maroon-dark)',
              boxShadow: '6px 6px 0px var(--maroon-dark)',
              maxWidth: 'clamp(180px, 45vw, 230px)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <div 
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1.5px solid var(--gold-primary)',
                background: '#FAF7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src="/assets/gajotsava-logo.jpg" 
                alt="ಗಜೋತ್ಸವ - Gajotsava Logo" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '3px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Massive Display Typography */}
        <h1 
          style={{
            fontSize: 'clamp(2.1rem, 8vw, 3.4rem)',
            lineHeight: 1.08,
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            margin: '0 0 16px',
            textTransform: 'uppercase',
            color: 'var(--text-primary)'
          }}
        >
          <div>ONE CITY.</div>
          <div style={{ color: 'var(--maroon-primary)', textDecoration: 'underline', textDecorationColor: 'var(--gold-primary)', textUnderlineOffset: '6px' }}>21 BAPPAS.</div>
          <div style={{ color: 'var(--text-primary)' }}>ONE VOTE.</div>
        </h1>

        {/* Subtext */}
        <p 
          style={{
            fontSize: '0.98rem',
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            margin: '0 auto 28px',
            fontWeight: 600
          }}
        >
          Explore full 4K photo collections, artisan stories, eco-cleanliness checks, and cast your verified community vote in real-time.
        </p>

        {/* The Giant 3D Vote Button */}
        <div style={{ maxWidth: '420px', margin: '0 auto 12px' }}>
          <button
            onClick={onExploreClick}
            className="btn-3d-giant"
          >
            <span>EXPLORE PANDHALS &amp; VOTE NOW ↓</span>
          </button>
        </div>
      </section>
    </div>
  );
}
