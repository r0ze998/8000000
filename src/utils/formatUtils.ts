// =============================================================================
// Format Utility Functions
// =============================================================================

// Format number with commas for better readability
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Format cultural capital display
export const formatCulturalCapital = (capital: number): string => {
  if (capital >= 1000000) {
    return `${(capital / 1000000).toFixed(1)}M`;
  } else if (capital >= 1000) {
    return `${(capital / 1000).toFixed(1)}K`;
  } else {
    return capital.toString();
  }
};

// Format percentage display
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
};

// Format date for display
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format experience points display
export const formatExperience = (exp: number): string => {
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}K XP`;
  }
  return `${exp} XP`;
};

// Format rarity for display
export const formatRarity = (rarity: string): string => {
  const rarityMap: { [key: string]: string } = {
    'common': '一般',
    'uncommon': '珍しい',
    'rare': 'レア',
    'epic': 'エピック',
    'legendary': '伝説'
  };

  return rarityMap[rarity.toLowerCase()] || rarity;
};

// Format prayer type for display
export const formatPrayerType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'health': '健康祈願',
    'success': '成功祈願',
    'love': '恋愛成就',
    'protection': '厄除け',
    'wisdom': '学業成就'
  };

  return typeMap[type] || type;
};

// Format belt rank for display
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