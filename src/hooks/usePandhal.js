import { useState, useMemo, useCallback } from 'react';
import { pandhalService, shufflePandhals } from '../services/pandhalService';
import { PANDHALS_DATA } from '../data/pandhals';

export function usePandhal(liveCounts = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Initialize with a randomly shuffled base order so every pandhal gets top spot exposure
  const [randomizedBase, setRandomizedBase] = useState(() => shufflePandhals(PANDHALS_DATA));

  const shuffle = useCallback(() => {
    setRandomizedBase(shufflePandhals(PANDHALS_DATA));
  }, []);

  const pandhals = useMemo(() => {
    return pandhalService.filterPandhals(randomizedBase, searchQuery, activeCategory, liveCounts);
  }, [randomizedBase, searchQuery, activeCategory, liveCounts]);

  return {
    pandhals,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    shuffle,
    totalCount: pandhals.length
  };
}
