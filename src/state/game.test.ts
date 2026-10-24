import { describe, expect, it } from 'vitest';
import { canPlace, canRemove, emptyGame, inventory, levelOf, reduce, rewardsFor, type Action, type Game, type Visit } from './model';
import { jstDay } from '../chain/codec';

const run = (g: Game, ...actions: Action[]) => actions.reduce(reduce, g);
const visit = (placeId: string, at: string, extra: Partial<Visit> = {}): Action => ({
  type: 'addVisit',
  visit: { id: `${placeId}-${at}`, placeId, placeName: placeId, at, check: 'gps', demo: false, chain: { status: 'local' }, ...extra },
});

describe('参拝と部品', () => {
  it('初めての神社ではゆかりの部品、2回目からは日ごとの部品をもらう', () => {
    const first = rewardsFor('kasuga-taisha', true, 20000);
    expect(first).toEqual(expect.arrayContaining(['path', 'style-kasuga', 'shika', 'toro']));
    const again = rewardsFor('kasuga-taisha', false, 20001);
    expect(again.filter((p) => p !== 'path')).toHaveLength(1);
    // ゆかりの部品がない神社の初回は、共通の部品が2つ
    expect(rewardsFor('kanda-myojin', true, 20000).filter((p) => p !== 'path')).toHaveLength(2);
  });

  it('報酬は神社と日付だけで決まる（チェーンの記録から再計算できる）', () => {
    expect(rewardsFor('hie-jinja', false, 20500)).toEqual(rewardsFor('hie-jinja', false, 20500));
  });

  it('同じ神社は日本時間の同じ日に1回まで', () => {
    const g = run(
      emptyGame(),
      visit('meiji-jingu', '2026-10-24T01:00:00+09:00'),
      visit('meiji-jingu', '2026-10-24T23:30:00+09:00'),
      visit('meiji-jingu', '2026-10-25T00:10:00+09:00'),
    );
    expect(g.visits).toHaveLength(2);
    expect(g.visits[1]!.day).toBe(jstDay(Date.parse('2026-10-25T00:10:00+09:00')));
  });
});

describe('育ち方', () => {
  it('行った神社の数で境内が広がる', () => {
    let g = emptyGame();
    expect(levelOf(g)).toMatchObject({ size: 5, toNext: 2 });
    g = run(g, visit('meiji-jingu', '2026-10-01T10:00:00+09:00'), visit('hie-jinja', '2026-10-01T12:00:00+09:00'));
    expect(levelOf(g)).toMatchObject({ size: 7, name: '村の社' });
    // 同じ神社に何度行っても広さは変わらない
    g = run(g, visit('hie-jinja', '2026-10-02T12:00:00+09:00'));
    expect(levelOf(g).size).toBe(7);
  });
});

describe('置き方（本殿から伸びるように）', () => {
  const start = () => run(emptyGame(), visit('kasuga-taisha', '2026-10-01T10:00:00+09:00'));

  it('本殿か置いた部品の隣にしか置けない', () => {
    const g = start();
    expect(canPlace(g, 2, 2, 'path').ok).toBe(false);
    const g2 = run(g, { type: 'place', x: 1, y: 0, partId: 'path' });
    expect(g2.placements).toHaveLength(1);
    expect(canPlace(g2, 2, 0, 'shika').ok).toBe(true);
    expect(canPlace(g2, 0, 0, 'shika').ok).toBe(false);
  });

  it('境内の外と、持っていない部品は置けない', () => {
    const g = start();
    expect(canPlace(g, 3, 0, 'path').ok).toBe(false);
    expect(canPlace(g, 1, 0, 'kitsune').ok).toBe(false);
  });

  it('置くと手元から減り、外すと戻る', () => {
    let g = start();
    const before = inventory(g).shika!;
    g = run(g, { type: 'place', x: 0, y: 1, partId: 'shika' });
    expect(inventory(g).shika).toBe(before - 1);
    g = run(g, { type: 'remove', x: 0, y: 1 });
    expect(inventory(g).shika).toBe(before);
  });

  it('外すと本殿から切り離される部品が出るなら外せない', () => {
    const g = run(start(), { type: 'place', x: 1, y: 0, partId: 'path' }, { type: 'place', x: 2, y: 0, partId: 'path' });
    expect(canRemove(g, 1, 0).ok).toBe(false);
    expect(canRemove(g, 2, 0).ok).toBe(true);
  });

  it('持っている社殿を本殿にできる', () => {
    const g = run(start(), { type: 'setHonden', partId: 'style-kasuga' });
    expect(g.honden).toBe('style-kasuga');
    expect(inventory(g)['style-kasuga']).toBe(0);
    expect(run(g, { type: 'setHonden', partId: 'style-taisha' }).honden).toBe('style-kasuga');
  });

  it('デモを消すと、デモの部品で置いたものも外れる', () => {
    let g = run(
      emptyGame(),
      visit('meiji-jingu', '2026-10-01T10:00:00+09:00'),
      visit('kasuga-taisha', '2026-10-01T11:00:00+09:00', { demo: true, check: 'demo', chain: { status: 'skipped' } }),
    );
    g = run(g, { type: 'place', x: 1, y: 0, partId: 'path' }, { type: 'place', x: 0, y: 1, partId: 'shika' }, { type: 'setHonden', partId: 'style-kasuga' });
    g = run(g, { type: 'clearDemo' });
    expect(g.visits).toHaveLength(1);
    expect(g.placements.map((p) => p.partId)).toEqual(['path']);
    expect(g.honden).toBe('hokora');
  });
});
