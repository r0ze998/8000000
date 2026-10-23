import { useState, useEffect } from 'react';

/**
 * React + localStorage Hook
 * @returns [value, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 1️⃣ 初期値のロード
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 2️⃣ setter ラッパー ― localStorage へも保存
  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // useEffectを削除 - setValueで既に同期しているため不要

  // ★ const 付けず可変タプルで返す
  return [storedValue, setValue];
}

export default useLocalStorage;
