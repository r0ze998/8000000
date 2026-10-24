// 境内図鑑（見どころ）のデータ。
// facts は出典付きの事実（kind: 'folk' は「俗説・諸説」として区別して表示する）。
// look はこのアプリによる「探し方の案内」で、事実の主張ではない。

export type FeatureCategory = 'torii' | 'guardian' | 'building' | 'precinct';

export interface Fact {
  text: string;
  sources: string[];
  kind?: 'fact' | 'folk';
}

export interface Feature {
  id: string;
  category: FeatureCategory;
  name: string;
  kana: string;
  /** ひとことで言うと何か（図鑑の一覧に出す） */
  gist: string;
  facts: Fact[];
  /** 現地で探すときの案内（アプリの創作・助言） */
  look: string[];
  /** 見分け稽古で同じ問題に並べるグループ */
  drillGroup?: string;
  /** 見分け稽古の問題文で使う、見分けるための手がかり */
  drillCue?: string;
}

export const CATEGORY_LABEL: Record<FeatureCategory, string> = {
  torii: '鳥居',
  guardian: '狛犬と神使',
  building: '社殿のかたち',
  precinct: '境内のもの',
};

export const CATEGORY_ORDER: FeatureCategory[] = ['torii', 'guardian', 'building', 'precinct'];

export const FEATURES: Feature[] = [
  // ── 鳥居 ────────────────────────────────
  {
    id: 'torii-shinmei',
    category: 'torii',
    name: '神明鳥居',
    kana: 'しんめいとりい',
    gist: 'まっすぐな線だけでできた、いちばん簡素な形の鳥居',
    facts: [
      {
        text: '鳥居は神明鳥居と明神鳥居に大別される。神明鳥居は笠木（いちばん上の横木）に反りがなく、その下の島木もない直線的な形。',
        sources: ['wp-torii'],
      },
      {
        text: '神明鳥居では、貫（2本目の横木）が柱の外へ突き出さない形が多い。',
        sources: ['wp-torii'],
      },
    ],
    look: [
      'いちばん上の横木が、定規で引いたようにまっすぐか見てみましょう。',
      '2本目の横木の端が、柱の外にはみ出していないかを確かめます。',
    ],
    drillGroup: 'torii',
    drillCue: '上の横木がまっすぐで、2本目の横木が柱の外に出ていない',
  },
  {
    id: 'torii-myojin',
    category: 'torii',
    name: '明神鳥居',
    kana: 'みょうじんとりい',
    gist: '上の横木が両端で反り上がる、よく見かける形の鳥居',
    facts: [
      {
        text: '明神系の鳥居は、笠木の下に島木が重なり、両端が反り上がる（反り増し）。',
        sources: ['wp-torii'],
      },
      {
        text: '明神鳥居では貫が柱の外へ突き出す。笠木と貫の間に額束（扁額をかける短い柱）が入ることもある。',
        sources: ['wp-torii'],
      },
    ],
    look: [
      '上の横木の両端が、ゆるやかに空へ反っているか見てみましょう。',
      '真ん中に神社の名前を書いた額がかかっていることがあります。',
    ],
    drillGroup: 'torii',
    drillCue: '上の横木の両端が反り上がり、2本目の横木が柱の外に出ている',
  },
  {
    id: 'torii-ryobu',
    category: 'torii',
    name: '両部鳥居',
    kana: 'りょうぶとりい',
    gist: '柱の前後に低い控えの柱が付いた、どっしりした鳥居',
    facts: [
      {
        text: '両部鳥居は、明神鳥居の2本の柱それぞれの前後に稚児柱（控柱）を添えた形をしている。',
        sources: ['wp-torii'],
      },
      {
        text: '嚴島神社の海上に立つ大鳥居は、両部鳥居の例として知られる。',
        sources: ['wp-torii', 'wp-itsukushima'],
      },
    ],
    look: [
      '鳥居を横から見て、太い柱の前後に低い柱が付いていないか探しましょう。',
    ],
    drillGroup: 'torii',
    drillCue: '太い柱の前後に、低い控えの柱が付いている',
  },

  // ── 狛犬と神使 ────────────────────────────
  {
    id: 'komainu-aun',
    category: 'guardian',
    name: '阿吽の狛犬',
    kana: 'あうんのこまいぬ',
    gist: '口を開けた像と閉じた像で、一対になっている狛犬',
    facts: [
      {
        text: '狛犬は多くの場合一対で置かれ、一方は口を開いた「阿形」、もう一方は口を閉じた「吽形」となっている。',
        sources: ['wp-komainu'],
      },
    ],
    look: [
      '参道の左右の像の口元を見比べてみましょう。開いているのはどちら側でしたか。',
      '台座に、奉納された年や人の名が刻まれていることがあります。',
    ],
  },
  {
    id: 'komainu-horn',
    category: 'guardian',
    name: '角のある狛犬',
    kana: 'つののあるこまいぬ',
    gist: '頭に一本角がある像。角のない側と見比べると面白い',
    facts: [
      {
        text: '平安時代の文献では、一方を「獅子」、もう一方を角のある「狛犬」と呼び分けていた。現在は2体を合わせて狛犬と呼ぶことが多い。',
        sources: ['wp-komainu'],
      },
      {
        text: '2体とも同じ姿で角のない例も多く、この区別に当てはまらない像はきわめて多い。',
        sources: ['wp-komainu'],
      },
    ],
    look: ['頭のてっぺんに小さな角がないか、左右の像を見比べましょう。'],
  },
  {
    id: 'shinshi-kitsune',
    category: 'guardian',
    name: '狐の像',
    kana: 'きつねのぞう',
    gist: '稲荷の神さまの使いとされる狐',
    facts: [
      {
        text: '稲荷神の神使（神の使い）は狐とされる。',
        sources: ['wp-shinshi', 'wp-fushimi'],
      },
    ],
    look: ['狐の像があったら、口に何かくわえていないか、左右で違いがないか見てみましょう。'],
    drillGroup: 'shinshi',
    drillCue: '稲荷神社',
  },
  {
    id: 'shinshi-shika',
    category: 'guardian',
    name: '鹿',
    kana: 'しか',
    gist: '春日大社とゆかりの深い神使',
    facts: [
      {
        text: '鹿は春日大社の神使とされる。祭神の武甕槌命が白い鹿に乗って来たという伝承がある。',
        sources: ['wp-shinshi', 'wp-kasugataisha'],
      },
    ],
    look: ['灯籠や絵馬、手水の水口などに鹿があしらわれていないか探してみましょう。'],
    drillGroup: 'shinshi',
    drillCue: '春日大社',
  },
  {
    id: 'shinshi-ushi',
    category: 'guardian',
    name: '牛の像',
    kana: 'うしのぞう',
    gist: '天満宮の使いとされる牛。伏せた姿の像も',
    facts: [
      {
        text: '牛は天満宮の神使とされ、境内に牛の像が置かれていることがある。',
        sources: ['wp-shinshi'],
      },
      {
        text: '北野天満宮では臥牛（伏せた牛）の像が多く奉納され、祭神・菅原道真と牛にまつわる言い伝えが多く伝わる。',
        sources: ['wp-kitano'],
      },
    ],
    look: ['牛が伏せているか立っているか、どちらを向いているかを見てみましょう。'],
    drillGroup: 'shinshi',
    drillCue: '天満宮（天神さま）',
  },
  {
    id: 'shinshi-saru',
    category: 'guardian',
    name: '猿の像',
    kana: 'さるのぞう',
    gist: '日吉・日枝の神社とゆかりのある猿',
    facts: [
      {
        text: '猿は日吉・日枝・山王系の神社の神使とされ、日枝神社（東京都千代田区）には猿の像（猿神像）がある。',
        sources: ['wp-shinshi'],
      },
    ],
    look: ['猿が子どもを抱いていたり、何かを持っていたりしないか見てみましょう。'],
    drillGroup: 'shinshi',
    drillCue: '日枝神社・日吉大社などの山王系の神社',
  },

  // ── 社殿のかたち ────────────────────────────
  {
    id: 'style-shinmei',
    category: 'building',
    name: '神明造',
    kana: 'しんめいづくり',
    gist: '屋根の平らな側に入口がある、直線的な社殿',
    facts: [
      {
        text: '神明造は切妻造・平入（屋根の棟と平行な側に入口がある）で、屋根に反りがない直線的な様式。',
        sources: ['wp-shinmei'],
      },
      {
        text: '伊勢神宮の正殿の様式は特に「唯一神明造」と呼ばれる。',
        sources: ['wp-shinmei', 'wp-naiku'],
      },
    ],
    look: ['正面から見て、屋根の三角形の面ではなく、長い面が見えるか確かめましょう。'],
    drillGroup: 'style',
    drillCue: '屋根に反りがなく、長い側の面に入口がある',
  },
  {
    id: 'style-taisha',
    category: 'building',
    name: '大社造',
    kana: 'たいしゃづくり',
    gist: '屋根の三角形の側に入口がある、古い形式の社殿',
    facts: [
      {
        text: '大社造は切妻造・妻入（屋根の三角形の面の側に入口がある）で、出雲大社本殿が代表例。',
        sources: ['wp-taisha', 'wp-izumo'],
      },
    ],
    look: ['正面に屋根の三角形（妻）が向いているか、入口が中心からずれているかを見てみましょう。'],
    drillGroup: 'style',
    drillCue: '屋根の三角形の面が正面を向いている',
  },
  {
    id: 'style-nagare',
    category: 'building',
    name: '流造',
    kana: 'ながれづくり',
    gist: '正面側の屋根が長く流れるように伸びた、もっとも多い形式',
    facts: [
      {
        text: '流造は切妻造・平入で、正面側の屋根が長く延びて向拝（参拝者側の庇）となる。全国でもっとも多い本殿形式とされる。',
        sources: ['wp-nagare'],
      },
    ],
    look: ['横から見て、屋根の前側だけが長く伸びていないか確かめましょう。'],
    drillGroup: 'style',
    drillCue: '正面側の屋根だけが長く伸びている',
  },
  {
    id: 'style-kasuga',
    category: 'building',
    name: '春日造',
    kana: 'かすがづくり',
    gist: '妻入りの小さな社殿の正面に、庇が付いた形',
    facts: [
      {
        text: '春日造は切妻造・妻入の正面に庇（向拝）を付けた様式で、春日大社本殿が代表例。',
        sources: ['wp-kasuga', 'wp-kasugataisha'],
      },
    ],
    look: ['摂社・末社の小さな社殿にもよく見られます。三角形の面に庇が付いているか見てみましょう。'],
  },
  {
    id: 'style-gongen',
    category: 'building',
    name: '権現造',
    kana: 'ごんげんづくり',
    gist: '本殿と拝殿を「石の間」でつないだ、一体型の社殿',
    facts: [
      {
        text: '権現造は本殿と拝殿を石の間（相の間）でつないで一体とした様式。日光東照宮や北野天満宮が代表例として挙げられる。',
        sources: ['wp-gongen', 'wp-toshogu', 'wp-kitano'],
      },
    ],
    look: ['拝殿の奥にある本殿と、間をつなぐ低い建物の屋根を横から見てみましょう。'],
  },
  {
    id: 'chigi-katsuogi',
    category: 'building',
    name: '千木と鰹木',
    kana: 'ちぎとかつおぎ',
    gist: '屋根の上で交差する木と、棟に並ぶ丸太',
    facts: [
      {
        text: '千木は屋根の両端で交差して突き出た部材、鰹木は棟の上に直角に並べた部材。',
        sources: ['wp-chigi', 'wp-katsuogi'],
      },
      {
        text: '千木の先端が垂直に切られた「外削ぎ」は男神、水平に切られた「内削ぎ」は女神を祀るという説があるが、例外も多く、俗説とされる。',
        sources: ['wp-chigi'],
        kind: 'folk',
      },
    ],
    look: ['屋根の上の千木の先が縦に切られているか、横に切られているか見てみましょう。', '鰹木が何本並んでいるか数えてみましょう。'],
  },

  // ── 境内のもの ────────────────────────────
  {
    id: 'temizuya',
    category: 'precinct',
    name: '手水舎',
    kana: 'てみずや・ちょうずや',
    gist: '参拝の前に手と口をすすいで清める場所',
    facts: [
      {
        text: '手水舎は参拝者が手や口を水で清めるための施設。',
        sources: ['wp-temizuya'],
      },
      {
        text: '作法の一例：右手で柄杓を持って左手を清め、持ち替えて右手を清め、再び右手に持ち替えて左手に水を受けて口をすすぎ、もう一度左手に水を流す。',
        sources: ['jinjahoncho-sanpai'],
      },
    ],
    look: ['水口（水の出るところ）が龍などの形になっていないか見てみましょう。', '柄杓を使わない形式の手水舎もあります。掲示に従いましょう。'],
  },
  {
    id: 'shimenawa',
    category: 'precinct',
    name: '注連縄と紙垂',
    kana: 'しめなわとしで',
    gist: '神聖な場所の境を示す縄と、ジグザグの白い紙',
    facts: [
      {
        text: '注連縄は神域と現世を隔てる結界の役割を持つとされ、鳥居や拝殿、神木などに張られる。',
        sources: ['wp-shimenawa'],
      },
      {
        text: '紙垂は注連縄などに下げる、特殊な断ち方で折った紙。',
        sources: ['wp-shide'],
      },
    ],
    look: ['縄の太さや、撚りの向き、紙垂の数を見比べてみましょう。'],
  },
  {
    id: 'shinboku',
    category: 'precinct',
    name: '御神木',
    kana: 'ごしんぼく',
    gist: '神社で特に大切にされる木。注連縄が巻かれていることも',
    facts: [
      {
        text: '神木は神社の境内にある、神が宿る、または神域を示すとされる樹木で、注連縄が張られることが多い。',
        sources: ['wp-shinboku'],
      },
    ],
    look: ['木の種類や幹の太さを見てみましょう。柵の内側には入らず、外から眺めます。'],
  },
  {
    id: 'sessha',
    category: 'precinct',
    name: '摂社・末社',
    kana: 'せっしゃ・まっしゃ',
    gist: '本殿とは別に、境内に祀られている小さなお社',
    facts: [
      {
        text: '摂社・末社は、本社に付属してその境内や境外に祀られる神社。',
        sources: ['wp-sessha'],
      },
    ],
    look: ['本殿の脇や裏手、参道の途中に小さな社殿がないか探してみましょう。何の神さまの社か掲示があることも。'],
  },
  {
    id: 'ema',
    category: 'precinct',
    name: '絵馬',
    kana: 'えま',
    gist: '願いごとを書いて奉納する木の板',
    facts: [
      {
        text: '絵馬は願いごとや感謝を込めて社寺に奉納する、絵が描かれた木の板。もとは生きた馬を奉納した風習に由来するとされる。',
        sources: ['wp-ema'],
      },
    ],
    look: ['その神社ならではの絵柄を見てみましょう。他の人の願いごとは読み込まず、絵柄だけ眺めます。'],
  },
  {
    id: 'toro',
    category: 'precinct',
    name: '石灯籠',
    kana: 'いしどうろう',
    gist: '参道に並ぶ石の灯り。刻まれた年を探すのが楽しい',
    facts: [
      {
        text: '灯籠は社寺の参道などに置かれる灯火の器具で、石造のものは奉納されたものが多い。',
        sources: ['wp-toro'],
      },
    ],
    look: ['竿（柱の部分）に刻まれた年号や奉納者の名前を探してみましょう。いちばん古い年はいつでしたか。'],
  },
];

export const FEATURE_BY_ID: Record<string, Feature> = Object.fromEntries(FEATURES.map((f) => [f.id, f]));

export const featuresIn = (category: FeatureCategory) => FEATURES.filter((f) => f.category === category);
