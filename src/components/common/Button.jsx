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
    border: 'none',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-pill)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    touchAction: 'manipulation',
    ...style
  };

  const variantStyles = {
    primary: {
      background: 'var(--accent-gradient)',
      color: '#FFFFFF',
      fontWeight: 700,
      fontSize: '0.96rem',
      padding: '12px 24px',
      minHeight: 'var(--touch-target)',
      boxShadow: '0 4px 20px rgba(255, 85, 0, 0.35)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-primary)',
      fontWeight: 600,
      fontSize: '0.94rem',
      padding: '12px 22px',
      minHeight: 'var(--touch-target)',
      border: '1px solid var(--border-medium)',
      backdropFilter: 'blur(10px)'
    },
    whatsapp: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#FFFFFF',
      fontWeight: 700,
      fontSize: '0.94rem',
      padding: '12px 22px',
      minHeight: 'var(--touch-target)',
      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.35)'
    },
    iconOnly: {
      width: '42px',
      height: '42px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid var(--border-medium)',
      borderRadius: '50%',
      color: 'var(--text-primary)',
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
