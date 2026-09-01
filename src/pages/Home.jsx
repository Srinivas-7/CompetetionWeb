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
  onShareClick
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

          {/* Search Input with Neon Outline */}
          <div style={{ position: 'relative', width: '100%', marginBottom: '14px' }}>
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
              placeholder="Search by pandhal name, location, theme..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: '#0c0e17',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.94rem',
                fontWeight: 600,
                color: '#ffffff',
                outline: 'none',
                boxShadow: '4px 4px 0px rgba(255, 0, 127, 0.35)',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--neon-pink)';
                e.target.style.boxShadow = '4px 4px 0px var(--neon-pink)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = '4px 4px 0px rgba(255, 0, 127, 0.35)';
              }}
              aria-label="Search pandhals"
            />
          </div>

          {/* Category Filter Pills (3D Buttons) */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '8px', 
              overflowX: 'auto', 
              paddingBottom: '8px', 
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    background: isActive ? 'var(--neon-yellow)' : '#131624',
                    border: isActive ? '2px solid #000000' : '1.5px solid rgba(255, 255, 255, 0.15)',
                    color: isActive ? '#000000' : '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    boxShadow: isActive ? '3px 3px 0px var(--neon-pink)' : '2px 2px 0px rgba(0, 0, 0, 0.5)',
                    flexShrink: 0,
                    transition: 'all 0.12s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
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
