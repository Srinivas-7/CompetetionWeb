import React, { useState, useEffect, useRef } from 'react';

export function PandhalGallery({ 
  pandhal, 
  onVoteClick, 
  onShareClick, 
  onClose 
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const photos = pandhal.photos || [];
  const currentPhoto = photos[selectedPhotoIndex] || photos[0];
  const totalPhotos = photos.length;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPhotos]);

  // Touch Swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      style={{
        background: '#101322',
        border: '2.5px solid #ffffff',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '22px 18px 26px',
        position: 'relative',
        boxSizing: 'border-box',
        boxShadow: '8px 8px 0px var(--neon-pink)',
        color: '#ffffff'
      }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          right: '14px',
          top: '14px',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'var(--neon-pink)',
          border: '2px solid #ffffff',
          color: '#ffffff',
          fontSize: '22px',
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px #ffffff',
          zIndex: 10
        }}
        aria-label="Close modal"
      >
        ×
      </button>

      {/* Header */}
      <div style={{ paddingRight: '48px', marginBottom: '16px' }}>
        <div 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            fontWeight: 800,
            color: 'var(--neon-yellow)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '2px'
          }}
        >
          PANDHAL #{String(pandhal.number).padStart(2, '0')} • {pandhal.theme}
        </div>
        <h2 
          style={{ 
            fontSize: '1.45rem', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 800, 
            color: '#ffffff', 
            margin: '0 0 4px',
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}
        >
          {pandhal.name}
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
          📍 {pandhal.location} • {pandhal.organization} (Est. {pandhal.establishedYear})
        </p>
      </div>

      {/* Main Selected Photo Stage with < and > Navigation Arrows */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '100%',
          height: '270px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.25)',
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
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#000000',
            border: '2px solid #ffffff',
            boxShadow: '2px 2px 0px var(--neon-pink)',
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 5,
            paddingBottom: '2px'
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
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#000000',
            border: '2px solid #ffffff',
            boxShadow: '2px 2px 0px var(--neon-pink)',
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 5,
            paddingBottom: '2px'
          }}
          aria-label="Next photo"
        >
          ›
        </button>

        {/* Photo Counter Pill in Image Overlay */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 'var(--radius-pill)',
            padding: '3px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#ffffff',
            pointerEvents: 'none'
          }}
        >
          {selectedPhotoIndex + 1} / {totalPhotos}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700, color: 'var(--neon-lime)', textAlign: 'center', marginBottom: '14px' }}>
        {currentPhoto.title}
      </p>

      {/* Thumbnail Strip */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${totalPhotos}, 1fr)`,
          gap: '8px',
          marginBottom: '18px'
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
                border: isSelected ? '2.5px solid var(--neon-pink)' : '1.5px solid rgba(255, 255, 255, 0.2)',
                height: '56px',
                background: '#000000',
                opacity: isSelected ? 1 : 0.55,
                boxShadow: isSelected ? '2px 2px 0px var(--neon-pink)' : 'none',
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

      {/* Eco Verification Banner */}
      <div 
        style={{
          background: 'rgba(204, 255, 0, 0.1)',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '18px',
          fontSize: '0.84rem',
          color: '#ffffff',
          border: '1.5px solid var(--neon-lime)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🌱</span>
        <div>
          <strong style={{ color: 'var(--neon-lime)' }}>100% Eco-Verified:</strong> Biodegradable Prasad &amp; Zero-Plastic Grounds.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onVoteClick(pandhal.id)}
          style={{
            flex: 1,
            background: 'var(--gradient-hyper)',
            color: '#000000',
            border: '2px solid #ffffff',
            boxShadow: '4px 4px 0px var(--neon-pink)',
            borderRadius: 'var(--radius-pill)',
            padding: '14px',
            fontSize: '1rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          <span>VOTE FOR THIS BAPPA 🏆</span>
        </button>

        <button
          onClick={() => onShareClick(pandhal)}
          style={{
            background: '#22c55e',
            color: '#ffffff',
            border: '2px solid #ffffff',
            boxShadow: '3px 3px 0px #ffffff',
            borderRadius: 'var(--radius-pill)',
            padding: '14px 20px',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          <span>SHARE 💬</span>
        </button>
      </div>
    </div>
  );
}
