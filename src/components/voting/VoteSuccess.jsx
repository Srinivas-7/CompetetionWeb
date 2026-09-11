import React from 'react';
import { Button } from '../common/Button';

export function VoteSuccess({ 
  pandhalName, 
  onShareClick, 
  onDoneClick 
}) {
  return (
    <div style={{ padding: '15px 0 10px', textAlign: 'center' }}>
      {/* Checkmark Badge */}
      <div 
        style={{
          width: '76px',
          height: '76px',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--green-emerald)',
          border: '3px solid var(--maroon-dark)',
          borderRadius: 'var(--radius-xs)',
          boxShadow: '4px 4px 0px var(--maroon-dark)'
        }}
      >
        <span style={{ fontSize: '2.4rem', color: '#FFF', fontWeight: 900 }}>✓</span>
      </div>

      <h3 
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          fontWeight: 900,
          color: 'var(--maroon-primary)',
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}
      >
        VOTE LOCKED
      </h3>

      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '20px', fontWeight: 600 }}>
        Your sacred community vote for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhalName}</strong> is officially recorded!
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button 
          variant="whatsapp" 
          onClick={onShareClick}
          style={{ width: '100%' }}
        >
          Share My Vote on WhatsApp
        </Button>

        <Button 
          variant="secondary" 
          onClick={onDoneClick}
          style={{ width: '100%' }}
        >
          Continue Exploring Pandhals
        </Button>
      </div>
    </div>
  );
}
