import { describe, expect, it } from 'vitest';
import { emptyNotebook } from './model';
import { BACKUP_PREFIX, loadNotebook, parseNotebook, saveNotebook, STORAGE_KEY } from './storage';

class MemoryStorage implements Storage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
}

describe('保存と復元', () => {
  it('保存した帳面をそのまま復元できる', () => {
    const s = new MemoryStorage();
    const nb = { ...emptyNotebook(), title: 'テスト' };
    expect(saveNotebook(nb, s)).toBe(true);
    const r = loadNotebook(s);
    expect(r.status).toBe('restored');
    expect(r.notebook).toEqual(nb);
  });

  it('壊れたデータは退避して新しい帳面で始める（元の値は残す）', () => {
    const s = new MemoryStorage();
    s.setItem(STORAGE_KEY, '{oops');
    const r = loadNotebook(s, new Date(1000));
    expect(r.status).toBe('recovered');
    expect(s.getItem(`${BACKUP_PREFIX}1000`)).toBe('{oops');
    expect(s.getItem(STORAGE_KEY)).toBe('{oops');
  });

  it('旧アプリの神社名を引き継ぐ。既定名「マイ神社」は引き継がない', () => {
    const a = new MemoryStorage();
    a.setItem('shrineName', JSON.stringify('森の社'));
    const r = loadNotebook(a);
    expect(r.status === 'fresh' && r.importedTitle).toBe(true);
    expect(r.notebook.title).toBe('森の社の帳面');

    const b = new MemoryStorage();
    b.setItem('shrineName', JSON.stringify('マイ神社'));
    expect(loadNotebook(b).notebook.title).toBe('わたしの帳面');
  });

  it('使えないストレージでは unavailable を返す', () => {
    const s = new MemoryStorage();
    s.setItem = () => {
      throw new Error('quota');
    };
    expect(loadNotebook(s).status).toBe('unavailable');
  });

  it('記録のない見つけた印や不正な項目は取り除く', () => {
    const raw = {
      ...emptyNotebook(),
      visits: [{ id: 'v1', placeId: 'p', placeName: 'P', startedAt: 'x' }, { id: 3 }],
      sightings: [
        { id: 's1', featureId: 'toro', visitId: 'v1', at: 'x' },
        { id: 's2', featureId: 'toro', visitId: 'gone', at: 'x' },
      ],
      pinned: ['a', 'b', 'c', 'd', 5],
    };
    const nb = parseNotebook(raw)!;
    expect(nb.visits).toHaveLength(1);
    expect(nb.visits[0]).toMatchObject({ memo: '', demo: false, check: 'self' });
    expect(nb.sightings.map((s) => s.id)).toEqual(['s1']);
    expect(nb.pinned).toEqual(['a', 'b', 'c']);
    expect(parseNotebook({ version: 2 })).toBeNull();
    expect(parseNotebook(null)).toBeNull();
  });
});
