import React, { useEffect } from 'react';
import { useVote } from '../hooks/useVote';
import { useAuth } from '../context/AuthContext';

export function VotePage({ 
  pandhal, 
  onBack, 
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
    resetState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pandhal?.id]);

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
  const coverPhoto = pandhal.photos[0] || { src: '', alt: pandhal.name };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navigation Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(11, 13, 20, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '12px 16px'
        }}
      >
        <div 
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.12s ease'
            }}
          >
            <span>←</span>
            <span>Back to Trail</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img 
              src="/favicon.svg" 
              alt="Bappa Trail" 
              style={{ width: '26px', height: '26px', display: 'block' }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
              BAPPA<span style={{ color: 'var(--neon-pink)' }}>TRAIL</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Voting Container */}
      <main 
        style={{ 
          flex: 1, 
          maxWidth: '560px', 
          width: '100%', 
          margin: '0 auto', 
          padding: '24px 16px 60px', 
          boxSizing: 'border-box' 
        }}
      >
        <div 
          className="max-card"
          style={{
            padding: '28px 20px',
            textAlign: 'center',
            background: '#141726',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Pandhal Number Badge */}
          <div style={{ marginBottom: '12px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: '#f59e0b',
                color: '#000000',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                padding: '4px 10px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
              }}
            >
              #{String(pandhal.number).padStart(2, '0')} OFFICIAL CANDIDATE
            </span>
          </div>

          {/* Grand Hero Image Stage */}
          <div 
            style={{
              width: '100%',
              aspectRatio: '16 / 11',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#090a0f',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              margin: '0 auto 16px',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            <img 
              src={coverPhoto.src} 
              alt={coverPhoto.alt} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Pandhal Title & Location */}
          <h1 
            style={{
              fontSize: 'clamp(1.4rem, 5vw, 1.85rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 6px',
              lineHeight: 1.2
            }}
          >
            {pandhal.name}
          </h1>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
            📍 {pandhal.location} • <span style={{ color: '#f59e0b' }}>{pandhal.theme}</span>
          </p>

          {/* Verified Google User Badge */}
          {user && (
            <div 
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '14px',
                padding: '10px 14px',
                marginBottom: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left'
              }}
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Voter'} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #f59e0b' }}
                />
              ) : (
                <span style={{ fontSize: '20px' }}>👤</span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>
                  ✓ VERIFIED GOOGLE VOTER
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || user.email}
                </div>
              </div>
            </div>
          )}

          {/* STATE 1: Vote Confirmation Form */}
          {!isDelayed && !successData && (
            <div>
              {errorMessage && (
                <div 
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid #ef4444',
                    color: '#fca5a5',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    marginBottom: '16px',
                    textAlign: 'left'
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              {isAlreadyVotedForThis ? (
                <div 
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid #10b981',
                    borderRadius: '14px',
                    padding: '16px',
                    color: '#10b981',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    marginBottom: '16px'
                  }}
                >
                  ✓ Your vote is already locked for this Bappa!
                </div>
              ) : isAlreadyVotedForOther ? (
                <div 
                  style={{
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid #f59e0b',
                    borderRadius: '14px',
                    padding: '16px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    lineHeight: 1.45,
                    marginBottom: '16px',
                    textAlign: 'left'
                  }}
                >
                  🔒 Your Google account has already cast its 1 unique vote for <strong>{myVote.pandhalName}</strong>.
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Each Google account is permitted 1 vote across the trail.
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.5 }}>
                    Click below to lock your verified community ballot for <strong style={{ color: '#ffffff' }}>{pandhal.name}</strong>.
                  </p>

                  <button
                    onClick={handleConfirmVote}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: 'var(--gradient-hyper)',
                      color: '#000000',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '14px 20px',
                      fontSize: '1.02rem',
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
                    <span>{isSubmitting ? 'LOCKING BALLOT…' : 'CONFIRM MY SACRED VOTE 🏆'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STATE 2: Delayed Loading */}
          {isDelayed && !successData && (
            <div style={{ padding: '24px 0' }}>
              <div 
                style={{
                  width: '46px',
                  height: '46px',
                  border: '3px solid rgba(245, 158, 11, 0.2)',
                  borderTopColor: '#f59e0b',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spinSlow 0.8s linear infinite'
                }}
              />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px', textTransform: 'uppercase' }}>
                Recording your vote…
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                Locking ballot to your verified Google account
              </p>
            </div>
          )}

          {/* STATE 3: Success State */}
          {successData && (
            <div style={{ padding: '12px 0' }}>
              <div 
                style={{
                  width: '68px',
                  height: '68px',
                  background: '#10b981',
                  border: '2px solid #ffffff',
                  color: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                  fontWeight: 900,
                  margin: '0 auto 14px',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.45)'
                }}
              >
                ✓
              </div>

              <h3 
                style={{ 
                  fontSize: '1.5rem', 
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900, 
                  color: '#ffffff', 
                  margin: '0 0 8px',
                  textTransform: 'uppercase'
                }}
              >
                VOTE LOCKED!
              </h3>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>
                Your sacred vote for <strong style={{ color: '#f59e0b' }}>{pandhal.name}</strong> is officially counted! Ganpati Bappa Morya! 🐘✨
              </p>

              <button
                onClick={onBack}
                style={{
                  width: '100%',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-pill)',
                  padding: '13px',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>RETURN TO TRAIL FEED</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
