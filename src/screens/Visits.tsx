import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { ChainChip } from '../components/ChainPanel';
import { useGame } from '../state/GameContext';
import { useChain } from '../chain/ChainContext';
import { readVisitorStats } from '../chain/client';
import { distinctShrines } from '../state/model';
import { formatDate } from '../lib/time';

export function Visits() {
  const { game } = useGame();
  const { cfg, sender } = useChain();
  const [onChain, setOnChain] = useState<{ visits: number; shrines: number } | 'error' | null>(null);
  const list = [...game.visits].sort((a, b) => b.at.localeCompare(a.at));
  const confirmed = game.visits.filter((v) => v.chain.status === 'confirmed').length;
  const pending = game.visits.filter((v) => !v.demo && v.check !== 'self' && (v.chain.status === 'local' || v.chain.status === 'failed')).length;

  useEffect(() => {
    if (!cfg || !sender) return;
    let alive = true;
    readVisitorStats(cfg, sender.address).then(
      (s) => alive && setOnChain(s),
      () => alive && setOnChain('error'),
    );
    return () => {
      alive = false;
    };
  }, [cfg, sender, confirmed]);

  const settings = (
    <Link to="/settings" className="icon-btn" aria-label="設定とデータ">
      <Icon name="settings" />
    </Link>
  );

  return (
    <Screen title="記録" actions={settings}>
      <div className="stack-l">
        <header className="card card--hero stack-s">
          <span className="eyebrow">参拝の記録</span>
          <dl className="row row--wrap" style={{ margin: 0, gap: 18 }}>
            {[
              ['参拝', game.visits.length],
              ['神社', distinctShrines(game)],
              ['チェーンに記録', confirmed],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="tiny muted">{k}</dt>
                <dd style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700 }}>{v}</dd>
              </div>
            ))}
          </dl>
          {cfg && sender && onChain && onChain !== 'error' && (
            <p className="small muted">
              チェーン上のあなたのアドレスの記録：参拝 {onChain.visits} 回・{onChain.shrines} 社（{cfg.label}）
            </p>
          )}
          {onChain === 'error' && <p className="small muted">チェーンの記録を読み込めませんでした。通信状態を確かめてください。</p>}
          {pending > 0 && (
            <p className="small">
              チェーンにまだ記録していない参拝が {pending} 件あります。各記録から送れます（記録日は送った日になります）。
            </p>
          )}
        </header>

        {list.length === 0 ? (
          <div className="empty">
            <p>まだ参拝の記録はありません。神社に着いたら「参拝」から始めます。</p>
            <Link to="/places" className="btn btn--primary">
              神社をさがす
            </Link>
          </div>
        ) : (
          <ul className="list">
            {list.map((v) => (
              <li key={v.id}>
                <Link to={`/visits/${v.id}`} className="list-item">
                  <span className="list-item__main">
                    <span className="list-item__title">{v.placeName}</span>
                    <span className="list-item__sub">
                      {formatDate(v.at)} ・ 部品 {v.rewards.length}
                      {v.check === 'self' && ' ・ 位置未確認'}
                    </span>
                  </span>
                  <ChainChip rec={v.chain} demo={v.demo} />
                  <span className="chev">
                    <Icon name="chevron" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}
