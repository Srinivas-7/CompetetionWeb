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
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPhotos, isFullscreen]);

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
    <>
      <div 
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #EADECB',
          borderRadius: '24px',
          padding: '24px 18px',
          color: 'var(--text-primary)',
          position: 'relative',
          boxShadow: '0 12px 36px rgba(91, 20, 20, 0.14)',
          maxWidth: '780px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Info */}
        <div style={{ marginBottom: '14px', textAlign: 'center', paddingRight: '28px', paddingLeft: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <span 
              style={{
                display: 'inline-block',
                background: 'var(--maroon-primary)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '0.74rem',
                padding: '3px 10px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(107, 20, 20, 0.25)'
              }}
            >
              #{String(pandhal.number).padStart(2, '0')} OFFICIAL
            </span>
          </div>

          <h2 
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.3rem, 4.2vw, 1.75rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 4px',
              lineHeight: 1.2
            }}
          >
            {pandhal.name}
          </h2>

          {(pandhal.location || pandhal.theme) && (
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {pandhal.location}{pandhal.location && pandhal.theme && ' • '}
              {pandhal.theme && <span style={{ color: 'var(--maroon-primary)', fontWeight: 700 }}>{pandhal.theme}</span>}
            </p>
          )}
        </div>

        {/* Free-Size Uncropped Stage */}
        <div 
          onTouchStart={onTouchStartHandler}
          onTouchMove={onTouchMoveHandler}
          onTouchEnd={onTouchEndHandler}
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '360px',
            maxHeight: '68vh',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#120808',
            border: '1.5px solid #EADECB',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Ambient blurred backdrop so wide screens have a seamless glowing look */}
          {currentPhoto.src && (
            <div 
              style={{
                position: 'absolute',
                inset: '-20px',
                backgroundImage: `url(${currentPhoto.thumbSrc || currentPhoto.src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                filter: 'blur(28px) brightness(0.35)',
                transform: 'scale(1.15)',
                pointerEvents: 'none',
                opacity: 0.9
              }}
            />
          )}

          {/* Foreground 100% UNCROPPED Natural Photo */}
          {currentPhoto.src && (
            <img 
              src={currentPhoto.src} 
              alt={currentPhoto.alt || pandhal.name}
              style={{
                maxWidth: '100%',
                maxHeight: '66vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                position: 'relative',
                zIndex: 2,
                borderRadius: '8px',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.6)',
                cursor: 'zoom-in'
              }}
              onClick={() => setIsFullscreen(true)}
              title="Click to view fullscreen"
            />
          )}

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
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--maroon-primary)',
                  border: '1px solid #EADECB',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  zIndex: 10
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--maroon-primary)',
                  border: '1px solid #EADECB',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  zIndex: 10
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          {/* Top-Right Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.65)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(6px)',
              zIndex: 10
            }}
            title="Expand Fullscreen"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <span>Full View</span>
          </button>

          {/* Photo Counter Pill */}
          {totalPhotos > 1 && (
            <div 
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 'var(--radius-pill)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 10
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
              padding: '4px 2px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {photos.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: idx === selectedPhotoIndex ? '2.5px solid var(--maroon-primary)' : '1px solid #EADECB',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: idx === selectedPhotoIndex ? 1 : 0.6,
                  transform: idx === selectedPhotoIndex ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  backgroundColor: '#F5EFEB'
                }}
                aria-label={`Select photo ${idx + 1}`}
              >
                <img 
                  src={p.thumbSrc || p.src} 
                  alt="" 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
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
              padding: '14px 20px',
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
            <span>VOTE FOR THIS PANDAL →</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: '#FDFBF7',
                border: '1px solid #EADECB',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-pill)',
                padding: '14px 18px',
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

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box'
          }}
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              fontSize: '22px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000
            }}
            aria-label="Close fullscreen"
          >
            ×
          </button>

          <img 
            src={currentPhoto.src} 
            alt={currentPhoto.alt || pandhal.name}
            style={{
              maxWidth: '96vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.8)',
              userSelect: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
