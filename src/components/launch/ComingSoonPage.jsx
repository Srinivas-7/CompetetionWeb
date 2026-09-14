import React, { useState, useEffect } from 'react';
import { GanapatiDoodle } from './GanapatiDoodle';
import { LAUNCH_CONFIG } from '../../utils/constants';

function calculateTimeRemaining(targetTimestamp) {
  const diff = targetTimestamp - Date.now();
  if (diff <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { total: diff, days, hours, minutes, seconds };
}

export function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(LAUNCH_CONFIG.LAUNCH_TIMESTAMP));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(LAUNCH_CONFIG.LAUNCH_TIMESTAMP));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // Compute prominent remaining time string (e.g., "1 DAY 1 HOUR")
  const displayHours = timeLeft.minutes > 0 ? timeLeft.hours + 1 : timeLeft.hours;
  const timeRemainingSummary = timeLeft.total > 0
    ? `${timeLeft.days > 0 ? `${timeLeft.days} DAY ` : ''}${displayHours} HOUR${displayHours !== 1 ? 'S' : ''}`.trim()
    : 'LAUNCHING NOW';

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: 'var(--bg-page, #FBF7F0)',
        backgroundImage: `
          radial-gradient(circle at 50% 12%, rgba(200, 157, 71, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 50% 88%, rgba(107, 20, 20, 0.06) 0%, transparent 65%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        color: 'var(--text-primary, #1A1A1A)'
      }}
    >
      {/* Decorative Traditional Corner Accents */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.78rem',
          color: 'var(--gold-primary, #C89D47)',
          opacity: 0.75,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        ✦ ॐ ✦
      </div>
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.78rem',
          color: 'var(--gold-primary, #C89D47)',
          opacity: 0.75,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        ✦ ॐ ✦
      </div>

      {/* Main Centered Card Container */}
      <main
        style={{
          maxWidth: '480px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '16px 12px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Top Festival Pill Badge */}
        <div style={{ marginBottom: '14px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFF8E7',
              color: 'var(--maroon-primary, #6B1414)',
              border: '1.5px solid var(--gold-primary, #C89D47)',
              boxShadow: '0 2px 10px rgba(200, 157, 71, 0.22)',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 800,
              fontSize: 'clamp(0.72rem, 2.5vw, 0.8rem)',
              letterSpacing: '0.08em',
              padding: '6px 16px',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}
          >
            <span style={{ color: 'var(--gold-primary, #C89D47)' }}>★</span>
            BAPPA UTSAV 2026
            <span style={{ color: 'var(--gold-primary, #C89D47)' }}>★</span>
          </span>
        </div>

        {/* Central Transparent Ganapati Doodle Illustration */}
        <div
          style={{
            margin: '4px 0 14px',
            animation: 'bappaFloat 4s ease-in-out infinite alternate',
            transformOrigin: 'center center'
          }}
        >
          <GanapatiDoodle size={260} />
        </div>

        {/* Prominent Announcement Heading */}
        <h1
          style={{
            fontFamily: 'var(--font-display, "Unbounded", system-ui, sans-serif)',
            fontSize: 'clamp(1.65rem, 6.2vw, 2.35rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 12px',
            color: 'var(--maroon-primary, #6B1414)',
            textTransform: 'uppercase',
            wordBreak: 'break-word'
          }}
        >
          BAPPA IS <br />
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #DFBF7A 0%, #C89D47 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            COMING SOON
          </span>
        </h1>

        {/* Launch Date & Time Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1.5px solid #EADECB',
            borderRadius: '14px',
            padding: '8px 20px',
            boxShadow: '0 4px 14px rgba(91, 20, 20, 0.06)',
            marginBottom: '16px'
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 800,
              fontSize: 'clamp(0.85rem, 3vw, 0.98rem)',
              letterSpacing: '0.04em',
              color: 'var(--maroon-primary, #6B1414)',
              textTransform: 'uppercase'
            }}
          >
            15 SEPTEMBER • 10:00 AM IST
          </p>
        </div>

        {/* Live Countdown Unit Cards */}
        {timeLeft.total > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              width: '100%',
              maxWidth: '340px',
              marginBottom: '18px'
            }}
          >
            {[
              { label: 'DAYS', value: pad(timeLeft.days) },
              { label: 'HOURS', value: pad(displayHours) },
              { label: 'MINS', value: pad(timeLeft.minutes) },
              { label: 'SECS', value: pad(timeLeft.seconds) }
            ].map((unit) => (
              <div
                key={unit.label}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #EADECB',
                  borderRadius: '14px',
                  padding: '10px 4px',
                  boxShadow: '0 3px 10px rgba(91, 20, 20, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading, "Unbounded", system-ui, sans-serif)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.15rem, 4vw, 1.4rem)',
                    color: 'var(--maroon-primary, #6B1414)',
                    lineHeight: 1.1
                  }}
                >
                  {unit.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted, #9C8B80)',
                    marginTop: '4px'
                  }}
                >
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subtitle / Festive Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
            fontSize: 'clamp(0.85rem, 2.8vw, 0.95rem)',
            fontWeight: 600,
            lineHeight: 1.5,
            color: 'var(--text-secondary, #66554B)',
            margin: '0',
            maxWidth: '360px'
          }}
        >
          Bappa is taking a little longer to arrive — thank you for your patience, the celebration begins 15 September at 10:00 AM IST.
        </p>
      </main>

      {/* Micro-Animation Keyframes */}
      <style>
        {`
          @keyframes bappaFloat {
            0% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.01);
            }
            100% {
              transform: translateY(0px) scale(1);
            }
          }
          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.4;
              transform: scale(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1.15);
            }
          }
          @keyframes spinSlow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
