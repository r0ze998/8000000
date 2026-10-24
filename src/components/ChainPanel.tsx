// チェーンへの記録状態と、その場でできる操作（同意・接続・送信・送り直し）を出す。

import { Link } from 'react-router-dom';
import { useChain } from '../chain/ChainContext';
import { useChainActions } from '../chain/useChainActions';
import { useGame } from '../state/GameContext';
import type { ChainRecord } from '../state/model';

export function ChainChip({ rec, demo }: { rec: ChainRecord; demo?: boolean }) {
  if (demo) return <span className="chip chip--demo">デモ（記録しない）</span>;
  switch (rec.status) {
    case 'confirmed':
      return <span className="chip chip--seen">チェーンに記録済み</span>;
    case 'sending':
      return <span className="chip">送信中</span>;
    case 'failed':
      return <span className="chip chip--warn">記録できず</span>;
    default:
      return <span className="chip">端末内のみ</span>;
  }
}

export function TxLink({ hash }: { hash?: string }) {
  const { cfg } = useChain();
  if (!hash) return null;
  const short = `${hash.slice(0, 8)}…${hash.slice(-6)}`;
  return cfg?.explorerTx ? (
    <a href={cfg.explorerTx(hash)} target="_blank" rel="noopener noreferrer" className="small">
      トランザクション {short}
    </a>
  ) : (
    <span className="small muted">トランザクション {short}（{cfg?.label}）</span>
  );
}

/** 同意のお願い。公開される内容をはっきり書く */
export function ConsentBox({ onDone }: { onDone?: (consent: boolean) => void }) {
  const { dispatch } = useGame();
  const { cfg } = useChain();
  const decide = (consent: boolean) => {
    dispatch({ type: 'setChainConsent', consent });
    onDone?.(consent);
  };
  return (
    <div className="notice notice--gold stack-s" role="group" aria-labelledby="consent-title">
      <strong id="consent-title">参拝をチェーンに記録しますか？</strong>
      <span className="small">
        記録すると、<b>ウォレットのアドレス・神社・日付</b>が {cfg?.label ?? 'チェーン'} に公開され、だれでも見られます。消すことはできません。
        位置の座標や時刻、メモは含みません（状況の報告をしたときは、その報告文が公開されます）。
      </span>
      <span className="small">記録しなくても、自分の神社はこの端末で育てられます。あとから設定で変えられます。</span>
      <div className="row">
        <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => decide(false)}>
          端末だけに残す
        </button>
        <button type="button" className="btn btn--primary" style={{ flex: 1 }} onClick={() => decide(true)}>
          記録する
        </button>
      </div>
    </div>
  );
}

/** 記録の状態に応じて、次にできることを1つ出す */
export function ChainAction({
  rec,
  demo,
  onSend,
  what = '参拝',
  disabledReason,
  unverified,
}: {
  rec: ChainRecord;
  demo: boolean;
  onSend: () => void;
  what?: string;
  disabledReason?: string;
  /** 位置を確かめていない参拝。みんなの地図の信頼性のため、チェーンには送らない */
  unverified?: boolean;
}) {
  const { block } = useChainActions();
  const { connect, status, error } = useChain();
  const b = block(demo);

  if (rec.status === 'confirmed')
    return rec.txHash ? <TxLink hash={rec.txHash} /> : <p className="small">{rec.reason ?? 'チェーンに記録済みです。'}</p>;
  if (unverified && !demo)
    return <p className="small muted">位置を確かめていない参拝は、みんなの地図の信頼性を守るため、チェーンには記録しません（部品はもらえます）。</p>;
  if (rec.status === 'sending')
    return (
      <div className="row" role="status">
        <span className="spinner" aria-hidden />
        <span className="small">チェーンに送っています…（数秒〜数十秒）</span>
      </div>
    );

  switch (b.kind) {
    case 'demo':
      return <p className="small muted">デモの{what}はチェーンに記録しません。</p>;
    case 'unconfigured':
      return <p className="small muted">このアプリはいまチェーンに接続していないため、{what}はこの端末にだけ保存されます。</p>;
    case 'consent':
      return <ConsentBox />;
    case 'declined':
      return (
        <p className="small muted">
          チェーンには記録しない設定です。<Link to="/settings#chain">設定で変える</Link>
        </p>
      );
    case 'disconnected':
      return (
        <div className="stack-s">
          {error && <p className="small notice notice--warn">{error}</p>}
          <button type="button" className="btn" onClick={() => void connect()} disabled={status === 'connecting'}>
            {status === 'connecting' ? '接続しています…' : 'ウォレットに接続して記録する'}
          </button>
        </div>
      );
    case 'ready':
      return (
        <div className="stack-s">
          {rec.status === 'failed' && rec.reason && <p className="small notice notice--warn">{rec.reason}</p>}
          {rec.txHash && <TxLink hash={rec.txHash} />}
          <button type="button" className="btn btn--primary" onClick={onSend} disabled={Boolean(disabledReason)}>
            {rec.status === 'failed' ? `${what}を送り直す` : `${what}をチェーンに記録する`}
          </button>
          {disabledReason && <p className="tiny muted">{disabledReason}</p>}
        </div>
      );
  }
}
