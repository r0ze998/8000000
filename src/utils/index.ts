// =============================================================================
// Utility Functions
// =============================================================================

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format cultural capital with commas
export const formatCulturalCapital = (amount: number): string => {
  return amount.toLocaleString();
};

// Calculate level from cultural capital
export const calculateLevel = (culturalCapital: number): number => {
  return Math.floor(culturalCapital / 100) + 1;
};

// Calculate experience to next level
export const getExperienceToNextLevel = (culturalCapital: number): number => {
  const currentLevel = calculateLevel(culturalCapital);
  const requiredForNextLevel = currentLevel * 100;
  return requiredForNextLevel - culturalCapital;
};

// =============================================================================
// Game Logic
// =============================================================================

// Calculate base reward for worship session
export const calculateBaseReward = (duration: number, prayerType?: string) => {
  const baseRate = 10; // Base cultural capital per minute
  const minutes = duration / 60;

  // Prayer type multipliers
  const multiplier = prayerType === 'gratitude' ? 1.2 :
                    prayerType === 'healing' ? 1.1 :
                    prayerType === 'wisdom' ? 1.15 : 1.0;

  const culturalCapital = Math.floor(minutes * baseRate * multiplier);
  const experience = Math.floor(culturalCapital * 0.5);

  return {
    culturalCapital,
    experience
  };
};

// =============================================================================
// Seasonal and Environmental
// =============================================================================

// Get current seasonal event
export const getCurrentSeasonalEvent = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // New Year (January 1-7)
  if (month === 1 && day <= 7) {
    return {
      name: 'New Year',
      emoji: '🎍',
      bonus: 0.5
    };
  }

  // Cherry Blossom (March 20 - May 15)
  if ((month === 3 && day >= 20) || month === 4 || (month === 5 && day <= 15)) {
    return {
      name: 'Cherry Blossom',
      emoji: '🌸',
      bonus: 0.3
    };
  }

  // Summer Festival (July 1 - August 31)
  if (month === 7 || month === 8) {
    return {
      name: 'Summer Festival',
      emoji: '🎆',
      bonus: 0.2
    };
  }

  // Autumn Leaves (September 15 - November 30)
  if ((month === 9 && day >= 15) || month === 10 || month === 11) {
    return {
      name: 'Autumn Leaves',
      emoji: '🍁',
      bonus: 0.25
    };
  }

  return null;
};

// Get time of day
export const getTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Get random weather (for simulation)
export const getRandomWeather = () => {
  const conditions = [
    { condition: 'sunny', emoji: '☀️', bonus: 0.1 },
    { condition: 'cloudy', emoji: '☁️', bonus: 0 },
    { condition: 'rainy', emoji: '🌧️', bonus: 0.05 },
    { condition: 'snowy', emoji: '❄️', bonus: 0.15 }
  ];

  return conditions[Math.floor(Math.random() * conditions.length)];
};

// =============================================================================
// Debug Utilities
// =============================================================================

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

export const debugLog = (message: string, ...args: any[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// =============================================================================
// Data Validation
// =============================================================================

export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};