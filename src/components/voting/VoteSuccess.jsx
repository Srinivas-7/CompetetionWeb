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
          width: '84px',
          height: '84px',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, #2E7D32 0%, #1B5E20 70%)',
          border: '3px solid var(--gold-primary)',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(76, 175, 80, 0.6), 0 0 15px var(--gold-primary)'
        }}
      >
        <span style={{ fontSize: '2.8rem', color: '#FFF', fontWeight: 900 }}>✓</span>
      </div>

      <h3 
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          fontWeight: 900,
          color: 'var(--gold-primary)',
          letterSpacing: '1px',
          marginBottom: '6px'
        }}
      >
        VOTE LOCKED
      </h3>

      <p style={{ fontSize: '0.95rem', color: 'var(--ivory-cream)', lineHeight: 1.4, marginBottom: '18px' }}>
        Your sacred community vote for <strong style={{ color: 'var(--gold-light)' }}>{pandhalName}</strong> is officially recorded! 🐘✨
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button 
          variant="whatsapp" 
          onClick={onShareClick}
          icon="💬"
          style={{ width: '100%' }}
        >
          Share My Vote on WhatsApp
        </Button>

        <Button 
          variant="secondary" 
          onClick={onDoneClick}
          style={{ width: '100%' }}
        >
          Continue Exploring Trail
        </Button>
      </div>
    </div>
  );
}
