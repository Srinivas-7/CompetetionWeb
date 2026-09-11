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
        borderRadius: '4px',
        background: '#FFFFFF',
        border: '2px solid var(--maroon-dark)',
        boxShadow: '4px 4px 0px var(--maroon-dark)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease'
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
          borderBottom: '2px solid var(--maroon-dark)'
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
              fontWeight: 900,
              fontSize: 'clamp(0.68rem, 1.8vw, 0.8rem)',
              padding: '2px 7px',
              borderRadius: '2px',
              border: '1.5px solid var(--maroon-dark)',
              boxShadow: '2px 2px 0px var(--maroon-dark)'
            }}
          >
            #{String(pandhal.number).padStart(2, '0')}
          </span>

          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              background: '#FFFFFF',
              color: 'var(--maroon-dark)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.62rem, 1.5vw, 0.74rem)',
              fontWeight: 900,
              padding: '2px 7px',
              borderRadius: '2px',
              border: '1.5px solid var(--maroon-dark)',
              boxShadow: '2px 2px 0px var(--maroon-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
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
            fontSize: 'clamp(0.6rem, 1.4vw, 0.72rem)',
            background: 'var(--maroon-dark)',
            color: '#FFFFFF',
            padding: '1px 5px',
            borderRadius: '2px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <span>GALLERY</span>
        </div>
      </div>

      {/* 2. Card Content & Live Voting Section */}
      <div 
        style={{ 
          padding: 'clamp(10px, 2vw, 14px)', 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          justifyContent: 'space-between',
          gap: '10px',
          background: '#FFFFFF'
        }}
      >
        {/* Title & Details */}
        <div onClick={() => onCardClick(pandhal.id)} style={{ cursor: 'pointer' }}>
          <h3 
            style={{ 
              fontSize: 'clamp(0.82rem, 2.2vw, 1.05rem)', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 900, 
              color: 'var(--text-primary)', 
              margin: '0 0 4px',
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
              fontSize: 'clamp(0.66rem, 1.6vw, 0.78rem)', 
              color: 'var(--text-secondary)', 
              fontWeight: 600,
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
            border: '1.5px solid var(--maroon-dark)',
            borderRadius: '3px',
            padding: '4px 8px',
            gap: '4px'
          }}
        >
          <span 
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: 'clamp(0.58rem, 1.4vw, 0.7rem)', 
              color: 'var(--text-primary)', 
              fontWeight: 800, 
              whiteSpace: 'nowrap', 
              flexShrink: 0,
              letterSpacing: '0.04em'
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
              fontSize: 'clamp(0.66rem, 1.5vw, 0.78rem)',
              padding: '2px 8px',
              borderRadius: '2px',
              border: '1px solid var(--maroon-dark)',
              boxShadow: '1px 1px 0px var(--maroon-dark)',
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
              border: '2px solid var(--maroon-dark)',
              boxShadow: '2.5px 2.5px 0px var(--maroon-dark)',
              borderRadius: '3px',
              padding: 'clamp(7px, 1.5vw, 10px) 4px',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(0.7rem, 1.6vw, 0.84rem)',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!hasVoted) e.currentTarget.style.background = 'var(--maroon-hover)';
              e.currentTarget.style.transform = 'translate(-1px, -1px)';
              e.currentTarget.style.boxShadow = '4px 4px 0px var(--maroon-dark)';
            }}
            onMouseLeave={(e) => {
              if (!hasVoted) e.currentTarget.style.background = 'var(--maroon-primary)';
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '2.5px 2.5px 0px var(--maroon-dark)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1.5px, 1.5px)';
              e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
            }}
          >
            <span>{hasVoted ? '✓ LOCKED' : 'VOTE'}</span>
          </button>
        </div>
      </div>
    </article>
  );
});
