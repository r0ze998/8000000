import { describe, expect, it } from 'vitest';
import { emptyGame, reduce } from './model';
import { BACKUP_PREFIX, loadGame, parseGame, saveGame, STORAGE_KEY } from './storage';

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
  it('保存したデータをそのまま復元できる', () => {
    const s = new MemoryStorage();
    let g = reduce(emptyGame(), {
      type: 'addVisit',
      visit: { id: 'v1', placeId: 'kasuga-taisha', placeName: '春日大社', at: '2026-10-01T10:00:00+09:00', check: 'gps', demo: false, chain: { status: 'confirmed', txHash: '0x1' } },
    });
    g = reduce(g, { type: 'place', x: 1, y: 0, partId: 'path' });
    expect(saveGame(g, s)).toBe(true);
    const r = loadGame(s);
    expect(r.status).toBe('restored');
    expect(r.game).toEqual(g);
  });

  it('送信中のまま閉じた記録は「確認が必要」に戻す', () => {
    const s = new MemoryStorage();
    const g = reduce(emptyGame(), {
      type: 'addVisit',
      visit: { id: 'v1', placeId: 'hie-jinja', placeName: '日枝神社', at: '2026-10-01T10:00:00+09:00', check: 'gps', demo: false, chain: { status: 'sending', txHash: '0xabc' } },
    });
    saveGame(g, s);
    const v = loadGame(s).game.visits[0]!;
    expect(v.chain.status).toBe('failed');
    expect(v.chain.txHash).toBe('0xabc');
  });

  it('壊れたデータは退避して新しく始める（元の値は残す）', () => {
    const s = new MemoryStorage();
    s.setItem(STORAGE_KEY, '{oops');
    const r = loadGame(s, new Date(1000));
    expect(r.status).toBe('recovered');
    expect(s.getItem(`${BACKUP_PREFIX}1000`)).toBe('{oops');
    expect(s.getItem(STORAGE_KEY)).toBe('{oops');
  });

  it('旧アプリの神社名を引き継ぐ。既定名「マイ神社」は引き継がない', () => {
    const a = new MemoryStorage();
    a.setItem('shrineName', JSON.stringify('森の社'));
    const r = loadGame(a);
    expect(r.status === 'fresh' && r.importedName).toBe(true);
    expect(r.game.name).toBe('森の社');
    const b = new MemoryStorage();
    b.setItem('shrineName', JSON.stringify('マイ神社'));
    expect(loadGame(b).game.name).toBe('わたしの神社');
  });

  it('使えないストレージでは unavailable を返す', () => {
    const s = new MemoryStorage();
    s.setItem = () => {
      throw new Error('quota');
    };
    expect(loadGame(s).status).toBe('unavailable');
  });

  it('持っていない部品の配置や、不正な項目は取り除く', () => {
    const raw = {
      ...emptyGame(),
      visits: [{ id: 'v1', placeId: 'p', placeName: 'P', at: '2026-10-01T10:00:00+09:00', day: 20362, rewards: ['path'] }, { id: 3 }],
      placements: [
        { x: 1, y: 0, partId: 'path' },
        { x: 2, y: 0, partId: 'shika' },
        { x: 'a', y: 0, partId: 'path' },
      ],
    };
    const g = parseGame(raw)!;
    expect(g.visits).toHaveLength(1);
    expect(g.placements).toEqual([{ x: 1, y: 0, partId: 'path' }]);
    expect(parseGame({ version: 2 })).toBeNull();
  });
});
