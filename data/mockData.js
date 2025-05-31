/**
 * Mock Data for Development
 * 開発用のサンプルデータ
 */

export const initialMockData = {
  visits: [
    { 
      id: 1, 
      shrineName: '明治神宮', 
      date: '2024-05-30', 
      streakCount: 7 
    },
    { 
      id: 2, 
      shrineName: '浅草寺', 
      date: '2024-05-29', 
      streakCount: 6 
    },
    { 
      id: 3, 
      shrineName: '伏見稲荷大社', 
      date: '2024-05-28', 
      streakCount: 5 
    }
  ],
  nfts: [
    {
      id: 1,
      type: 'omamori',
      title: '雨の日の静寂な参拝',
      shrine: '明治神宮',
      rarity: 'rare',
      story: '雨粒が木々を優しく叩く音が、心を落ち着かせてくれました...',
      date: '2024-05-30',
      culturalValue: 850
    }
  ],
  sbts: [
    { 
      id: 1, 
      roleType: 'kannushi', 
      shrine: '明治神宮', 
      contributionLevel: 'advanced', 
      governanceWeight: 100 
    }
  ],
  poaps: [
    { 
      id: 1, 
      eventName: '春の神社めぐりイベント', 
      contributionLevel: 'organizer', 
      date: '2024-04-15' 
    }
  ],
  culturalScore: 12500
};

export const defaultUserSettings = {
  currentStreak: 7,
  todayVisited: false,
  level: 1,
  totalVisits: 3
};