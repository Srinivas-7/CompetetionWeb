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
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          color: '#ffffff'
        }}
      >
        <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🐘</p>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
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
        const votes = liveCounts[pandhal.id] !== undefined ? liveCounts[pandhal.id] : pandhal.initialVotes;
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
