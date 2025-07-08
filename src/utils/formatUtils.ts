

// =============================================================================
// Format Utility Functions
// =============================================================================

// 1) オーバーロード宣言
export function formatTime(value: number): string;
export function formatTime(value: string | Date): string;

// 2) 実装（既存関数）を number も受け取れる形に
export function formatTime(
  value: number | string | Date,
  inMilliseconds = false
): string {
  // ① 数値なら mm:ss
  if (typeof value === 'number') {
    const totalSeconds = inMilliseconds ? Math.floor(value / 1000) : value;
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // ② Date / 文字列なら HH:MM
  const d = new Date(value);
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

// Format currency (cultural capital)
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
  return exp.toLocaleString();
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format percentage
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format rarity display
export const formatRarity = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: 'コモン',
    uncommon: 'アンコモン',
    rare: 'レア',
    epic: 'エピック',
    legendary: 'レジェンダリー'
  };
  return rarityMap[rarity.toLowerCase()] || rarity;
};
