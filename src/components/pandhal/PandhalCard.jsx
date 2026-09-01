import React, { memo } from 'react';

export const PandhalCard = memo(function PandhalCard({ 
  pandhal, 
  voteCount = 0, 
  hasVoted = false, 
  onCardClick, 
  onVoteClick, 
  onShareClick 
}) {
  const coverPhoto = pandhal.photos[0] || { src: '', alt: pandhal.name };

  return (
    <article 
      className="max-card"
      id={`card-${pandhal.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* 1. Photo Stage */}
      <div 
        onClick={() => onCardClick(pandhal.id)}
        style={{ 
          width: '100%', 
          aspectRatio: '1 / 1',
          overflow: 'hidden', 
          position: 'relative',
          background: '#090a0f',
          cursor: 'pointer',
          borderBottom: '1.5px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <img 
          src={coverPhoto.src} 
          alt={coverPhoto.alt} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block'
          }}
          loading="lazy"
        />

        {/* Gradient shadow */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(19, 22, 36, 0.92) 0%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)',
            pointerEvents: 'none'
          }} 
        />

        {/* Top Floating Badges */}
        <div 
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          <span 
            style={{
              background: '#f59e0b',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)',
              padding: '2px 6px',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
            }}
          >
            #{String(pandhal.number).padStart(2, '0')}
          </span>

          <span 
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: 'clamp(0.6rem, 1.6vw, 0.72rem)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <span>📸</span> {pandhal.photos?.length || 1}
          </span>
        </div>

        {/* Bottom Hint */}
        <div 
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.58rem, 1.4vw, 0.7rem)',
            color: '#e2e8f0',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <span>👁️ GALLERY</span>
        </div>
      </div>

      {/* 2. Card Content & Live Voting Section */}
      <div 
        style={{ 
          padding: 'clamp(8px, 1.8vw, 14px)', 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          justifyContent: 'space-between',
          gap: '8px' 
        }}
      >
        {/* Title & Details */}
        <div onClick={() => onCardClick(pandhal.id)} style={{ cursor: 'pointer' }}>
          <h3 
            style={{ 
              fontSize: 'clamp(0.76rem, 2.2vw, 1.05rem)', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 700, 
              color: '#ffffff', 
              margin: '0 0 3px',
              lineHeight: 1.22,
              letterSpacing: '-0.02em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={pandhal.name}
          >
            {pandhal.name}
          </h3>

          <p 
            style={{ 
              fontSize: 'clamp(0.65rem, 1.6vw, 0.78rem)', 
              color: 'var(--text-secondary)', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <span style={{ color: 'var(--neon-orange)' }}>📍</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pandhal.location}</span>
          </p>
        </div>

        {/* Live Vote Score Strip */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#0a0c14',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '4px 6px',
            gap: '4px'
          }}
        >
          <span 
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: 'clamp(0.56rem, 1.4vw, 0.68rem)', 
              color: 'var(--text-secondary)', 
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            VOTES
          </span>
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--gradient-flame)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 'clamp(0.62rem, 1.5vw, 0.74rem)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 8px rgba(255, 85, 0, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '0.72rem', lineHeight: 1 }}>🔥</span>
            <span>{voteCount.toLocaleString('en-IN')}</span>
          </span>
        </div>

        {/* Full Width Compact Action Button */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVoteClick(pandhal.id);
            }}
            style={{
              width: '100%',
              background: hasVoted ? '#10b981' : 'var(--gradient-hyper)',
              color: hasVoted ? '#ffffff' : '#000000',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: hasVoted ? '0 2px 6px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(245, 158, 11, 0.35)',
              borderRadius: 'var(--radius-pill)',
              padding: 'clamp(5px, 1.2vw, 8px) 4px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(0.64rem, 1.6vw, 0.78rem)',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{hasVoted ? '✓ LOCKED' : 'VOTE 🏆'}</span>
          </button>
        </div>
      </div>
    </article>
  );
});
