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
          background: 'var(--bg-card)',
          border: '3px solid var(--maroon-dark)',
          borderRadius: 'var(--radius-xs)',
          maxWidth: '430px',
          width: '100%',
          padding: '28px 20px',
          position: 'relative',
          textAlign: 'center',
          boxSizing: 'border-box',
          boxShadow: '6px 6px 0px var(--maroon-dark)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Close Button */}
        {!isSubmitting && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--ivory-warm)',
              border: '2px solid var(--maroon-dark)',
              boxShadow: '2px 2px 0px var(--maroon-dark)',
              color: 'var(--maroon-primary)',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '2px 2px 0px var(--maroon-dark)';
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
              borderRadius: 'var(--radius-xs)',
              objectFit: 'cover',
              border: '2.5px solid var(--maroon-dark)',
              margin: '0 auto 10px',
              boxShadow: '3px 3px 0px var(--maroon-dark)',
              display: 'block'
            }}
          />
          <h2 
            style={{ 
              fontSize: '1.3rem', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 900, 
              color: 'var(--maroon-primary)', 
              margin: '0 0 2px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em'
            }}
          >
            {pandhal.name}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>
            {pandhal.location}
          </p>
        </div>

        {/* Verified Google User Pill */}
        {user && (
          <div 
            style={{
              background: 'var(--ivory-warm)',
              border: '2px solid var(--maroon-dark)',
              boxShadow: '2px 2px 0px var(--maroon-dark)',
              borderRadius: 'var(--radius-xs)',
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
                style={{ width: '28px', height: '28px', borderRadius: '2px', border: '1.5px solid var(--maroon-dark)' }}
              />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9, color: 'var(--maroon-primary)' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--maroon-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ✓ VERIFIED GOOGLE VOTER
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  background: '#FEE2E2',
                  border: '2px solid var(--maroon-dark)',
                  boxShadow: '2px 2px 0px var(--maroon-dark)',
                  color: '#991B1B',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 12px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
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
                  background: '#DCFCE7',
                  border: '2px solid var(--maroon-dark)',
                  boxShadow: '3px 3px 0px var(--maroon-dark)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '14px',
                  color: '#166534',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  marginBottom: '16px',
                  textTransform: 'uppercase'
                }}
              >
                ✓ You already locked your vote for {pandhal.name}!
              </div>
            ) : isAlreadyVotedForOther ? (
              <div 
                style={{
                  background: '#FEF3C7',
                  border: '2px solid var(--maroon-dark)',
                  boxShadow: '3px 3px 0px var(--maroon-dark)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '14px',
                  color: '#92400E',
                  fontSize: '0.86rem',
                  lineHeight: 1.45,
                  marginBottom: '16px',
                  textAlign: 'left',
                  fontWeight: 600
                }}
              >
                Your Google account has already voted for <strong>{myVote.pandhalName}</strong>. 
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                  Each Google account can cast exactly 1 vote across the celebration.
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.45, fontWeight: 600 }}>
                  Click below to lock your 1 unique community vote for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhal.name}</strong>.
                </p>

                <button
                  onClick={handleConfirmVote}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    border: '2.5px solid var(--maroon-dark)',
                    background: 'var(--maroon-primary)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-xs)',
                    padding: '14px 20px',
                    fontSize: '0.98rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '4px 4px 0px var(--maroon-dark)',
                    opacity: isSubmitting ? 0.6 : 1,
                    transition: 'transform 0.08s ease, box-shadow 0.08s ease'
                  }}
                  onMouseDown={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translate(2px, 2px)';
                      e.currentTarget.style.boxShadow = '2px 2px 0px var(--maroon-dark)';
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.boxShadow = '4px 4px 0px var(--maroon-dark)';
                    }
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
                border: '3.5px solid var(--maroon-dark)',
                borderTopColor: 'var(--gold-primary)',
                borderRadius: '50%',
                margin: '0 auto 14px',
                animation: 'spinSlow 0.8s linear infinite'
              }}
            />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 900, color: 'var(--maroon-primary)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Recording your vote…
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>
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
                background: 'var(--green-emerald)',
                border: '2.5px solid var(--maroon-dark)',
                color: '#ffffff',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 900,
                margin: '0 auto 12px',
                boxShadow: '3px 3px 0px var(--maroon-dark)'
              }}
            >
              ✓
            </div>

            <h3 
              style={{ 
                fontSize: '1.45rem', 
                fontFamily: 'var(--font-display)',
                fontWeight: 900, 
                color: 'var(--maroon-primary)', 
                margin: '0 0 6px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}
            >
              VOTE LOCKED!
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.45, fontWeight: 600 }}>
              Your sacred vote for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhal.name}</strong> is officially counted! Ganpati Bappa Morya!
            </p>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                border: '2px solid var(--maroon-dark)',
                background: 'var(--ivory-warm)',
                color: 'var(--maroon-primary)',
                borderRadius: 'var(--radius-xs)',
                padding: '12px',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '3px 3px 0px var(--maroon-dark)',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(1px, 1px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '3px 3px 0px var(--maroon-dark)';
              }}
            >
              <span>CONTINUE EXPLORING PANDHALS</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
