// =============================================================================
// Format Utility Functions
// =============================================================================

// Format Japanese date
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
  if (exp >= 1000000) {
    return `${(exp / 1000000).toFixed(1)}M XP`;
  }
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}K XP`;
  }
  return `${exp} XP`;
};

// Format cultural capital display
export const formatCulturalCapital = (capital: number): string => {
  if (capital >= 1000000) {
    return `${(capital / 1000000).toFixed(1)}M`;
  }
  if (capital >= 1000) {
    return `${(capital / 1000).toFixed(1)}K`;
  }
  return capital.toString();
};

// Format belt rank based on cultural capital
export const formatBeltRank = (culturalCapital: number): string => {
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