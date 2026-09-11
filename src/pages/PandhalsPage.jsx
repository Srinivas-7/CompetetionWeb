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
          background: 'var(--bg-card)',
          borderBottom: '2.5px solid var(--maroon-dark)',
          boxShadow: '0 3px 0px rgba(0, 0, 0, 0.08)',
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
              border: '2px solid var(--maroon-dark)',
              color: 'var(--maroon-primary)',
              borderRadius: 'var(--radius-xs)',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              boxShadow: '2px 2px 0px var(--maroon-dark)',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '2px 2px 0px var(--maroon-dark)';
            }}
          >
            <span style={{ fontWeight: 900 }}>←</span>
            <span>Home</span>
          </button>

          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Bappa Utsav" 
              style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover', border: '2px solid var(--maroon-dark)', boxShadow: '2px 2px 0px var(--maroon-dark)', display: 'block' }}
            />
            <span 
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.98rem',
                letterSpacing: '-0.02em',
                color: 'var(--maroon-primary)',
                whiteSpace: 'nowrap'
              }}
            >
              BAPPA<span style={{ color: 'var(--gold-primary)' }}> UTSAV</span>
            </span>
          </div>

          {/* User Profile / Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {user && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--ivory-warm)',
                  border: '2px solid var(--maroon-dark)',
                  boxShadow: '2px 2px 0px var(--maroon-dark)',
                  borderRadius: 'var(--radius-xs)',
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
                    style={{ width: '20px', height: '20px', borderRadius: '2px', border: '1px solid var(--maroon-dark)' }}
                  />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9, color: 'var(--maroon-primary)' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <span 
                  style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
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
            )}
          </div>
        </div>
      </header>

      {/* Royal Maroon Hero Banner */}
      <div 
        style={{
          background: 'var(--maroon-dark)',
          color: '#FFFFFF',
          padding: '32px 16px 28px',
          textAlign: 'center',
          borderBottom: '3.5px solid var(--gold-primary)',
          boxShadow: '0 4px 0px var(--maroon-dark)'
        }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div 
            style={{
              display: 'inline-block',
              background: 'var(--maroon-primary)',
              border: '1.5px solid var(--gold-primary)',
              boxShadow: '2px 2px 0px var(--gold-primary)',
              borderRadius: 'var(--radius-xs)',
              padding: '3px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 900,
              color: 'var(--gold-light)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            ✦ EXPLORE &amp; VOTE ✦
          </div>

          <h1 
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 2.6rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#FFFFFF',
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}
          >
            21 PANDALS
          </h1>

          <p style={{ margin: 0, fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, fontFamily: 'var(--font-sans)', letterSpacing: '0.02em' }}>
            Discover. Vote. Support.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <main 
        style={{
          padding: '28px 14px 60px',
          maxWidth: 'var(--container-max)',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          boxSizing: 'border-box',
          flex: 1
        }}
      >
        {/* Search Bar + Leaderboard + Shuffle Action Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <span 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--maroon-primary)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-xs)',
                  border: '2px solid var(--maroon-dark)',
                  background: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxShadow: '3px 3px 0px var(--maroon-dark)',
                  transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--maroon-primary)';
                  e.target.style.boxShadow = '4px 4px 0px var(--maroon-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--maroon-dark)';
                  e.target.style.boxShadow = '3px 3px 0px var(--maroon-dark)';
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
                border: '2px solid var(--maroon-dark)',
                color: 'var(--maroon-primary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '11px 16px',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px var(--maroon-dark)',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(1px, 1px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '3px 3px 0px var(--maroon-dark)';
              }}
              title="View Live Leaderboard"
            >
              {/* Trophy Icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-primary)' }}>
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
                  background: 'var(--ivory-warm)',
                  border: '2px solid var(--maroon-dark)',
                  color: 'var(--maroon-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0px var(--maroon-dark)',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'transform 0.08s ease, box-shadow 0.08s ease'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translate(1px, 1px)';
                  e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '3px 3px 0px var(--maroon-dark)';
                }}
                title="Shuffle pandhals randomly"
              >
                <span>🎲 Shuffle</span>
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
        ariaLabel="Live Leaderboard"
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
