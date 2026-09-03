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
        background: '#121522',
        border: '1.5px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '24px',
        padding: '24px 20px',
        color: '#ffffff',
        position: 'relative',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        maxWidth: '720px',
        margin: '0 auto'
      }}
    >
      {/* Header Info */}
      <div style={{ marginBottom: '16px', textAlign: 'center', paddingRight: '24px', paddingLeft: '24px' }}>
        <span 
          style={{
            display: 'inline-block',
            background: '#f59e0b',
            color: '#000000',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
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
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 800, 
            color: '#ffffff',
            margin: '0 0 4px',
            lineHeight: 1.2
          }}
        >
          {pandhal.name}
        </h2>
        
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
          {pandhal.location} • <span style={{ color: '#f59e0b' }}>{pandhal.theme}</span>
        </p>
      </div>

      {/* Main 4K Photo Stage with Left/Right Arrows */}
      <div 
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
        style={{
          width: '100%',
          height: 'clamp(240px, 50vh, 380px)',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        <img 
          src={currentPhoto.src} 
          alt={currentPhoto.alt} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* Previous < Arrow Button */}
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.75)',
            border: '1.5px solid #ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 5,
            paddingBottom: '2px',
            backdropFilter: 'blur(4px)'
          }}
          aria-label="Previous photo"
        >
          ‹
        </button>

        {/* Next > Arrow Button */}
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.75)',
            border: '1.5px solid #ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 5,
            paddingBottom: '2px',
            backdropFilter: 'blur(4px)'
          }}
          aria-label="Next photo"
        >
          ›
        </button>

        {/* Photo Counter Pill */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 'var(--radius-pill)',
            padding: '2px 8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#ffffff',
            pointerEvents: 'none'
          }}
        >
          {selectedPhotoIndex + 1} / {totalPhotos}
        </div>
      </div>

      {/* Photo Title */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', textAlign: 'center', marginBottom: '14px' }}>
        {currentPhoto.title}
      </p>

      {/* Thumbnail Strip */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${totalPhotos}, 1fr)`,
          gap: '8px',
          marginBottom: '20px'
        }}
      >
        {photos.map((photo, idx) => {
          const isSelected = idx === selectedPhotoIndex;
          return (
            <div 
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(idx)}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                overflow: 'hidden',
                border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                height: '52px',
                background: '#000000',
                opacity: isSelected ? 1 : 0.5,
                boxShadow: isSelected ? '0 2px 8px rgba(245, 158, 11, 0.35)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <img 
                src={photo.src} 
                alt={photo.alt} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          );
        })}
      </div>

      {/* Sleek Full-Width Vote Button (Share button removed) */}
      <div>
        <button
          onClick={() => onVoteClick(pandhal.id)}
          style={{
            width: '100%',
            background: 'var(--gradient-hyper)',
            color: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
            borderRadius: 'var(--radius-pill)',
            padding: '11px 20px',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(245, 158, 11, 0.25)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.35)';
          }}
        >
          <span>VOTE FOR THIS BAPPA</span>
        </button>
      </div>
    </div>
  );
}
