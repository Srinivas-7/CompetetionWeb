import React from 'react';

export function AlreadyVoted({ message }) {
  if (!message) return null;

  return (
    <div 
      style={{
        background: 'rgba(194, 24, 7, 0.25)',
        border: '1px solid #FF5252',
        color: '#FF8A80',
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '14px',
        textAlign: 'left',
        lineHeight: 1.35
      }}
    >
      {message}
    </div>
  );
}
