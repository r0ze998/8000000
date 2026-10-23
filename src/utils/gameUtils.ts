
// Game mechanics and reward calculation utilities

export interface PrayerReward {
  culturalCapital: number;
  experience: number;
  specialBonus?: {
    type: string;
    value: number;
    description: string;
  };
}

export interface SeasonalEvent {
  name: string;
  bonus: number;
  icon?: string;
  description?: string;
}

export const PRAYER_MULTIPLIERS = {
  meditation: 1.2,
  gratitude: 1.1,
  protection: 1.0,
  prosperity: 1.3,
  healing: 1.15,
  wisdom: 1.25
} as const;

// Calculate enhanced reward with bonuses
export const calculateEnhancedReward = (
  baseCulturalCapital: number,
  baseExperience: number,
  bonuses: {
    seasonal?: number;
    weather?: number;
    timeOfDay?: number;
    streak?: number;
  }
): PrayerReward => {
  const totalBonus = (bonuses.seasonal || 0) + (bonuses.weather || 0) + (bonuses.timeOfDay || 0);
  const streakMultiplier = 1 + ((bonuses.streak || 0) * 0.1);
  
  const enhancedCulturalCapital = Math.floor((baseCulturalCapital + totalBonus) * streakMultiplier);
  const enhancedExperience = Math.floor((baseExperience + totalBonus * 0.5) * streakMultiplier);
  
  let specialBonus;
  if (bonuses.streak && bonuses.streak >= 7) {
    specialBonus = {
      type: 'streak',
      value: bonuses.streak * 10,
      description: `${bonuses.streak}日連続参拝ボーナス`
    };
  }
  
  return {
    culturalCapital: enhancedCulturalCapital,
    experience: enhancedExperience,
    specialBonus
  };
};

export const getSeasonalEvents = (): SeasonalEvent[] => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const events: SeasonalEvent[] = [];
  
  // New Year
  if ((month === 0 && day <= 7) || (month === 11 && day >= 28)) {
    events.push({
      name: '新年祭',
      bonus: 50,
      icon: '🎍',
      description: '新年の特別な加護'
    });
  }
  
  // Cherry blossom season
  if (month === 2 || month === 3) {
    events.push({
      name: '桜祭り',
      bonus: 30,
      icon: '🌸',
      description: '桜の季節の美しい祝福'
    });
  }
  
  // Summer festival
  if (month === 6 || month === 7) {
    events.push({
      name: '夏祭り',
      bonus: 25,
      icon: '🎆',
      description: '夏の祭りの活気'
    });
  }
  
  // Autumn leaves
  if (month === 9 || month === 10) {
    events.push({
      name: '紅葉祭',
      bonus: 35,
      icon: '🍂',
      description: '紅葉の季節の静寂'
    });
  }
  
  return events;
};

export const calculateLevelProgress = (experience: number) => {
  const currentLevel = Math.floor(Math.sqrt(experience / 100)) + 1;
  const nextLevelExp = Math.pow(currentLevel, 2) * 100;
  const currentLevelExp = Math.pow(currentLevel - 1, 2) * 100;
  const progress = (experience - currentLevelExp) / (nextLevelExp - currentLevelExp);
  
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    progress: Math.min(progress, 1),
    experienceToNext: nextLevelExp - experience,
    currentLevelExp,
    nextLevelExp
  };
};

// Weather system
export const getWeatherBonus = (weather: string): number => {
  const bonuses = {
    sunny: 10,
    cloudy: 5,
    rainy: 15,
    snowy: 20,
    clear: 8
  };
  return bonuses[weather as keyof typeof bonuses] || 0;
};

// Time-based bonuses
export const getTimeBonuses = () => {
  const hour = new Date().getHours();
  const bonuses = {
    morning: hour >= 6 && hour < 12 ? 15 : 0,
    afternoon: hour >= 12 && hour < 17 ? 5 : 0,
    evening: hour >= 17 && hour < 21 ? 10 : 0,
    night: hour >= 21 || hour < 6 ? 20 : 0
  };
  
  return bonuses;
};

// Streak calculations
export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays >= 30) return 100;
  if (streakDays >= 14) return 50;
  if (streakDays >= 7) return 25;
  if (streakDays >= 3) return 10;
  return 0;
};

// Achievement system
export const checkAchievements = (stats: {
  totalVisits: number;
  streak: number;
  culturalCapital: number;
  nftCount: number;
}) => {
  const achievements = [];
  
  if (stats.totalVisits >= 1) achievements.push('初参拝');
  if (stats.totalVisits >= 10) achievements.push('常連参拝者');
  if (stats.totalVisits >= 100) achievements.push('参拝マスター');
  
  if (stats.streak >= 7) achievements.push('一週間連続');
  if (stats.streak >= 30) achievements.push('一月連続');
  if (stats.streak >= 100) achievements.push('百日連続');
  
  if (stats.culturalCapital >= 1000) achievements.push('文化資本家');
  if (stats.culturalCapital >= 10000) achievements.push('文化大師');
  
  if (stats.nftCount >= 10) achievements.push('NFTコレクター');
  if (stats.nftCount >= 50) achievements.push('NFT愛好家');
  
  return achievements;
};
