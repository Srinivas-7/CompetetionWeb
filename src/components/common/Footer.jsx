import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 'auto',
        background: 'var(--maroon-dark)',
        borderTop: '3.5px solid var(--gold-primary)',
        boxShadow: '0 -3px 0px var(--maroon-dark)',
        padding: '36px 16px 30px',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)'
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
            src="/assets/cute-bappa-logo.jpg" 
            alt="Bappa Utsav" 
            style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', border: '2px solid var(--gold-primary)', boxShadow: '2px 2px 0px var(--gold-primary)', display: 'block' }}
          />
          <span 
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '1.05rem',
              letterSpacing: '-0.01em',
              color: '#FFFFFF',
              textTransform: 'uppercase'
            }}
          >
            BAPPA<span style={{ color: 'var(--gold-primary)' }}> UTSAV</span>
          </span>
        </div>

        {/* Tagline */}
        <p style={{ margin: 0, fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600, letterSpacing: '0.02em' }}>
          Chaturthi 2026 • Celebrating Devotion, Art &amp; Tradition
        </p>

        {/* Divider */}
        <div 
          style={{
            height: '2px',
            width: '60px',
            background: 'var(--gold-primary)',
            margin: '6px 0'
          }}
        />

        {/* All Rights Reserved */}
        <p 
          style={{
            margin: 0,
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          &copy; {currentYear} Bappa Utsav. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
