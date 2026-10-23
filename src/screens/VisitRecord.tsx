import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Illustration } from '../components/Illustration';
import { Sheet } from '../components/Sheet';
import { Stamp } from '../components/Progress';
import { useNotebook } from '../state/NotebookContext';
import { featureStatus, firstsInVisit, MAX_PINNED, sightingsOf } from '../state/model';
import { FEATURES, FEATURE_BY_ID } from '../data/features';
import { SHRINE_BY_ID } from '../data/shrines';
import { checkLabel } from '../lib/labels';
import { formatDate } from '../lib/time';
import { NotFound } from './NotFound';

export function VisitRecord() {
  const { visitId = '' } = useParams();
  const [params] = useSearchParams();
  const fresh = params.get('new') === '1';
  const { nb, dispatch } = useNotebook();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const visit = nb.visits.find((v) => v.id === visitId);
  if (!visit) return <NotFound what="帳面の頁" back="/notebook" />;
  if (!visit.closedAt) {
    return (
      <Screen title="帳面の頁" back="/notebook">
        <div className="empty">
          <p>この頁はまだ記録中です。</p>
          <Link to="/visit" className="btn btn--primary">
            記録を続ける
          </Link>
        </div>
      </Screen>
    );
  }

  const sightings = sightingsOf(nb, visit.id);
  const firstIds = new Set(firstsInVisit(nb, visit.id).map((s) => s.featureId));
  const shrine = SHRINE_BY_ID[visit.placeId];

  // 次に探すもの：知っているのに未見 → 同じ神社で出典がある未見 → そのほかの未見
  const knownHere = new Set(shrine?.known.map((k) => k.featureId) ?? []);
  const suggestions = FEATURES.filter((f) => featureStatus(nb, f.id) !== 'seen')
    .map((f) => ({ f, score: (featureStatus(nb, f.id) === 'learned' ? 0 : 2) + (knownHere.has(f.id) ? 0 : 1) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((x) => x.f);

  return (
    <Screen title={visit.placeName} back="/notebook">
      <div className="stack-l">
        <header className="card card--hero stack-s">
          <span className="eyebrow">{formatDate(visit.startedAt)}</span>
          <h2 style={{ fontSize: '1.45rem' }}>{visit.placeName}</h2>
          <div className="row row--wrap" style={{ gap: 6 }}>
            <span className={`chip${visit.check === 'demo' ? ' chip--demo' : ''}`}>{checkLabel(visit)}</span>
            {visit.demo && <span className="chip chip--demo">デモの記録</span>}
          </div>
          {fresh && (
            <p role="status">
              {firstIds.size > 0
                ? `帳面に綴じました。初めて見たものが ${firstIds.size} つあります。`
                : sightings.length > 0
                  ? '帳面に綴じました。見たことのあるものを、また見つけましたね。'
                  : '帳面に綴じました。訪れた記録として残ります。'}
            </p>
          )}
        </header>

        <section className="stack-s" aria-labelledby="found-title">
          <h3 id="found-title">見つけたもの</h3>
          {sightings.length === 0 ? (
            <p className="muted small">印を付けたものはありません。</p>
          ) : (
            <ul className="list">
              {sightings.map((s) => {
                const f = FEATURE_BY_ID[s.featureId];
                if (!f) return null;
                return (
                  <li key={s.id}>
                    <Link to={`/guide/${f.id}`} className="list-item">
                      <span style={{ width: 56, flex: 'none' }}>
                        <Illustration id={f.id} />
                      </span>
                      <span className="list-item__main">
                        <span className="list-item__title">{f.name}</span>
                        {s.note && <span className="list-item__sub">「{s.note}」</span>}
                      </span>
                      {firstIds.has(f.id) && <Stamp label="初" animate={fresh} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {visit.memo && (
          <section className="stack-s">
            <h3>その他の気づき</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{visit.memo}</p>
          </section>
        )}

        {suggestions.length > 0 && (
          <section className="stack-s" aria-labelledby="next-title">
            <h3 id="next-title">次に探すと面白いもの</h3>
            <ul className="list">
              {suggestions.map((f) => {
                const pinned = nb.pinned.includes(f.id);
                const full = !pinned && nb.pinned.length >= MAX_PINNED;
                return (
                  <li key={f.id} className="list-item">
                    <span style={{ width: 56, flex: 'none' }}>
                      <Illustration id={f.id} />
                    </span>
                    <Link to={`/guide/${f.id}`} className="list-item__main" style={{ color: 'inherit', textDecoration: 'none' }}>
                      <span className="list-item__title">{f.name}</span>
                      <span className="list-item__sub">{f.gist}</span>
                    </Link>
                    <button
                      type="button"
                      className={`btn ${pinned ? 'btn--moss' : ''}`}
                      aria-pressed={pinned}
                      disabled={full}
                      onClick={() => dispatch({ type: 'togglePin', featureId: f.id })}
                      style={{ minWidth: 88 }}
                    >
                      {pinned ? '✓ 選んだ' : '探す'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="stack-s">
          <Link to="/" className="btn btn--primary btn--block">
            きょうへ
          </Link>
          <Link to={`/places/${visit.placeId}`} className="btn btn--block">
            {visit.placeName}のページ
          </Link>
          <button type="button" className="btn btn--quiet btn--danger" onClick={() => setConfirmDelete(true)}>
            この頁を消す
          </button>
        </div>
      </div>

      {confirmDelete && (
        <Sheet title="この頁を消しますか？" onClose={() => setConfirmDelete(false)}>
          <p>付けた印とメモが消え、図鑑の「見た」も、この頁でしか見ていないものは戻ります。元に戻せません。</p>
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setConfirmDelete(false)}>
              やめる
            </button>
            <button
              type="button"
              className="btn btn--danger"
              style={{ flex: 1 }}
              onClick={() => {
                dispatch({ type: 'deleteVisit', visitId: visit.id });
                navigate('/notebook', { replace: true });
              }}
            >
              消す
            </button>
          </div>
        </Sheet>
      )}
    </Screen>
  );
}
