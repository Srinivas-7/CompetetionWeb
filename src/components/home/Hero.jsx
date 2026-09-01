import React from 'react';

export function Hero({ onExploreClick, totalVotes = 0 }) {
  return (
    <div style={{ background: 'var(--bg-page)', color: '#ffffff', overflow: 'hidden' }}>
      {/* 1. Sticky High-Energy Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(8, 9, 14, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.12)',
          padding: '12px 18px'
        }}
      >
        <div 
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--gradient-hyper)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                fontSize: '1.1rem',
                fontWeight: 900,
                border: '1.5px solid #ffffff',
                boxShadow: '2px 2px 0px #ff007f'
              }}
            >
              ⚡
            </div>
            <div>
              <span 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.08rem',
                  letterSpacing: '-0.03em',
                  color: '#ffffff'
                }}
              >
                BAPPA<span style={{ color: 'var(--neon-lime)' }}>TRAIL</span>
              </span>
            </div>
          </div>

          {/* Right Live Pill + Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#000000',
                background: 'var(--neon-lime)',
                border: '1.5px solid #000000',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '2px 2px 0px #ffffff'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff0000' }} />
              2026 LIVE
            </span>

            <button
              onClick={onExploreClick}
              className="btn-3d-pink"
              style={{
                padding: '7px 16px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-display)'
              }}
            >
              VOTE 🏆
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Peak Creative Maximalism) */}
      <section 
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '38px 18px 24px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Floating Angled Sticker */}
        <div style={{ marginBottom: '18px' }}>
          <span 
            className="animate-wiggle"
            style={{
              display: 'inline-block',
              background: 'var(--neon-yellow)',
              color: '#000000',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px var(--neon-pink)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              padding: '6px 14px',
              borderRadius: '6px',
              transform: 'rotate(-2deg)'
            }}
          >
            ★ CHATURTHI 2026 OFFICIAL TRAIL ★
          </span>
        </div>

        {/* Massive Maximalist Display Typography */}
        <h1 
          style={{
            fontSize: 'clamp(2.1rem, 7.8vw, 3.2rem)',
            lineHeight: 1.08,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            margin: '0 0 16px',
            textTransform: 'uppercase'
          }}
        >
          <div>ONE CITY.</div>
          <div className="gradient-text-hyper">21 BAPPAS.</div>
          <div className="stroke-text">ONE VOTE.</div>
        </h1>

        {/* Punchy High-Energy Subtext */}
        <p 
          style={{
            fontSize: '1.02rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            maxWidth: '460px',
            margin: '0 auto 26px',
            fontWeight: 500
          }}
        >
          Explore full 4K photo collections, artisan stories, eco-cleanliness checks, and cast your verified community vote in real-time.
        </p>

        {/* THE GIANT MAXIMALIST 3D VOTE BUTTON */}
        <div style={{ maxWidth: '440px', margin: '0 auto 28px' }}>
          <button
            onClick={onExploreClick}
            className="btn-3d-giant"
          >
            <span>🔥 EXPLORE PANDHALS &amp; VOTE NOW ↓</span>
          </button>
        </div>

        {/* 3 Maximalist Sticker Chips */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '10px'
          }}
        >
          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#ffffff',
              background: '#161928',
              border: '1.5px solid var(--border-medium)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '2px 2px 0px rgba(255, 255, 255, 0.2)'
            }}
          >
            🏛️ 21 PANDHALS
          </span>

          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--neon-lime)',
              background: '#161928',
              border: '1.5px solid var(--neon-lime)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '2px 2px 0px var(--neon-lime)'
            }}
          >
            🌱 100% ECO-VERIFIED
          </span>

          <span 
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--neon-pink)',
              background: '#161928',
              border: '1.5px solid var(--neon-pink)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '2px 2px 0px var(--neon-pink)'
            }}
          >
            🔒 1-PHONE = 1-VOTE
          </span>
        </div>
      </section>

      {/* 3. Animated Infinite Marquee Ticker Ribbon */}
      <div 
        style={{
          background: 'var(--neon-pink)',
          color: '#ffffff',
          overflow: 'hidden',
          padding: '8px 0',
          borderTop: '2px solid #ffffff',
          borderBottom: '2px solid #ffffff',
          boxShadow: '0 4px 20px rgba(255, 0, 127, 0.4)',
          transform: 'rotate(-0.5deg)',
          margin: '10px -10px 20px'
        }}
      >
        <div className="animate-marquee">
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.06em', whiteSpace: 'nowrap', padding: '0 20px' }}>
            ⚡ 21 GRAND PANDHALS ★ 1 UNIQUE PHONE VOTE ★ 4K PHOTO GALLERIES ★ REALTIME LEADERBOARD ★ 100% ZERO-WASTE ECO CHECK ★ GANPATI BAPPA MORYA ★ 
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.06em', whiteSpace: 'nowrap', padding: '0 20px' }}>
            ⚡ 21 GRAND PANDHALS ★ 1 UNIQUE PHONE VOTE ★ 4K PHOTO GALLERIES ★ REALTIME LEADERBOARD ★ 100% ZERO-WASTE ECO CHECK ★ GANPATI BAPPA MORYA ★ 
          </span>
        </div>
      </div>
    </div>
  );
}
