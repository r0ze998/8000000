import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useShrineName = () => {
  const [shrineName, setShrineName] = useLocalStorage('shrineName', '参拝');

  return {
    shrineName: shrineName || '参拝',
    setShrineName
  };
};