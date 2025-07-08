
// =============================================================================
// Format Utility Functions
// =============================================================================

// Format time with overloads
export function formatTime(value: number): string;
export function formatTime(value: string | Date): string;
export function formatTime(
  value: number | string | Date,
  inMilliseconds = false
): string {
  // Handle number (seconds/milliseconds)
  if (typeof value === 'number') {
    const totalSeconds = inMilliseconds ? Math.floor(value / 1000) : value;
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // Handle Date/string (HH:MM format)
  const d = new Date(value);
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

// Format date to Japanese format
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ja-JP');
};

// Format percentage
export const formatPercentage = (value: number, total: number): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

// Format duration in human-readable format
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
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

// Format cultural capital
export const formatCulturalCapital = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return formatNumber(amount);
};

// Format experience points
export const formatExperience = (exp: number): string => {
  return `${formatNumber(exp)} EXP`;
};

// Format level display
export const formatLevel = (level: number): string => {
  return `Lv.${level}`;
};

// Format rarity display
export const formatRarity = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: '一般',
    rare: '珍しい',
    epic: '稀有',
    legendary: '伝説'
  };
  return rarityMap[rarity] || rarity;
};
