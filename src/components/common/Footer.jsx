import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 'auto',
        background: '#08090e',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px 16px 28px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="/favicon.svg" 
            alt="Bappa Trail" 
            style={{ width: '24px', height: '24px', display: 'block' }}
          />
          <span 
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}
          >
            BAPPA<span style={{ color: 'var(--neon-lime)' }}>TRAIL</span>
          </span>
        </div>

        {/* Tagline */}
        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Chaturthi 2026 • Celebrating Devotion, Art &amp; Tradition
        </p>

        {/* Divider */}
        <div 
          style={{
            height: '1px',
            width: '60px',
            background: 'rgba(255, 255, 255, 0.12)',
            margin: '4px 0'
          }}
        />

        {/* All Rights Reserved */}
        <p 
          style={{
            margin: 0,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-secondary)'
          }}
        >
          &copy; {currentYear} Bappa Trail. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
