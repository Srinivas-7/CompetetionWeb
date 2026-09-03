import { useState, useEffect } from 'react';
import { votingService } from '../services/votingService';
import { PANDHALS_DATA } from '../data/pandhals';

export function useLiveVotes() {
  // Pure zero baseline - all counts are fetched live from Firebase
  const [counts, setCounts] = useState(() => {
    const initial = {};
    PANDHALS_DATA.forEach(p => {
      initial[p.id] = 0;
    });
    return initial;
  });

  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const unsubscribe = votingService.subscribeLiveCounts((firebaseCounts) => {
      if (firebaseCounts) {
        setCounts(prev => {
          const next = { ...prev };
          PANDHALS_DATA.forEach(p => {
            next[p.id] = typeof firebaseCounts[p.id] === 'number' ? firebaseCounts[p.id] : 0;
          });
          return next;
        });
        
        let sum = 0;
        PANDHALS_DATA.forEach(p => {
          sum += (typeof firebaseCounts[p.id] === 'number' ? firebaseCounts[p.id] : 0);
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
