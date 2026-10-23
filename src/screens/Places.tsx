import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Sheet } from '../components/Sheet';
import { useNotebook } from '../state/NotebookContext';
import { newId, placeVisits } from '../state/model';
import { allPlaces, sortByDistance, type Place } from '../lib/places';
import { formatDistance, NEAR_RADIUS_M, POSITION_ERROR_TEXT, roundCoord } from '../lib/geo';
import { useLocate } from '../lib/useLocate';

function PlaceRow({ place, distance }: { place: Place; distance?: number }) {
  const { nb } = useNotebook();
  const visits = placeVisits(nb, place.id).length;
  const near = distance !== undefined && distance <= NEAR_RADIUS_M;
  return (
    <li>
      <Link to={`/places/${place.id}`} className="list-item">
        <span className="list-item__main">
          <span className="list-item__title">{place.name}</span>
          <span className="list-item__sub">
            {place.area}
            {visits > 0 && ` ・ 帳面に ${visits} 頁`}
          </span>
        </span>
        {distance !== undefined && Number.isFinite(distance) && (
          <span className="list-item__aside">{near ? <span className="chip chip--seen">境内付近</span> : formatDistance(distance)}</span>
        )}
        <span className="chev">
          <Icon name="chevron" />
        </span>
      </Link>
    </li>
  );
}

export function Places() {
  const { nb, dispatch } = useNotebook();
  const navigate = useNavigate();
  const { state, locate } = useLocate();
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const places = useMemo(() => allPlaces(nb), [nb]);
  const q = query.trim();
  const filtered = q ? places.filter((p) => `${p.name}${p.area}${p.kind === 'shrine' ? p.shrine.kana : ''}`.includes(q)) : places;
  const sorted = state.phase === 'ok' ? sortByDistance(filtered, state.coords) : filtered.map((place) => ({ place, d: undefined }));
  const nearest = state.phase === 'ok' ? sorted[0] : undefined;

  return (
    <Screen title="さがす">
      <div className="stack-l">
        <section className="stack">
          <div className="stack-s">
            <h2>神社をさがす</h2>
            <p className="muted small">
              着いた神社を選んで記録を始めます。収録していない神社は、自分で帳面に加えられます。
            </p>
          </div>

          {state.phase === 'idle' && (
            <div className="card card--flat stack-s">
              <strong>近い順に並べますか？</strong>
              <p className="small muted">
                位置情報は並べ替えのためにこの場で一度だけ使い、保存も送信もしません。
              </p>
              <button type="button" className="btn btn--primary" onClick={locate}>
                <Icon name="locate" />
                位置情報で近い順にする
              </button>
            </div>
          )}
          {state.phase === 'locating' && (
            <div className="card card--flat row" role="status">
              <span className="spinner" aria-hidden />
              <span>現在地を確かめています…</span>
            </div>
          )}
          {state.phase === 'error' && (
            <div className="notice notice--warn" role="alert">
              <strong>{POSITION_ERROR_TEXT[state.reason].title}</strong>
              <span>{POSITION_ERROR_TEXT[state.reason].body}</span>
              <span>
                <button type="button" className="link" onClick={locate}>
                  もう一度試す
                </button>
              </span>
            </div>
          )}
          {state.phase === 'ok' && (
            <div className={`notice ${state.simulated ? 'notice--gold' : 'notice--ok'}`} role="status">
              <strong>{state.simulated ? '模擬位置（デモ）で並べています' : '現在地から近い順に並べています'}</strong>
              {nearest && nearest.d !== undefined && nearest.d > NEAR_RADIUS_M && (
                <span>近くに収録済みの神社はありません。近所の神社なら、下の「帳面に加える」から記録できます。</span>
              )}
            </div>
          )}

          <label className="field">
            <span className="visually-hidden">神社名・地名で絞り込む</span>
            <input
              type="search"
              placeholder="神社名・地名で絞り込む"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          {sorted.length === 0 ? (
            <div className="empty">
              <p>「{q}」に当てはまる神社は収録されていません。</p>
              <button type="button" className="btn" onClick={() => setAdding(true)}>
                「{q}」を帳面に加える
              </button>
            </div>
          ) : (
            <ul className="list">
              {sorted.map(({ place, d }) => (
                <PlaceRow key={place.id} place={place} distance={d} />
              ))}
            </ul>
          )}
        </section>

        <section className="card card--flat stack-s">
          <h3>近所の神社を帳面に加える</h3>
          <p className="small muted">
            収録は代表的な {places.filter((p) => p.kind === 'shrine').length} 社だけです。図鑑の見どころは、どの神社でも探せます。
          </p>
          <button type="button" className="btn" onClick={() => setAdding(true)}>
            <Icon name="plus" />
            神社を加える
          </button>
        </section>
      </div>

      {adding && (
        <AddPlaceSheet
          initialName={q}
          coords={state.phase === 'ok' && !state.simulated ? state.coords : undefined}
          onClose={() => setAdding(false)}
          onAdd={(name, keepCoords) => {
            const id = newId('place');
            const coords = keepCoords && state.phase === 'ok' && !state.simulated ? state.coords : undefined;
            dispatch({
              type: 'addCustomPlace',
              place: {
                id,
                name,
                createdAt: new Date().toISOString(),
                ...(coords ? { lat: roundCoord(coords.lat), lng: roundCoord(coords.lng) } : {}),
              },
            });
            setAdding(false);
            navigate(`/places/${id}`);
          }}
        />
      )}
    </Screen>
  );
}

function AddPlaceSheet({
  initialName,
  coords,
  onClose,
  onAdd,
}: {
  initialName: string;
  coords?: { lat: number; lng: number };
  onClose: () => void;
  onAdd: (name: string, keepCoords: boolean) => void;
}) {
  const [name, setName] = useState(initialName);
  const [keep, setKeep] = useState(false);
  const trimmed = name.trim();
  return (
    <Sheet title="神社を帳面に加える" onClose={onClose}>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onAdd(trimmed.slice(0, 40), keep);
        }}
      >
        <label className="field">
          神社の名前
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="例：○○八幡神社" required />
        </label>
        {coords ? (
          <label className="row small" style={{ alignItems: 'flex-start' }}>
            <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} style={{ width: 22, height: 22, marginTop: 2 }} />
            <span>
              おおよその位置（約100m単位）もこの端末に保存する
              <br />
              <span className="muted">次に来たとき、近い順に並ぶようになります。</span>
            </span>
          </label>
        ) : (
          <p className="small muted">位置は保存しません。次に来たときは名前から選べます。</p>
        )}
        <p className="tiny muted">追加した神社の情報は、あなたの帳面の中だけにあります。</p>
        <div className="row">
          <button type="button" className="btn btn--quiet" onClick={onClose} style={{ flex: 1 }}>
            やめる
          </button>
          <button type="submit" className="btn btn--primary" disabled={!trimmed} style={{ flex: 2 }}>
            加える
          </button>
        </div>
      </form>
    </Sheet>
  );
}
