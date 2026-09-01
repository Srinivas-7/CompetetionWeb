import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useVote } from '../../hooks/useVote';

export function VoteModal({ 
  pandhal, 
  isOpen, 
  onClose, 
  onVoteRecorded 
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
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
      setPhoneNumber(myVote ? myVote.phone : '');
    }
  }, [isOpen]);

  if (!pandhal) return null;

  const handleSubmit = () => {
    if (isSubmitting) return;
    clearError();
    castVote(phoneNumber, pandhal.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#${pandhal.id}`;
    const text = encodeURIComponent(
      `🪔 I just cast my community vote for ${pandhal.name} on Bappa Trail! 🐘✨\n\n` +
      `Explore all 21 Bappas and lock your vote here:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose} ariaLabel="Vote for Bappa">
      <div 
        style={{
          background: '#101322',
          border: '2.5px solid #ffffff',
          borderRadius: '24px',
          maxWidth: '430px',
          width: '100%',
          padding: '28px 20px',
          position: 'relative',
          textAlign: 'center',
          boxSizing: 'border-box',
          boxShadow: '8px 8px 0px var(--neon-pink)',
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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--neon-pink)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #ffffff'
            }}
            aria-label="Close dialog"
          >
            ×
          </button>
        )}

        {/* Selected Pandhal Avatar & Title */}
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={pandhal.photos[0]?.src || ''} 
            alt={pandhal.name} 
            style={{
              width: '78px',
              height: '78px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--neon-pink)',
              margin: '0 auto 10px',
              boxShadow: '0 0 20px rgba(255, 0, 127, 0.4)'
            }}
          />
          <h2 
            style={{ 
              fontSize: '1.35rem', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 800, 
              color: '#ffffff', 
              margin: '0 0 2px'
            }}
          >
            {pandhal.name}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
            📍 {pandhal.location}
          </p>
        </div>

        {/* STATE 1: Phone Form */}
        {!isDelayed && !successData && (
          <div>
            {errorMessage && (
              <div 
                style={{
                  background: 'rgba(255, 0, 85, 0.2)',
                  border: '1.5px solid var(--neon-pink)',
                  color: '#ffcce0',
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

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label 
                htmlFor="voter-mobile-input" 
                style={{ display: 'block', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.82rem', color: 'var(--neon-yellow)', marginBottom: '6px' }}
              >
                ENTER MOBILE NUMBER TO VOTE
              </label>

              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#07090f',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '3px 3px 0px rgba(255, 0, 127, 0.4)'
                }}
              >
                <span 
                  style={{ 
                    padding: '12px 14px', 
                    background: 'rgba(255, 255, 255, 0.08)', 
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800, 
                    fontSize: '0.92rem', 
                    color: '#ffffff',
                    borderRight: '1.5px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  🇮🇳 +91
                </span>
                <input 
                  id="voter-mobile-input"
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhoneNumber(digits);
                    clearError();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    border: 0,
                    outline: 'none',
                    background: 'transparent',
                    padding: '12px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    letterSpacing: '1px',
                    color: '#ffffff'
                  }}
                  autoFocus={!myVote}
                />
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>🔒</span>
                <span>1 unique mobile number = 1 community vote.</span>
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%',
                border: '2.5px solid #ffffff',
                background: 'var(--gradient-hyper)',
                color: '#000000',
                borderRadius: 'var(--radius-pill)',
                padding: '15px',
                fontSize: '1.05rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '4px 4px 0px var(--neon-pink)',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              <span>{isSubmitting ? 'LOCKING BALLOT…' : 'LOCK MY SACRED VOTE 🏆'}</span>
            </button>
          </div>
        )}

        {/* STATE 2: Delayed Loading */}
        {isDelayed && !successData && (
          <div style={{ padding: '24px 0' }}>
            <div 
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(255, 0, 127, 0.2)',
                borderTopColor: 'var(--neon-pink)',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spinSlow 0.8s linear infinite'
              }}
            />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px', textTransform: 'uppercase' }}>
              Recording your vote for Bappa…
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Connecting to realtime community ballot database
            </p>
          </div>
        )}

        {/* STATE 3: Success State */}
        {successData && (
          <div style={{ padding: '10px 0' }}>
            <div 
              style={{
                width: '72px',
                height: '72px',
                background: 'var(--neon-lime)',
                border: '2.5px solid #ffffff',
                color: '#000000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                fontWeight: 900,
                margin: '0 auto 14px',
                boxShadow: '4px 4px 0px var(--neon-pink)'
              }}
            >
              ✓
            </div>

            <h3 
              style={{ 
                fontSize: '1.6rem', 
                fontFamily: 'var(--font-display)',
                fontWeight: 900, 
                color: '#ffffff', 
                margin: '0 0 6px',
                textTransform: 'uppercase'
              }}
            >
              VOTE LOCKED!
            </h3>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.45 }}>
              Your sacred vote for <strong style={{ color: 'var(--neon-yellow)' }}>{pandhal.name}</strong> is officially counted! Ganpati Bappa Morya! 🐘✨
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleShare}
                style={{
                  width: '100%',
                  border: '2px solid #ffffff',
                  background: '#22c55e',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-pill)',
                  padding: '14px',
                  fontSize: '0.96rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0px #ffffff'
                }}
              >
                <span>SHARE MY VOTE ON WHATSAPP 💬</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'transparent',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-pill)',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>CONTINUE EXPLORING TRAIL</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
