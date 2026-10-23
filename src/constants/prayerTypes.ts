// 祈りの種類定数

export interface PrayerType {
  id: string;
  title: string;
  description: string;
  message: string;
  duration: number;
  color: string;
  emoji: string;
}

export const PRAYER_TYPES: PrayerType[] = [
  {
    id: 'gratitude',
    title: '🌸 感謝の祈り',
    description: '今日あなたが感謝していることに心を向けましょう',
    message: '深く感謝の気持ちを込めて、3つの感謝を心の中で唱えましょう...',
    duration: 180, // 3分
    color: '#FFB7C5',
    emoji: '🌸'
  },
  {
    id: 'wishes',
    title: '🎯 願いの祈り',
    description: 'あなたの目標や願いが叶うよう祈りましょう',
    message: 'あなたの願いと目標に向けて、心からの祈りを捧げましょう...',
    duration: 240, // 4分
    color: '#87CEEB',
    emoji: '🎯'
  },
  {
    id: 'mindfulness',
    title: '💭 今に集中する祈り',
    description: '今この瞬間に意識を向け、心を落ち着かせましょう',
    message: '今の感情や状況をありのまま受け入れ、心の平安を祈りましょう...',
    duration: 300, // 5分
    color: '#90EE90',
    emoji: '💭'
  },
  {
    id: 'peace',
    title: '🕊️ 平和の祈り',
    description: '心の平安と世界の平和を祈りましょう',
    message: '心からの平安と、すべての人の幸せを祈りましょう...',
    duration: 360, // 6分
    color: '#DDA0DD',
    emoji: '🕊️'
  },
  {
    id: 'healing',
    title: '🌿 癒しの祈り',
    description: '心身の癒しと健康を祈りましょう',
    message: '心と体の癒しを求め、健やかな日々を祈りましょう...',
    duration: 240, // 4分
    color: '#98FB98',
    emoji: '🌿'
  }
];