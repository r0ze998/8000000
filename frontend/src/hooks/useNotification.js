import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  }, []);

  return {
    notification,
    showNotification
  };
};