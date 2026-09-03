import { useState, useEffect } from 'react';
import { votingService } from '../services/votingService';
import { PANDHALS_DATA } from '../data/pandhals';

export function useLiveVotes() {
  const [counts, setCounts] = useState(() => {
    const initial = {};
    PANDHALS_DATA.forEach(p => {
      initial[p.id] = p.initialVotes || 0;
    });
    return initial;
  });

  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const unsubscribe = votingService.subscribeLiveCounts((updatedCounts) => {
      if (updatedCounts) {
        setCounts(prev => {
          const next = { ...prev };
          PANDHALS_DATA.forEach(p => {
            if (updatedCounts[p.id] !== undefined) {
              next[p.id] = updatedCounts[p.id];
            }
          });
          return next;
        });
        
        let sum = 0;
        PANDHALS_DATA.forEach(p => {
          sum += (updatedCounts[p.id] !== undefined ? updatedCounts[p.id] : (p.initialVotes || 0));
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
