import React from 'react';

export function LiveVoteCount({ count = 0, label = "votes", showIcon = true, style = {} }) {
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(18, 3, 5, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        borderRadius: 'var(--radius-pill)',
        padding: '4px 12px',
        ...style
      }}
    >
      {showIcon && <span style={{ fontSize: '1rem' }}>🗳️</span>}
      <span 
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.1rem',
          fontWeight: 800,
          color: 'var(--gold-primary)',
          lineHeight: 1
        }}
      >
        {count.toLocaleString('en-IN')}
      </span>
      {label && (
        <span style={{ fontSize: '0.75rem', color: 'var(--ivory-muted)', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
    </div>
  );
}
