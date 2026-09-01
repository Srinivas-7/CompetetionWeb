import React from 'react';
import { PandhalGallery } from '../components/pandhal/PandhalGallery';

export function PandhalPage({ 
  pandhal, 
  onVoteClick, 
  onShareClick, 
  onBackToTrail 
}) {
  if (!pandhal) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gold-light)' }}>
        <h3>Pandhal Not Found</h3>
        <button onClick={onBackToTrail} style={{ marginTop: '16px' }} className="festive-btn">
          Back to Trail
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '0 16px' }}>
      <PandhalGallery 
        pandhal={pandhal}
        onVoteClick={onVoteClick}
        onShareClick={onShareClick}
        onClose={onBackToTrail}
      />
    </div>
  );
}
