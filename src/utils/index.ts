
// =============================================================================
// Local Storage Utilities
// =============================================================================

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage with key "${key}":`, error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading from localStorage with key "${key}":`, error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key "${key}":`, error);
  }
};

// =============================================================================
// Date & Time Utilities
// =============================================================================

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// =============================================================================
// Math & Random Utilities
// =============================================================================

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    if (temp !== undefined && shuffled[j] !== undefined) {
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
  }
  return shuffled;
};

export const randomChoice = <T>(array: T[]): T => {
  if (array.length === 0) {
    throw new Error('Cannot choose from empty array');
  }
  const index = randomInt(0, array.length - 1);
  const item = array[index];
  if (item === undefined) {
    throw new Error('Selected item is undefined');
  }
  return item;
};

export const randomId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// =============================================================================
// Game Mechanics
// =============================================================================

export const calculateBaseReward = (duration: number, shrineRarity: string): number => {
  const baseReward = duration * 10; // 1分あたり10ポイント
  const rarityMultiplier = {
    common: 1,
    rare: 1.2,
    epic: 1.5,
    legendary: 2.0
  };
  
  const multiplier = rarityMultiplier[shrineRarity as keyof typeof rarityMultiplier] || 1;
  return Math.floor(baseReward * multiplier);
};

export const getCurrentSeasonalEvent = () => {
  const now = new Date();
  const month = now.getMonth();
  
  // 季節イベントの簡単な実装
  if (month === 0 || month === 1) {
    return {
      name: '新年祈願',
      multiplier: 1.5,
      description: '新年の特別な御利益'
    };
  } else if (month >= 2 && month <= 4) {
    return {
      name: '春の参拝',
      multiplier: 1.2,
      description: '桜の季節の特別な参拝'
    };
  } else if (month >= 5 && month <= 7) {
    return {
      name: '夏祭り',
      multiplier: 1.3,
      description: '夏祭りの特別イベント'
    };
  } else if (month >= 8 && month <= 10) {
    return {
      name: '秋の収穫祭',
      multiplier: 1.25,
      description: '豊穣への感謝'
    };
  } else {
    return {
      name: '師走の参拝',
      multiplier: 1.4,
      description: '年末の特別な参拝'
    };
  }
};

export const getRandomWeather = () => {
  const weathers = [
    { condition: 'sunny', bonus: 1.1, icon: '☀️' },
    { condition: 'cloudy', bonus: 1.0, icon: '☁️' },
    { condition: 'rainy', bonus: 1.2, icon: '🌧️' },
    { condition: 'snowy', bonus: 1.3, icon: '❄️' }
  ];
  
  return randomChoice(weathers);
};

// =============================================================================
// Validation Utilities
// =============================================================================

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStarknetAddress = (address: string): boolean => {
  // StarkNet アドレスの基本的な検証
  return /^0x[0-9a-fA-F]{63,64}$/.test(address);
};

// =============================================================================
// Debug Utilities
// =============================================================================

export const debugLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

export const debugWarn = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

export const debugError = (message: string, error?: Error): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${message}`, error);
  }
};

// =============================================================================
// Distance Calculation
// =============================================================================

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
};
