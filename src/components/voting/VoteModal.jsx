import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useVote } from '../../hooks/useVote';
import { useAuth } from '../../context/AuthContext';

export function VoteModal({ 
  pandhal, 
  isOpen, 
  onClose, 
  onVoteRecorded 
}) {
  const { user } = useAuth();
  const { 
    isSubmitting, 
    isDelayed, 
    errorMessage, 
    successData, 
    myVote, 
    castVote, 
    resetState, 
    clearError 
  } = useVote(() => {
    if (onVoteRecorded) onVoteRecorded(pandhal?.id);
  });

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  if (!pandhal) return null;

  const handleConfirmVote = () => {
    if (isSubmitting) return;
    clearError();
    const email = user?.email || user?.uid || 'anonymous-devotee';
    const name = user?.displayName || 'Devotee';
    castVote(email, pandhal.id, name);
  };

  const isAlreadyVotedForThis = myVote && myVote.pandhalId === pandhal.id;
  const isAlreadyVotedForOther = myVote && myVote.pandhalId !== pandhal.id;

  return (
    <Modal isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose} ariaLabel="Vote for Bappa">
      <div 
        style={{
          background: '#121522',
          border: '1.5px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '24px',
          maxWidth: '430px',
          width: '100%',
          padding: '28px 20px',
          position: 'relative',
          textAlign: 'center',
          boxSizing: 'border-box',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
          color: '#ffffff'
        }}
      >
        {/* Close Button */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '14px',
              top: '14px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close dialog"
          >
            ×
          </button>
        )}

        {/* Selected Pandhal Avatar & Title */}
        <div style={{ marginBottom: '16px' }}>
          <img 
            src={pandhal.photos[0]?.src || ''} 
            alt={pandhal.name} 
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid #f59e0b',
              margin: '0 auto 10px',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)'
            }}
          />          <h2 
            style={{ 
              fontSize: '1.25rem', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 800, 
              color: '#ffffff', 
              margin: '0 0 2px'
            }}
          >
            {pandhal.name}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            {pandhal.location}
          </p>
        </div>

        {/* Verified Google User Pill */}
        {user && (
          <div 
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '8px 12px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left'
            }}
          >
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Voter'} 
                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #f59e0b' }}
              />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                ✓ VERIFIED GOOGLE VOTER
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || user.email}
              </div>
            </div>
          </div>
        )}

        {/* STATE 1: 1-Tap Vote Confirmation Form */}
        {!isDelayed && !successData && (
          <div>
            {errorMessage && (
              <div 
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  marginBottom: '14px',
                  textAlign: 'left'
                }}
              >
                {errorMessage}
              </div>
            )}

            {isAlreadyVotedForThis ? (
              <div 
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#10b981',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  marginBottom: '16px'
                }}
              >
                ✓ You already locked your vote for {pandhal.name}!
              </div>
            ) : isAlreadyVotedForOther ? (
              <div 
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  lineHeight: 1.45,
                  marginBottom: '16px',
                  textAlign: 'left'
                }}
              >
                Your Google account has already voted for <strong>{myVote.pandhalName}</strong>. 
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Each Google account can cast exactly 1 vote across the trail.
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.45 }}>
                  Click below to lock your 1 unique community vote for <strong style={{ color: '#ffffff' }}>{pandhal.name}</strong>.
                </p>

                <button
                  onClick={handleConfirmVote}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    background: 'var(--gradient-hyper)',
                    color: '#000000',
                    borderRadius: 'var(--radius-pill)',
                    padding: '13px 20px',
                    fontSize: '0.98rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                    opacity: isSubmitting ? 0.6 : 1,
                    transition: 'transform 0.12s ease'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(2px)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{isSubmitting ? 'LOCKING BALLOT…' : 'CONFIRM MY VOTE'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STATE 2: Delayed Loading */}
        {isDelayed && !successData && (
          <div style={{ padding: '20px 0' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                border: '3px solid rgba(245, 158, 11, 0.2)',
                borderTopColor: '#f59e0b',
                borderRadius: '50%',
                margin: '0 auto 14px',
                animation: 'spinSlow 0.8s linear infinite'
              }}
            />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px', textTransform: 'uppercase' }}>
              Recording your vote…
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Locking vote to your verified Google account
            </p>
          </div>
        )}

        {/* STATE 3: Success State */}
        {successData && (
          <div style={{ padding: '10px 0' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                background: '#10b981',
                border: '2px solid #ffffff',
                color: '#ffffff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 900,
                margin: '0 auto 12px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              ✓
            </div>

            <h3 
              style={{ 
                fontSize: '1.4rem', 
                fontFamily: 'var(--font-display)',
                fontWeight: 900, 
                color: '#ffffff', 
                margin: '0 0 6px',
                textTransform: 'uppercase'
              }}
            >
              VOTE LOCKED!
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.45 }}>
              Your sacred vote for <strong style={{ color: '#f59e0b' }}>{pandhal.name}</strong> is officially counted! Ganpati Bappa Morya!
            </p>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                borderRadius: 'var(--radius-pill)',
                padding: '12px',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <span>CONTINUE EXPLORING TRAIL</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
