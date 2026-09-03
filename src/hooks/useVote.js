import { useState, useEffect } from 'react';
import { votingService } from '../services/votingService';
import { useAuth } from '../context/AuthContext';

export function useVote(onSuccess) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [myVote, setMyVote] = useState(null);

  // Live real-time Firestore sync with active Google user
  useEffect(() => {
    if (!user?.uid) {
      setMyVote(null);
      return;
    }

    const unsubscribe = votingService.subscribeUserVote(user.uid, (voteRecord) => {
      setMyVote(voteRecord);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  const resetState = () => {
    setIsSubmitting(false);
    setIsDelayed(false);
    setErrorMessage('');
    setSuccessData(null);
  };

  const castVote = async (email, pandhalId, voterName = '') => {
    setIsSubmitting(true);
    setIsDelayed(false);
    setErrorMessage('');
    setSuccessData(null);

    // 0.50s rule timer
    const timer = setTimeout(() => {
      setIsDelayed(true);
    }, 500);

    try {
      const result = await votingService.castVote(email, pandhalId, voterName);
      clearTimeout(timer);

      if (result.success) {
        setSuccessData(result);
        if (onSuccess) onSuccess(result);
      } else {
        setErrorMessage(result.message || 'Voting failed. Please try again.');
      }
    } catch (err) {
      clearTimeout(timer);
      setErrorMessage("Bappa is taking a little longer to arrive. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsDelayed(false);
    }
  };

  return {
    isSubmitting,
    isDelayed,
    errorMessage,
    successData,
    myVote,
    castVote,
    resetState,
    clearError: () => setErrorMessage('')
  };
}
