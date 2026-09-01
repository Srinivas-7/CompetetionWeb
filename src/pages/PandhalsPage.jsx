import React, { useEffect } from 'react';
import { PandhalGrid } from '../components/pandhal/PandhalGrid';
import { useAuth } from '../context/AuthContext';

export function PandhalsPage({
  pandhals = [],
  liveCounts = {},
  myVote = null,
  searchQuery = '',
  setSearchQuery,
  onCardClick,
  onVoteClick,
  onShuffle,
  onBack
}) {
  const { user, logout } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ background: 'var(--bg-page)', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(11, 13, 20, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
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
          {/* Back to Home Button */}
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}
          >
            <span>←</span>
            <span>Home</span>
          </button>

          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <img 
              src="/favicon.svg" 
              alt="Bappa Trail" 
              style={{ width: '26px', height: '26px', display: 'block' }}
            />
            <span 
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.92rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
                whiteSpace: 'nowrap'
              }}
            >
              BAPPA<span style={{ color: 'var(--neon-pink)' }}>TRAIL</span>
            </span>
          </div>

          {/* User Profile / Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
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
                    style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #f59e0b' }}
                  />
                ) : (
                  <span style={{ fontSize: '12px' }}>👤</span>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.66rem', 
                    fontWeight: 700, 
                    color: '#ffffff', 
                    maxWidth: '70px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main 
        style={{
          padding: '20px 14px 60px',
          maxWidth: 'var(--container-max)',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          boxSizing: 'border-box',
          flex: 1
        }}
      >
        {/* Title Header */}
        <div style={{ marginBottom: '18px' }}>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#f59e0b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '3px'
            }}
          >
            ⚡ 2026 OFFICIAL COMMUNITY BALLOT
          </div>

          <h1 
            style={{
              fontSize: 'clamp(1.35rem, 5vw, 1.85rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              lineHeight: 1.18,
              color: '#ffffff',
              margin: '0 0 14px',
              letterSpacing: '-0.02em'
            }}
          >
            21 Pandhals to <span className="gradient-text-hyper">Explore &amp; Vote</span>
          </h1>

          {/* Search Bar with 1-Tap Shuffle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  fontSize: '15px',
                  color: 'var(--text-muted)'
                }}
              >
                🔍
              </span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  background: '#111420',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--neon-pink)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                }}
                aria-label="Search pandhals"
              />
            </div>

            {onShuffle && (
              <button
                onClick={onShuffle}
                style={{
                  whiteSpace: 'nowrap',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#f59e0b',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.12s ease'
                }}
                title="Shuffle pandhals randomly"
              >
                <span>🔀</span>
                <span>Shuffle</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-in-a-Row Pandhals Grid */}
        <PandhalGrid 
          pandhals={pandhals}
          liveCounts={liveCounts}
          myVote={myVote}
          onCardClick={onCardClick}
          onVoteClick={onVoteClick}
        />
      </main>
    </div>
  );
}
