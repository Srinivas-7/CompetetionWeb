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
        border: '3px solid var(--maroon-dark)',
        borderRadius: 'var(--radius-xs)',
        padding: '24px 20px',
        color: 'var(--text-primary)',
        position: 'relative',
        boxShadow: '6px 6px 0px var(--maroon-dark)',
        maxWidth: '720px',
        margin: '0 auto'
      }}
    >
      {/* Header Info */}
      <div style={{ marginBottom: '18px', textAlign: 'center', paddingRight: '24px', paddingLeft: '24px' }}>
        <span 
          style={{
            display: 'inline-block',
            background: 'var(--maroon-primary)',
            color: '#FFFFFF',
            border: '1.5px solid var(--maroon-dark)',
            boxShadow: '2px 2px 0px var(--maroon-dark)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '0.74rem',
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '8px',
            letterSpacing: '0.04em'
          }}
        >
          #{String(pandhal.number).padStart(2, '0')} OFFICIAL
        </span>

        <h2 
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.3rem, 4.5vw, 1.75rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            margin: '0 0 6px',
            lineHeight: 1.15,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em'
          }}
        >
          {pandhal.name}
        </h2>

        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {pandhal.location} • <span style={{ color: 'var(--maroon-primary)', fontWeight: 800 }}>{pandhal.theme}</span>
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
          borderRadius: 'var(--radius-xs)',
          overflow: 'hidden',
          backgroundColor: '#F5EFEB',
          border: '2.5px solid var(--maroon-dark)',
          margin: '0 auto 16px',
          boxShadow: '4px 4px 0px var(--maroon-dark)'
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
                background: '#FFFFFF',
                color: 'var(--maroon-primary)',
                border: '2px solid var(--maroon-dark)',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '2px 2px 0px var(--maroon-dark)',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) translate(1px, 1px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) translate(0, 0)';
                e.currentTarget.style.boxShadow = '2px 2px 0px var(--maroon-dark)';
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
                background: '#FFFFFF',
                color: 'var(--maroon-primary)',
                border: '2px solid var(--maroon-dark)',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '2px 2px 0px var(--maroon-dark)',
                transition: 'transform 0.08s ease, box-shadow 0.08s ease'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) translate(1px, 1px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px var(--maroon-dark)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) translate(0, 0)';
                e.currentTarget.style.boxShadow = '2px 2px 0px var(--maroon-dark)';
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
              background: 'var(--maroon-dark)',
              color: '#FFFFFF',
              border: '1.5px solid #FFFFFF',
              boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)'
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
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                border: idx === selectedPhotoIndex ? '2.5px solid var(--maroon-primary)' : '1.5px solid #EADECB',
                boxShadow: idx === selectedPhotoIndex ? '2px 2px 0px var(--maroon-dark)' : 'none',
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
            border: '2.5px solid var(--maroon-dark)',
            borderRadius: 'var(--radius-xs)',
            padding: '14px 20px',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '0.96rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '4px 4px 0px var(--maroon-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'transform 0.08s ease, box-shadow 0.08s ease'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0px var(--maroon-dark)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0px var(--maroon-dark)';
          }}
        >
          <span>VOTE FOR THIS PANDHAL →</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'var(--ivory-warm)',
              border: '2px solid var(--maroon-dark)',
              color: 'var(--maroon-primary)',
              borderRadius: 'var(--radius-xs)',
              padding: '14px 20px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 900,
              fontSize: '0.86rem',
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
            Close
          </button>
        )}
      </div>
    </div>
  );
}
