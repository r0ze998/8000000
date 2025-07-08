

// =============================================================================
// Format Utility Functions
// =============================================================================

// Format time with overloads for different input types
export function formatTime(value: number): string;
export function formatTime(value: string | Date): string;
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

// Format experience points
export const formatExperience = (exp: number): string => {
  if (exp >= 1000000) return `${(exp / 1000000).toFixed(1)}M`;
  if (exp >= 1000) return `${(exp / 1000).toFixed(1)}K`;
  return exp.toString();
};

// Format cultural capital
export const formatCulturalCapital = (cc: number): string => {
  return cc.toLocaleString('ja-JP');
};
