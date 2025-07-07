// ========================================
// Core Utilities Index
// ========================================

// Time & Date utilities
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Game utilities
export const calculateBaseReward = (duration: number) => {
  const baseRate = 10;
  const multiplier = Math.floor(duration / 60);
  return {
    culturalCapital: baseRate * multiplier,
    experience: Math.floor((baseRate * multiplier) * 0.8)
  };
};

export const calculateNFTStakingRewards = (stakedNFTs: any[]): number => {
  return stakedNFTs.reduce((total, nft) => {
    const baseReward = 5;
    const rarityMultiplier = getRarityMultiplier(nft.rarity);
    return total + (baseReward * rarityMultiplier);
  }, 0);
};

export const getRarityMultiplier = (rarity: string): number => {
  const multipliers = {
    common: 1,
    uncommon: 1.5,
    rare: 2,
    epic: 3,
    legendary: 5
  };
  return multipliers[rarity as keyof typeof multipliers] || 1;
};

export const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getCulturalRank = (culturalCapital: number) => {
  if (culturalCapital >= 10000) return { 
    name: '金帯', 
    color: '#FFD700',
    icon: '🥇',
    gradient: 'linear-gradient(45deg, #FFD700, #FFA500)',
    glow: '0 0 20px rgba(255, 215, 0, 0.8)'
  };
  if (culturalCapital >= 8000) return { 
    name: '赤帯', 
    color: '#FF4500',
    icon: '🔴',
    gradient: 'linear-gradient(45deg, #FF4500, #FF6347)',
    glow: '0 0 20px rgba(255, 69, 0, 0.8)'
  };
  if (culturalCapital >= 6000) return { 
    name: '黒帯', 
    color: '#2F2F2F',
    icon: '⚫',
    gradient: 'linear-gradient(45deg, #2F2F2F, #696969)',
    glow: '0 0 20px rgba(47, 47, 47, 0.8)'
  };
  if (culturalCapital >= 4000) return { 
    name: '茶帯', 
    color: '#8B4513',
    icon: '🟤',
    gradient: 'linear-gradient(45deg, #8B4513, #CD853F)',
    glow: '0 0 20px rgba(139, 69, 19, 0.8)'
  };
  if (culturalCapital >= 2000) return { 
    name: '紫帯', 
    color: '#8A2BE2',
    icon: '🟣',
    gradient: 'linear-gradient(45deg, #8A2BE2, #9370DB)',
    glow: '0 0 20px rgba(138, 43, 226, 0.8)'
  };
  if (culturalCapital >= 1000) return { 
    name: '青帯', 
    color: '#0066FF',
    icon: '🔵',
    gradient: 'linear-gradient(45deg, #0066FF, #4169E1)',
    glow: '0 0 20px rgba(0, 102, 255, 0.8)'
  };
  if (culturalCapital >= 500) return { 
    name: '緑帯', 
    color: '#32CD32',
    icon: '🟢',
    gradient: 'linear-gradient(45deg, #32CD32, #90EE90)',
    glow: '0 0 20px rgba(50, 205, 50, 0.8)'
  };
  if (culturalCapital >= 300) return { 
    name: '橙帯', 
    color: '#FF8C00',
    icon: '🟠',
    gradient: 'linear-gradient(45deg, #FF8C00, #FFA500)',
    glow: '0 0 20px rgba(255, 140, 0, 0.8)'
  };
  if (culturalCapital >= 100) return { 
    name: '黄帯', 
    color: '#FFD700',
    icon: '🟡',
    gradient: 'linear-gradient(45deg, #FFD700, #FFFF00)',
    glow: '0 0 20px rgba(255, 215, 0, 0.8)'
  };
  return { 
    name: '白帯', 
    color: '#FFFFFF',
    icon: '⚪',
    gradient: 'linear-gradient(45deg, #FFFFFF, #F5F5F5)',
    glow: '0 0 20px rgba(255, 255, 255, 0.8)'
  };
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
    case '神話級':
      return '#FFD700';
    case 'epic':
    case '史跡級':
      return '#9370DB';
    case 'rare':
    case '希少級':
      return '#4169E1';
    case 'uncommon':
    case '珍しい':
      return '#32CD32';
    case 'common':
    case '一般級':
    default:
      return '#FFFFFF';
  }
};

export const getDailyMissionRewards = (type: string): number => {
  const rewards = {
    worship: 25,
    explore: 15,
    cultural: 20,
    social: 10
  };
  return rewards[type as keyof typeof rewards] || 5;
};

export const getCurrentSeasonalEvent = () => {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return { 
      name: '桜祭り', 
      bonus: 50,
      icon: '🌸',
      multiplier: 1.5
    };
  } else if (month >= 6 && month <= 8) {
    return { 
      name: '夏祭り', 
      bonus: 30,
      icon: '🎆',
      multiplier: 1.3
    };
  } else if (month >= 9 && month <= 11) {
    return { 
      name: '紅葉狩り', 
      bonus: 40,
      icon: '🍁',
      multiplier: 1.4
    };
  } else {
    return { 
      name: '初詣', 
      bonus: 100,
      icon: '⛩️',
      multiplier: 2.0
    };
  }
};

export const getRandomWeather = (): string => {
  const weathers = ['sunny', 'cloudy', 'rainy', 'snowy'];
  return weathers[Math.floor(Math.random() * weathers.length)];
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Storage utilities
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('LocalStorage save error:', error);
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any = null): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('LocalStorage load error:', error);
    return defaultValue;
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

// Formatting utilities
export const formatCurrency = (amount: number, currency: string = '¥'): string => {
  return `${currency}${amount.toLocaleString('ja-JP')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};