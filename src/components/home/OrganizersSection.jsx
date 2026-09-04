import React from 'react';

const ORGANIZER_PLACEHOLDERS = [
  { id: '1', handle: '@vijayanagara_edits', url: 'https://www.instagram.com/vijayanagara_edits', label: 'Vijayanagara Edits' },
  { id: '2', handle: '@vijayanagara_vlogs', url: 'https://www.instagram.com/vijayanagara_vlogs', label: 'Vijayanagara Vlogs' },
  { id: '3', handle: '@vlogs_with_varun_kiran', url: 'https://www.instagram.com/vlogs_with_varun_kiran/', label: 'Vlogs with Varun Kiran' },
  { id: '4', handle: '@nimur_huduga', url: 'https://www.instagram.com/nimur_huduga', label: 'Nimur Huduga' },
];

export function OrganizersSection() {
  return (
    <section
      style={{
        background: 'var(--maroon-dark)',
        color: '#FFFFFF',
        width: '100%',
        padding: '36px 16px 48px',
        boxSizing: 'border-box',
        borderTop: '2px solid var(--gold-primary)',
        borderBottom: '2px solid var(--gold-primary)',
        position: 'relative'
      }}
      aria-label="Organizers and Sponsors"
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(200, 157, 71, 0.18)',
                color: 'var(--gold-light)',
                border: '1px solid var(--gold-primary)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                textTransform: 'uppercase'
              }}
            >
              ★ ORGANISERS &amp; SPONSORS ★
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 900,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}
          >
            Organised With Devotion &amp; Vision
          </h2>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0 auto',
              maxWidth: '520px',
              lineHeight: 1.5
            }}
          >
            Honoring the organizing team and our esteemed event sponsors bringing together the 21 Grand Pandhals of Chaturthi 2026.
          </p>
        </div>

        {/* Grid: 2 Cards (1st: Organizer, 2nd: Sponsors) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 420px))',
            justifyContent: 'center',
            gap: '24px',
            margin: '0 auto'
          }}
        >
          {/* CARD 1: ORGANIZER (FIRST) */}
          <div
            style={{
              background: '#FFFFFF',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--gold-primary)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 24px',
              textAlign: 'center',
              position: 'relative',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Organizer Badge */}
              <div style={{ marginBottom: '18px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--maroon-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-pill)',
                    letterSpacing: '0.06em'
                  }}
                >
                  <span>EVENT ORGANISER</span>
                </span>
              </div>

              {/* Organizer Name */}
              <div style={{ marginBottom: '16px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.28rem',
                    fontWeight: 800,
                    color: 'var(--maroon-primary)',
                    margin: '0 0 4px',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Organizing Committee
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.01em',
                    margin: 0
                  }}
                >
                  (Chaturthi 2026 Utsava Samithi)
                </p>
              </div>

              {/* Instagram ID Placeholders (4 Handles) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  marginTop: '16px'
                }}
              >
                {ORGANIZER_PLACEHOLDERS.map((item) => (
                  <a
                    key={item.id}
                    href={item.url || `https://instagram.com/${item.handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: '#FDFBF7',
                      border: '1px solid #E2D7C8',
                      color: 'var(--maroon-primary)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.01em',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--maroon-primary)';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = 'var(--maroon-primary)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FDFBF7';
                      e.currentTarget.style.color = 'var(--maroon-primary)';
                      e.currentTarget.style.borderColor = '#E2D7C8';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    title={item.label}
                  >
                    {/* Instagram Icon SVG */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.handle}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom Caption */}
            <div style={{ position: 'relative', zIndex: 1, marginTop: '20px' }}>
              <div
                style={{
                  height: '2px',
                  width: '40px',
                  background: 'var(--gold-primary)',
                  margin: '0 auto 10px',
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
                Official Event Management &amp; Coordination
              </p>
            </div>
          </div>

          {/* CARD 2: SPONSORS (SECOND) */}
          <div
            style={{
              background: '#FFFFFF',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--gold-primary)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 24px',
              textAlign: 'center',
              position: 'relative',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Sponsor Badge */}
              <div style={{ marginBottom: '18px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'var(--maroon-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-pill)',
                    letterSpacing: '0.06em'
                  }}
                >
                  <span>EVENT SPONSORS</span>
                </span>
              </div>

              {/* Sponsor 1 */}
              <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.28rem',
                    fontWeight: 800,
                    color: 'var(--maroon-primary)',
                    margin: '0 0 4px',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Honourable H R Gaviyappa
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.01em',
                    margin: '0 0 8px'
                  }}
                >
                  (MLA, Vijayanagara – Hosapete)
                </p>
                <a
                  href="https://www.instagram.com/mlahrgaviyappa"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#FDFBF7',
                    border: '1px solid #E2D7C8',
                    color: 'var(--maroon-primary)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--maroon-primary)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--maroon-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FDFBF7';
                    e.currentTarget.style.color = 'var(--maroon-primary)';
                    e.currentTarget.style.borderColor = '#E2D7C8';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="Honourable H R Gaviyappa on Instagram"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>@mlahrgaviyappa</span>
                </a>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  width: '60px',
                  background: '#EADECB',
                  margin: '14px auto',
                  borderRadius: '2px'
                }}
              />

              {/* Sponsor 2 */}
              <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.28rem',
                    fontWeight: 800,
                    color: 'var(--maroon-primary)',
                    margin: '0 0 4px',
                    letterSpacing: '-0.01em'
                  }}
                >
                  H G Virupaksha
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.01em',
                    margin: '0 0 8px'
                  }}
                >
                  (Samaja Sevakaru, Hosapete)
                </p>
                <a
                  href="https://www.instagram.com/hg_virupaksha_official_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#FDFBF7',
                    border: '1px solid #E2D7C8',
                    color: 'var(--maroon-primary)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--maroon-primary)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--maroon-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FDFBF7';
                    e.currentTarget.style.color = 'var(--maroon-primary)';
                    e.currentTarget.style.borderColor = '#E2D7C8';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="H G Virupaksha on Instagram"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>@hg_virupaksha_official_</span>
                </a>
              </div>
            </div>

            {/* Bottom Caption */}
            <div style={{ position: 'relative', zIndex: 1, marginTop: '20px' }}>
              <div
                style={{
                  height: '2px',
                  width: '40px',
                  background: 'var(--gold-primary)',
                  margin: '0 auto 10px',
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
                Chaturthi 2026 Grand Sponsors
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
