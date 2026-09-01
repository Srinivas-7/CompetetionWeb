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
        marginBottom: '4px'
      }}
    >
      {/* 1. Photo Stage */}
      <div 
        onClick={() => onCardClick(pandhal.id)}
        style={{ 
          width: '100%', 
          height: '240px', 
          overflow: 'hidden', 
          position: 'relative',
          background: '#090a0f',
          cursor: 'pointer',
          borderBottom: '2px solid rgba(255, 255, 255, 0.12)'
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

        {/* Gradient shadow for text readability */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(19, 22, 36, 0.95) 0%, transparent 60%, rgba(0, 0, 0, 0.5) 100%)',
            pointerEvents: 'none'
          }} 
        />

        {/* Top Floating Badges */}
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          <span 
            style={{
              background: 'var(--neon-yellow)',
              border: '2px solid #000000',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '0.82rem',
              padding: '3px 10px',
              borderRadius: '6px',
              boxShadow: '2px 2px 0px #000000'
            }}
          >
            #{String(pandhal.number).padStart(2, '0')}
          </span>

          <span 
            style={{
              background: 'var(--neon-cyan)',
              border: '2px solid #000000',
              color: '#000000',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '0.76rem',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '2px 2px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>📸</span> {pandhal.photos?.length || 1} PHOTOS
          </span>
        </div>

        {/* Bottom Hint */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            color: '#e2e8f0',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>👁️ TAP TO VIEW 4K GALLERY</span>
        </div>
      </div>

      {/* 2. Card Content & Live Voting Section */}
      <div 
        style={{ 
          padding: '18px 16px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px' 
        }}
      >
        {/* Title & Details */}
        <div onClick={() => onCardClick(pandhal.id)} style={{ cursor: 'pointer' }}>
          <h3 
            style={{ 
              fontSize: '1.18rem', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 700, 
              color: '#ffffff', 
              margin: '0 0 6px',
              lineHeight: 1.25,
              letterSpacing: '-0.02em'
            }}
          >
            {pandhal.name}
          </h3>

          <p 
            style={{ 
              fontSize: '0.86rem', 
              color: 'var(--text-secondary)', 
              margin: '0 0 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ color: 'var(--neon-orange)' }}>📍</span>
            <span>{pandhal.location}</span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '3px 8px',
                borderRadius: '6px'
              }}
            >
              {pandhal.theme}
            </span>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                padding: '3px 0'
              }}
            >
              Est. {pandhal.establishedYear}
            </span>
          </div>
        </div>

        {/* Live Vote Score Strip */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#0a0c14',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            LIVE COMMUNITY VOTES
          </span>
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--gradient-flame)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.9rem',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 10px rgba(255, 85, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🔥 {voteCount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Tactile 3D Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVoteClick(pandhal.id);
            }}
            style={{
              flex: 1,
              background: hasVoted ? '#16a34a' : 'var(--gradient-hyper)',
              color: hasVoted ? '#ffffff' : '#000000',
              border: '2px solid #ffffff',
              boxShadow: hasVoted ? '3px 3px 0px #ffffff' : '4px 4px 0px var(--neon-pink)',
              borderRadius: 'var(--radius-pill)',
              padding: '13px 18px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '0.96rem',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>{hasVoted ? '✓ VOTE LOCKED 🔒' : 'VOTE FOR BAPPA 🏆'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareClick(pandhal);
            }}
            style={{
              width: '48px',
              height: '48px',
              background: '#22c55e',
              border: '2px solid #ffffff',
              boxShadow: '3px 3px 0px #ffffff',
              color: '#ffffff',
              borderRadius: 'var(--radius-pill)',
              fontSize: '20px',
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
