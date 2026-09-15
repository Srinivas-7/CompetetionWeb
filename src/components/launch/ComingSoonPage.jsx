import React, { useState, useEffect } from 'react';
import { GanapatiDoodle } from './GanapatiDoodle';

function calculateTimeRemaining(targetTimestamp) {
  if (!targetTimestamp) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
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

export function ComingSoonPage({ targetTimestamp = null, displayTime = "Opening Soon" }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(targetTimestamp));

  useEffect(() => {
    if (!targetTimestamp) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetTimestamp));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  const pad = (n) => String(n).padStart(2, '0');

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
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 'clamp(0.72rem, 2vw, 0.82rem)',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--gold-dark, #8A6818)',
            background: 'rgba(218, 165, 32, 0.12)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-pill, 9999px)',
            border: '1px solid rgba(218, 165, 32, 0.35)',
            boxShadow: '0 2px 8px rgba(200, 157, 71, 0.12)'
          }}
        >
          GANAPATHI TRAIL 2026
        </span>
      </header>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '440px',
          width: '100%',
          zIndex: 1
        }}
      >
        <div
          style={{
            marginBottom: '16px',
            filter: 'drop-shadow(0 12px 24px rgba(107, 20, 20, 0.18))',
            animation: 'bappaFloat 4s ease-in-out infinite'
          }}
        >
          <GanapatiDoodle size={110} primaryColor="#6B1414" accentColor="#C89D47" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading, "Unbounded", system-ui, sans-serif)',
            fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: 'var(--maroon-primary, #6B1414)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(107, 20, 20, 0.08)'
          }}
        >
          Bappa is Arriving
        </h1>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(107, 20, 20, 0.06)',
            border: '1px solid rgba(107, 20, 20, 0.15)',
            padding: '6px 14px',
            borderRadius: '12px',
            marginBottom: '20px'
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
            {displayTime}
          </p>
        </div>

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
              { label: 'HOURS', value: pad(timeLeft.hours) },
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
          Thank you for your patience — the celebration begins at {displayTime}.
        </p>
      </main>

      <style>
        {`
          @keyframes bappaFloat {
            0% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.02);
            }
            100% {
              transform: translateY(0px) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}
