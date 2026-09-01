import React from 'react';
import { Button } from '../common/Button';

export function ExploreButton({ onExploreClick, onVoteClick }) {
  return (
    <div 
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto 32px'
      }}
    >
      <Button 
        variant="primary" 
        onClick={onExploreClick}
        icon="👀"
        style={{ width: '100%', fontSize: '1.05rem', padding: '14px 20px' }}
      >
        EXPLORE GANAPATHIS
      </Button>

      <Button 
        variant="secondary" 
        onClick={onVoteClick}
        icon="🏆"
        style={{ width: '100%', fontSize: '1.05rem', padding: '14px 20px' }}
      >
        VOTE FOR BAPPA
      </Button>
    </div>
  );
}
