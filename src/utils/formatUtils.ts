// =============================================================================
// Format Utility Functions
// =============================================================================

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Format cultural capital
export const formatCulturalCapital = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};

// Format experience points
export const formatExperience = (exp: number): string => {
  return `${exp.toLocaleString()} XP`;
};

// Format level progress
export const formatLevelProgress = (currentExp: number, levelExp: number): string => {
  const percentage = Math.min((currentExp / levelExp) * 100, 100);
  return `${percentage.toFixed(1)}%`;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time in MM:SS format - single declaration only
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format duration in human readable format
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}時間${minutes % 60}分`;
  }
  if (minutes > 0) {
    return `${minutes}分${seconds % 60}秒`;
  }
  return `${seconds}秒`;
};

// Format rarity with appropriate styling
export const formatRarity = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    'common': '一般',
    'rare': '珍しい',
    'epic': '稀有',
    'legendary': '伝説'
  };
  return rarityMap[rarity] || rarity;
};

// Format percentage
export const formatPercentage = (value: number, total: number): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};