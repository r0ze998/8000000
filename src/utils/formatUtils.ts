
// =============================================================================
// Format Utilities
// =============================================================================

// Format currency (Japanese Yen)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with Japanese locale
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ja-JP').format(num);
};

// Format date in Japanese format
export const formatDate = (date: Date | number): string => {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

// Format date and time
export const formatDateTime = (date: Date | number): string => {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Format duration in minutes and seconds
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format cultural capital with unit
export const formatCulturalCapital = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M 文化資本`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K 文化資本`;
  } else {
    return `${amount} 文化資本`;
  }
};

// Format percentage
export const formatPercentage = (value: number, total: number): string => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return `${percentage.toFixed(1)}%`;
};

// Format rarity text
export const formatRarity = (rarity: string): string => {
  const rarityMap = {
    common: '一般',
    rare: '希少',
    epic: '史詩',
    legendary: '伝説'
  };
  return rarityMap[rarity as keyof typeof rarityMap] || rarity;
};

// Format level display
export const formatLevel = (level: number): string => {
  return `レベル ${level}`;
};

// Format experience points
export const formatExperience = (exp: number): string => {
  return `${formatNumber(exp)} EXP`;
};

// Format streak display
export const formatStreak = (days: number): string => {
  return `${days}日連続`;
};
