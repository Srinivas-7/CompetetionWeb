import React from 'react';
import { Hero } from '../components/home/Hero';
import { PandhalGrid } from '../components/pandhal/PandhalGrid';
import { CATEGORIES } from '../utils/constants';

export function Home({ 
  pandhals = [],
  liveCounts = {},
  totalVotes = 0,
  myVote = null,
  searchQuery = '',
  setSearchQuery,
  activeCategory = 'all',
  setActiveCategory,
  onCardClick,
  onVoteClick,
  onShareClick,
  onShuffle
}) {
  const scrollToPandhals = () => {
    document.getElementById('pandhals')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'var(--bg-page)', color: '#ffffff', minHeight: '100vh' }}>
      {/* 1. FRONT HERO (Peak Creative Maximalism with Giant Vote CTA) */}
      <Hero 
        onExploreClick={scrollToPandhals} 
        totalVotes={totalVotes}
      />

      {/* 2. PANDHALS DIRECT VOTE & 4K PHOTO CATALOGUE */}
      <main 
        id="pandhals"
        style={{
          padding: '24px 16px 80px',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '22px' }}>
          <div 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--neon-pink)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}
          >
            ⚡ COMMUNITY BALLOT &amp; 4K GALLERIES
          </div>

          <h2 
            style={{
              fontSize: 'clamp(1.4rem, 5vw, 1.95rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              lineHeight: 1.18,
              color: '#ffffff',
              margin: '0 0 16px',
              letterSpacing: '-0.02em'
            }}
          >
            21 Pandhals to <span className="gradient-text-hyper">Explore &amp; Vote</span>
          </h2>

          {/* Search Bar with 1-Tap Shuffle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  fontSize: '16px',
                  color: 'var(--text-muted)'
                }}
              >
                🔍
              </span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pandhal name, location..."
                style={{
                  width: '100%',
                  padding: '11px 16px 11px 42px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  background: '#111420',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
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
                  fontSize: '0.82rem',
                  padding: '11px 16px',
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

        {/* 21 Pandhals Grid */}
        <PandhalGrid 
          pandhals={pandhals}
          liveCounts={liveCounts}
          myVote={myVote}
          onCardClick={onCardClick}
          onVoteClick={onVoteClick}
          onShareClick={onShareClick}
        />
      </main>

      {/* 3. Maximalist Mobile Footer */}
      <footer 
        style={{
          borderTop: '2px solid rgba(255, 255, 255, 0.12)',
          background: '#08090e',
          padding: '32px 16px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}
      >
        <div 
          style={{ 
            fontFamily: 'var(--font-heading)',
            fontWeight: 800, 
            fontSize: '1.15rem',
            color: '#ffffff', 
            letterSpacing: '-0.02em',
            marginBottom: '6px' 
          }}
        >
          GANPATI BAPPA MORYA 🐘✨
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--neon-lime)', marginBottom: '16px' }}>
          CHATURTHI 2026 • 1-PHONE = 1-VOTE VERIFIED
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-3d-pink"
          style={{
            padding: '8px 20px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          BACK TO TOP ↑
        </button>
      </footer>
    </div>
  );
}
