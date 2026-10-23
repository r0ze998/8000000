import { Link, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Illustration } from '../components/Illustration';
import { FactList, GuideBox } from '../components/Facts';
import { Stamp } from '../components/Progress';
import { Icon } from '../components/Icon';
import { useNotebook } from '../state/NotebookContext';
import { featureStatus, firstSighting, MAX_PINNED } from '../state/model';
import { CATEGORY_LABEL, FEATURE_BY_ID } from '../data/features';
import { SHRINES } from '../data/shrines';
import { formatDate } from '../lib/time';
import { NotFound } from './NotFound';

export function GuideEntry() {
  const { featureId = '' } = useParams();
  const { nb, dispatch } = useNotebook();
  const f = FEATURE_BY_ID[featureId];
  if (!f) return <NotFound what="図鑑の項目" back="/guide" />;

  const status = featureStatus(nb, f.id);
  const first = firstSighting(nb, f.id);
  const firstVisit = first ? nb.visits.find((v) => v.id === first.visitId) : undefined;
  const pinned = nb.pinned.includes(f.id);
  const pinFull = !pinned && nb.pinned.length >= MAX_PINNED;
  const examples = SHRINES.filter((s) => s.known.some((k) => k.featureId === f.id));

  return (
    <Screen title={f.name} back="/guide">
      <div className="stack-l">
        <header className="stack">
          <div className="ill-frame" style={{ position: 'relative' }}>
            <Illustration id={f.id} label={`${f.name}の模式図`} />
            {status === 'seen' && (
              <span style={{ position: 'absolute', top: 10, right: 10 }}>
                <Stamp large />
              </span>
            )}
          </div>
          <div className="stack-s">
            <span className="eyebrow">{CATEGORY_LABEL[f.category]}</span>
            <h2 style={{ fontSize: '1.55rem' }}>{f.name}</h2>
            <p className="muted small">{f.kana}</p>
            <p>{f.gist}</p>
          </div>

          {status === 'seen' && firstVisit ? (
            <div className="notice notice--ok">
              <strong>
                {formatDate(first!.at)}、{firstVisit.placeName}で初めて見た
                {firstVisit.demo && '（デモ）'}
              </strong>
              {first!.note && <span>「{first!.note}」</span>}
              <Link to={`/notebook/${firstVisit.id}`} className="small">
                その日の頁を見る
              </Link>
            </div>
          ) : (
            <div className="stack-s">
              <button
                type="button"
                className={`btn btn--block ${pinned ? '' : 'btn--primary'}`}
                aria-pressed={pinned}
                disabled={pinFull}
                onClick={() => dispatch({ type: 'togglePin', featureId: f.id })}
              >
                <Icon name="pin" />
                {pinned ? '探し物から外す' : '探し物に加える'}
              </button>
              <p className="tiny muted center">
                {pinFull
                  ? `探し物は${MAX_PINNED}つまでです。ほかを外すと加えられます。`
                  : `探し物は境内の記録で先頭に並びます（${nb.pinned.length}/${MAX_PINNED}）。`}
              </p>
              {status === 'unknown' && (
                <button
                  type="button"
                  className="btn btn--quiet"
                  onClick={() => dispatch({ type: 'learn', featureIds: [f.id], via: 'read', at: new Date().toISOString() })}
                >
                  見分け方を覚えた
                </button>
              )}
            </div>
          )}
        </header>

        <section className="stack" aria-labelledby="facts-title">
          <h3 id="facts-title">どんなもの？</h3>
          <FactList facts={f.facts} />
        </section>

        <GuideBox items={f.look} />

        {examples.length > 0 && (
          <section className="stack-s" aria-labelledby="ex-title">
            <h3 id="ex-title">出典で確かめられる例</h3>
            <ul className="list">
              {examples.map((s) => (
                <li key={s.id}>
                  <Link to={`/places/${s.id}`} className="list-item">
                    <span className="list-item__main">
                      <span className="list-item__title">{s.name}</span>
                      <span className="list-item__sub">{s.known.find((k) => k.featureId === f.id)?.note}</span>
                    </span>
                    <span className="chev">
                      <Icon name="chevron" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Screen>
  );
}
