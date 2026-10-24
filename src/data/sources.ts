// 出典の一覧。事実として表示する文には、必ずここの id を 1 つ以上付ける。
// 本文は出典の要約・言い換えであり、引用ではない。

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
}

const wiki = (id: string, page: string): Source => ({
  id,
  title: `${page}（Wikipedia 日本語版）`,
  publisher: 'Wikipedia',
  url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(page.replace(/ /g, '_'))}`,
});

export const SOURCES: Record<string, Source> = Object.fromEntries(
  [
    wiki('wp-torii', '鳥居'),
    wiki('wp-komainu', '狛犬'),
    wiki('wp-shinshi', '神使'),
    wiki('wp-shinmei', '神明造'),
    wiki('wp-taisha', '大社造'),
    wiki('wp-nagare', '流造'),
    wiki('wp-kasuga', '春日造'),
    wiki('wp-gongen', '権現造'),
    wiki('wp-chigi', '千木'),
    wiki('wp-katsuogi', '鰹木'),
    wiki('wp-temizuya', '手水舎'),
    wiki('wp-shimenawa', '注連縄'),
    wiki('wp-shide', '紙垂'),
    wiki('wp-shinboku', '神木'),
    wiki('wp-sessha', '摂社'),
    wiki('wp-ema', '絵馬'),
    wiki('wp-toro', '灯籠'),
    wiki('wp-meiji', '明治神宮'),
    wiki('wp-hie', '日枝神社 (千代田区)'),
    wiki('wp-edo3', '江戸三大祭り'),
    wiki('wp-sengu', '神宮式年遷宮'),
    wiki('wp-kanda', '神田神社'),
    wiki('wp-fushimi', '伏見稲荷大社'),
    wiki('wp-yasaka', '八坂神社'),
    wiki('wp-kitano', '北野天満宮'),
    wiki('wp-kasugataisha', '春日大社'),
    wiki('wp-izumo', '出雲大社'),
    wiki('wp-naiku', '皇大神宮'),
    wiki('wp-tsurugaoka', '鶴岡八幡宮'),
    wiki('wp-dazaifu', '太宰府天満宮'),
    wiki('wp-sumiyoshi', '住吉大社'),
    wiki('wp-itsukushima', '嚴島神社'),
    wiki('wp-toshogu', '日光東照宮'),
    {
      id: 'jinjahoncho-sanpai',
      title: '参拝方法',
      publisher: '神社本庁',
      url: 'https://www.jinjahoncho.or.jp/omairi/sanpai/',
    },
    {
      id: 'izumo-official',
      title: 'よくあるご質問',
      publisher: '出雲大社',
      url: 'https://izumooyashiro.or.jp/faq/',
    },
    {
      id: 'meiji-faq',
      title: 'よくあるご質問',
      publisher: '明治神宮',
      url: 'https://www.meijijingu.or.jp/faq/',
    },
  ].map((s) => [s.id, s]),
);

export const getSource = (id: string): Source | undefined => SOURCES[id];
