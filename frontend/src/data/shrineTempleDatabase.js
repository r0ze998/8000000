// 神社・寺院データベース
export const SHRINE_TEMPLE_DATABASE = [
  // 東京都の有名神社
  {
    id: 'meiji-jingu',
    name: '明治神宮',
    type: 'shrine',
    prefecture: '東京都',
    city: '渋谷区',
    address: '東京都渋谷区代々木神園町1-1',
    deity: '明治天皇・昭憲皇太后',
    founded: 1920,
    description: '明治天皇と昭憲皇太后を祀る神社。初詣の参拝者数は日本一。',
    benefits: ['縁結び', '家内安全', '厄除け'],
    coordinates: { lat: 35.6762, lng: 139.6993 },
    culturalValue: 100,
    rarity: 'legendary'
  },
  {
    id: 'sensoji',
    name: '浅草寺',
    type: 'temple',
    prefecture: '東京都',
    city: '台東区',
    address: '東京都台東区浅草2-3-1',
    sect: '聖観音宗',
    founded: 645,
    description: '東京最古の寺院。雷門で有名。観音様を本尊とする。',
    benefits: ['商売繁盛', '学業成就', '健康祈願'],
    coordinates: { lat: 35.7148, lng: 139.7967 },
    culturalValue: 120,
    rarity: 'legendary'
  },
  {
    id: 'yasukuni-jinja',
    name: '靖国神社',
    type: 'shrine',
    prefecture: '東京都',
    city: '千代田区',
    address: '東京都千代田区九段北3-1-1',
    deity: '戦没者の英霊',
    founded: 1869,
    description: '明治維新以降の戦没者を祀る神社。桜の名所としても有名。',
    benefits: ['国家安泰', '平和祈願', '英霊顕彰'],
    coordinates: { lat: 35.6947, lng: 139.7433 },
    culturalValue: 90,
    rarity: 'rare'
  },
  {
    id: 'nezu-jinja',
    name: '根津神社',
    type: 'shrine',
    prefecture: '東京都',
    city: '文京区',
    address: '東京都文京区根津1-28-9',
    deity: '須佐之男命・大山咋命・誉田別命',
    founded: 1706,
    description: 'つつじ祭りで有名。江戸時代から続く歴史ある神社。',
    benefits: ['縁結び', '学業成就', '開運招福'],
    coordinates: { lat: 35.7280, lng: 139.7614 },
    culturalValue: 70,
    rarity: 'uncommon'
  },
  
  // 京都府の有名寺社
  {
    id: 'kiyomizu-dera',
    name: '清水寺',
    type: 'temple',
    prefecture: '京都府',
    city: '京都市',
    address: '京都府京都市東山区清水1-294',
    sect: '北法相宗',
    founded: 778,
    description: '「清水の舞台」で有名。世界遺産に登録されている。',
    benefits: ['縁結び', '安産祈願', '開運招福'],
    coordinates: { lat: 34.9949, lng: 135.7851 },
    culturalValue: 150,
    rarity: 'legendary'
  },
  {
    id: 'fushimi-inari',
    name: '伏見稲荷大社',
    type: 'shrine',
    prefecture: '京都府',
    city: '京都市',
    address: '京都府京都市伏見区深草藪之内町68',
    deity: '稲荷大神',
    founded: 711,
    description: '千本鳥居で有名。商売繁盛の神様として親しまれる。',
    benefits: ['商売繁盛', '五穀豊穣', '開運招福'],
    coordinates: { lat: 34.9671, lng: 135.7727 },
    culturalValue: 130,
    rarity: 'legendary'
  },
  {
    id: 'kinkaku-ji',
    name: '金閣寺（鹿苑寺）',
    type: 'temple',
    prefecture: '京都府',
    city: '京都市',
    address: '京都府京都市北区金閣寺町1',
    sect: '臨済宗相国寺派',
    founded: 1397,
    description: '金箔で覆われた舎利殿で有名。世界遺産に登録されている。',
    benefits: ['学業成就', '開運招福', '心願成就'],
    coordinates: { lat: 35.0394, lng: 135.7292 },
    culturalValue: 140,
    rarity: 'legendary'
  },
  
  // 奈良県の有名寺社
  {
    id: 'todai-ji',
    name: '東大寺',
    type: 'temple',
    prefecture: '奈良県',
    city: '奈良市',
    address: '奈良県奈良市雑司町406-1',
    sect: '華厳宗',
    founded: 745,
    description: '奈良の大仏で有名。世界遺産に登録されている。',
    benefits: ['学業成就', '病気平癒', '国家安泰'],
    coordinates: { lat: 34.6889, lng: 135.8398 },
    culturalValue: 160,
    rarity: 'legendary'
  },
  {
    id: 'kasuga-taisha',
    name: '春日大社',
    type: 'shrine',
    prefecture: '奈良県',
    city: '奈良市',
    address: '奈良県奈良市春日野町160',
    deity: '武甕槌命・経津主命・天児屋根命・比売神',
    founded: 768,
    description: '藤原氏の氏神。灯籠で有名。世界遺産に登録されている。',
    benefits: ['開運招福', '縁結び', '学業成就'],
    coordinates: { lat: 34.6690, lng: 135.8485 },
    culturalValue: 110,
    rarity: 'rare'
  },
  
  // 大阪府の有名寺社
  {
    id: 'sumiyoshi-taisha',
    name: '住吉大社',
    type: 'shrine',
    prefecture: '大阪府',
    city: '大阪市',
    address: '大阪府大阪市住吉区住吉2-9-89',
    deity: '住吉三神・神功皇后',
    founded: 211,
    description: '海の神様として親しまれる。住吉造の本殿が有名。',
    benefits: ['航海安全', '商売繁盛', '縁結び'],
    coordinates: { lat: 34.6185, lng: 135.4932 },
    culturalValue: 100,
    rarity: 'rare'
  },
  {
    id: 'shitennoji',
    name: '四天王寺',
    type: 'temple',
    prefecture: '大阪府',
    city: '大阪市',
    address: '大阪府大阪市天王寺区四天王寺1-11-18',
    sect: '和宗',
    founded: 593,
    description: '聖徳太子が建立した日本最古の寺院の一つ。',
    benefits: ['学業成就', '病気平癒', '家内安全'],
    coordinates: { lat: 34.6544, lng: 135.5168 },
    culturalValue: 120,
    rarity: 'rare'
  },
  
  // 神奈川県の有名寺社
  {
    id: 'kamakura-daibutsu',
    name: '高徳院（鎌倉大仏）',
    type: 'temple',
    prefecture: '神奈川県',
    city: '鎌倉市',
    address: '神奈川県鎌倉市長谷4-2-28',
    sect: '浄土宗',
    founded: 1252,
    description: '鎌倉大仏で有名。青銅製の阿弥陀如来坐像。',
    benefits: ['心願成就', '病気平癒', '開運招福'],
    coordinates: { lat: 35.3167, lng: 139.5356 },
    culturalValue: 110,
    rarity: 'rare'
  },
  {
    id: 'tsurugaoka-hachimangu',
    name: '鶴岡八幡宮',
    type: 'shrine',
    prefecture: '神奈川県',
    city: '鎌倉市',
    address: '神奈川県鎌倉市雪ノ下2-1-31',
    deity: '八幡神（応神天皇）',
    founded: 1063,
    description: '鎌倉幕府の鎮守。源頼朝ゆかりの神社。',
    benefits: ['勝負運', '出世開運', '厄除け'],
    coordinates: { lat: 35.3260, lng: 139.5563 },
    culturalValue: 90,
    rarity: 'rare'
  },
  
  // 愛知県の有名寺社
  {
    id: 'atsuta-jingu',
    name: '熱田神宮',
    type: 'shrine',
    prefecture: '愛知県',
    city: '名古屋市',
    address: '愛知県名古屋市熱田区神宮1-1-1',
    deity: '熱田大神（天照大神）',
    founded: '113年',
    description: '三種の神器の一つ草薙剣を祀る。',
    benefits: ['開運招福', '商売繁盛', '厄除け'],
    coordinates: { lat: 35.1281, lng: 136.9075 },
    culturalValue: 120,
    rarity: 'legendary'
  },
  
  // 島根県の有名神社
  {
    id: 'izumo-taisha',
    name: '出雲大社',
    type: 'shrine',
    prefecture: '島根県',
    city: '出雲市',
    address: '島根県出雲市大社町杵築東195',
    deity: '大国主大神',
    founded: '神代',
    description: '縁結びの神様として有名。日本最古の神社の一つ。',
    benefits: ['縁結び', '夫婦円満', '子宝祈願'],
    coordinates: { lat: 35.4018, lng: 132.6857 },
    culturalValue: 150,
    rarity: 'legendary'
  },
  
  // 三重県の有名神社
  {
    id: 'ise-jingu',
    name: '伊勢神宮',
    type: 'shrine',
    prefecture: '三重県',
    city: '伊勢市',
    address: '三重県伊勢市宇治館町1',
    deity: '天照大御神',
    founded: '垂仁天皇26年',
    description: '日本の総氏神。内宮と外宮からなる。',
    benefits: ['国家安泰', '五穀豊穣', '開運招福'],
    coordinates: { lat: 34.4554, lng: 136.7254 },
    culturalValue: 200,
    rarity: 'mythical'
  }
];

// レア度によるポイント倍率
export const RARITY_MULTIPLIERS = {
  common: 1.0,
  uncommon: 1.2,
  rare: 1.5,
  legendary: 2.0,
  mythical: 3.0
};

// 都道府県別の神社・寺院を取得
export const getShrinesByPrefecture = (prefecture) => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => shrine.prefecture === prefecture);
};

// タイプ別（神社・寺院）で取得
export const getShrinesByType = (type) => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => shrine.type === type);
};

// 名前で検索
export const searchShrines = (query) => {
  const lowerQuery = query.toLowerCase();
  return SHRINE_TEMPLE_DATABASE.filter(shrine => 
    shrine.name.toLowerCase().includes(lowerQuery) ||
    shrine.city.toLowerCase().includes(lowerQuery) ||
    shrine.prefecture.toLowerCase().includes(lowerQuery)
  );
};

// IDで取得
export const getShrineById = (id) => {
  return SHRINE_TEMPLE_DATABASE.find(shrine => shrine.id === id);
};

// 近くの神社・寺院を取得（簡易版）
export const getNearbyShines = (userLat, userLng, radiusKm = 50) => {
  return SHRINE_TEMPLE_DATABASE.filter(shrine => {
    const distance = calculateDistance(userLat, userLng, shrine.coordinates.lat, shrine.coordinates.lng);
    return distance <= radiusKm;
  });
};

// 2点間の距離を計算（ハヴァーサイン公式）
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};