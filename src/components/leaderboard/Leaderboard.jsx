import React from 'react';
import { PANDHALS_DATA } from '../../data/pandhals';

export function Leaderboard({ liveCounts = {}, onPandhalClick }) {
  const sorted = [...PANDHALS_DATA].sort((a, b) => {
    const cA = liveCounts[a.id] || 0;
    const cB = liveCounts[b.id] || 0;
    return cB - cA;
  }).slice(0, 5); // Top 5

  const highestVote = (sorted[0] && (liveCounts[sorted[0].id] || 0)) || 1;

  const getRankBadge = (idx) => {
    switch (idx) {
      case 0:
        return { label: '1', color: '#111318', bg: '#fef08a', border: '#111318', icon: '1' };
      case 1:
        return { label: '2', color: '#111318', bg: '#e2e8f0', border: '#111318', icon: '2' };
      case 2:
        return { label: '3', color: '#111318', bg: '#fed7aa', border: '#111318', icon: '3' };
      default:
        return { label: `${idx + 1}`, color: '#111318', bg: '#f3f4f6', border: '#111318', icon: `${idx + 1}` };
    }
  };

  return (
    <div 
      id="leaderboard"
      className="brave-card-offset"
      style={{
        background: '#ffffff',
        padding: '32px',
        margin: '0 auto 50px',
        maxWidth: 'var(--container-max)'
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
          borderBottom: '1.5px solid #111318',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: '#111318', margin: '0 0 4px' }}>
            Live Trail Leaderboard
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: 0 }}>
            Top 5 community-voted Bappas in real-time
          </p>
        </div>

        <div 
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#111318',
            background: '#fef08a',
            border: '1.5px solid #111318',
            padding: '5px 14px',
            borderRadius: 'var(--radius-pill)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
          LIVE VOTE SYNC
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sorted.map((p, idx) => {
          const votes = liveCounts[p.id] || 0;
          const badge = getRankBadge(idx);
          const percent = Math.min(100, Math.round((votes / highestVote) * 100));

          return (
            <div 
              key={p.id}
              onClick={() => onPandhalClick(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: '#ffffff',
                border: '1.5px solid #111318',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '4px 4px 0px #111318';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Progress fill */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: `${percent}%`,
                  background: idx === 0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(243, 244, 246, 0.6)',
                  pointerEvents: 'none'
                }} 
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: badge.bg,
                    border: '1.5px solid #111318',
                    color: badge.color,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {badge.icon !== '#' ? badge.icon : badge.label}
                </div>

                <img 
                  src={p.photos[0]?.src || ''} 
                  alt={p.name} 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1.5px solid #111318'
                  }}
                />

                <div>
                  <div style={{ fontWeight: 700, color: '#111318', fontSize: '1rem' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                    {p.location} • {p.theme}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', zIndex: 1 }}>
                <div style={{ fontWeight: 800, color: '#111318', fontSize: '1.05rem' }}>
                  {votes.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>votes</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#485bfc', fontWeight: 600 }}>
                  View Gallery →
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
