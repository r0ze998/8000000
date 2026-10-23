
// =============================================================================
// Format Utilities
// =============================================================================

// Format numbers with appropriate suffixes
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format cultural capital
export const formatCulturalCapital = (amount: number): string => {
  return `${formatNumber(amount)} 文化資本`;
};

// Format experience points
export const formatExperience = (exp: number): string => {
  return `${formatNumber(exp)} EXP`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Format level progress
export const formatLevelProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP');
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format duration in human readable format
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
};

// Format rarity
export const formatRarity = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: '一般',
    uncommon: '珍しい',
    rare: 'レア',
    epic: 'エピック',
    legendary: '伝説'
  };
  return rarityMap[rarity] || rarity;
};
