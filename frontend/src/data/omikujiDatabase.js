// おみくじデータベース - 伝統的な運勢占いシステム

// レアリティ設定
export const OMIKUJI_RARITIES = {
  大吉: { rate: 0.01, color: '#FFD700', particles: 'gold', sound: 'legendary' },
  中吉: { rate: 0.10, color: '#FF6B6B', particles: 'red', sound: 'epic' },
  小吉: { rate: 0.20, color: '#4ECDC4', particles: 'cyan', sound: 'rare' },
  吉: { rate: 0.30, color: '#95E1D3', particles: 'green', sound: 'common' },
  末吉: { rate: 0.20, color: '#C7CEEA', particles: 'purple', sound: 'common' },
  凶: { rate: 0.15, color: '#636E72', particles: 'gray', sound: 'bad' },
  大凶: { rate: 0.04, color: '#2D3436', particles: 'dark', sound: 'terrible' }
};

// 運勢カテゴリー
export const FORTUNE_CATEGORIES = {
  学業運: {
    icon: '📚',
    name: '学業運',
    description: '学問・試験・資格'
  },
  恋愛運: {
    icon: '💕',
    name: '恋愛運',
    description: '恋愛・結婚・人間関係'
  },
  金運: {
    icon: '💰',
    name: '金運',
    description: '金銭・商売・投資'
  },
  健康運: {
    icon: '🌿',
    name: '健康運',
    description: '健康・病気平癒・長寿'
  },
  仕事運: {
    icon: '💼',
    name: '仕事運',
    description: '仕事・昇進・転職'
  }
};

// 伝統的なおみくじメッセージ
export const OMIKUJI_MESSAGES = {
  大吉: {
    base: [
      '万事大吉なり。願い事すべて叶う時なり。',
      '天の恵み降り注ぐ。千載一遇の好機なり。',
      '神仏の加護篤し。大いなる幸運の訪れあり。',
      '運気最高潮なり。恐れず前進すべし。',
      '吉星照臨す。すべての道開かれん。'
    ],
    学業運: [
      '学問の神のご加護あり。合格間違いなし。',
      '知恵の扉開かれん。すべての試験に吉あり。',
      '文殊の知恵授かりて、学業大成就なり。'
    ],
    恋愛運: [
      '良縁まさに結ばれん。運命の出会いあり。',
      '愛の花満開なり。永遠の契り結ばれん。',
      '縁結びの神の祝福あり。幸せな未来待つ。'
    ],
    金運: [
      '財運天より降る。思わぬ臨時収入あり。',
      '金運絶頂なり。投資すべて吉と出る。',
      '商売大繁盛。富貴の道開かれん。'
    ],
    健康運: [
      '無病息災なり。百歳まで健康保たれん。',
      '病魔退散。活力みなぎる時なり。',
      '心身共に絶好調。何事も成し遂げられん。'
    ],
    仕事運: [
      '出世の道開かれん。大いなる成功あり。',
      '仕事運最高潮。すべての計画うまくいく。',
      '昇進確実なり。リーダーとして輝く時。'
    ]
  },
  
  中吉: {
    base: [
      '運気上昇中なり。努力実を結ぶ時。',
      '吉事多し。慎重に進めば大成功あり。',
      '良き流れあり。チャンスを逃すことなかれ。',
      '福運近づく。準備怠ることなかれ。',
      '幸運の兆しあり。積極的に行動すべし。'
    ],
    学業運: [
      '努力報われる時。合格の可能性高し。',
      '学業順調なり。油断せず精進すべし。',
      '知識深まる時期。良き師に出会えり。'
    ],
    恋愛運: [
      '恋の予感あり。積極的に行動すべし。',
      '良縁近し。心を開いて待つべし。',
      '愛情深まる時。素直な気持ち大切に。'
    ],
    金運: [
      '金運上昇中。堅実な行動で利益あり。',
      '臨時収入の予感。無駄遣い控えるべし。',
      '商売順調なり。新規開拓も吉。'
    ],
    健康運: [
      '健康運良好。体力充実の時なり。',
      '回復の兆しあり。養生怠らずべし。',
      '心身のバランス良し。運動始めるに吉。'
    ],
    仕事運: [
      '仕事運上昇。新しい挑戦に吉あり。',
      '評価高まる時。実力発揮のチャンスあり。',
      '昇進の可能性あり。人間関係大切に。'
    ]
  },
  
  小吉: {
    base: [
      '小さな幸せ集まりて、大きな喜びとなる。',
      '着実な進歩あり。焦らず進むべし。',
      '吉事あれど小なり。感謝の心忘れずに。',
      '運気安定なり。現状維持も大切なり。',
      '小さな成功重なる。コツコツと努力すべし。'
    ],
    学業運: [
      '学業まずまず。基礎固めに良き時期。',
      '理解深まる時。復習を大切にすべし。',
      '小さな進歩あり。継続は力なり。'
    ],
    恋愛運: [
      '恋愛運穏やか。友情から愛情へ発展も。',
      '相手を思いやる心が幸運を呼ぶ。',
      '小さな幸せ大切に。日常に愛あり。'
    ],
    金運: [
      '金運普通。節約により貯蓄増える。',
      '収入安定。計画的な使い方が吉。',
      '小さな利益あり。コツコツ貯めるべし。'
    ],
    健康運: [
      '健康運普通。規則正しい生活が大切。',
      '体調安定。無理は禁物なり。',
      '小さな不調に注意。早めの対処が吉。'
    ],
    仕事運: [
      '仕事運平穏。地道な努力が評価される。',
      '現状維持が吉。スキルアップの好機。',
      '小さな成果あり。チームワーク大切に。'
    ]
  },
  
  吉: {
    base: [
      '平穏無事なり。日々の幸せに感謝すべし。',
      '運気普通なり。努力次第で向上あり。',
      '現状に満足すべし。欲張らずに進むべし。',
      '安定の時期。基礎を固めるに良し。',
      '吉凶相半ば。慎重な判断必要なり。'
    ],
    学業運: [
      '学業平常。継続的な努力が必要。',
      '理解に時間かかるも、諦めずに進むべし。',
      '基礎学習に適す。焦らず着実に。'
    ],
    恋愛運: [
      '恋愛運普通。現状維持が最善なり。',
      '相手との対話大切に。理解深まる時。',
      '急がず焦らず。自然な流れに任せるべし。'
    ],
    金運: [
      '金運平常。収支のバランス大切に。',
      '大きな出費控えるべし。貯蓄に励むべし。',
      '堅実な金銭管理で安定を保つべし。'
    ],
    健康運: [
      '健康運普通。予防に努めるべし。',
      '疲労溜めずに。適度な休息必要。',
      '生活習慣の見直し時期。改善の好機。'
    ],
    仕事運: [
      '仕事運平常。現在の職務に専念すべし。',
      '大きな変化は避けるべし。スキル磨くべし。',
      '周囲との協調大切。チーム力で乗り切る。'
    ]
  },
  
  末吉: {
    base: [
      '今は耐える時。やがて運気上向く。',
      '小さな困難あれど、乗り越えられる。',
      '辛抱強く待てば、吉事訪れん。',
      '試練の時なれど、成長の機会なり。',
      '運気低調なれど、希望を失うなかれ。'
    ],
    学業運: [
      '学業やや困難。基礎から見直すべし。',
      '理解に苦しむも、諦めずに続けるべし。',
      '苦手科目に向き合う時。克服の好機。'
    ],
    恋愛運: [
      '恋愛運低調。自分磨きに専念すべし。',
      '相手との距離感大切に。焦りは禁物。',
      '今は準備の時。良縁は必ず訪れる。'
    ],
    金運: [
      '金運やや悪し。倹約に努めるべし。',
      '出費かさむ時期。計画的な支出必要。',
      '投資は控えるべし。守りの姿勢大切。'
    ],
    健康運: [
      '健康注意。無理は禁物なり。',
      '疲労蓄積の恐れ。十分な休息必要。',
      '体調管理徹底すべし。予防が最善。'
    ],
    仕事運: [
      '仕事運やや低調。現状維持に努める。',
      '困難あれど、経験として活かすべし。',
      '批判に耐える時。自己研鑽に励むべし。'
    ]
  },
  
  凶: {
    base: [
      '運気低迷なり。慎重に行動すべし。',
      '困難多き時期。忍耐強く乗り切るべし。',
      '試練の時なり。これも修行と思うべし。',
      '凶事あれど、心持ち次第で転機となる。',
      '今は守りの時。新しいことは控えるべし。'
    ],
    学業運: [
      '学業困難多し。基礎の見直し必要。',
      '成績低迷の恐れ。努力倍増すべし。',
      '集中力欠如に注意。環境整えるべし。'
    ],
    恋愛運: [
      '恋愛運凶。トラブル注意すべし。',
      '誤解生じやすき時。言葉慎むべし。',
      '今は恋愛より自己成長に専念すべし。'
    ],
    金運: [
      '金運凶。大きな損失の恐れあり。',
      '詐欺に注意。うまい話に乗るなかれ。',
      '借金は絶対に避けるべし。倹約第一。'
    ],
    健康運: [
      '健康運凶。病気・怪我に要注意。',
      '無理は大病の元。休息最優先すべし。',
      '定期健診受けるべし。早期発見大切。'
    ],
    仕事運: [
      '仕事運凶。トラブル多発の恐れ。',
      '人間関係に亀裂。言動慎むべし。',
      '転職は避けるべし。現職で耐える時。'
    ]
  },
  
  大凶: {
    base: [
      '大いなる試練の時。心を強く持つべし。',
      '凶事重なれど、必ず夜明けは来る。',
      '最悪の時期なれど、ここが底なり。',
      '神仏に祈り、厄除けに努めるべし。',
      '今は何もせず、嵐が過ぎるを待つべし。'
    ],
    学業運: [
      '学業大凶。一から出直す覚悟必要。',
      '試験は延期すべし。準備不足明らか。',
      '今は学ぶより、心身の回復優先すべし。'
    ],
    恋愛運: [
      '恋愛大凶。別離の危機あり。',
      '新しい出会いは避けるべし。災い招く。',
      '今は一人の時間を大切にすべし。'
    ],
    金運: [
      '金運最悪。破産の危機に注意。',
      '投資・賭け事は絶対禁止。大損確実。',
      '最小限の支出に留め、守りに徹すべし。'
    ],
    健康運: [
      '健康大凶。重病の恐れあり。',
      '即座に健康診断受けるべし。手遅れになる前に。',
      '心身共に限界。完全休養必要なり。'
    ],
    仕事運: [
      '仕事運最悪。失職の危機あり。',
      '重大ミスに注意。取り返しつかぬ事態も。',
      '今は目立たず、嵐が過ぎるを待つべし。'
    ]
  }
};

// 季節の特別メッセージ
export const SEASONAL_MESSAGES = {
  新年: {
    period: { start: '01-01', end: '01-15' },
    messages: {
      大吉: '新春大吉。今年一年、幸多かれと祈る。',
      中吉: '良き年の始まり。希望に満ちた一年となる。',
      小吉: '穏やかな年明け。着実な一年となる。',
      吉: '平穏な正月。無事是名馬なり。',
      末吉: '今は静かな始まり。やがて花開く。',
      凶: '年初めより試練あり。厄払い必要。',
      大凶: '厄年の始まり。神仏の加護を求めるべし。'
    }
  },
  
  節分: {
    period: { start: '02-01', end: '02-04' },
    messages: {
      大吉: '福は内、鬼は外。大いなる福来たる。',
      中吉: '邪気払われ、良き運気流れ込む。',
      小吉: '豆まきの功徳あり。小さな福授かる。',
      吉: '節分の清め効果あり。運気安定す。',
      末吉: '鬼退治の時。やがて福来たる。',
      凶: '邪気強し。しっかり厄払いすべし。',
      大凶: '鬼門開く。至急厄除け必要なり。'
    }
  },
  
  桜花: {
    period: { start: '03-20', end: '04-15' },
    messages: {
      大吉: '桜花爛漫。人生の春到来なり。',
      中吉: '花開く時期。チャンス多く訪れる。',
      小吉: '小さな花も美し。日々に喜びあり。',
      吉: '桜のごとく、今を大切に生きるべし。',
      末吉: 'つぼみの時期。やがて花開く。',
      凶: '花散る如し。無常を知る時。',
      大凶: '嵐に散る花。試練の春なり。'
    }
  },
  
  七夕: {
    period: { start: '07-01', end: '07-07' },
    messages: {
      大吉: '織姫彦星の祝福。願い事すべて叶う。',
      中吉: '星に願いを。良縁結ばれる予感。',
      小吉: '小さな願い叶う。感謝の心大切に。',
      吉: '七夕の夜、希望の星輝く。',
      末吉: '雲に隠れし星。やがて輝く時来る。',
      凶: '天の川渡れず。願い届かぬ時。',
      大凶: '星の導き失う。迷いの時期なり。'
    }
  },
  
  お盆: {
    period: { start: '08-13', end: '08-16' },
    messages: {
      大吉: '先祖の加護篤し。大いなる守りあり。',
      中吉: 'ご先祖様の導きあり。正しき道示される。',
      小吉: '供養の功徳あり。心安らかなり。',
      吉: '先祖に感謝。平穏な日々続く。',
      末吉: '迷える魂に祈りを。やがて道開ける。',
      凶: '先祖の戒めあり。行いを正すべし。',
      大凶: '因縁深し。しっかり供養すべし。'
    }
  },
  
  紅葉: {
    period: { start: '10-15', end: '11-30' },
    messages: {
      大吉: '錦秋の如く、人生も彩り豊かなり。',
      中吉: '実りの秋。努力の成果現れる。',
      小吉: '紅葉の美しさに、小さな幸せ見出す。',
      吉: '秋の実り。地道な努力報われる。',
      末吉: '落ち葉の如く。一度落ちてまた芽吹く。',
      凶: '枯れ葉舞う。物事の終わりを受け入れる時。',
      大凶: '木枯らし吹く。厳しい冬への備え必要。'
    }
  },
  
  年末: {
    period: { start: '12-20', end: '12-31' },
    messages: {
      大吉: '良き締めくくり。来年更なる飛躍あり。',
      中吉: '一年の感謝を胸に、新たな年へ。',
      小吉: '無事年越し。小さな幸せに感謝。',
      吉: '平穏に年を終える。来年に期待。',
      末吉: '今年の苦労、来年の糧となる。',
      凶: '年末の試練。心して乗り切るべし。',
      大凶: '大晦日の厄。年越しの祓い必須。'
    }
  }
};

// おみくじ引く際の和歌（ランダム選択用）
export const OMIKUJI_POEMS = [
  {
    text: '朝日さす 峰の白雪 とけぬれば 谷の小川に 春風ぞ吹く',
    meaning: '困難な状況も必ず解決し、新しい季節が訪れます'
  },
  {
    text: '山高み 雲のいでくる 春の日は 花の香りも ひとしお深し',
    meaning: '高い目標に向かえば、より大きな喜びが得られます'
  },
  {
    text: '月影の いたらぬ里は なけれども ながむる人の 心にぞすむ',
    meaning: '幸運は誰にでも平等に訪れますが、それに気づく心が大切です'
  },
  {
    text: '露の身は ここかしこにて 消えぬとも 心は同じ 花の下かな',
    meaning: '形あるものは移り変わっても、大切な思いは変わりません'
  },
  {
    text: '吹く風の 色はなけれど 秋来れば 木々の梢に あらわれにけり',
    meaning: '見えないものも、時が来れば必ず形となって現れます'
  }
];

// コレクション用の特殊おみくじ
export const SPECIAL_OMIKUJI = {
  神託: {
    id: 'shintaku',
    name: '神託みくじ',
    rarity: 'mythical',
    unlockCondition: '100回おみくじを引く',
    message: '神の声届く。汝の道は開かれたり。',
    effect: '全運勢+50%ボーナス'
  },
  
  龍神: {
    id: 'ryujin',
    name: '龍神みくじ',
    rarity: 'legendary',
    unlockCondition: '大吉を10回引く',
    message: '龍神の加護を得たり。天高く昇る時来たれり。',
    effect: '金運大幅アップ'
  },
  
  月読: {
    id: 'tsukuyomi',
    name: '月読みくじ',
    rarity: 'legendary',
    unlockCondition: '満月の夜に引く',
    message: '月の導きあり。隠されし真実明らかになる。',
    effect: '恋愛運特別ボーナス'
  },
  
  桜吹雪: {
    id: 'sakurafubuki',
    name: '桜吹雪みくじ',
    rarity: 'epic',
    unlockCondition: '桜の季節に引く',
    message: '桜花の祝福。新しい始まりに幸あれ。',
    effect: '全体運上昇'
  },
  
  雷神: {
    id: 'raijin',
    name: '雷神みくじ',
    rarity: 'epic',
    unlockCondition: '雷雨の日に引く',
    message: '雷神の力宿る。障害を打ち破る力を得る。',
    effect: '仕事運ブースト'
  }
};

// おみくじコレクションの実績
export const OMIKUJI_ACHIEVEMENTS = {
  初心者: {
    id: 'beginner',
    name: 'おみくじ初心者',
    description: '初めておみくじを引く',
    requirement: 1,
    reward: '称号：運試し初心者'
  },
  
  常連: {
    id: 'regular',
    name: 'おみくじ常連',
    description: '10回おみくじを引く',
    requirement: 10,
    reward: '称号：運勢の探求者'
  },
  
  達人: {
    id: 'master',
    name: 'おみくじ達人',
    description: '50回おみくじを引く',
    requirement: 50,
    reward: '称号：運命の達人'
  },
  
  伝説: {
    id: 'legend',
    name: 'おみくじ伝説',
    description: '100回おみくじを引く',
    requirement: 100,
    reward: '称号：運勢の支配者'
  },
  
  幸運児: {
    id: 'lucky',
    name: '幸運児',
    description: '大吉を引く',
    requirement: 'special',
    reward: '称号：選ばれし者'
  },
  
  不屈: {
    id: 'resilient',
    name: '不屈の精神',
    description: '大凶を引いても諦めない',
    requirement: 'special',
    reward: '称号：不屈の魂'
  },
  
  全運制覇: {
    id: 'complete',
    name: '全運制覇',
    description: 'すべての運勢を引く',
    requirement: 'special',
    reward: '称号：運命の収集家'
  },
  
  季節巡り: {
    id: 'seasonal',
    name: '季節巡り',
    description: 'すべての季節でおみくじを引く',
    requirement: 'special',
    reward: '称号：四季の巡礼者'
  }
};

// NFTメタデータ生成関数
export const generateOmikujiNFTMetadata = (omikuji, shrineData) => {
  const timestamp = new Date().toISOString();
  const seasonalEvent = getCurrentSeason();
  
  return {
    name: `${shrineData.name} - ${omikuji.fortune}みくじ`,
    description: `${shrineData.name}で引いた${omikuji.fortune}のおみくじ。${omikuji.message}`,
    image: 'ipfs://omikuji-placeholder', // 実際のIPFSハッシュに置き換え
    attributes: [
      {
        trait_type: 'Fortune',
        value: omikuji.fortune
      },
      {
        trait_type: 'Shrine',
        value: shrineData.name
      },
      {
        trait_type: 'Category',
        value: omikuji.category
      },
      {
        trait_type: 'Rarity',
        value: OMIKUJI_RARITIES[omikuji.fortune].rate
      },
      {
        trait_type: 'Season',
        value: seasonalEvent || 'Regular'
      },
      {
        trait_type: 'Date',
        value: timestamp
      },
      {
        trait_type: 'Poem',
        value: omikuji.poem?.text || ''
      }
    ],
    properties: {
      fortune_level: omikuji.fortune,
      shrine_id: shrineData.id,
      seasonal_bonus: seasonalEvent ? true : false,
      collection_number: omikuji.collectionNumber || 0
    }
  };
};

// 現在の季節イベントを取得
export const getCurrentSeason = () => {
  const now = new Date();
  const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  for (const [season, data] of Object.entries(SEASONAL_MESSAGES)) {
    if (monthDay >= data.period.start && monthDay <= data.period.end) {
      return season;
    }
  }
  
  return null;
};

// おみくじを引く関数
export const drawOmikuji = (shrineType = null) => {
  // レアリティに基づいて運勢を決定
  const random = Math.random();
  let accumulator = 0;
  let fortune = '吉'; // デフォルト
  
  for (const [key, value] of Object.entries(OMIKUJI_RARITIES)) {
    accumulator += value.rate;
    if (random <= accumulator) {
      fortune = key;
      break;
    }
  }
  
  // カテゴリーを決定（神社タイプに基づく）
  const categories = Object.keys(FORTUNE_CATEGORIES);
  let category = shrineType || categories[Math.floor(Math.random() * categories.length)];
  
  // メッセージを選択
  const baseMessages = OMIKUJI_MESSAGES[fortune].base;
  const categoryMessages = OMIKUJI_MESSAGES[fortune][category] || [];
  const allMessages = [...baseMessages, ...categoryMessages];
  const message = allMessages[Math.floor(Math.random() * allMessages.length)];
  
  // 季節メッセージをチェック
  const currentSeason = getCurrentSeason();
  let seasonalMessage = null;
  if (currentSeason && SEASONAL_MESSAGES[currentSeason].messages[fortune]) {
    seasonalMessage = SEASONAL_MESSAGES[currentSeason].messages[fortune];
  }
  
  // 和歌を選択
  const poem = OMIKUJI_POEMS[Math.floor(Math.random() * OMIKUJI_POEMS.length)];
  
  return {
    fortune,
    category,
    message,
    seasonalMessage,
    poem,
    rarity: OMIKUJI_RARITIES[fortune],
    timestamp: new Date().toISOString()
  };
};