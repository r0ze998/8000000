import { describe, expect, it } from 'vitest';
import { FEATURES, FEATURE_BY_ID } from './features';
import { SHRINES, SHRINE_SOURCE } from './shrines';
import { SOURCES } from './sources';
import { ETIQUETTE_FACTS } from './etiquette';
import { buildRound, groupMembers } from '../lib/drill';
import { distanceM, formatDistance } from '../lib/geo';

describe('事実と出典の整合', () => {
  const allFacts = [
    ...FEATURES.flatMap((f) => f.facts),
    ...SHRINES.flatMap((s) => [...s.facts, ...s.known.map((k) => ({ text: k.note, sources: k.sources }))]),
    ...ETIQUETTE_FACTS,
  ];

  it('事実として表示する文には、存在する出典が必ず1つ以上ある', () => {
    for (const f of allFacts) {
      expect(f.sources.length, f.text).toBeGreaterThan(0);
      for (const id of f.sources) expect(SOURCES[id], `${id} in ${f.text}`).toBeDefined();
    }
  });

  it('すべての神社に主祭神の出典がある', () => {
    for (const s of SHRINES) expect(SOURCES[SHRINE_SOURCE[s.id] ?? ''], s.id).toBeDefined();
  });

  it('神社の見どころは図鑑に存在する項目を指す', () => {
    for (const s of SHRINES) for (const k of s.known) expect(FEATURE_BY_ID[k.featureId], k.featureId).toBeDefined();
  });

  it('出典は https のみ', () => {
    for (const s of Object.values(SOURCES)) expect(s.url.startsWith('https://')).toBe(true);
  });

  it('id は重複しない', () => {
    expect(new Set(FEATURES.map((f) => f.id)).size).toBe(FEATURES.length);
    expect(new Set(SHRINES.map((s) => s.id)).size).toBe(SHRINES.length);
  });
});

describe('見分け稽古', () => {
  it('問題の組はそれぞれ3つ以上の選択肢を持つ', () => {
    for (const g of ['torii', 'style', 'shinshi']) expect(groupMembers(g).length).toBeGreaterThanOrEqual(3);
  });

  it('組を指定すると、その組の全項目が1回ずつ出る', () => {
    const round = buildRound({ group: 'torii' });
    expect(round.map((q) => q.answer.id).sort()).toEqual(['torii-myojin', 'torii-ryobu', 'torii-shinmei']);
    for (const q of round) expect(q.options.map((o) => o.id)).toContain(q.answer.id);
  });

  it('まだ知らないものを優先して出す', () => {
    const known = new Set(FEATURES.filter((f) => f.drillGroup).map((f) => f.id).slice(0, 5));
    const round = buildRound({ known, size: 5 });
    expect(round.every((q) => !known.has(q.answer.id))).toBe(true);
  });
});

describe('距離', () => {
  it('東京駅〜明治神宮はおよそ5.6km', () => {
    const d = distanceM({ lat: 35.6812, lng: 139.7671 }, { lat: 35.6764, lng: 139.6993 });
    expect(d).toBeGreaterThan(5500);
    expect(d).toBeLessThan(6500);
    expect(formatDistance(d)).toMatch(/^約\d\.\dkm$/);
    expect(formatDistance(123)).toBe('約120m');
  });
});
