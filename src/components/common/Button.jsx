import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button',
  icon = null,
  style = {},
  ariaLabel
}) {
  const baseStyle = {
    fontFamily: 'var(--font-sans)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-xs)',
    transition: 'transform 0.08s ease, box-shadow 0.08s ease',
    touchAction: 'manipulation',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    ...style
  };

  const variantStyles = {
    primary: {
      background: 'var(--maroon-primary)',
      color: '#FFFFFF',
      fontWeight: 900,
      fontSize: '0.96rem',
      padding: '12px 24px',
      minHeight: 'var(--touch-target)',
      border: '2.5px solid var(--maroon-dark)',
      boxShadow: '4px 4px 0px var(--maroon-dark)'
    },
    secondary: {
      background: 'var(--ivory-warm)',
      color: 'var(--maroon-primary)',
      fontWeight: 900,
      fontSize: '0.94rem',
      padding: '12px 22px',
      minHeight: 'var(--touch-target)',
      border: '2px solid var(--maroon-dark)',
      boxShadow: '3px 3px 0px var(--maroon-dark)'
    },
    whatsapp: {
      background: '#25D366',
      color: '#FFFFFF',
      fontWeight: 900,
      fontSize: '0.94rem',
      padding: '12px 22px',
      minHeight: 'var(--touch-target)',
      border: '2.5px solid var(--maroon-dark)',
      boxShadow: '4px 4px 0px var(--maroon-dark)'
    },
    iconOnly: {
      width: '42px',
      height: '42px',
      background: 'var(--ivory-warm)',
      border: '2px solid var(--maroon-dark)',
      borderRadius: 'var(--radius-xs)',
      boxShadow: '2px 2px 0px var(--maroon-dark)',
      color: 'var(--maroon-primary)',
      fontSize: '1.1rem',
      padding: 0
    }
  };

  const appliedStyle = {
    ...baseStyle,
    ...(variantStyles[variant] || variantStyles.primary)
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={appliedStyle}
      className={`leo-btn ${className}`}
      aria-label={ariaLabel}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
