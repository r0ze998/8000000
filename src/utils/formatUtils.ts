
// =============================================================================
// Format Utility Functions
// =============================================================================

// Format currency display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format large numbers with units
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format date in Japanese format
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format experience points display
export const formatExperience = (exp: number): string => {
  return `${exp.toLocaleString()} EXP`;
};

// Format cultural capital display
export const formatCulturalCapital = (capital: number): string => {
  return `${capital.toLocaleString()} 文化資本`;
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Get rank display
export const getRankDisplay = (rank: number): string => {
  if (rank === 1) return '🥇 1位';
  if (rank === 2) return '🥈 2位';
  if (rank === 3) return '🥉 3位';
  return `${rank}位`;
};

// Format streak display
export const formatStreak = (days: number): string => {
  return `${days}日連続`;
};

// Get level badge
export const getLevelBadge = (level: number): string => {
  if (level >= 50) return '🏆';
  if (level >= 30) return '💎';
  if (level >= 20) return '⭐';
  if (level >= 10) return '🌟';
  return '🔰';
};

// Get cultural belt display
export const getCulturalBeltDisplay = (culturalCapital: number): string => {
  if (culturalCapital >= 10000) return '金帯';
  if (culturalCapital >= 8000) return '赤帯';
  if (culturalCapital >= 6000) return '黒帯';
  if (culturalCapital >= 4000) return '茶帯';
  if (culturalCapital >= 2000) return '紫帯';
  if (culturalCapital >= 1000) return '青帯';
  if (culturalCapital >= 500) return '緑帯';
  if (culturalCapital >= 300) return '橙帯';
  if (culturalCapital >= 100) return '黄帯';
  return '白帯';
};

// Function overloads for formatTime
export function formatTime(value: number): string;
export function formatTime(value: string | Date): string;

// Format time - handles both number (seconds) and Date/string
export function formatTime(
  value: number | string | Date,
  inMilliseconds = false
): string {
  // If number, format as mm:ss
  if (typeof value === 'number') {
    const totalSeconds = inMilliseconds ? Math.floor(value / 1000) : value;
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // If Date/string, format as HH:MM
  const d = new Date(value);
  return d.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
