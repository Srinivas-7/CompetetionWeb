import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';

export function useProgress(myVote = null) {
  const { user } = useAuth();
  const [progressState, setProgressState] = useState(() => 
    progressService.computeProgress(user?.uid, myVote)
  );

  const refreshProgress = useCallback(() => {
    if (user?.uid) {
      setProgressState(progressService.computeProgress(user.uid, myVote));
    } else {
      setProgressState(progressService.computeProgress(null, null));
    }
  }, [user?.uid, myVote]);

  useEffect(() => {
    refreshProgress();
    const unsubscribe = progressService.subscribe(() => {
      refreshProgress();
    });
    return () => unsubscribe();
  }, [refreshProgress]);

  const claimDailyCheckin = useCallback(() => {
    if (!user?.uid) return { success: false, message: 'Please sign in first.' };
    const result = progressService.recordDailyCheckin(user.uid);
    refreshProgress();
    return result;
  }, [user?.uid, refreshProgress]);

  const claimShareBonus = useCallback(() => {
    if (!user?.uid) return { success: false, message: 'Please sign in first.' };
    const result = progressService.recordShare(user.uid);
    refreshProgress();
    return result;
  }, [user?.uid, refreshProgress]);

  const recordPandhalVisit = useCallback((pandhalId) => {
    if (!user?.uid || !pandhalId) return;
    progressService.recordPandhalVisit(user.uid, pandhalId);
    refreshProgress();
  }, [user?.uid, refreshProgress]);

  return {
    ...progressState,
    claimDailyCheckin,
    claimShareBonus,
    recordPandhalVisit,
    refreshProgress
  };
}
