
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

export const calculateEnhancedReward = (
  duration: number, 
  prayerType: string,
  streakCount: number = 0,
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning'
): PrayerReward => {
  const baseRate = 10;
  const minutes = duration / (1000 * 60);
  
  // Base calculation
  const multiplier = PRAYER_MULTIPLIERS[prayerType as keyof typeof PRAYER_MULTIPLIERS] || 1.0;
  let culturalCapital = Math.floor(baseRate * minutes * multiplier);
  
  // Time of day bonus
  const timeBonus = {
    morning: 1.2,
    afternoon: 1.0,
    evening: 1.1,
    night: 0.9
  };
  
  culturalCapital *= timeBonus[timeOfDay];
  
  // Streak bonus
  const streakMultiplier = Math.min(1 + (streakCount * 0.1), 2.0);
  culturalCapital *= streakMultiplier;
  
  const experience = Math.floor(culturalCapital * 0.5);
  
  // Special bonus for significant streaks
  let specialBonus;
  if (streakCount >= 7) {
    specialBonus = {
      type: 'streak',
      value: Math.floor(culturalCapital * 0.2),
      description: `${streakCount}日連続参拝ボーナス`
    };
  }
  
  return {
    culturalCapital: Math.floor(culturalCapital),
    experience,
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
    experienceToNext: Math.max(0, nextLevelExp - experience),
    totalExperienceForNext: nextLevelExp - currentLevelExp
  };
};

export const getBeltRequirements = () => {
  return [
    { belt: '白帯', required: 0, color: '#FFFFFF' },
    { belt: '黄帯', required: 100, color: '#FDE047' },
    { belt: '橙帯', required: 300, color: '#FB923C' },
    { belt: '緑帯', required: 500, color: '#4ADE80' },
    { belt: '青帯', required: 1000, color: '#60A5FA' },
    { belt: '紫帯', required: 2000, color: '#A78BFA' },
    { belt: '茶帯', required: 4000, color: '#A3A3A3' },
    { belt: '黒帯', required: 6000, color: '#1F2937' },
    { belt: '赤帯', required: 8000, color: '#EF4444' },
    { belt: '金帯', required: 10000, color: '#FFD700' }
  ];
};
