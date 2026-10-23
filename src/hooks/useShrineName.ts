
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useShrineName() {
  const [shrineName, setShrineName] = useLocalStorage('shrineName', 'マイ神社');
  const [isEditing, setIsEditing] = useState(false);

  const updateShrineName = (newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName) {
      setShrineName(trimmedName);
    }
  };

  return {
    shrineName,
    setShrineName,
    isEditing,
    setIsEditing,
    updateShrineName
  };
}

export default useShrineName;
