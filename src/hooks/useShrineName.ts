
import { useState, useEffect } from 'react';

export const useShrineName = () => {
  const [shrineName, setShrineName] = useState<string>('マイ神社');

  useEffect(() => {
    const savedName = localStorage.getItem('shrineName');
    if (savedName) {
      setShrineName(savedName);
    }
  }, []);

  const updateShrineName = (newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName) {
      setShrineName(trimmedName);
      localStorage.setItem('shrineName', trimmedName);
    }
  };

  return {
    shrineName,
    updateShrineName
  };
};
