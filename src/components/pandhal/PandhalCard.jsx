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
              background: 'var(--neon-yellow)',
              border: '1.5px solid #000000',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)',
              padding: '2px 6px',
              borderRadius: '4px',
              boxShadow: '1px 1px 0px #000000'
            }}
          >
            #{String(pandhal.number).padStart(2, '0')}
          </span>

          <span 
            style={{
              background: 'var(--neon-cyan)',
              border: '1.5px solid #000000',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: 'clamp(0.6rem, 1.6vw, 0.72rem)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '1px 1px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
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
            borderRadius: 'var(--radius-xs)',
            padding: '4px 6px'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.58rem, 1.4vw, 0.72rem)', color: 'var(--text-secondary)', fontWeight: 700 }}>
            VOTES
          </span>
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--gradient-flame)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 'clamp(0.66rem, 1.6vw, 0.8rem)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 8px rgba(255, 85, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            🔥 {voteCount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Tactile 3D Action Buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVoteClick(pandhal.id);
            }}
            style={{
              flex: 1,
              background: hasVoted ? '#16a34a' : 'var(--gradient-hyper)',
              color: hasVoted ? '#ffffff' : '#000000',
              border: '1.5px solid #ffffff',
              boxShadow: hasVoted ? '2px 2px 0px #ffffff' : '2.5px 2.5px 0px var(--neon-pink)',
              borderRadius: 'var(--radius-pill)',
              padding: 'clamp(6px, 1.4vw, 10px) 4px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(0.66rem, 1.8vw, 0.82rem)',
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

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareClick(pandhal);
            }}
            style={{
              width: 'clamp(28px, 6vw, 36px)',
              height: 'clamp(28px, 6vw, 36px)',
              background: '#22c55e',
              border: '1.5px solid #ffffff',
              boxShadow: '2px 2px 0px #ffffff',
              color: '#ffffff',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'clamp(12px, 3vw, 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            💬
          </button>
        </div>
      </div>
    </article>
  );
});
