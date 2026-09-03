import React from 'react';

export function PhoneInput({ value, onChange, onKeyDown, autoFocus = false, disabled = false }) {
  const handleChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 10) digits = digits.slice(0, 10);
    onChange(digits);
  };

  return (
    <div style={{ textAlign: 'left', marginBottom: '18px' }}>
      <label 
        htmlFor="phone-vote-input" 
        style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--ivory-cream)', marginBottom: '8px' }}
      >
        Enter Mobile Number to Vote
      </label>

      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 2, 4, 0.9)',
          border: '1.5px solid var(--gold-metallic)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}
      >
        <span 
          style={{
            padding: '12px 14px',
            background: 'rgba(255, 215, 0, 0.08)',
            borderRight: '1px solid rgba(255, 215, 0, 0.2)',
            color: 'var(--gold-light)',
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            userSelect: 'none'
          }}
        >
          +91
        </span>

        <input
          id="phone-vote-input"
          type="tel"
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder="9876543210"
          maxLength={10}
          inputMode="numeric"
          autoComplete="tel-national"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '12px 14px',
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#FFF'
          }}
          aria-label="10 digit Indian mobile number"
        />
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--ivory-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>1 unique phone number = 1 community vote across the trail.</span>
      </p>
    </div>
  );
}
