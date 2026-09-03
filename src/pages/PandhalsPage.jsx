import React, { useEffect, useState } from 'react';
import { PandhalGrid } from '../components/pandhal/PandhalGrid';
import { Leaderboard } from '../components/leaderboard/Leaderboard';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/common/Footer';

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
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
          {/* Back to Home Button */}
          <button
            onClick={onBack}
            style={{
              background: '#FFFFFF',
              border: '1px solid #EADECB',
              color: 'var(--maroon-primary)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <span>←</span>
            <span>Home</span>
          </button>

          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Bappa Trail" 
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gold-primary)', display: 'block' }}
            />
            <span 
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.92rem',
                letterSpacing: '-0.02em',
                color: 'var(--maroon-primary)',
                whiteSpace: 'nowrap'
              }}
            >
              BAPPA<span style={{ color: 'var(--gold-primary)' }}>TRAIL</span>
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
                  background: 'rgba(107, 20, 20, 0.08)',
                  border: '1px solid rgba(107, 20, 20, 0.2)',
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
                    style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid var(--gold-primary)' }}
                  />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8, color: 'var(--maroon-primary)' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-sans)', 
                    fontSize: '0.66rem', 
                    fontWeight: 700, 
                    color: 'var(--maroon-primary)', 
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

      {/* Royal Maroon Hero Banner */}
      <div 
        style={{
          background: 'var(--maroon-dark)',
          color: '#FFFFFF',
          padding: '28px 16px 24px',
          textAlign: 'center',
          borderBottom: '2px solid var(--gold-primary)'
        }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: 'var(--gold-light)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}
          >
            ✦ EXPLORE &amp; VOTE ✦
          </div>

          <h1 
            style={{
              fontSize: 'clamp(1.6rem, 5.5vw, 2.4rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
              margin: '0 0 8px',
              letterSpacing: '-0.02em'
            }}
          >
            21 PANDALS
          </h1>

          <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.82)', fontWeight: 500 }}>
            Discover. Vote. Support.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <main 
        style={{
          padding: '24px 14px 60px',
          maxWidth: 'var(--container-max)',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          boxSizing: 'border-box',
          flex: 1
        }}
      >
        {/* Search Bar + Leaderboard + Shuffle Action Bar */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pandal name or location..."
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid #EADECB',
                  background: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--maroon-primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(107, 20, 20, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#EADECB';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
                aria-label="Search pandhals"
              />
            </div>

            {/* Leaderboard Button */}
            <button
              onClick={() => setShowLeaderboard(true)}
              style={{
                whiteSpace: 'nowrap',
                background: '#FFFFFF',
                border: '1.5px solid #EADECB',
                color: 'var(--maroon-primary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '10px 14px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--maroon-primary)';
                e.currentTarget.style.background = '#FDFBF7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#EADECB';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              title="View Live Leaderboard"
            >
              {/* Trophy Icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-primary)' }}>
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1c1.78-.39 3.23-1.63 3.61-3.14C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
              <span>Leaderboard</span>
            </button>

            {/* Shuffle Button */}
            {onShuffle && (
              <button
                onClick={onShuffle}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#FFFFFF',
                  border: '1.5px solid #EADECB',
                  color: 'var(--maroon-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--maroon-primary)';
                  e.currentTarget.style.background = '#FDFBF7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#EADECB';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                title="Shuffle pandhals randomly"
              >
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

      {/* Live Leaderboard Modal Dialog */}
      <Modal 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)}
        maxWidth="680px"
        ariaLabel="Live Trail Leaderboard"
      >
        <Leaderboard 
          liveCounts={liveCounts}
          onPandhalClick={(id) => {
            setShowLeaderboard(false);
            onCardClick(id);
          }}
          onClose={() => setShowLeaderboard(false)}
        />
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  );
}
