


// =============================================================================
// Format Utility Functions
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

// Format cultural capital with icon
export const formatCulturalCapital = (amount: number): string => {
  return `${formatNumber(amount)} 🏛️`;
};

// Format experience points
export const formatExperience = (exp: number): string => {
  return `${formatNumber(exp)} XP`;
};

// Format level progress as percentage
export const formatLevelProgress = (progress: number): string => {
  return `${Math.round(progress)}%`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

// Format rarity with color coding
export const formatRarity = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: 'コモン',
    uncommon: 'アンコモン',
    rare: 'レア',
    epic: 'エピック',
    legendary: 'レジェンダリー'
  };
  return rarityMap[rarity] || rarity;
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format duration in human readable format
export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}分${seconds > 0 ? ` ${seconds}秒` : ''}`;
  }
  return `${seconds}秒`;
};

// Format date in Japanese format
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
