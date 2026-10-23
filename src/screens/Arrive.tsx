import { Link, useNavigate, useParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { useNotebook } from '../state/NotebookContext';
import { activeVisit, newId, type LocationCheck } from '../state/model';
import { findPlace } from '../lib/places';
import { distanceM, formatDistance, NEAR_RADIUS_M, POSITION_ERROR_TEXT } from '../lib/geo';
import { useLocate } from '../lib/useLocate';
import { isDarkHours } from '../lib/time';
import { VISIT_GUIDANCE } from '../data/etiquette';
import { NotFound } from './NotFound';

export function Arrive() {
  const { placeId = '' } = useParams();
  const { nb, dispatch } = useNotebook();
  const navigate = useNavigate();
  const { state, locate } = useLocate();
  const place = findPlace(nb, placeId);
  if (!place) return <NotFound what="神社" back="/places" />;

  const current = activeVisit(nb);
  const demo = nb.settings.demo;
  const demoHere = demo && nb.settings.demoPlaceId === place.id;
  const distance = state.phase === 'ok' && place.coords ? distanceM(state.coords, place.coords) : undefined;
  const near = distance !== undefined && distance <= NEAR_RADIUS_M;

  const start = (check: LocationCheck) => {
    dispatch({
      type: 'startVisit',
      visit: {
        id: newId('visit'),
        placeId: place.id,
        placeName: place.name,
        startedAt: new Date().toISOString(),
        check,
        distanceM: check === 'self' || distance === undefined ? undefined : Math.round(distance),
        memo: '',
        demo,
      },
    });
    dispatch({ type: 'completeOnboarding' });
    navigate('/visit', { replace: true });
  };

  if (current) {
    return (
      <Screen title="記録を始める" back={`/places/${place.id}`} tabs={false}>
        <div className="notice stack-s" role="status">
          <strong>{current.placeName}の記録が途中です</strong>
          <span>一度にひとつの神社だけ記録できます。先に綴じるか、破棄してください。</span>
          <Link to="/visit" className="btn btn--primary">
            記録中の頁へ
          </Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen title="記録を始める" back={`/places/${place.id}`} tabs={false}>
      <div className="stack-l">
        <header className="stack-s">
          <span className="eyebrow">{place.area}</span>
          <h2 style={{ fontSize: '1.4rem' }}>{place.name}</h2>
        </header>

        {isDarkHours() && (
          <div className="notice notice--gold" role="note">
            <strong>暗い時間です</strong>
            <span>境内は足元が見えにくく、閉門している神社もあります。無理をせず、明るい時間にあらためても大丈夫です。</span>
          </div>
        )}

        {place.coords ? (
          <section className="card stack" aria-labelledby="loc-title">
            <h3 id="loc-title">境内の近くにいますか？</h3>
            {state.phase === 'idle' && (
              <>
                <p className="small">
                  位置情報で一度だけ確かめます。座標は保存も送信もせず、帳面には「約何m」という概数だけを残します。
                </p>
                <button type="button" className="btn btn--primary btn--block" onClick={locate}>
                  <Icon name="locate" />
                  {demo ? '模擬位置（デモ）で確かめる' : '位置を確かめる'}
                </button>
              </>
            )}
            {state.phase === 'locating' && (
              <div className="row" role="status">
                <span className="spinner" aria-hidden />
                <span>確かめています…</span>
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
            {state.phase === 'ok' && distance !== undefined && (
              near ? (
                <div className={`notice ${state.simulated ? 'notice--gold' : 'notice--ok'}`} role="status">
                  <strong>
                    境内付近です（{formatDistance(distance)}）{state.simulated && '・模擬位置'}
                  </strong>
                  <span>登録している座標は概略なので、多少の誤差があります。</span>
                </div>
              ) : (
                <div className="notice notice--warn" role="status">
                  <strong>
                    {place.name}から{formatDistance(distance)}離れているようです{state.simulated && '（模擬位置）'}
                  </strong>
                  <span>
                    {demo && !demoHere
                      ? `デモの模擬位置は別の神社に設定されています。設定から変えるか、位置を使わずに始められます。`
                      : '着いてからもう一度確かめるか、位置を使わずに記録できます。'}
                  </span>
                  <span>
                    <button type="button" className="link" onClick={locate}>
                      もう一度確かめる
                    </button>
                  </span>
                </div>
              )
            )}
            {state.phase === 'ok' && near && (
              <button type="button" className="btn btn--primary btn--block" onClick={() => start(state.simulated ? 'demo' : 'gps')}>
                記録を始める
              </button>
            )}
          </section>
        ) : (
          <section className="notice">
            <strong>位置を保存していない神社です</strong>
            <span>位置の確認はせずに記録します。</span>
          </section>
        )}

        <section className="stack-s">
          <button
            type="button"
            className={`btn btn--block ${place.coords ? '' : 'btn--primary'}`}
            onClick={() => start(demo ? 'demo' : 'self')}
          >
            {place.coords ? '位置を使わずに始める' : '記録を始める'}
          </button>
          <p className="tiny muted center">位置を使わない記録には「位置未確認」と付きます。帳面はあなただけのものなので、それで困ることはありません。</p>
        </section>

        <section className="stack-s" aria-labelledby="guide-title">
          <h3 id="guide-title">境内でのお願い</h3>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            {VISIT_GUIDANCE.slice(0, 3).map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <Link to="/manners" className="small">
            参拝の作法と心得をすべて見る
          </Link>
        </section>
      </div>
    </Screen>
  );
}
