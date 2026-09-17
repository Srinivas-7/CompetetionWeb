import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useVote } from '../hooks/useVote';
import { useAuth } from '../context/AuthContext';
import { PANDHALS_DATA } from '../data/pandhals';
import { isVotingClosed } from '../utils/timeUtils';
import { downloadFullLeaderboardPDF } from '../utils/pdfExport';

export function VotePage({ 
  pandhal, 
  liveCounts = {},
  totalVotes = 0,
  myVote: propMyVote,
  onBack, 
  onVoteRecorded 
}) {
  const { user } = useAuth();
  const { 
    isSubmitting, 
    isDelayed, 
    errorMessage, 
    successData, 
    myVote: hookMyVote, 
    castVote, 
    resetState, 
    clearError 
  } = useVote(() => {
    if (onVoteRecorded) onVoteRecorded(pandhal?.id);
  });

  const activeMyVote = hookMyVote || propMyVote;
  const isClosed = isVotingClosed() || Boolean(successData) || Boolean(activeMyVote);

  // Trigger celebration confetti on mount if voting is closed or success
  useEffect(() => {
    resetState();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isClosed) {
      triggerConfettiBurst();
    }
  }, [pandhal?.id, isClosed]);

  const triggerConfettiBurst = () => {
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6B1414', '#C89D47', '#DFBF7A', '#16A34A', '#FFFFFF']
        });
      }
    } catch (e) {
      // Graceful fallback if canvas is restricted
    }
  };

  // Sort all pandhals by accurate real-time votes
  const sortedPandhals = [...PANDHALS_DATA].map((p) => ({
    ...p,
    votes: liveCounts[p.id] || 0
  })).sort((a, b) => b.votes - a.votes);

  // Accurate #1 Winner derived directly from real live vote counts
  const winnerPandhal = sortedPandhals[0] || PANDHALS_DATA[0];
  const top5Pandhals = sortedPandhals.slice(0, 5);
  const highestVote = winnerPandhal?.votes || 1;
  const computedTotalVotes = totalVotes > 0 ? totalVotes : sortedPandhals.reduce((sum, p) => sum + (p.votes || 0), 0);

  const handleConfirmVote = () => {
    if (isSubmitting || !pandhal) return;
    clearError();
    const email = user?.email || user?.uid || 'anonymous-devotee';
    const name = user?.displayName || 'Devotee';
    castVote(email, pandhal.id, name);
  };

  const handleDownloadPDF = () => {
    downloadFullLeaderboardPDF(sortedPandhals, computedTotalVotes);
  };

  const isAlreadyVotedForThis = activeMyVote && activeMyVote.pandhalId === pandhal?.id;
  const isAlreadyVotedForOther = activeMyVote && activeMyVote.pandhalId !== pandhal?.id;
  const coverPhoto = pandhal?.photos?.[0] || { src: '', alt: pandhal?.name || 'Gajotsav Pandhal' };
  const winnerCoverPhoto = winnerPandhal?.photos?.[0] || { src: '/assets/cute-bappa-logo.jpg', alt: winnerPandhal.name };

  const getRankBadgeStyle = (idx) => {
    switch (idx) {
      case 0:
        return { bg: 'var(--maroon-primary)', color: '#FFFFFF' };
      case 1:
        return { bg: 'var(--gold-dark)', color: '#FFFFFF' };
      case 2:
        return { bg: 'var(--gold-primary)', color: '#FFFFFF' };
      default:
        return { bg: '#EADECB', color: 'var(--text-primary)' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navigation Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(251, 247, 240, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid #EADECB',
          padding: '12px 16px'
        }}
      >
        <div 
          style={{
            maxWidth: '900px',
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
              border: '1px solid #EADECB',
              color: 'var(--maroon-primary)',
              borderRadius: 'var(--radius-pill)',
              padding: '7px 16px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
          >
            <span>←</span>
            <span>Back to Pandhals</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Gajotsav 2026" 
              style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold-primary)', display: 'block' }}
            />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.92rem', color: 'var(--maroon-primary)' }}>
              GAJ<span style={{ color: 'var(--gold-primary)' }}>OTSAV 2026</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main 
        style={{ 
          flex: 1, 
          maxWidth: '820px', 
          width: '100%', 
          margin: '0 auto', 
          padding: '24px 16px 64px', 
          boxSizing: 'border-box' 
        }}
      >
        {/* ========================================================================= */}
        {/* POST-1:00 PM / VOTING CONCLUDED / SUCCESS THANK YOU VIEW                   */}
        {/* ========================================================================= */}
        {isClosed ? (
          <div>
            {/* 1. #1 Winner Spotlight Banner on Top */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #FFFDF6 0%, #FFF8EA 100%)',
                border: '2px solid var(--gold-primary)',
                borderRadius: '24px',
                padding: '24px 20px',
                marginBottom: '24px',
                boxShadow: '0 12px 32px rgba(200, 157, 71, 0.2)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--maroon-primary)',
                  color: '#FFFFFF',
                  border: '1.5px solid var(--gold-primary)',
                  padding: '5px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                  boxShadow: '0 4px 12px rgba(107, 20, 20, 0.25)'
                }}
              >
                👑 #1 WINNER • GAJOTSAV 2026
              </div>

              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  marginTop: '6px'
                }}
              >
                <img 
                  src={winnerCoverPhoto.thumbSrc || winnerCoverPhoto.src || '/assets/cute-bappa-logo.jpg'} 
                  alt={winnerPandhal.name} 
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    border: '2px solid var(--gold-primary)',
                    objectFit: 'cover',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    backgroundColor: '#111'
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <h2 
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.1rem, 3.5vw, 1.45rem)',
                      fontWeight: 900,
                      color: 'var(--maroon-primary)',
                      lineHeight: 1.25,
                      margin: '0 0 4px'
                    }}
                  >
                    #{String(winnerPandhal.number).padStart(2, '0')} {winnerPandhal.name} 🏆
                  </h2>
                  <div 
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {winnerPandhal.location && <span>{winnerPandhal.location}</span>}
                    {winnerPandhal.location && <span>•</span>}
                    <span 
                      style={{
                        background: 'var(--gold-primary)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      {winnerPandhal.votes.toLocaleString('en-IN')} Total Votes
                      {computedTotalVotes > 0 && ` (${((winnerPandhal.votes / computedTotalVotes) * 100).toFixed(1)}%)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Thank You for Voting Card */}
            <div 
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EADECB',
                borderRadius: '24px',
                padding: '34px 24px',
                textAlign: 'center',
                boxShadow: '0 16px 40px rgba(91, 20, 20, 0.08)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '24px'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, var(--maroon-primary), var(--gold-primary), var(--maroon-primary))'
                }}
              />

              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #16A34A, #15803D)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 900,
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)'
                }}
              >
                ✓
              </div>

              <h1 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                  fontWeight: 900,
                  color: 'var(--maroon-primary)',
                  margin: '0 0 8px',
                  lineHeight: 1.2
                }}
              >
                Thank You for Voting!
              </h1>
              
              <p 
                style={{
                  fontSize: '0.98rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  maxWidth: '580px',
                  margin: '0 auto 24px'
                }}
              >
                {pandhal ? (
                  <>Your sacred vote for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhal.name}</strong> has been officially recorded in the live community tally.</>
                ) : (
                  <>Your sacred vote has been officially secured and counted in the live community tally.</>
                )}
                {' '}Ganpati Bappa Morya!
              </p>

              {/* Action Buttons: Download PDF & Celebrate Confetti */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}
              >
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    background: '#FDF6E2',
                    color: 'var(--maroon-primary)',
                    border: '1.5px solid var(--gold-primary)',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-pill)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 3px 10px rgba(200, 157, 71, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>📥</span>
                  <span>Download Full Leaderboard PDF</span>
                </button>

                <button
                  onClick={triggerConfettiBurst}
                  style={{
                    background: 'var(--maroon-primary)',
                    color: '#FFFFFF',
                    border: '1px solid var(--maroon-dark)',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-pill)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(107, 20, 20, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>🎉</span>
                  <span>Celebrate with Confetti</span>
                </button>
              </div>
            </div>

            {/* 3. Top 5 Standings Section */}
            <section 
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EADECB',
                borderRadius: '24px',
                padding: '24px 20px',
                boxShadow: '0 12px 36px rgba(91, 20, 20, 0.08)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1.5px solid #EADECB',
                  paddingBottom: '16px',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <h2 
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: 'var(--maroon-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 0 4px'
                    }}
                  >
                    <span>Top 5 Standings</span>
                    <span 
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#15803D',
                        background: '#DCFCE7',
                        border: '1px solid #86EFAC',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
                      REAL-TIME
                    </span>
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Top 5 leading Bappas with real-time transparent votes
                  </p>
                </div>

                <div 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    background: '#FDFBF7',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid #EADECB'
                  }}
                >
                  Total Votes: <strong style={{ color: 'var(--maroon-primary)' }}>{computedTotalVotes.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Leaderboard List: Exactly Top 5 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {top5Pandhals.map((p, idx) => {
                  const votes = p.votes || 0;
                  const badge = getRankBadgeStyle(idx);
                  const percent = computedTotalVotes > 0 ? ((votes / highestVote) * 100) : 0;
                  const sharePercent = computedTotalVotes > 0 ? ((votes / computedTotalVotes) * 100).toFixed(1) : '0.0';
                  const isUserVote = activeMyVote?.pandhalId === p.id;

                  return (
                    <div 
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: isUserVote ? '#F0FDF4' : idx === 0 ? '#FFFDF5' : idx === 1 ? '#FFFDF8' : '#FDFBF7',
                        border: isUserVote ? '1.5px solid #16A34A' : idx === 0 ? '1.5px solid var(--gold-primary)' : '1px solid #EADECB',
                        borderRadius: '14px',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Background progress fill */}
                      <div 
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${percent}%`,
                          background: 'rgba(107, 20, 20, 0.04)',
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1, minWidth: 0 }}>
                        <span 
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: badge.bg,
                            color: badge.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            flexShrink: 0
                          }}
                        >
                          {idx + 1}
                        </span>

                        <div style={{ minWidth: 0 }}>
                          <div 
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            <span>#{String(p.number).padStart(2, '0')} {p.name} {idx === 0 && '👑'}</span>
                            {isUserVote && (
                              <span 
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  background: '#16A34A',
                                  color: '#FFFFFF',
                                  padding: '1px 6px',
                                  borderRadius: 'var(--radius-pill)',
                                  letterSpacing: '0.02em'
                                }}
                              >
                                YOUR VOTE
                              </span>
                            )}
                          </div>
                          {p.location && (
                            <div 
                              style={{
                                fontSize: '0.74rem',
                                color: 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {p.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ position: 'relative', zIndex: 1, textAlign: 'right', flexShrink: 0, marginLeft: '10px' }}>
                        <span 
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            background: idx < 3 ? 'var(--maroon-primary)' : '#8C2222',
                            color: '#FFFFFF',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-pill)',
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {votes.toLocaleString('en-IN')} votes
                        </span>
                        <span 
                          style={{
                            display: 'block',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-muted)',
                            marginTop: '2px'
                          }}
                        >
                          {sharePercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Footer Trust Info */}
            <div 
              style={{
                textAlign: 'center',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #EADECB',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem'
              }}
            >
              🌸 Gajotsav 2026 Community Celebration • All votes secured with cryptographic anti-tamper ledger • Ganpati Bappa Morya!
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* ACTIVE VOTING BALLOT FORM (BEFORE 1:00 PM IST)                           */
          /* ========================================================================= */
          <div 
            className="max-card"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              background: '#FFFFFF',
              border: '1.5px solid #EADECB',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(91, 20, 20, 0.08)'
            }}
          >
            {/* Pandhal Number Badge */}
            <div style={{ marginBottom: '12px' }}>
              <span 
                style={{
                  display: 'inline-block',
                  background: 'var(--maroon-primary)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(107, 20, 20, 0.3)'
                }}
              >
                #{String(pandhal?.number || 1).padStart(2, '0')} OFFICIAL CANDIDATE
              </span>
            </div>

            {/* Hero Image Stage */}
            <div 
              style={{
                width: '100%',
                minHeight: '280px',
                maxHeight: '420px',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#160B0B',
                border: '1.5px solid #EADECB',
                margin: '0 auto 16px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
              }}
            >
              {coverPhoto.src && (
                <div 
                  style={{
                    position: 'absolute',
                    inset: '-15px',
                    backgroundImage: `url(${coverPhoto.thumbSrc || coverPhoto.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(24px) brightness(0.4)',
                    transform: 'scale(1.15)',
                    pointerEvents: 'none'
                  }}
                />
              )}
              <img 
                src={coverPhoto.src} 
                alt={coverPhoto.alt || pandhal?.name} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px', 
                  width: 'auto', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  display: 'block',
                  position: 'relative',
                  zIndex: 2,
                  borderRadius: '8px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                }}
              />
            </div>

            {/* Pandhal Title & Location */}
            <h1 
              style={{
                fontSize: 'clamp(1.4rem, 5vw, 1.85rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 6px',
                lineHeight: 1.2
              }}
            >
              {pandhal?.name}
            </h1>

            {(pandhal?.location || pandhal?.theme) && (
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
                {pandhal?.location}{pandhal?.location && pandhal?.theme && ' • '}
                {pandhal?.theme && <span style={{ color: 'var(--maroon-primary)', fontWeight: 700 }}>{pandhal.theme}</span>}
              </p>
            )}

            {/* Verified Google User Badge */}
            {user && (
              <div 
                style={{
                  background: '#FDFBF7',
                  border: '1px solid #EADECB',
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
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--gold-primary)' }}
                  />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8, color: 'var(--maroon-primary)' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gold-dark)', fontWeight: 800, textTransform: 'uppercase' }}>
                    ✓ VERIFIED GOOGLE VOTER
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.displayName || user.email}
                  </div>
                </div>
              </div>
            )}

            {/* Balloting Form */}
            {!isDelayed && (
              <div>
                {errorMessage && (
                  <div 
                    style={{
                      background: '#FEE2E2',
                      border: '1px solid #EF4444',
                      color: '#991B1B',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
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
                      border: '1px solid #16A34A',
                      borderRadius: '14px',
                      padding: '16px',
                      color: '#166534',
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
                      background: '#FEF3C7',
                      border: '1px solid #D97706',
                      borderRadius: '14px',
                      padding: '16px',
                      color: '#92400E',
                      fontSize: '0.88rem',
                      lineHeight: 1.45,
                      marginBottom: '16px',
                      textAlign: 'left'
                    }}
                  >
                    Your Google account has already cast its 1 unique vote for <strong>{activeMyVote.pandhalName}</strong>.
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Each Google account is permitted 1 vote across the celebration.
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.5 }}>
                      Click below to lock your verified community ballot for <strong style={{ color: 'var(--maroon-primary)' }}>{pandhal?.name}</strong>.
                    </p>

                    <button
                      onClick={handleConfirmVote}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        background: 'var(--maroon-primary)',
                        color: '#FFFFFF',
                        border: '1px solid var(--maroon-dark)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '14px 20px',
                        fontSize: '1.02rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(107, 20, 20, 0.35)',
                        opacity: isSubmitting ? 0.6 : 1,
                        transition: 'transform 0.12s ease'
                      }}
                    >
                      <span>{isSubmitting ? 'LOCKING BALLOT…' : 'CONFIRM MY SACRED VOTE'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Delayed Loading */}
            {isDelayed && (
              <div style={{ padding: '24px 0' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    border: '3px solid #EADECB',
                    borderTopColor: 'var(--maroon-primary)',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    animation: 'spinSlow 0.8s linear infinite'
                  }}
                />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'var(--maroon-primary)', margin: '0 0 4px', textTransform: 'uppercase' }}>
                  Recording your vote…
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Locking ballot to your verified Google account
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
