import React from 'react';
import { PANDHALS_DATA } from '../../data/pandhals';

export function Leaderboard({ liveCounts = {}, onPandhalClick, onClose }) {
  const sorted = [...PANDHALS_DATA].sort((a, b) => {
    const cA = liveCounts[a.id] || 0;
    const cB = liveCounts[b.id] || 0;
    return cB - cA;
  });

  const highestVote = (sorted[0] && (liveCounts[sorted[0].id] || 0)) || 1;

  const getRankBadge = (idx) => {
    switch (idx) {
      case 0:
        return { label: '1', color: '#FFFFFF', bg: 'var(--maroon-primary)', border: 'var(--maroon-dark)' };
      case 1:
        return { label: '2', color: '#FFFFFF', bg: 'var(--gold-dark)', border: 'var(--gold-primary)' };
      case 2:
        return { label: '3', color: '#FFFFFF', bg: 'var(--gold-primary)', border: 'var(--gold-light)' };
      default:
        return { label: `${idx + 1}`, color: 'var(--text-primary)', bg: '#F7F2E9', border: '#EADECB' };
    }
  };

  return (
    <div 
      id="leaderboard"
      className="max-card"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #EADECB',
        borderRadius: '24px',
        padding: '24px 18px',
        margin: '0 auto',
        maxWidth: '680px',
        width: '100%',
        boxShadow: '0 12px 36px rgba(91, 20, 20, 0.12)',
        boxSizing: 'border-box',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          borderBottom: '1.5px solid #EADECB',
          paddingBottom: '14px',
          flexShrink: 0
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--maroon-primary)', margin: 0 }}>
              Live Leaderboard
            </h3>
            <span 
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--maroon-primary)',
                background: '#FDF6E2',
                border: '1px solid var(--gold-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-emerald)' }} />
              LIVE
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
            All 21 Bappas ranked in real-time by verified community votes
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: '#FDFBF7',
              border: '1px solid #EADECB',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0
            }}
            aria-label="Close Leaderboard"
          >
            ✕
          </button>
        )}
      </div>

      {/* Scrollable Rows */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          overflowY: 'auto',
          paddingRight: '4px',
          flex: 1
        }}
      >
        {sorted.map((p, idx) => {
          const votes = liveCounts[p.id] || 0;
          const badge = getRankBadge(idx);
          const percent = Math.min(100, Math.round((votes / highestVote) * 100));

          return (
            <div 
              key={p.id}
              onClick={() => {
                if (onPandhalClick) onPandhalClick(p.id);
                if (onClose) onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: idx < 3 ? '#FFFDF8' : '#FDFBF7',
                border: idx === 0 ? '1.5px solid var(--gold-primary)' : '1px solid #EADECB',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--maroon-primary)';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = idx === 0 ? 'var(--gold-primary)' : '#EADECB';
                e.currentTarget.style.background = idx < 3 ? '#FFFDF8' : '#FDFBF7';
              }}
            >
              {/* Progress Background bar */}
              <div 
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${percent}%`,
                  background: 'rgba(107, 20, 20, 0.05)',
                  pointerEvents: 'none'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1, minWidth: 0 }}>
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: badge.bg,
                    color: badge.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    flexShrink: 0
                  }}
                >
                  {badge.label}
                </span>

                <div style={{ minWidth: 0 }}>
                  <h4 
                    style={{ 
                      margin: '0 0 1px', 
                      fontSize: '0.88rem', 
                      fontFamily: 'var(--font-heading)', 
                      fontWeight: 800, 
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    #{String(p.number).padStart(2, '0')} {p.name}
                  </h4>
                  <p 
                    style={{ 
                      margin: 0, 
                      fontSize: '0.72rem', 
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {p.location}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right', position: 'relative', zIndex: 1, flexShrink: 0, marginLeft: '8px' }}>
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--maroon-primary)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'inline-block',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {votes.toLocaleString('en-IN')} votes
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
