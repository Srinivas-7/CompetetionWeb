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
        borderRadius: 'var(--radius-md)',
        background: '#FFFFFF',
        border: '1px solid #EADECB',
        boxShadow: '0 4px 16px rgba(91, 20, 20, 0.07)'
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
          background: '#F5EFEB',
          cursor: 'pointer',
          borderBottom: '1.5px solid #EADECB'
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

        {/* Gradient shadow overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, transparent 40%, rgba(0, 0, 0, 0.25) 100%)',
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
          {/* Maroon #XX Tag */}
          <span 
            style={{
              background: 'var(--maroon-primary)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)',
              padding: '2px 8px',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            #{String(pandhal.number).padStart(2, '0')}
          </span>

          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              background: 'rgba(0, 0, 0, 0.65)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.72rem)',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 'var(--radius-pill)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span>{pandhal.photos?.length || 1}</span>
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
            color: '#FFFFFF',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}
        >
          <span>GALLERY</span>
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
          gap: '8px',
          background: '#FFFFFF'
        }}
      >
        {/* Title & Details */}
        <div onClick={() => onCardClick(pandhal.id)} style={{ cursor: 'pointer' }}>
          <h3 
            style={{ 
              fontSize: 'clamp(0.78rem, 2.2vw, 1.05rem)', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 800, 
              color: 'var(--text-primary)', 
              margin: '0 0 3px',
              lineHeight: 1.25,
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
              gap: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--maroon-primary)', flexShrink: 0 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{pandhal.location}</span>
          </p>
        </div>

        {/* Live Vote Score Strip */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-cream-accent)',
            border: '1px solid #EADECB',
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
              background: 'var(--maroon-primary)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: 'clamp(0.62rem, 1.5vw, 0.74rem)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 1px 4px rgba(107, 20, 20, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              flexShrink: 0
            }}
          >
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
              background: hasVoted ? 'var(--green-emerald)' : 'var(--maroon-primary)',
              color: '#FFFFFF',
              border: hasVoted ? '1px solid var(--green-dark)' : '1px solid var(--maroon-dark)',
              boxShadow: hasVoted ? '0 2px 6px rgba(22, 163, 74, 0.35)' : '0 2px 8px rgba(107, 20, 20, 0.35)',
              borderRadius: 'var(--radius-pill)',
              padding: 'clamp(6px, 1.4vw, 9px) 4px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(0.66rem, 1.6vw, 0.8rem)',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s ease, transform 0.12s ease'
            }}
            onMouseEnter={(e) => {
              if (!hasVoted) e.currentTarget.style.background = 'var(--maroon-hover)';
            }}
            onMouseLeave={(e) => {
              if (!hasVoted) e.currentTarget.style.background = 'var(--maroon-primary)';
            }}
          >
            <span>{hasVoted ? '✓ LOCKED' : 'VOTE'}</span>
          </button>
        </div>
      </div>
    </article>
  );
});
