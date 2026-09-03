import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function Hero({ onExploreClick, totalVotes = 0 }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ background: 'var(--bg-page)', color: '#ffffff', overflow: 'hidden' }}>
      {/* 1. Sticky High-Energy Header (Mobile-Optimized Spacing) */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(8, 9, 14, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.12)',
          padding: '10px 14px'
        }}
      >
        <div 
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <img 
              src="/favicon.svg" 
              alt="Bappa Trail Logo" 
              style={{
                width: '32px',
                height: '32px',
                display: 'block',
                flexShrink: 0
              }}
            />
            <div>
              <span 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.94rem',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap'
                }}
              >
                BAPPA<span style={{ color: 'var(--neon-lime)' }}>TRAIL</span>
              </span>
            </div>
          </div>

          {/* Right User Profile + Live Pill + Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Logged in Google User Pill */}
            {user && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '2px 8px 2px 2px',
                  cursor: 'pointer'
                }}
                onClick={logout}
                title={`Signed in as ${user.email}. Click to sign out.`}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid var(--neon-lime)' }}
                  />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: '#ffffff', 
                    maxWidth: '80px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>✕</span>
              </div>
            )}

            <button
              onClick={onExploreClick}
              className="btn-3d-pink"
              style={{
                padding: '6px 14px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-display)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <span>VOTE</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Peak Creative Maximalism) */}
      <section 
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '24px 16px 20px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Angled Sticker */}
        <div style={{ marginBottom: '16px' }}>
          <span 
            style={{
              display: 'inline-block',
              background: 'var(--neon-yellow)',
              color: '#000000',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px var(--neon-pink)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.76rem',
              letterSpacing: '0.06em',
              padding: '6px 12px',
              borderRadius: '6px',
              transform: 'rotate(-2deg)'
            }}
          >
            ★ CHATURTHI 2026 OFFICIAL TRAIL ★
          </span>
        </div>

        {/* Regal Gajotsava Logo Emblem Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div 
            style={{
              position: 'relative',
              background: '#fefefe',
              borderRadius: '20px',
              padding: '8px',
              border: '2px solid #f59e0b',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 28px rgba(245, 158, 11, 0.3)',
              maxWidth: 'clamp(170px, 45vw, 220px)',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Inner Gold Inset Border */}
            <div 
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid rgba(180, 83, 9, 0.3)',
                background: '#faf7f2',
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
                  borderRadius: '13px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Massive Maximalist Display Typography */}
        <h1 
          style={{
            fontSize: 'clamp(2rem, 7.5vw, 3.1rem)',
            lineHeight: 1.08,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            margin: '0 0 14px',
            textTransform: 'uppercase'
          }}
        >
          <div>ONE CITY.</div>
          <div className="gradient-text-hyper">21 BAPPAS.</div>
          <div className="stroke-text">ONE VOTE.</div>
        </h1>

        {/* Subtext */}
        <p 
          style={{
            fontSize: '0.96rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            maxWidth: '440px',
            margin: '0 auto 24px',
            fontWeight: 500
          }}
        >
          Explore full 4K photo collections, artisan stories, eco-cleanliness checks, and cast your verified community vote in real-time.
        </p>

        {/* THE GIANT MAXIMALIST 3D VOTE BUTTON */}
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
