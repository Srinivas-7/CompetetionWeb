import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function VoteLoading() {
  return (
    <div style={{ padding: '20px 0', textAlign: 'center' }}>
      <LoadingSpinner 
        size={48} 
        text="Your vote is on the line to Bappa…" 
        subtext="Confirming community ballot with database" 
      />
    </div>
  );
}
