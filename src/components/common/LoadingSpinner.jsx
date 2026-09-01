import React from 'react';

export function LoadingSpinner({ size = 48, text = null, subtext = null }) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: '4px solid rgba(255, 215, 0, 0.2)',
          borderTopColor: 'var(--gold-primary)',
          borderRadius: '50%',
          margin: '0 auto 14px',
          animation: 'spinSlow 0.8s linear infinite'
        }}
      />
      {text && (
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
          {text}
        </div>
      )}
      {subtext && (
        <div style={{ fontSize: '0.84rem', color: 'var(--ivory-muted)', marginTop: '4px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
