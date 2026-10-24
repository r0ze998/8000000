import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Sheet } from '../components/Sheet';
import { useGame } from '../state/GameContext';
import { useChain } from '../chain/ChainContext';
import { emptyGame } from '../state/model';
import { parseGame } from '../state/storage';
import { SHRINES } from '../data/shrines';
import { SOURCES } from '../data/sources';
import { PRIVACY_POINTS } from '../data/etiquette';

const short = (a: string) => `${a.slice(0, 8)}…${a.slice(-6)}`;

export function Settings() {
  const { game, dispatch } = useGame();
  const { cfg, status, sender, error, connect, disconnect } = useChain();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(game.name);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pendingImport, setPendingImport] = useState<ReturnType<typeof parseGame>>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const demoCount = game.visits.filter((v) => v.demo).length;

  useEffect(() => {
    const id = hash.replace('#', '');
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [hash]);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8000000-shrine-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onFile = async (file: File | undefined) => {
    setImportMsg(null);
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error('too big');
      const parsed = parseGame(JSON.parse(await file.text()));
      if (!parsed) throw new Error('shape');
      setPendingImport(parsed);
    } catch {
      setImportMsg({ ok: false, text: 'このファイルは読み込めませんでした。このアプリで書き出した .json ファイルを選んでください。' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Screen title="設定とデータ" back="/">
      <div className="stack-l">
        <section className="card stack" aria-labelledby="name-title">
          <h2 id="name-title">神社の名前</h2>
          <form
            className="row"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'setName', name });
            }}
          >
            <label className="field" style={{ flex: 1 }}>
              <span className="visually-hidden">神社の名前</span>
              <input type="text" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} />
            </label>
            <button type="submit" className="btn" disabled={!name.trim() || name.trim() === game.name}>
              保存
            </button>
          </form>
        </section>

        <section className="card stack" id="chain" aria-labelledby="chain-title">
          <h2 id="chain-title">チェーン（DePIN）</h2>
          {!cfg ? (
            <p className="small">
              このアプリはいまチェーンの設定がないため、参拝は端末内にだけ保存されます。開発者向けの設定方法は README にあります。
            </p>
          ) : (
            <>
              <p className="small">
                接続先：<strong>{cfg.label}</strong>
                {cfg.chain === 'sepolia' && '（テスト用のネットワークで、実際のお金は使いません）'}
              </p>
              {cfg.explorerContract ? (
                <a href={cfg.explorerContract(cfg.contractAddress)} target="_blank" rel="noopener noreferrer" className="small">
                  記録先のコントラクト {short(cfg.contractAddress)}
                </a>
              ) : (
                <span className="small muted">記録先のコントラクト {short(cfg.contractAddress)}</span>
              )}
              <div className="stack-s">
                <strong className="small">ウォレット</strong>
                {sender ? (
                  <div className="row row--between">
                    <span className="small">
                      接続中：{short(sender.address)}
                      {cfg.chain === 'devnet' && '（devnet のテスト用アカウント）'}
                    </span>
                    {cfg.chain !== 'devnet' && (
                      <button type="button" className="btn btn--quiet" onClick={disconnect}>
                        切断
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <button type="button" className="btn" onClick={() => void connect()} disabled={status === 'connecting'}>
                      {status === 'connecting' ? '接続しています…' : 'ウォレットに接続'}
                    </button>
                    <p className="tiny muted">Argent X または Braavos（ブラウザ拡張・アプリ）を Sepolia テストネットに切り替えて使います。手数料にはテスト用の STRK が必要です。</p>
                  </>
                )}
                {error && <p className="small notice notice--warn">{error}</p>}
              </div>
              <label className="row" style={{ minHeight: 48, alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={game.settings.chainConsent === true}
                  onChange={(e) => dispatch({ type: 'setChainConsent', consent: e.target.checked })}
                  style={{ width: 24, height: 24, marginTop: 2 }}
                />
                <span>
                  <strong>参拝をチェーンに記録する</strong>
                  <br />
                  <span className="small muted">ウォレットのアドレス・神社・日付が公開され、消せません。オフにしても、自分の神社は端末で育てられます。</span>
                </span>
              </label>
            </>
          )}
        </section>

        <section className="card stack" id="demo" aria-labelledby="demo-title">
          <h2 id="demo-title">デモモード</h2>
          <p className="small">
            {'神社に行かなくても、参拝から部品を置くまでの流れを試せます。位置は選んだ神社の近くにいる「模擬位置」になり、デモの参拝には「デモ」と表示されます。チェーンには記録しません。'}
          </p>
          <label className="row" style={{ minHeight: 48 }}>
            <input
              type="checkbox"
              checked={game.settings.demo}
              onChange={(e) => dispatch({ type: 'setDemo', demo: e.target.checked })}
              style={{ width: 24, height: 24 }}
            />
            <strong>デモモードを使う</strong>
          </label>
          <label className="field">
            模擬位置にする神社
            <select value={game.settings.demoPlaceId} onChange={(e) => dispatch({ type: 'setDemo', demo: game.settings.demo, demoPlaceId: e.target.value })}>
              {SHRINES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}（{s.prefecture}）
                </option>
              ))}
            </select>
          </label>
          {game.settings.demo && (
            <button type="button" className="btn btn--primary" onClick={() => navigate(`/arrive/${game.settings.demoPlaceId}`)}>
              デモで参拝する
            </button>
          )}
          <button type="button" className="btn btn--quiet btn--danger" disabled={demoCount === 0} onClick={() => dispatch({ type: 'clearDemo' })}>
            デモの参拝と部品をすべて消す（{demoCount}件）
          </button>
        </section>

        <section className="card stack" id="data" aria-labelledby="data-title">
          <h2 id="data-title">端末のデータ</h2>
          <p className="small">
            自分の神社の配置と、チェーンに記録していない参拝は、この端末のブラウザにだけ保存されています。ときどき書き出しておくと安心です。
          </p>
          <button type="button" className="btn" onClick={exportData}>
            データを書き出す（.json）
          </button>
          <label className="btn">
            書き出したデータを読み込む
            <input ref={fileRef} type="file" accept="application/json,.json" className="visually-hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          {importMsg && (
            <div className={`notice ${importMsg.ok ? 'notice--ok' : 'notice--warn'}`} role="status">
              {importMsg.text}
            </div>
          )}
          <button type="button" className="btn btn--quiet btn--danger" onClick={() => setConfirmReset(true)}>
            端末のデータをすべて消す
          </button>
        </section>

        <section className="stack-s" aria-labelledby="privacy-title">
          <h2 id="privacy-title">位置情報とプライバシー</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            {PRIVACY_POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="stack-s" aria-labelledby="about-title">
          <h2 id="about-title">このアプリについて</h2>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
            <li>非公式の個人制作アプリです。掲載している神社を含め、いずれの神社・団体とも提携・公認の関係にありません。</li>
            <li>部品と「自分の神社」はゲーム上の創作です。「事実」の印が付いた文だけが出典に基づく説明です。</li>
            <li>トークンの発行・販売や、お金のやりとりはありません。チェーンには参拝・神社の登録・様子の報告だけを記録します。</li>
            <li>位置の確認は端末の GPS によるもので、なりすましを完全には防げません。みんなの地図は参考情報です。</li>
            <li>地図の画像は OpenStreetMap を使っています。挿絵はこのアプリのために描いた模式図です。</li>
          </ul>
          <details className="disclosure">
            <summary>出典の一覧（{Object.keys(SOURCES).length}件）</summary>
            <ul className="small" style={{ paddingLeft: '1.2em', display: 'grid', gap: 4 }}>
              {Object.values(SOURCES).map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.publisher === 'Wikipedia' ? s.title : `${s.publisher}「${s.title}」`}
                  </a>
                </li>
              ))}
            </ul>
            <p className="tiny muted">Wikipedia の記事は CC BY-SA 4.0 で提供されています。本アプリの文章は要約・言い換えです。</p>
          </details>
          <Link to="/manners" className="small">
            参拝の作法と心得
          </Link>
          <p className="tiny muted">8000000 v3.1.0</p>
        </section>
      </div>

      {pendingImport && (
        <Sheet title="このデータを読み込みますか？" onClose={() => setPendingImport(null)}>
          <p>
            「{pendingImport.name}」（参拝 {pendingImport.visits.length} 回）を読み込みます。いまの端末のデータは置き換わります。チェーンに記録済みの参拝は消えません。
          </p>
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setPendingImport(null)}>
              やめる
            </button>
            <button
              type="button"
              className="btn btn--primary"
              style={{ flex: 2 }}
              onClick={() => {
                dispatch({ type: 'replace', game: pendingImport });
                setPendingImport(null);
                setImportMsg({ ok: true, text: 'データを読み込みました。' });
              }}
            >
              読み込む
            </button>
          </div>
        </Sheet>
      )}
      {confirmReset && (
        <Sheet title="端末のデータをすべて消しますか？" onClose={() => setConfirmReset(false)}>
          <p>自分の神社の配置、部品、参拝の控えが消えます。元に戻せません。チェーンに記録済みの参拝・報告は消えません。</p>
          <div className="row">
            <button type="button" className="btn btn--quiet" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>
              やめる
            </button>
            <button
              type="button"
              className="btn btn--danger"
              style={{ flex: 1 }}
              onClick={() => {
                dispatch({ type: 'replace', game: emptyGame() });
                setConfirmReset(false);
                navigate('/', { replace: true });
              }}
            >
              すべて消す
            </button>
          </div>
        </Sheet>
      )}
    </Screen>
  );
}
