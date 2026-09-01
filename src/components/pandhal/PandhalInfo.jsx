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
        <span>📍</span>
        <span>{pandhal.location}</span>
      </div>
      <div 
        style={{
          fontSize: '0.78rem',
          color: 'var(--ivory-cream)',
          background: 'rgba(255, 215, 0, 0.08)',
          borderLeft: '3px solid var(--gold-primary)',
          padding: '6px 10px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          marginTop: '6px',
          lineHeight: 1.35
        }}
      >
        <strong>Theme:</strong> {pandhal.theme} (Est. {pandhal.establishedYear})
      </div>
    </div>
  );
}
