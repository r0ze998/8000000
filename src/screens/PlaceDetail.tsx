import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { FactList, SourceLinks } from '../components/Facts';
import { Illustration } from '../components/Illustration';
import { ChainAction, ChainChip } from '../components/ChainPanel';
import { useGame } from '../state/GameContext';
import { useCommunity } from '../chain/useCommunity';
import { useChainActions } from '../chain/useChainActions';
import { REPORT_STATUS, visitedToday, visitsAt } from '../state/model';
import { findPlace } from '../lib/places';
import { mapUrl } from '../lib/geo';
import { PART_BY_ID, signatureParts } from '../data/parts';
import { SHRINE_SOURCE } from '../data/shrines';
import { formatDate } from '../lib/time';
import { NotFound } from './NotFound';

const dayToDate = (day: number) => {
  const d = new Date(day * 86400000);
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`;
};

export function PlaceDetail() {
  const { placeId = '' } = useParams();
  const [params] = useSearchParams();
  const { game } = useGame();
  const community = useCommunity();
  const { block, registerPlace } = useChainActions();
  const navigate = useNavigate();
  const autoRegister = useRef(false);
  const place = findPlace(game, placeId, community.shrines);
  const custom = place?.kind === 'custom' ? game.customPlaces.find((c) => c.id === place.id) : undefined;
  const wantsRegister = params.get('register') === '1';

  useEffect(() => {
    if (wantsRegister && custom && custom.chain?.status === 'local' && !autoRegister.current && block(false).kind === 'ready') {
      autoRegister.current = true;
      void registerPlace(custom.id);
    }
  }, [wantsRegister, custom, block, registerPlace]);

  if (!place) {
    if (community.status === 'loading') {
      return (
        <Screen title="神社" back="/places">
          <div className="row" role="status">
            <span className="spinner" aria-hidden />
            <span>読み込んでいます…</span>
          </div>
        </Screen>
      );
    }
    return <NotFound what="神社" back="/places" />;
  }

  const visits = visitsAt(game, place.id);
  const shrine = place.kind === 'shrine' ? place.shrine : undefined;
  const stats = community.stats[place.id];
  const reports = community.reports.filter((r) => r.shrineId === place.id).slice(0, 5);
  const sig = signatureParts(place.id);
  const today = visitedToday(game, place.id);

  const dock = (
    <button type="button" className="btn btn--primary btn--block" onClick={() => navigate(`/arrive/${place.id}`)}>
      {today ? '今日の参拝の記録を見る' : 'ここで参拝する'}
    </button>
  );

  return (
    <Screen title={place.name} back="/places" dock={dock}>
      <div className="stack-l">
        <header className="stack-s">
          <span className="eyebrow">{place.area}</span>
          <h2 style={{ fontSize: '1.5rem' }}>{place.name}</h2>
          {shrine && <p className="muted small">{shrine.kana}</p>}
          <div className="row row--wrap">
            {place.coords && (
              <a className="btn btn--quiet" href={mapUrl(place.coords)} target="_blank" rel="noopener noreferrer">
                <Icon name="external" />
                地図で開く
              </a>
            )}
            {shrine?.official && (
              <a className="btn btn--quiet" href={shrine.official} target="_blank" rel="noopener noreferrer">
                <Icon name="external" />
                公式サイト
              </a>
            )}
          </div>
        </header>

        <section className="card stack-s" aria-labelledby="parts-title">
          <h3 id="parts-title">参拝でもらえる部品</h3>
          {sig.length > 0 ? (
            <>
              <p className="small">初めて参拝すると、この神社にゆかりのある部品がもらえます。</p>
              <ul className="reward-grid">
                {sig.map((id) => {
                  const p = PART_BY_ID[id]!;
                  return (
                    <li key={id} className="reward">
                      <Illustration id={p.art} label={p.name} />
                      <span className="reward__name">{p.name}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="small">初めての参拝では、どの神社でも手に入る部品が2つもらえます。</p>
          )}
          <p className="tiny muted">2回目からは、参拝した日ごとに部品が1つ（と参道の玉砂利）もらえます。同じ神社は1日1回までです。</p>
        </section>

        {shrine ? (
          <section className="stack" aria-labelledby="facts-title">
            <h3 id="facts-title">この神社について</h3>
            <div className="fact">
              <span>
                <span className="chip chip--fact">事実</span>
              </span>
              <p>
                <strong>主祭神</strong>　{shrine.deities}
              </p>
              <SourceLinks ids={[SHRINE_SOURCE[shrine.id] ?? '']} />
            </div>
            <FactList facts={shrine.facts} />
            {shrine.known.length > 0 && <FactList facts={shrine.known.map((k) => ({ text: k.note, sources: k.sources }))} />}
          </section>
        ) : (
          <section className="notice">
            <strong>{place.kind === 'community' ? 'ほかの参拝者が登録した神社です' : 'あなたが加えた神社です'}</strong>
            <span>由緒や祭神は、境内の案内板や神社の公式な情報で確かめてください。このアプリには情報がありません。</span>
          </section>
        )}

        {custom && (
          <section className="card stack-s" aria-labelledby="reg-title">
            <h3 id="reg-title">みんなの地図への登録</h3>
            {custom.lat === undefined ? (
              <p className="small muted">位置を保存していないので、みんなの地図には登録できません。</p>
            ) : (
              <>
                {custom.chain && <ChainChip rec={custom.chain} />}
                <ChainAction rec={custom.chain ?? { status: 'local' }} demo={false} what="この神社" onSend={() => void registerPlace(custom.id)} />
              </>
            )}
          </section>
        )}

        <section className="stack-s" aria-labelledby="everyone-title">
          <h3 id="everyone-title">みんなの記録</h3>
          {community.status === 'off' ? (
            <p className="small muted">チェーンに接続していないため、みんなの記録は表示できません。</p>
          ) : community.status === 'error' ? (
            <p className="small muted">チェーンから読み込めませんでした。</p>
          ) : stats ? (
            <>
              <p className="small">
                参拝 {stats.visits} 回・{stats.visitors} 人
                {stats.reports > 0 && ` ・ 最新の様子：${REPORT_STATUS[stats.lastStatus] ?? '—'}（${dayToDate(stats.lastReportDay)}）`}
              </p>
              {reports.map((r) => (
                <p key={r.txHash} className="small">
                  {dayToDate(r.day)}　{REPORT_STATUS[r.status]}
                  {r.note && `「${r.note}」`}
                </p>
              ))}
              {reports.length > 0 && <p className="tiny muted">報告は参拝した人が書いたもので、神社の公式な情報ではありません。</p>}
            </>
          ) : (
            <div className="row" role="status">
              <span className="spinner" aria-hidden />
              <span className="small">読み込んでいます…</span>
            </div>
          )}
        </section>

        <section className="stack-s" aria-labelledby="mine-title">
          <h3 id="mine-title">あなたの参拝</h3>
          {visits.length === 0 ? (
            <p className="muted small">まだ参拝していません。</p>
          ) : (
            <ul className="list">
              {visits.map((v) => (
                <li key={v.id}>
                  <Link to={`/visits/${v.id}`} className="list-item">
                    <span className="list-item__main">
                      <span className="list-item__title">{formatDate(v.at)}</span>
                      <span className="list-item__sub">部品 {v.rewards.length}</span>
                    </span>
                    <ChainChip rec={v.chain} demo={v.demo} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="tiny muted">
          {`このページは公開されている資料と参拝者の記録をもとにした非公式の紹介です。このアプリは${place.kind === 'shrine' ? 'この神社と' : '神社と'}提携・公認の関係にありません。参拝時間や行事は公式の情報で確かめてください。`}
        </p>
      </div>
    </Screen>
  );
}
