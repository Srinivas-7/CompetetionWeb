import { useState, useEffect } from 'react';
import { votingService } from '../services/votingService';
import { PANDHALS_DATA } from '../data/pandhals';

export function useLiveVotes() {
  const [counts, setCounts] = useState(() => {
    const initial = {};
    PANDHALS_DATA.forEach(p => {
      initial[p.id] = p.initialVotes;
    });
    return initial;
  });

  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const unsubscribe = votingService.subscribeLiveCounts((updatedCounts) => {
      if (updatedCounts) {
        setCounts(prev => ({ ...prev, ...updatedCounts }));
        
        let sum = 0;
        PANDHALS_DATA.forEach(p => {
          sum += (updatedCounts[p.id] !== undefined ? updatedCounts[p.id] : p.initialVotes);
        });
        setTotalVotes(sum);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return { counts, totalVotes };
}
