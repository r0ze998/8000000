// =============================================================================
// Date & Time Utilities
// =============================================================================

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// =============================================================================
// Validation Utilities
// =============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isNotEmpty = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

export const validatePrayerDuration = (duration: number): boolean => {
  return duration >= 60 && duration <= 3600; // 1分〜1時間
};

// =============================================================================
// Formatting Utilities
// =============================================================================

export const formatCurrency = (amount: number, currency: string = '¥'): string => {
  return `${currency}${amount.toLocaleString('ja-JP')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// =============================================================================
// Local Storage Utilities
// =============================================================================

export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }
};

// =============================================================================
// Array Utilities
// =============================================================================

export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
};

// =============================================================================
// Random Utilities
// =============================================================================

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomChoice = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array');
  }
  return array[randomInt(0, array.length - 1)];
};

export const randomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// LocalStorage utility functions
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

// Worship utility functions
export const calculateBaseReward = (duration: number): number => {
  return Math.floor(duration / 60) * 10; // 1分あたり10ポイント
};

export const getCurrentSeasonalEvent = (): string | null => {
  const now = new Date();
  const month = now.getMonth() + 1;

  if (month >= 3 && month <= 5) return '春の祭り';
  if (month >= 6 && month <= 8) return '夏祭り';
  if (month >= 9 && month <= 11) return '秋の収穫祭';
  if (month === 12 || month <= 2) return '冬の祈願';

  return null;
};

export const getRandomWeather = (): string => {
  const weathers = ['晴れ', '曇り', '雨', '雪', '霧'];
  return randomChoice(weathers);
};

// =============================================================================
// DOM Utilities
// =============================================================================

export const scrollToTop = (smooth: boolean = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// =============================================================================
// Debug Utilities
// =============================================================================

export const debugLog = (message: string, data?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🙏 [Shrine App] ${message}`, data ? data : '');
  }
};

export const measurePerformance = <T>(
  fn: () => T,
  label: string
): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  debugLog(`Performance [${label}]: ${(end - start).toFixed(2)}ms`);
  return result;
};