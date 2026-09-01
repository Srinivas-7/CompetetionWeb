import React from 'react';
import { Hero } from '../components/home/Hero';

export function Home({ 
  totalVotes = 0,
  onExploreClick
}) {
  return (
    <div style={{ background: 'var(--bg-page)', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Grand Hero & Interactive CTA */}
      <Hero 
        onExploreClick={onExploreClick} 
        totalVotes={totalVotes}
      />

      {/* 2. Highlights / Feature Section on Home Landing */}
      <section 
        style={{
          maxWidth: 'var(--container-max)',
          width: '100%',
          margin: '0 auto',
          padding: '10px 16px 60px',
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            marginBottom: '32px'
          }}
        >
          {/* Card 1 */}
          <div 
            style={{
              background: '#141726',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏛️</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
              21 Grand Pandhals
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Curated mandals across the city with exclusive 4K photo collections.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            style={{
              background: '#141726',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: '#f59e0b' }}>
              1 Google Account = 1 Vote
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Strict anti-fraud verification ensuring fair, verified community voting.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            style={{
              background: '#141726',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: '#10b981' }}>
              Live Real-Time Tally
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              Instant live score updates synced simultaneously across all devices.
            </p>
          </div>
        </div>

        {/* Big Direct Action Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onExploreClick}
            style={{
              background: 'var(--gradient-hyper)',
              color: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 6px 24px rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-pill)',
              padding: '16px 36px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.12s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(2px)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>EXPLORE 21 PANDHALS &amp; VOTE NOW 🏆</span>
          </button>
        </div>
      </section>
    </div>
  );
}
