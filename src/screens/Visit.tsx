import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Illustration } from '../components/Illustration';
import { Sheet } from '../components/Sheet';
import { FactList } from '../components/Facts';
import { useNotebook } from '../state/NotebookContext';
import { activeVisit, featureStatus, newId, sightingsOf, type Sighting } from '../state/model';
import { CATEGORY_LABEL, CATEGORY_ORDER, FEATURES, type Feature, type FeatureCategory } from '../data/features';
import { SHRINE_BY_ID } from '../data/shrines';
import { ETIQUETTE_FACTS, VISIT_GUIDANCE } from '../data/etiquette';
import { checkLabel } from '../lib/labels';

function FindRow({
  feature,
  sighting,
  known,
  onToggle,
  onNote,
}: {
  feature: Feature;
  sighting?: Sighting;
  known: boolean;
  onToggle: () => void;
  onNote: (note: string) => void;
}) {
  const { nb } = useNotebook();
  const status = featureStatus(nb, feature.id);
  return (
    <li className={`find${sighting ? ' find--on' : ''}`}>
      <Illustration id={feature.id} />
      <div className="find__head row row--wrap" style={{ gap: 4 }}>
        <span className="find__name">{feature.name}</span>
        {status === 'seen' && <span className="chip">見たことあり</span>}
        {known && <span className="chip chip--fact">出典あり</span>}
      </div>
      <p className="find__hint">
        {feature.look[0]}
        <Link to={`/guide/${feature.id}`}>見分け方</Link>
      </p>
      <button type="button" className="find__toggle" aria-pressed={Boolean(sighting)} onClick={onToggle}>
        {sighting ? '✓ 見つけた' : '見つけた'}
      </button>
      {sighting && (
        <label className="find__note">
          <span className="visually-hidden">{feature.name}のメモ</span>
          <input
            type="text"
            value={sighting.note}
            maxLength={200}
            placeholder="どんな様子だった？（任意）"
            onChange={(e) => onNote(e.target.value)}
          />
        </label>
      )}
    </li>
  );
}

function BreathSheet({ onClose }: { onClose: () => void }) {
  const PHASES = [
    { key: 'in', label: '吸う', secs: 4 },
    { key: 'hold', label: '止める', secs: 4 },
    { key: 'out', label: '吐く', secs: 4 },
  ] as const;
  const CYCLES = 3;
  const [step, setStep] = useState(0);
  const done = step >= PHASES.length * CYCLES;
  const phase = PHASES[step % PHASES.length];
  useEffect(() => {
    if (done || !phase) return;
    const t = setTimeout(() => setStep((s) => s + 1), phase.secs * 1000);
    return () => clearTimeout(t);
  }, [step, done, phase]);
  return (
    <Sheet title="一息つく" onClose={onClose}>
      <p className="small muted">画面の円に合わせて、3回だけ深く呼吸します（約36秒）。目を閉じても構いません。</p>
      <div className="breath" data-phase={done ? 'out' : phase?.key} aria-live="polite">
        {done ? 'おわり' : phase?.label}
      </div>
      <p className="center small muted">
        {done ? '境内をもう一度見回してみましょう。' : `${Math.floor(step / PHASES.length) + 1} / ${CYCLES} 回目`}
      </p>
      <button type="button" className="btn btn--block" onClick={onClose}>
        {done ? '戻る' : 'やめる'}
      </button>
    </Sheet>
  );
}

export function Visit() {
  const { nb, dispatch } = useNotebook();
  const navigate = useNavigate();
  const visit = activeVisit(nb);
  const [filter, setFilter] = useState<'pinned' | 'all' | FeatureCategory>('all');
  const [sheet, setSheet] = useState<'none' | 'etiquette' | 'breath' | 'close' | 'discard'>('none');

  const sightings = visit ? sightingsOf(nb, visit.id) : [];
  const byFeature = new Map(sightings.map((s) => [s.featureId, s]));
  const shrine = visit ? SHRINE_BY_ID[visit.placeId] : undefined;
  const knownIds = useMemo(() => new Set(shrine?.known.map((k) => k.featureId) ?? []), [shrine]);

  // 探し物と出典のある見どころを先に並べる
  const ordered = useMemo(() => {
    const score = (f: Feature) => (nb.pinned.includes(f.id) ? 0 : knownIds.has(f.id) ? 1 : 2);
    return [...FEATURES].sort((a, b) => score(a) - score(b));
  }, [nb.pinned, knownIds]);

  if (!visit) {
    return (
      <Screen title="境内の記録" back="/" tabs={false}>
        <div className="empty" style={{ marginTop: 24 }}>
          <p>いま記録中の神社はありません。</p>
          <Link to="/places" className="btn btn--primary">
            神社を選んで始める
          </Link>
          <Link to="/notebook" className="btn btn--quiet">
            帳面を見る
          </Link>
        </div>
      </Screen>
    );
  }

  const shown =
    filter === 'pinned'
      ? ordered.filter((f) => nb.pinned.includes(f.id))
      : filter === 'all'
        ? ordered
        : ordered.filter((f) => f.category === filter);

  const toggle = (featureId: string) =>
    dispatch({ type: 'toggleSighting', visitId: visit.id, featureId, id: newId('s'), at: new Date().toISOString() });

  const close = () => {
    dispatch({ type: 'closeVisit', visitId: visit.id, at: new Date().toISOString() });
    navigate(`/notebook/${visit.id}?new=1`, { replace: true });
  };

  const dock = (
    <>
      <button type="button" className="btn btn--primary btn--block" onClick={() => setSheet('close')}>
        帳面に綴じる{sightings.length > 0 ? `（${sightings.length}件）` : ''}
      </button>
      <Link to="/" className="btn btn--quiet btn--block" style={{ minHeight: 40, padding: 4 }}>
        いったん閉じる（記録は残ります）
      </Link>
    </>
  );

  return (
    <Screen title="境内の記録" back="/" tabs={false} dock={dock}>
      <div className="stack-l">
        <header className="stack-s">
          <div className="row row--wrap" style={{ gap: 6 }}>
            <span className={`chip${visit.check === 'demo' || visit.demo ? ' chip--demo' : ''}`}>{checkLabel(visit)}</span>
            {visit.demo && <span className="chip chip--demo">デモの記録</span>}
          </div>
          <h2 style={{ fontSize: '1.45rem' }}>{visit.placeName}</h2>
          <p className="small muted">見つけたものに印を付けましょう。全部探す必要はありません。</p>
          <div className="row row--wrap">
            <button type="button" className="btn" onClick={() => setSheet('etiquette')} style={{ flex: '1 1 140px' }}>
              参拝の作法
            </button>
            <button type="button" className="btn" onClick={() => setSheet('breath')} style={{ flex: '1 1 140px' }}>
              一息つく
            </button>
          </div>
        </header>

        <section className="stack" aria-labelledby="find-title">
          <h3 id="find-title">見つける</h3>
          <div className="tabs" role="group" aria-label="見どころの絞り込み">
            {nb.pinned.length > 0 && (
              <button type="button" aria-pressed={filter === 'pinned'} onClick={() => setFilter('pinned')}>
                探し物 {nb.pinned.length}
              </button>
            )}
            <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              すべて
            </button>
            {CATEGORY_ORDER.map((c) => (
              <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          <ul className="list" aria-live="off">
            {shown.map((f) => (
              <FindRow
                key={f.id}
                feature={f}
                sighting={byFeature.get(f.id)}
                known={knownIds.has(f.id)}
                onToggle={() => toggle(f.id)}
                onNote={(note) => {
                  const s = byFeature.get(f.id);
                  if (s) dispatch({ type: 'setSightingNote', sightingId: s.id, note });
                }}
              />
            ))}
          </ul>
        </section>

        <section className="stack-s">
          <label className="field">
            その他の気づき（任意）
            <textarea
              value={visit.memo}
              maxLength={1000}
              placeholder="木漏れ日、音、香り、案内板で知ったこと…"
              onChange={(e) => dispatch({ type: 'setVisitMemo', visitId: visit.id, memo: e.target.value })}
            />
          </label>
          <span className="tiny muted">書いた内容はこの端末の帳面にだけ残ります。</span>
        </section>

        <button type="button" className="btn btn--quiet btn--danger" onClick={() => setSheet('discard')}>
          この記録を破棄する
        </button>
      </div>

      {sheet === 'etiquette' && (
        <Sheet title="参拝の作法" onClose={() => setSheet('none')}>
          <FactList facts={ETIQUETTE_FACTS} />
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            {VISIT_GUIDANCE.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <button type="button" className="btn btn--block" onClick={() => setSheet('none')}>
            閉じる
          </button>
        </Sheet>
      )}
      {sheet === 'breath' && <BreathSheet onClose={() => setSheet('none')} />}
      {sheet === 'close' && (
        <Sheet title="帳面に綴じますか？" onClose={() => setSheet('none')}>
          {sightings.length === 0 ? (
            <p>まだ何も印を付けていません。それでも、訪れた頁として綴じられます。</p>
          ) : (
            <p>見つけた {sightings.length} 件を帳面に綴じます。綴じたあとも、頁を見返せます。</p>
          )}
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setSheet('none')}>
              まだ探す
            </button>
            <button type="button" className="btn btn--primary" style={{ flex: 2 }} onClick={close}>
              綴じる
            </button>
          </div>
        </Sheet>
      )}
      {sheet === 'discard' && (
        <Sheet title="この記録を破棄しますか？" onClose={() => setSheet('none')}>
          <p>{visit.placeName}で付けた印とメモが消えます。元に戻せません。</p>
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setSheet('none')}>
              やめる
            </button>
            <button
              type="button"
              className="btn btn--danger"
              style={{ flex: 1 }}
              onClick={() => {
                dispatch({ type: 'discardVisit', visitId: visit.id });
                navigate('/', { replace: true });
              }}
            >
              破棄する
            </button>
          </div>
        </Sheet>
      )}
    </Screen>
  );
}
