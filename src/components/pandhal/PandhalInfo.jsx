import React from 'react';

export function PandhalInfo({ pandhal }) {
  if (!pandhal) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <h3 
        style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.25rem', 
          fontWeight: 800, 
          color: 'var(--gold-light)', 
          lineHeight: 1.2 
        }}
      >
        {pandhal.name}
      </h3>
      <span style={{ fontSize: '0.86rem', color: 'var(--saffron-light)', fontWeight: 600 }}>
        {pandhal.organization}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--ivory-muted)', marginTop: '2px' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.75, flexShrink: 0 }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span>{pandhal.location}</span>
      </div>
      <div 
        style={{
          fontSize: '0.8rem',
          color: 'var(--ivory-cream)',
          background: 'rgba(200, 157, 71, 0.12)',
          border: '1.5px solid var(--gold-primary)',
          boxShadow: '2px 2px 0px var(--gold-primary)',
          padding: '8px 10px',
          borderRadius: 'var(--radius-xs)',
          marginTop: '6px',
          lineHeight: 1.35
        }}
      >
        <strong style={{ color: 'var(--gold-light)' }}>THEME:</strong> {pandhal.theme} (Est. {pandhal.establishedYear})
      </div>
    </div>
  );
}
