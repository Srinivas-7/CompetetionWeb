import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function calculateTimeRemaining(targetTimestamp) {
  const diff = Math.max(0, targetTimestamp - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  return {
    diff,
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isEnded: diff <= 0
  };
}

export function Hero({ onExploreClick, totalVotes = 0 }) {
  const { user, logout } = useAuth();

  // Countdown timer to today 1:00 PM
  const [targetTimestamp] = useState(() => {
    const target = new Date();
    target.setHours(13, 0, 0, 0);
    return target.getTime();
  });

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetTimestamp));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetTimestamp));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

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
              alt="Gajotsav Logo" 
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
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '-0.02em',
                  color: 'var(--maroon-primary)',
                  display: 'block',
                  lineHeight: 1
                }}
              >
                GAJ<span style={{ color: 'var(--gold-primary)' }}>OTSAV</span>
              </span>
              <span 
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                KHAMMAM 2026
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user ? (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  border: '1px solid #EADECB',
                  borderRadius: 'var(--radius-pill)',
                  padding: '3px 8px 3px 3px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
                }}
                onClick={logout}
                title={`Signed in as ${user.email}. Click to sign out.`}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid var(--gold-primary)' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.72rem' }}>👤</span>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: 'var(--maroon-primary)', 
                    maxWidth: '80px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </div>
            ) : null}

            {/* Quick Explore CTA */}
            <button
              onClick={onExploreClick}
              style={{
                background: 'var(--maroon-primary)',
                color: '#FFFFFF',
                border: '1px solid var(--maroon-dark)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(107, 20, 20, 0.25)',
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

      {/* 2. Royal Maroon & Gold Announcement Ribbon */}
      <div 
        role="region"
        aria-label="Important Announcement"
        style={{
          background: 'linear-gradient(90deg, #4A0E17 0%, #6B1414 50%, #4A0E17 100%)',
          color: '#FFFFFF',
          borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          borderBottom: '1.5px solid var(--gold-primary)',
          padding: '8px 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(74, 14, 23, 0.35)',
          position: 'relative'
        }}
      >
        <div 
          className="animate-marquee" 
          style={{ 
            gap: '36px', 
            whiteSpace: 'nowrap',
            animationDuration: '24s'
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <span 
              key={i} 
              style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                letterSpacing: '0.03em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFF8EB'
              }}
            >
              <span 
                style={{ 
                  color: 'var(--gold-light)', 
                  background: 'rgba(212, 175, 55, 0.16)',
                  border: '1px solid rgba(212, 175, 55, 0.38)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em'
                }}
              >
                NOTICE
              </span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                The Voting will be closed today at 1:00 PM
              </span>
              <span 
                style={{ 
                  background: 'rgba(0, 0, 0, 0.35)', 
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  color: 'var(--gold-light)',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem'
                }}
              >
                {timeLeft.isEnded ? 'Voting Closed' : `Ends in ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
              </span>
              <span style={{ color: 'var(--gold-primary)', margin: '0 4px', fontSize: '0.7rem' }}>✦</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Cast your verified community vote today!</span>
              <span style={{ color: 'var(--gold-primary)', margin: '0 4px', fontSize: '0.7rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Hero Section */}
      <section 
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: 'clamp(42px, 7vw, 60px) 16px 28px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Official Utsav Sticker */}
        <div style={{ marginBottom: '22px' }}>
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
            ★ GAJOTSAV 2026 ★
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
