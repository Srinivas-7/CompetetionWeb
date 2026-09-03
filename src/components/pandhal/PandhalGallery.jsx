import React, { useState, useEffect } from 'react';

export function PandhalGallery({ 
  pandhal, 
  onVoteClick, 
  onShareClick,
  onClose 
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const photos = pandhal?.photos || [];
  const totalPhotos = photos.length;
  const currentPhoto = photos[selectedPhotoIndex] || { src: '', title: pandhal?.name, alt: pandhal?.name };

  // Reset index when pandhal changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [pandhal?.id]);

  const handlePrev = () => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedPhotoIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPhotos]);

  // Touch swipe support for mobile
  const minSwipeDistance = 45;

  const onTouchStartHandler = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!pandhal) return null;

  return (
    <div 
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #EADECB',
        borderRadius: '24px',
        padding: '24px 20px',
        color: 'var(--text-primary)',
        position: 'relative',
        boxShadow: '0 12px 36px rgba(91, 20, 20, 0.12)',
        maxWidth: '720px',
        margin: '0 auto'
      }}
    >
      {/* Header Info */}
      <div style={{ marginBottom: '16px', textAlign: 'center', paddingRight: '24px', paddingLeft: '24px' }}>
        <span 
          style={{
            display: 'inline-block',
            background: 'var(--maroon-primary)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '0.74rem',
            padding: '2px 8px',
            borderRadius: '4px',
            marginBottom: '6px'
          }}
        >
          #{String(pandhal.number).padStart(2, '0')} OFFICIAL
        </span>

        <h2 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 4px',
            lineHeight: 1.2
          }}
        >
          {pandhal.name}
        </h2>

        <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          {pandhal.location} • <span style={{ color: 'var(--maroon-primary)', fontWeight: 700 }}>{pandhal.theme}</span>
        </p>
      </div>

      {/* Main Image Stage */}
      <div 
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 11',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#F5EFEB',
          border: '1px solid #EADECB',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
        }}
      >
        <img 
          src={currentPhoto.src} 
          alt={currentPhoto.alt || pandhal.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Carousel Navigation Arrows */}
        {totalPhotos > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--maroon-primary)',
                border: '1px solid #EADECB',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--maroon-primary)',
                border: '1px solid #EADECB',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}

        {/* Photo Counter Pill */}
        {totalPhotos > 1 && (
          <div 
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {selectedPhotoIndex + 1} / {totalPhotos}
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      {totalPhotos > 1 && (
        <div 
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '20px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          {photos.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: idx === selectedPhotoIndex ? '2px solid var(--maroon-primary)' : '1px solid #EADECB',
                padding: 0,
                cursor: 'pointer',
                opacity: idx === selectedPhotoIndex ? 1 : 0.6,
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <img src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div 
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}
      >
        <button
          onClick={() => onVoteClick(pandhal.id)}
          style={{
            flex: 1,
            background: 'var(--maroon-primary)',
            color: '#FFFFFF',
            border: '1px solid var(--maroon-dark)',
            borderRadius: 'var(--radius-pill)',
            padding: '13px 20px',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '0.94rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(107, 20, 20, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>VOTE FOR THIS PANDHAL →</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: '#FDFBF7',
              border: '1px solid #EADECB',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-pill)',
              padding: '13px 18px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
