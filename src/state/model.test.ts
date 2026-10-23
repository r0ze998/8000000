import { describe, expect, it } from 'vitest';
import { activeVisit, emptyNotebook, featureStatus, firstsInVisit, MAX_PINNED, reduce, type Notebook, type Visit } from './model';

const visit = (id: string, extra: Partial<Visit> = {}): Visit => ({
  id,
  placeId: 'kasuga-taisha',
  placeName: '春日大社',
  startedAt: '2026-10-01T10:00:00.000Z',
  check: 'gps',
  memo: '',
  demo: false,
  ...extra,
});

const run = (nb: Notebook, ...actions: Parameters<typeof reduce>[1][]) => actions.reduce(reduce, nb);

describe('記録の流れ', () => {
  it('見つけた印は綴じるまで「見た」にならず、綴じると「見た」になり、探し物から外れる', () => {
    let nb = run(emptyNotebook(), { type: 'togglePin', featureId: 'style-kasuga' }, { type: 'startVisit', visit: visit('v1') });
    nb = reduce(nb, { type: 'toggleSighting', visitId: 'v1', featureId: 'style-kasuga', id: 's1', at: '2026-10-01T10:05:00.000Z' });
    expect(featureStatus(nb, 'style-kasuga')).toBe('unknown');
    nb = reduce(nb, { type: 'closeVisit', visitId: 'v1', at: '2026-10-01T10:30:00.000Z' });
    expect(featureStatus(nb, 'style-kasuga')).toBe('seen');
    expect(nb.pinned).toEqual([]);
    expect(nb.knowledge['style-kasuga']?.via).toBe('visit');
    expect(activeVisit(nb)).toBeUndefined();
  });

  it('同じ見どころをもう一度押すと印が外れる', () => {
    let nb = run(emptyNotebook(), { type: 'startVisit', visit: visit('v1') });
    const t = { type: 'toggleSighting', visitId: 'v1', featureId: 'toro', id: 's1', at: 'x' } as const;
    nb = run(nb, t, t);
    expect(nb.sightings).toEqual([]);
  });

  it('記録中は別の記録を始められない', () => {
    const nb = run(emptyNotebook(), { type: 'startVisit', visit: visit('v1') }, { type: 'startVisit', visit: visit('v2') });
    expect(nb.visits.map((v) => v.id)).toEqual(['v1']);
  });

  it('「初めて見た」は最初に綴じた記録にだけ付く', () => {
    let nb = emptyNotebook();
    for (const id of ['v1', 'v2']) {
      nb = run(
        nb,
        { type: 'startVisit', visit: visit(id, { startedAt: id === 'v1' ? '2026-10-01' : '2026-10-08' }) },
        { type: 'toggleSighting', visitId: id, featureId: 'toro', id: `s-${id}`, at: id === 'v1' ? '2026-10-01T01' : '2026-10-08T01' },
        { type: 'closeVisit', visitId: id, at: 'x' },
      );
    }
    expect(firstsInVisit(nb, 'v1').map((s) => s.featureId)).toEqual(['toro']);
    expect(firstsInVisit(nb, 'v2')).toEqual([]);
    // 最初の記録を消すと、2回目が「初めて」になる
    nb = reduce(nb, { type: 'deleteVisit', visitId: 'v1' });
    expect(firstsInVisit(nb, 'v2').map((s) => s.featureId)).toEqual(['toro']);
  });

  it('探し物は3つまで', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const nb = run(emptyNotebook(), ...ids.map((featureId) => ({ type: 'togglePin', featureId }) as const));
    expect(nb.pinned).toHaveLength(MAX_PINNED);
    expect(nb.pinned).not.toContain('d');
  });

  it('デモの記録だけを消せる', () => {
    let nb = run(
      emptyNotebook(),
      { type: 'startVisit', visit: visit('real') },
      { type: 'closeVisit', visitId: 'real', at: 'x' },
      { type: 'startVisit', visit: visit('demo', { demo: true, check: 'demo' }) },
      { type: 'toggleSighting', visitId: 'demo', featureId: 'toro', id: 's', at: 'x' },
    );
    nb = reduce(nb, { type: 'clearDemoRecords' });
    expect(nb.visits.map((v) => v.id)).toEqual(['real']);
    expect(nb.sightings).toEqual([]);
  });

  it('帳面の名前は空にできず、30文字で切る', () => {
    const nb = emptyNotebook();
    expect(reduce(nb, { type: 'setTitle', title: '   ' }).title).toBe(nb.title);
    expect(reduce(nb, { type: 'setTitle', title: 'あ'.repeat(40) }).title).toHaveLength(30);
  });
});
