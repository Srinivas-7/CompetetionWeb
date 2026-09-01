import React from 'react';
import { Button } from '../common/Button';

export function VoteButton({ 
  hasVoted = false, 
  onClick, 
  disabled = false,
  style = {} 
}) {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={disabled}
      icon="🏆"
      style={{
        width: '100%',
        padding: '14px 20px',
        fontSize: '1.05rem',
        background: hasVoted ? 'linear-gradient(135deg, #2E7D32, #1B5E20)' : undefined,
        borderColor: hasVoted ? '#81C784' : undefined,
        ...style
      }}
    >
      {hasVoted ? 'VOTE LOCKED' : 'LOCK MY VOTE'}
    </Button>
  );
}
