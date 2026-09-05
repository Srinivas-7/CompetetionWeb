import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../hooks/useProgress';

export function Hero({ onExploreClick, onProfileClick, totalVotes = 0 }) {
  const { user } = useAuth();
  const { totalPoints } = useProgress();

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      {/* 1. Sticky Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(251, 247, 240, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid #EADECB',
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
              src="/assets/cute-bappa-logo.jpg" 
              alt="Bappa Trail Logo" 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--gold-primary)',
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
                  color: 'var(--maroon-primary)',
                  whiteSpace: 'nowrap'
                }}
              >
                BAPPA<span style={{ color: 'var(--gold-primary)' }}>TRAIL</span>
              </span>
            </div>
          </div>

          {/* Right User Profile + Live Pill + Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Logged in Google User Pill - Clicking opens Profile & Progress Page */}
            {user && (
              <button 
                onClick={onProfileClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  border: '1.5px solid var(--gold-primary)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '3px 10px 3px 4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(200, 157, 71, 0.2)',
                  transition: 'all 0.12s ease'
                }}
                title="View your Devotee Profile & Progress Points"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid var(--gold-primary)' }}
                  />
                ) : (
                  <span style={{ fontSize: '13px' }}>👤</span>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.72rem', 
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
                <span 
                  style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.68rem', 
                    fontWeight: 900, 
                    color: 'var(--maroon-dark)',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--gold-primary)'
                  }}
                >
                  🪙 {totalPoints}
                </span>
              </button>
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

      {/* 2. Hero Section */}
      <section 
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '28px 16px 24px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Official Trail Sticker */}
        <div style={{ marginBottom: '18px' }}>
          <span 
            style={{
              display: 'inline-block',
              background: '#FDF6E2',
              color: 'var(--maroon-primary)',
              border: '1.5px solid var(--gold-primary)',
              boxShadow: '0 2px 8px rgba(200, 157, 71, 0.25)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.76rem',
              letterSpacing: '0.06em',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              textTransform: 'uppercase'
            }}
          >
            ★ CHATURTHI 2026 OFFICIAL TRAIL ★
          </span>
        </div>

        {/* Regal Gajotsava Logo Emblem Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
          <div 
            style={{
              position: 'relative',
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '8px',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 8px 24px rgba(107, 20, 20, 0.12), 0 0 16px rgba(200, 157, 71, 0.25)',
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
                border: '1px solid rgba(200, 157, 71, 0.4)',
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
                  borderRadius: '13px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Massive Display Typography */}
        <h1 
          style={{
            fontSize: 'clamp(2rem, 7.5vw, 3.1rem)',
            lineHeight: 1.1,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            margin: '0 0 14px',
            textTransform: 'uppercase',
            color: 'var(--text-primary)'
          }}
        >
          <div>ONE CITY.</div>
          <div className="gradient-text-hyper">21 BAPPAS.</div>
          <div style={{ color: 'var(--maroon-primary)' }}>ONE VOTE.</div>
        </h1>

        {/* Subtext */}
        <p 
          style={{
            fontSize: '0.96rem',
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            maxWidth: '460px',
            margin: '0 auto 26px',
            fontWeight: 500
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
