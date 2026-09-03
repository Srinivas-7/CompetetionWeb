import React from 'react';
import { PandhalCard } from './PandhalCard';

export function PandhalGrid({ 
  pandhals = [], 
  liveCounts = {}, 
  myVote = null, 
  onCardClick, 
  onVoteClick, 
  onShareClick 
}) {
  if (pandhals.length === 0) {
    return (
      <div 
        style={{ 
          textAlign: 'center', 
          padding: '48px 16px', 
          background: 'var(--bg-card)',
          border: '1.5px solid #EADECB',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-primary)'
        }}
      >
        <div style={{ marginBottom: '12px', opacity: 0.5, color: 'var(--maroon-primary)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--maroon-primary)', marginBottom: '6px' }}>
          No Bappas match your search
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
          Try clearing your search query.
        </p>
      </div>
    );
  }

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 'clamp(10px, 2.8vw, 20px)',
        width: '100%'
      }}
    >
      {pandhals.map(pandhal => {
        const votes = liveCounts[pandhal.id] !== undefined ? liveCounts[pandhal.id] : 0;
        const hasVoted = myVote && myVote.pandhalId === pandhal.id;

        return (
          <PandhalCard 
            key={pandhal.id}
            pandhal={pandhal}
            voteCount={votes}
            hasVoted={hasVoted}
            onCardClick={onCardClick}
            onVoteClick={onVoteClick}
            onShareClick={onShareClick}
          />
        );
      })}
    </div>
  );
}
