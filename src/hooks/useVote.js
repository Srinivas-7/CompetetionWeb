import { useState } from 'react';
import { votingService } from '../services/votingService';

export function useVote(onSuccess) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [myVote, setMyVote] = useState(() => votingService.getMyVote());

  const resetState = () => {
    setIsSubmitting(false);
    setIsDelayed(false);
    setErrorMessage('');
    setSuccessData(null);
    setMyVote(votingService.getMyVote());
  };

  const castVote = async (phone, pandhalId) => {
    setIsSubmitting(true);
    setIsDelayed(false);
    setErrorMessage('');
    setSuccessData(null);

    // 0.50s rule timer
    const timer = setTimeout(() => {
      setIsDelayed(true);
    }, 500);

    try {
      const result = await votingService.castVote(phone, pandhalId);
      clearTimeout(timer);

      if (result.success) {
        setSuccessData(result);
        setMyVote(votingService.getMyVote());
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
