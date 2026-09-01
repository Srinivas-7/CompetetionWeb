import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { PandhalDetails } from './components/pandhal/PandhalDetails';
import { VoteModal } from './components/voting/VoteModal';
import { useLiveVotes } from './hooks/useLiveVotes';
import { usePandhal } from './hooks/usePandhal';
import { pandhalService } from './services/pandhalService';
import { votingService } from './services/votingService';

export function App() {
  const { counts: liveCounts, totalVotes } = useLiveVotes();
  const { 
    pandhals, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory 
  } = usePandhal(liveCounts);

  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [selectedVoteId, setSelectedVoteId] = useState(null);
  const [myVote, setMyVote] = useState(() => votingService.getMyVote());

  // Deep-link hash handler (#pandhal-XX)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('pandhal-')) {
        const target = pandhalService.getPandhalById(hash);
        if (target) {
          setSelectedGalleryId(target.id);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const selectedGalleryPandhal = selectedGalleryId 
    ? pandhalService.getPandhalById(selectedGalleryId) 
    : null;

  const selectedVotePandhal = selectedVoteId 
    ? pandhalService.getPandhalById(selectedVoteId) 
    : null;

  const handleOpenGallery = (id) => {
    setSelectedGalleryId(id);
    if (history.pushState) {
      history.pushState(null, null, `#${id}`);
    }
  };

  const handleCloseGallery = () => {
    setSelectedGalleryId(null);
    if (history.pushState) {
      history.pushState(null, null, ' ');
    }
  };

  const handleOpenVote = (id) => {
    setSelectedVoteId(id);
  };

  const handleCloseVote = () => {
    setSelectedVoteId(null);
  };

  const handleShareOnWhatsApp = (pandhal) => {
    const url = `${window.location.origin}/#${pandhal.id}`;
    const text = encodeURIComponent(
      `🐘 Bappa Trail: Check out ${pandhal.name} at ${pandhal.location}!\n\n` +
      `Explore complete photos & cast your vote here: 🪔\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleVoteRecorded = () => {
    setMyVote(votingService.getMyVote());
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Main Home Page */}
      <main style={{ flex: 1 }}>
        <Home 
          pandhals={pandhals}
          liveCounts={liveCounts}
          totalVotes={totalVotes}
          myVote={myVote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onCardClick={handleOpenGallery}
          onVoteClick={handleOpenVote}
          onShareClick={handleShareOnWhatsApp}
        />
      </main>

      {/* Pandhal Details Modal (Photo Gallery) */}
      <PandhalDetails 
        pandhal={selectedGalleryPandhal}
        isOpen={Boolean(selectedGalleryPandhal)}
        onClose={handleCloseGallery}
        onVoteClick={(id) => {
          handleCloseGallery();
          handleOpenVote(id);
        }}
        onShareClick={handleShareOnWhatsApp}
      />

      {/* Direct Voting Modal (1-Phone = 1-Vote) */}
      <VoteModal 
        pandhal={selectedVotePandhal}
        isOpen={Boolean(selectedVotePandhal)}
        onClose={handleCloseVote}
        onVoteRecorded={handleVoteRecorded}
      />
    </div>
  );
}
