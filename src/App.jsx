import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { VotePage } from './pages/VotePage';
import { PandhalDetails } from './components/pandhal/PandhalDetails';
import { AuthProvider } from './context/AuthContext';
import { AuthGate } from './components/auth/AuthGate';
import { useLiveVotes } from './hooks/useLiveVotes';
import { usePandhal } from './hooks/usePandhal';
import { pandhalService } from './services/pandhalService';
import { votingService } from './services/votingService';

function MainDashboard() {
  const { counts: liveCounts, totalVotes } = useLiveVotes();
  const { 
    pandhals, 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory,
    shuffle
  } = usePandhal(liveCounts);

  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [selectedVoteId, setSelectedVoteId] = useState(null);
  const [myVote, setMyVote] = useState(() => votingService.getMyVote());

  // Deep-link hash handler (#pandhal-XX or #vote-pandhal-XX)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('vote-')) {
        const id = hash.replace('vote-', '');
        const target = pandhalService.getPandhalById(id);
        if (target) {
          setSelectedVoteId(target.id);
          setSelectedGalleryId(null);
          return;
        }
      }
      
      if (hash && hash.startsWith('pandhal-')) {
        const target = pandhalService.getPandhalById(hash);
        if (target) {
          setSelectedGalleryId(target.id);
          setSelectedVoteId(null);
          return;
        }
      }

      if (!hash) {
        setSelectedGalleryId(null);
        setSelectedVoteId(null);
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
    setSelectedVoteId(null);
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
    setSelectedGalleryId(null);
    if (history.pushState) {
      history.pushState(null, null, `#vote-${id}`);
    }
  };

  const handleCloseVote = () => {
    setSelectedVoteId(null);
    if (history.pushState) {
      history.pushState(null, null, ' ');
    }
  };

  const handleVoteRecorded = () => {
    setMyVote(votingService.getMyVote());
  };

  // If a user clicks Vote, navigate to the dedicated full-page Vote view
  if (selectedVotePandhal) {
    return (
      <VotePage 
        pandhal={selectedVotePandhal}
        onBack={handleCloseVote}
        onVoteRecorded={handleVoteRecorded}
      />
    );
  }

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
          onShuffle={shuffle}
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
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <MainDashboard />
      </AuthGate>
    </AuthProvider>
  );
}
