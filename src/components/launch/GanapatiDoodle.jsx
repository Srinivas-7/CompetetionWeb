import React from 'react';

export function GanapatiDoodle({ size = 260, className = '' }) {
  return (
    <div
      className={`ganapati-doodle-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        maxWidth: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      {/* Soft Divine Golden Glow Halo */}
      <div
        style={{
          position: 'absolute',
          width: '90%',
          height: '90%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(223, 191, 122, 0.45) 0%, rgba(200, 157, 71, 0.15) 55%, transparent 75%)',
          filter: 'blur(10px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Decorative Dashed Ring */}
      <div
        style={{
          position: 'absolute',
          width: '94%',
          height: '94%',
          borderRadius: '50%',
          border: '1.5px dashed rgba(200, 157, 71, 0.4)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'spinSlow 30s linear infinite'
        }}
      />

      {/* Exact Hand-Drawn Ganapati Doodle Image */}
      <img
        src="/assets/ganapati-doodle.png"
        alt="Hand-drawn Bappa Doodle"
        style={{
          width: '85%',
          height: '85%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          mixBlendMode: 'multiply',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
          filter: 'contrast(1.08)'
        }}
      />

      {/* Auspicious Gold Sparkle Accents */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          right: '10%',
          color: '#C89D47',
          fontSize: '1.2rem',
          zIndex: 2,
          animation: 'pulseGlow 2s ease-in-out infinite'
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '8%',
          color: '#C89D47',
          fontSize: '1.1rem',
          zIndex: 2,
          animation: 'pulseGlow 2.4s ease-in-out infinite 0.5s'
        }}
      >
        ✦
      </div>
    </div>
  );
}
