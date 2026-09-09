import { useState, useEffect, useRef } from 'react';
import { votingService } from '../services/votingService';
import { PANDHALS_DATA } from '../data/pandhals';

const POLLING_INTERVAL_MS = 20000; // 20s polling interval matching Edge Cache s-maxage

export function useLiveVotes() {
  const [counts, setCounts] = useState(() => {
    const initial = {};
    PANDHALS_DATA.forEach((p) => {
      initial[p.id] = 0;
    });
    return initial;
  });

  const [totalVotes, setTotalVotes] = useState(0);
  const isMountedRef = useRef(true);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchAndUpdate = async () => {
      try {
        const result = await votingService.fetchLiveCounts();
        if (isMountedRef.current && result?.counts) {
          setCounts({ ...result.counts });
          setTotalVotes(result.totalVotes || 0);
        }
      } catch (err) {
        console.warn('[useLiveVotes] Polling warning:', err);
      }
    };

    const startPolling = () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      intervalIdRef.current = setInterval(fetchAndUpdate, POLLING_INTERVAL_MS);
    };

    const stopPolling = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible: immediately update counts and resume interval
        fetchAndUpdate();
        startPolling();
      } else {
        // Tab is hidden: pause polling to conserve client resources and network
        stopPolling();
      }
    };

    // Initial fetch on mount
    fetchAndUpdate();
    startPolling();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { counts, totalVotes };
}
