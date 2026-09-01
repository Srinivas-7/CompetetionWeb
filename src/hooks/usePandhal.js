import { useState, useMemo } from 'react';
import { pandhalService } from '../services/pandhalService';

export function usePandhal(liveCounts = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const pandhals = useMemo(() => {
    return pandhalService.filterPandhals(searchQuery, activeCategory, liveCounts);
  }, [searchQuery, activeCategory, liveCounts]);

  return {
    pandhals,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    totalCount: pandhals.length
  };
}
