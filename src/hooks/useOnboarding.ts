
import { useState, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils';

export function useOnboarding() {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hasCompletedOnboarding = loadFromLocalStorage('hasCompletedOnboarding', false);
    setNeedsOnboarding(!hasCompletedOnboarding);
    setIsLoading(false);
  }, []);

  const completeOnboarding = () => {
    saveToLocalStorage('hasCompletedOnboarding', true);
    setNeedsOnboarding(false);
  };

  return {
    needsOnboarding,
    isLoading,
    completeOnboarding
  };
}

export default useOnboarding;
