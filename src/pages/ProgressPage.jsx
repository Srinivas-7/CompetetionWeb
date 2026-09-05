import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { Footer } from '../components/common/Footer';

export function ProgressPage({ 
  myVote = null, 
  onBack, 
  onExploreClick, 
  onVoteClick 
}) {
  const { user, logout } = useAuth();
  const {
    totalPoints,
    currentLevel,
    nextLevel,
    progressPercent,
    pointsToNextLevel,
    visitedCount,
    totalPandhals,
    hasVoted,
    votedPandhalName,
    isCheckedInToday,
    checkinCount,
    ledger,
    badges,
    claimDailyCheckin,
    claimShareBonus
  } = useProgress(myVote);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'votes' | 'darshan' | 'milestones'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDailyCheckin = () => {
    const result = claimDailyCheckin();
    showToast(result.message);
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    const shareText = "🪔 Join me on the official Chaturthi 2026 Bappa Trail! Explore 21 grand pandhals in 4K and cast your verified community vote:";

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chaturthi 2026 - Bappa Trail',
          text: shareText,
          url: shareUrl,
        });
        const res = claimShareBonus();
        showToast(res.message);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      const res = claimShareBonus();
      showToast("Link copied to clipboard! " + res.message);
    } catch {
      showToast("Share link: " + shareUrl);
    }
  };

  // Filter ledger entries based on tab
  const filteredLedger = ledger.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'votes') return item.category === 'Sacred Voting' || item.category === 'Account';
    if (activeTab === 'darshan') return item.category === 'Darshan';
    if (activeTab === 'milestones') return item.category === 'Milestone' || item.category === 'Daily Quest' || item.category === 'Social Blessing';
    return true;
  });

  return (
    <div style={{ background: 'var(--bg-page)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Sticky Navigation Header */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(251, 247, 240, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid #EADECB',
          padding: '10px 16px'
        }}
      >
        <div 
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          {/* Back Button */}
          <button
            onClick={onBack}
            style={{
              background: '#FFFFFF',
              border: '1px solid #EADECB',
              color: 'var(--maroon-primary)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.12s ease'
            }}
          >
            <span>←</span>
            <span>Back to Trail</span>
          </button>

          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img 
              src="/assets/cute-bappa-logo.jpg" 
              alt="Bappa Trail Logo" 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--gold-primary)',
                display: 'block'
              }}
            />
            <span 
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: 'var(--maroon-primary)'
              }}
            >
              BAPPA<span style={{ color: 'var(--gold-primary)' }}>TRAIL</span>
            </span>
          </div>

          {/* Points Pill */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              border: '1.5px solid var(--gold-primary)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(200, 157, 71, 0.2)'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>🪙</span>
            <span 
              style={{ 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 900, 
                fontSize: '0.84rem', 
                color: 'var(--maroon-dark)' 
              }}
            >
              {totalPoints} PTS
            </span>
          </div>
        </div>
      </header>

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--maroon-dark)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--gold-primary)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
            zIndex: 100,
            fontSize: '0.88rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
            maxWidth: '90vw',
            textAlign: 'center'
          }}
        >
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Page Content */}
      <main 
        style={{
          flex: 1,
          maxWidth: '960px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 16px 60px',
          boxSizing: 'border-box'
        }}
      >
        {/* Devotee Profile Royal Hero Card */}
        <section 
          style={{
            background: 'linear-gradient(135deg, #5B1414 0%, #3B0B11 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px 20px',
            border: '2px solid var(--gold-primary)',
            boxShadow: '0 12px 36px rgba(91, 20, 20, 0.25), 0 0 20px rgba(200, 157, 71, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '24px'
          }}
        >
          {/* Subtle Background Pattern Decoration */}
          <div 
            style={{
              position: 'absolute',
              right: '-20px',
              top: '-20px',
              fontSize: '120px',
              opacity: 0.06,
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            🐘
          </div>

          <div 
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* User Info Avatar & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
              <div 
                style={{
                  position: 'relative',
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: '2.5px solid var(--gold-primary)',
                  boxShadow: '0 4px 14px rgba(200, 157, 71, 0.4)',
                  padding: '2px',
                  background: '#FFFFFF',
                  flexShrink: 0
                }}
              >
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Devotee'} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'var(--maroon-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '28px'
                    }}
                  >
                    👤
                  </div>
                )}
                {/* Level Badge Pip */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    background: 'var(--gold-primary)',
                    color: 'var(--maroon-dark)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 900,
                    border: '2px solid #FFFFFF'
                  }}
                  title={`Devotee Level ${currentLevel.level}`}
                >
                  {currentLevel.level}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <h1 
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.15rem, 4vw, 1.45rem)',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {user?.displayName || user?.email?.split('@')[0] || 'Blessed Devotee'}
                  </h1>
                  <span 
                    style={{
                      background: 'rgba(223, 191, 122, 0.25)',
                      color: 'var(--gold-light)',
                      border: '1px solid var(--gold-primary)',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      textTransform: 'uppercase'
                    }}
                  >
                    ✓ Verified
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                  {user?.email || 'Google Account'}
                </div>

                {/* Devotee Rank */}
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    marginTop: '6px',
                    border: '1px solid rgba(223, 191, 122, 0.3)'
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{currentLevel.icon}</span>
                  <span 
                    style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '0.74rem', 
                      fontWeight: 800, 
                      color: 'var(--gold-light)' 
                    }}
                  >
                    Level {currentLevel.level}: {currentLevel.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout & Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={logout}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div 
            style={{ 
              marginTop: '20px', 
              background: 'rgba(0, 0, 0, 0.35)', 
              borderRadius: '16px', 
              padding: '12px 16px',
              border: '1px solid rgba(223, 191, 122, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold-light)' }}>
                Level Progress: {progressPercent}%
              </span>
              <span style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                {nextLevel 
                  ? `${pointsToNextLevel} PTS needed for Level ${nextLevel.level} (${nextLevel.title})`
                  : 'Max Rank Achieved! 👑'}
              </span>
            </div>

            <div 
              style={{
                width: '100%',
                height: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-pill)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--gold-primary) 0%, #FDE68A 100%)',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'width 0.4s ease',
                  boxShadow: '0 0 10px rgba(200, 157, 71, 0.6)'
                }}
              />
            </div>
          </div>
        </section>

        {/* 3. Summary Metric Cards (4x Grid) */}
        <section 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginBottom: '26px'
          }}
        >
          {/* Card 1: Total Points */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #EADECB',
              borderRadius: '18px',
              padding: '18px 16px',
              boxShadow: '0 4px 14px rgba(91, 20, 20, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                border: '1px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              🪙
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Total Devotee Points
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--maroon-primary)' }}>
                {totalPoints} <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-dark)' }}>PTS</span>
              </div>
            </div>
          </div>

          {/* Card 2: Pandhals Explored */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #EADECB',
              borderRadius: '18px',
              padding: '18px 16px',
              boxShadow: '0 4px 14px rgba(91, 20, 20, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#FDF2F2',
                border: '1px solid var(--maroon-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              🛕
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Pandhals Explored
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {visitedCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>/ {totalPandhals}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Sacred Vote */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #EADECB',
              borderRadius: '18px',
              padding: '18px 16px',
              boxShadow: '0 4px 14px rgba(91, 20, 20, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: hasVoted ? '#DCFCE7' : '#FEF3C7',
                border: `1px solid ${hasVoted ? '#16A34A' : '#D97706'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              {hasVoted ? '✓' : '🗳️'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Sacred Vote Status
              </div>
              <div 
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '0.98rem', 
                  fontWeight: 900, 
                  color: hasVoted ? '#166534' : 'var(--maroon-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {hasVoted ? (votedPandhalName || 'Vote Locked') : 'Pending (+100 PTS)'}
              </div>
            </div>
          </div>

          {/* Card 4: Badges Unlocked */}
          <div 
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #EADECB',
              borderRadius: '18px',
              padding: '18px 16px',
              boxShadow: '0 4px 14px rgba(91, 20, 20, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#FAF5FF',
                border: '1px solid #9333EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}
            >
              🏆
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Badges Unlocked
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {badges.filter(b => b.unlocked).length} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>/ {badges.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Quests: "Earn More Points" */}
        <section 
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #EADECB',
            borderRadius: '20px',
            padding: '22px 20px',
            boxShadow: '0 6px 20px rgba(91, 20, 20, 0.06)',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
                ⚡ DAILY QUESTS &amp; ACTIONS
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--maroon-primary)', margin: 0 }}>
                Earn Devotee Karma Points
              </h2>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Complete quests to unlock higher ranks &amp; blessings
            </span>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px'
            }}
          >
            {/* Quest 1: Daily Darshan */}
            <div 
              style={{
                background: '#FDFBF7',
                border: '1px solid #EADECB',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🪔</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    Daily Festival Darshan
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {isCheckedInToday ? `Claimed today (${checkinCount} total)` : 'Claim your daily +20 PTS'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleDailyCheckin}
                disabled={isCheckedInToday}
                style={{
                  background: isCheckedInToday ? '#E5E7EB' : 'var(--maroon-primary)',
                  color: isCheckedInToday ? '#6B7280' : '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: isCheckedInToday ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {isCheckedInToday ? 'Claimed ✓' : '+20 PTS'}
              </button>
            </div>

            {/* Quest 2: Share Trail */}
            <div 
              style={{
                background: '#FDFBF7',
                border: '1px solid #EADECB',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🤝</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    Share Bappa Trail
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Invite family &amp; friends (+30 PTS)
                  </div>
                </div>
              </div>

              <button
                onClick={handleShare}
                style={{
                  background: 'var(--gold-primary)',
                  color: 'var(--maroon-dark)',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                Share &amp; +30 PTS
              </button>
            </div>

            {/* Quest 3: Explore Pandhals */}
            <div 
              style={{
                background: '#FDFBF7',
                border: '1px solid #EADECB',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🛕</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    Explore 4K Galleries
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {visitedCount} of 21 explored (+10 PTS each)
                  </div>
                </div>
              </div>

              <button
                onClick={onExploreClick}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid var(--maroon-primary)',
                  color: 'var(--maroon-primary)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                Explore Pandhals →
              </button>
            </div>

            {/* Quest 4: Cast Vote */}
            <div 
              style={{
                background: '#FDFBF7',
                border: '1px solid #EADECB',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🗳️</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    Cast Official Vote
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {hasVoted ? `Locked for ${votedPandhalName}` : '1 unique ballot (+100 PTS)'}
                  </div>
                </div>
              </div>

              <button
                onClick={hasVoted ? onExploreClick : onExploreClick}
                style={{
                  background: hasVoted ? '#DCFCE7' : 'var(--maroon-primary)',
                  color: hasVoted ? '#166534' : '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '7px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {hasVoted ? 'Voted ✓' : 'Vote Now (+100)'}
              </button>
            </div>
          </div>
        </section>

        {/* 5. "What all points we got for what" - Full Breakdown Ledger */}
        <section 
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #EADECB',
            borderRadius: '20px',
            padding: '24px 20px',
            boxShadow: '0 6px 20px rgba(91, 20, 20, 0.06)',
            marginBottom: '28px'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
              📋 POINTS LEDGER &amp; STATEMENT
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--maroon-primary)', margin: '2px 0 6px' }}>
              What All Points You Received
            </h2>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Complete chronological audit of every point awarded to your devotee profile.
            </p>
          </div>

          {/* Filter Tabs */}
          <div 
            style={{
              display: 'flex',
              gap: '6px',
              borderBottom: '1.5px solid #EADECB',
              paddingBottom: '12px',
              marginBottom: '18px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {[
              { id: 'all', label: `All Activity (${ledger.length})` },
              { id: 'votes', label: 'Votes & Welcome' },
              { id: 'darshan', label: `Pandhal Darshans (${visitedCount})` },
              { id: 'milestones', label: 'Milestones & Quests' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--maroon-primary)' : '#FDFBF7',
                  color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--maroon-primary)' : '#EADECB'}`,
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.12s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Points List */}
          {filteredLedger.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🪔</div>
              <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-secondary)' }}>No points in this category yet.</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Explore pandhals or complete quests above to earn karma!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredLedger.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: '#FAF7F2',
                    border: '1px solid #EADECB',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'transform 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div 
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: '1px solid #EADECB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0
                      }}
                    >
                      {item.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span 
                          style={{
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-sans)'
                          }}
                        >
                          {item.title}
                        </span>
                        <span 
                          style={{
                            fontSize: '0.66rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            background: '#EAE2D5',
                            color: 'var(--text-secondary)',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          {item.category}
                        </span>
                      </div>

                      <div 
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div 
                      style={{
                        background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                        border: '1px solid #16A34A',
                        color: '#166534',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: '0.86rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        boxShadow: '0 2px 6px rgba(22, 163, 74, 0.15)'
                      }}
                    >
                      +{item.points} PTS
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 600 }}>
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. Devotee Badges Gallery */}
        <section 
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #EADECB',
            borderRadius: '20px',
            padding: '24px 20px',
            boxShadow: '0 6px 20px rgba(91, 20, 20, 0.06)',
            marginBottom: '28px'
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
              🏆 ACHIEVEMENTS &amp; HONOR
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--maroon-primary)', margin: '2px 0 6px' }}>
              Devotee Badges
            </h2>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Unlock special pilgrimage badges by exploring pandhals, checking in, and supporting Mandals.
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px'
            }}
          >
            {badges.map((badge) => (
              <div 
                key={badge.id}
                style={{
                  background: badge.unlocked ? '#FAF6EF' : '#F9F9F9',
                  border: badge.unlocked ? '1.5px solid var(--gold-primary)' : '1px dashed #D1D5DB',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  opacity: badge.unlocked ? 1 : 0.65,
                  position: 'relative',
                  boxShadow: badge.unlocked ? '0 4px 14px rgba(200, 157, 71, 0.15)' : 'none'
                }}
              >
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: badge.unlocked ? '#FFFFFF' : '#E5E7EB',
                    border: `1.5px solid ${badge.unlocked ? 'var(--gold-primary)' : '#9CA3AF'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0
                  }}
                >
                  {badge.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-display)', 
                        fontWeight: 800, 
                        fontSize: '0.9rem', 
                        color: badge.unlocked ? 'var(--maroon-primary)' : 'var(--text-muted)' 
                      }}
                    >
                      {badge.name}
                    </span>
                    {badge.unlocked ? (
                      <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 800 }}>✓ UNLOCKED</span>
                    ) : (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>🔒 LOCKED</span>
                    )}
                  </div>

                  <p style={{ margin: '4px 0 8px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {badge.description}
                  </p>

                  <div 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: badge.unlocked ? 'var(--gold-dark)' : 'var(--text-muted)'
                    }}
                  >
                    Reward: {badge.reward}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Back Button */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'var(--maroon-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 28px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(107, 20, 20, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>←</span>
            <span>Return to Pandhal Trail</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
