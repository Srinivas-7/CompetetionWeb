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
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navigation Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'var(--bg-card)',
          borderBottom: '2.5px solid var(--maroon-dark)',
          boxShadow: '0 3px 0px rgba(0, 0, 0, 0.08)',
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
              background: '#FFFFFF',
              border: '2px solid var(--maroon-dark)',
              color: 'var(--maroon-primary)',
              borderRadius: 'var(--radius-xs)',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '2px 2px 0px var(--maroon-dark)',
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
          >
            <span style={{ fontWeight: 900 }}>←</span>
            <span>Back to Pandhals</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Bappa Utsav" 
              style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover', border: '2px solid var(--maroon-dark)', boxShadow: '2px 2px 0px var(--maroon-dark)', display: 'block' }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.98rem', color: 'var(--maroon-primary)', letterSpacing: '-0.01em' }}>
              BAPPA<span style={{ color: 'var(--gold-primary)' }}> UTSAV</span>
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
          padding: '28px 16px 60px', 
          boxSizing: 'border-box' 
        }}
      >
        <div 
          style={{
            padding: '28px 20px',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '3px solid var(--maroon-dark)',
            borderRadius: 'var(--radius-xs)',
            boxShadow: '6px 6px 0px var(--maroon-dark)'
          }}
        >
          {/* Pandhal Number Badge */}
          <div style={{ marginBottom: '14px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: 'var(--maroon-primary)',
                color: '#FFFFFF',
                border: '1.5px solid var(--maroon-dark)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: 'var(--radius-xs)',
                boxShadow: '2px 2px 0px var(--maroon-dark)'
              }}
            >
              #{String(pandhal.number).padStart(2, '0')} OFFICIAL CANDIDATE
            </span>
          </div>

          {/* Hero Image Stage */}
          <div 
            style={{
              width: '100%',
              aspectRatio: '16 / 11',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              backgroundColor: '#F5EFEB',
              border: '2.5px solid var(--maroon-dark)',
              margin: '0 auto 18px',
              position: 'relative',
              boxShadow: '4px 4px 0px var(--maroon-dark)'
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
              fontSize: 'clamp(1.4rem, 5vw, 1.9rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: '0 0 6px',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em'
            }}
          >
            {pandhal.name}
          </h1>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 20px', fontWeight: 600 }}>
            {pandhal.location} • <span style={{ color: 'var(--maroon-primary)', fontWeight: 800 }}>{pandhal.theme}</span>
          </p>

          {/* Verified Google User Badge */}
          {user && (
            <div 
              style={{
                background: 'var(--ivory-warm)',
                border: '2px solid var(--maroon-dark)',
                boxShadow: '3px 3px 0px var(--maroon-dark)',
                borderRadius: 'var(--radius-xs)',
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
                  style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1.5px solid var(--maroon-dark)' }}
                />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9, color: 'var(--maroon-primary)' }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--maroon-primary)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ✓ VERIFIED GOOGLE VOTER
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                    background: '#FEE2E2',
                    border: '2px solid var(--maroon-dark)',
                    boxShadow: '3px 3px 0px var(--maroon-dark)',
                    color: '#991B1B',
                    borderRadius: 'var(--radius-xs)',
                    padding: '10px 14px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    marginBottom: '16px',
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
                    padding: '16px',
                    color: '#166534',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '0.98rem',
                    marginBottom: '16px',
                    textTransform: 'uppercase'
                  }}
                >
                  ✓ Your vote is already locked for this Bappa!
                </div>
              ) : isAlreadyVotedForOther ? (
                <div 
                  style={{
                    background: '#FEF3C7',
                    border: '2px solid var(--maroon-dark)',
                    boxShadow: '3px 3px 0px var(--maroon-dark)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '16px',
                    color: '#92400E',
                    fontSize: '0.88rem',
                    lineHeight: 1.45,
                    marginBottom: '16px',
                    textAlign: 'left',
                    fontWeight: 600
                  }}
                >
                  Your Google account has already cast its 1 unique vote for <strong>{myVote.pandhalName}</strong>.
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                    Each Google account is permitted 1 vote across the celebration.
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.5, fontWeight: 600 }}>
                    Click below to lock your verified community ballot for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhal.name}</strong>.
                  </p>

                  <button
                    onClick={handleConfirmVote}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: 'var(--maroon-primary)',
                      color: '#FFFFFF',
                      border: '2.5px solid var(--maroon-dark)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '15px 20px',
                      fontSize: '1.02rem',
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
                    <span>{isSubmitting ? 'LOCKING BALLOT…' : 'CONFIRM MY SACRED VOTE'}</span>
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
                  border: '3.5px solid var(--maroon-dark)',
                  borderTopColor: 'var(--gold-primary)',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spinSlow 0.8s linear infinite'
                }}
              />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--maroon-primary)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Recording your vote…
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>
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
                  background: 'var(--green-emerald)',
                  border: '2.5px solid var(--maroon-dark)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px',
                  fontWeight: 900,
                  margin: '0 auto 16px',
                  boxShadow: '4px 4px 0px var(--maroon-dark)'
                }}
              >
                ✓
              </div>

              <h3 
                style={{ 
                  fontSize: '1.55rem', 
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900, 
                  color: 'var(--maroon-primary)', 
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}
              >
                VOTE LOCKED!
              </h3>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: 1.5, fontWeight: 600 }}>
                Your sacred vote for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhal.name}</strong> is officially counted! Ganpati Bappa Morya!
              </p>

              <button
                onClick={onBack}
                style={{
                  width: '100%',
                  border: '2px solid var(--maroon-dark)',
                  background: 'var(--ivory-warm)',
                  color: 'var(--maroon-primary)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '14px',
                  fontSize: '0.92rem',
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
                ← Back to All Pandhals
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
