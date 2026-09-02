import React from 'react';

const ORGANIZERS = [
  {
    id: 'organizer-2',
    image: '/assets/organizers/organizer-2.jpg',
    role: 'Event Organiser',
    name: 'H R Gaviyappa',
    subtitle: '(MLA, Vijayanagara – Hosapete)',
  },
  {
    id: 'organizer-1',
    image: '/assets/organizers/organizer-1.jpg',
    role: 'Event Organiser',
    name: 'H G Virupaksha',
    subtitle: '(Samaja Sevakaru, Hosapete)',
  }
];


export function OrganizersSection() {
  return (
    <section
      style={{
        maxWidth: 'var(--container-max)',
        width: '100%',
        margin: '0 auto',
        padding: '20px 16px 40px',
        boxSizing: 'border-box'
      }}
      aria-label="Event Organizers"
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ marginBottom: '10px' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.25) 100%)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 2px 10px rgba(245, 158, 11, 0.15)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              textTransform: 'uppercase'
            }}
          >
            ★ EVENT ORGANISERS ★
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 900,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}
        >
          Organised With Devotion &amp; Vision
        </h2>

        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            margin: '0 auto',
            maxWidth: '520px',
            lineHeight: 1.5
          }}
        >
          Honoring the leadership and organizers bringing together the 21 Grand Pandhals of Chaturthi 2026.
        </p>
      </div>

      {/* Organizers Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 360px))',
          justifyContent: 'center',
          gap: '24px',
          margin: '0 auto'
        }}
      >
        {ORGANIZERS.map((org) => (
          <div
            key={org.id}
            style={{
              background: 'linear-gradient(180deg, #181c2e 0%, #111422 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), 0 0 24px rgba(245, 158, 11, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px 20px',
              textAlign: 'center',
              position: 'relative',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.7)';
              e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.6), 0 0 32px rgba(245, 158, 11, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.45), 0 0 24px rgba(245, 158, 11, 0.1)';
            }}
          >
            {/* Top decorative glow backdrop */}
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />

            {/* Organizer Photo Frame */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '210px',
                height: '250px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                background: '#090a10',
                marginBottom: '18px'
              }}
            >
              <img
                src={org.image}
                alt={org.name || org.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block'
                }}
              />
            </div>

            {/* Organizer Details */}
            <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
              <div style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    letterSpacing: '0.04em'
                  }}
                >
                  <span>👑</span>
                  <span>{org.role.toUpperCase()}</span>
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 2px',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  alignItems: 'center'
                }}
              >
                <span>{org.name || org.title}</span>
                {org.subtitle && (
                  <span
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#f59e0b',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {org.subtitle}
                  </span>
                )}
              </h3>

              <div
                style={{
                  height: '2px',
                  width: '40px',
                  background: 'var(--gradient-hyper)',
                  margin: '10px auto',
                  borderRadius: '2px'
                }}
              />

              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.4
                }}
              >
                Chaturthi 2026 Organizing Committee
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
