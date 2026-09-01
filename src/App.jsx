import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { PandhalsPage } from './pages/PandhalsPage';
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

  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'pandhals' | 'vote'
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [selectedVoteId, setSelectedVoteId] = useState(null);
  const [myVote, setMyVote] = useState(() => votingService.getMyVote());

  // Deep-link hash handler (#pandhals, #pandhal-XX, #vote-pandhal-XX)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash.startsWith('vote-')) {
        const id = hash.replace('vote-', '');
        const target = pandhalService.getPandhalById(id);
        if (target) {
          setSelectedVoteId(target.id);
          setCurrentPage('vote');
          setSelectedGalleryId(null);
          return;
        }
      }
      
      if (hash.startsWith('pandhal-')) {
        const target = pandhalService.getPandhalById(hash);
        if (target) {
          setSelectedGalleryId(target.id);
          setCurrentPage('pandhals');
          setSelectedVoteId(null);
          return;
        }
      }

      if (hash === 'pandhals') {
        setCurrentPage('pandhals');
        setSelectedGalleryId(null);
        setSelectedVoteId(null);
        return;
      }

      // Root / empty hash
      setCurrentPage('home');
      setSelectedGalleryId(null);
      setSelectedVoteId(null);
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page, hash = '') => {
    setCurrentPage(page);
    if (history.pushState) {
      history.pushState(null, null, hash ? `#${hash}` : ' ');
    }
  };

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
      history.pushState(null, null, '#pandhals');
    }
  };

  const handleOpenVote = (id) => {
    setSelectedVoteId(id);
    setCurrentPage('vote');
    setSelectedGalleryId(null);
    if (history.pushState) {
      history.pushState(null, null, `#vote-${id}`);
    }
  };

  const handleCloseVote = () => {
    setSelectedVoteId(null);
    setCurrentPage('pandhals');
    if (history.pushState) {
      history.pushState(null, null, '#pandhals');
    }
  };

  const handleVoteRecorded = () => {
    setMyVote(votingService.getMyVote());
  };

  // 1. DEDICATED VOTE PAGE
  if (currentPage === 'vote' && selectedVotePandhal) {
    return (
      <VotePage 
        pandhal={selectedVotePandhal}
        onBack={handleCloseVote}
        onVoteRecorded={handleVoteRecorded}
      />
    );
  }

  // 2. DEDICATED PANDHALS LIST PAGE
  if (currentPage === 'pandhals') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PandhalsPage 
          pandhals={pandhals}
          liveCounts={liveCounts}
          myVote={myVote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCardClick={handleOpenGallery}
          onVoteClick={handleOpenVote}
          onShuffle={shuffle}
          onBack={() => navigateTo('home')}
        />

        {/* 4K Photo Gallery Modal */}
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

  // 3. HOME LANDING PAGE
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Home 
        totalVotes={totalVotes}
        onExploreClick={() => navigateTo('pandhals', 'pandhals')}
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
