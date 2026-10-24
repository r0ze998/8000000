import { describe, expect, it } from 'vitest';
import { FEATURES, FEATURE_BY_ID } from './features';
import { SHRINES, SHRINE_SOURCE } from './shrines';
import { SOURCES } from './sources';
import { ETIQUETTE_FACTS } from './etiquette';
import { COMMON_PARTS, PARTS, PART_BY_ID, signatureParts } from './parts';
import { distanceM, formatDistance } from '../lib/geo';
import { decodeByteArray, encodeByteArray, encodeShortId, decodeShortId, jstDay } from '../chain/codec';

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

describe('部品', () => {
  it('部品の解説は図鑑の項目を指し、挿絵がある', () => {
    for (const p of PARTS) if (p.featureId) expect(FEATURE_BY_ID[p.featureId], p.id).toBeDefined();
    for (const id of COMMON_PARTS) expect(PART_BY_ID[id], id).toBeDefined();
  });

  it('ゆかりの部品は、出典で確かめられる見どころからだけ決まる', () => {
    expect(signatureParts('kasuga-taisha').sort()).toEqual(['shika', 'style-kasuga', 'toro']);
    expect(signatureParts('kanda-myojin')).toEqual([]);
    expect(signatureParts('c-unknown')).toEqual([]);
  });
});

describe('チェーン用の変換', () => {
  it('日本語の ByteArray を往復できる（31バイトの区切りをまたいでも）', () => {
    for (const s of ['', 'abc', '坂の上八幡神社', '本殿の屋根を修復中でした。参道は通れます。'.repeat(3)]) {
      const felts = encodeByteArray(s);
      expect(decodeByteArray(felts, 0)).toEqual({ value: s, next: felts.length });
    }
  });

  it('神社の id を felt に変換でき、長すぎる・ASCII 以外は断る', () => {
    expect(decodeShortId(encodeShortId('kasuga-taisha'))).toBe('kasuga-taisha');
    expect(() => encodeShortId('x'.repeat(32))).toThrow();
    expect(() => encodeShortId('春日')).toThrow();
  });

  it('日付の区切りは日本時間の0時', () => {
    expect(jstDay(Date.parse('2026-10-24T23:59:00+09:00'))).toBe(jstDay(Date.parse('2026-10-24T00:00:00+09:00')));
    expect(jstDay(Date.parse('2026-10-25T00:00:00+09:00'))).toBe(jstDay(Date.parse('2026-10-24T00:00:00+09:00')) + 1);
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
