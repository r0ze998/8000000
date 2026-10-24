import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Illustration } from '../components/Illustration';
import { ShrinePlot } from '../components/ShrinePlot';
import { Sheet } from '../components/Sheet';
import { useGame } from '../state/GameContext';
import { canPlace, canRemove, cellKey, inventory, levelOf, LEVELS, type Game } from '../state/model';
import { PART_BY_ID, PARTS } from '../data/parts';

function GrowthCard({ game }: { game: Game }) {
  const level = levelOf(game);
  const visits = game.visits.length;
  const pct = level.next ? ((level.shrines - level.min) / (level.next.min - level.min)) * 100 : 100;
  return (
    <section className="card stack-s" aria-label="神社の育ち具合">
      <div className="row row--between" style={{ alignItems: 'baseline' }}>
        <span className="eyebrow">
          {level.name}・{level.size}×{level.size}
        </span>
        <span className="small muted">
          参拝 {visits} 回・{level.shrines} 社
        </span>
      </div>
      <div className="meter__bar" role="img" aria-label={`次の広さまで ${Math.round(pct)}%`}>
        <span className="meter__seen" style={{ width: `${pct}%` }} />
      </div>
      <p className="small">
        {level.next
          ? `あと ${level.toNext} 社に参拝すると、境内が ${level.next.size}×${level.next.size}（${level.next.name}）に広がります。`
          : `境内はいちばん広い「${LEVELS[LEVELS.length - 1]!.name}」になりました。`}
      </p>
    </section>
  );
}

export function Home() {
  const { game, dispatch, importedName } = useGame();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [cellSheet, setCellSheet] = useState<{ x: number; y: number } | null>(null);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const inv = useMemo(() => inventory(game), [game]);
  const tray = PARTS.filter((p) => (inv[p.id] ?? 0) > 0);
  const fresh = game.visits.length === 0;
  const newParts = params.get('new')?.split(',').filter(Boolean) ?? [];

  const tryDemo = () => {
    dispatch({ type: 'setDemo', demo: true });
    navigate(`/arrive/${game.settings.demoPlaceId}`);
  };

  const onCell = (x: number, y: number) => {
    setMessage(null);
    if (selected) {
      const check = canPlace(game, x, y, selected);
      if (!check.ok) {
        setMessage(check.reason);
        return;
      }
      dispatch({ type: 'place', x, y, partId: selected });
      setPlaced((s) => new Set(s).add(cellKey(x, y)));
      if ((inv[selected] ?? 0) <= 1) setSelected(null);
      return;
    }
    const occupied = (x === 0 && y === 0) || game.placements.some((p) => p.x === x && p.y === y);
    if (occupied) setCellSheet({ x, y });
    else setMessage('置きたい部品を下から選んでから、置く場所を押してください。');
  };

  const sheetPart =
    cellSheet && (cellSheet.x === 0 && cellSheet.y === 0 ? PART_BY_ID[game.honden] : PART_BY_ID[game.placements.find((p) => p.x === cellSheet.x && p.y === cellSheet.y)?.partId ?? '']);
  const hondenChoices = PARTS.filter((p) => p.canBeHonden && (p.id === 'hokora' || p.id === game.honden || (inv[p.id] ?? 0) > 0));

  const settings = (
    <Link to="/settings" className="icon-btn" aria-label="設定とデータ">
      <Icon name="settings" />
    </Link>
  );

  return (
    <Screen title={game.name} brand actions={settings}>
      <div className="stack-l">
        <header className="stack-s">
          <h2 style={{ fontSize: '1.5rem' }}>{game.name}</h2>
          {importedName && <p className="small muted">以前のアプリで付けた神社の名前を引き継ぎました。</p>}
        </header>

        {fresh && (
          <section className="card card--hero stack" aria-labelledby="intro-title">
            <span className="eyebrow">8000000</span>
            <h2 id="intro-title">神社に参拝すると、あなたの神社が育つ。</h2>
            <ol className="small" style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 6 }}>
              <li>実在の神社に行き、着いたことを位置で確かめて参拝する</li>
              <li>参拝すると、その神社にゆかりのある部品がもらえる</li>
              <li>部品を本殿の隣から置いていく。行った神社が増えるほど境内が広がる</li>
              <li>参拝の記録はチェーンに残り、みんなの神社の地図になる</li>
            </ol>
            <Link to="/places" className="btn btn--primary btn--block">
              <Icon name="places" />
              近くの神社をさがす
            </Link>
            <button type="button" className="btn btn--quiet" onClick={tryDemo}>
              神社に行かずにデモで試す
            </button>
          </section>
        )}

        <ShrinePlot game={game} selected={selected} onCell={onCell} highlight={placed} />

        {message && (
          <p className="notice notice--warn" role="status">
            {message}
          </p>
        )}

        {!fresh && (
          <section className="stack-s" aria-labelledby="tray-title">
            <div className="section-head">
              <h3 id="tray-title">手元の部品</h3>
              {selected && (
                <button type="button" className="link" onClick={() => setSelected(null)}>
                  選ぶのをやめる
                </button>
              )}
            </div>
            {tray.length === 0 ? (
              <p className="small muted">手元の部品はすべて置きました。神社に参拝すると、また部品がもらえます。</p>
            ) : (
              <>
                <p className="small muted">{selected ? `「${PART_BY_ID[selected]?.name}」を置く場所を押してください（光っているマス）。` : '部品を選び、本殿か置いた部品の隣に置きます。'}</p>
                <ul className="tray" aria-label="手元の部品">
                  {tray.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className={`tray__item${selected === p.id ? ' tray__item--on' : ''}${newParts.includes(p.id) ? ' tray__item--new' : ''}`}
                        aria-pressed={selected === p.id}
                        onClick={() => {
                          setMessage(null);
                          setSelected(selected === p.id ? null : p.id);
                        }}
                      >
                        <Illustration id={p.art} />
                        <span className="tray__name">{p.name}</span>
                        <span className="tray__count">×{inv[p.id]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        {!fresh && <GrowthCard game={game} />}

        {!fresh && (
          <Link to="/places" className="btn btn--primary btn--block">
            <Icon name="places" />
            神社に参拝する
          </Link>
        )}
      </div>

      {cellSheet && sheetPart && (
        <Sheet title={cellSheet.x === 0 && cellSheet.y === 0 ? `本殿：${sheetPart.name}` : sheetPart.name} onClose={() => setCellSheet(null)}>
          <div className="ill-frame" style={{ maxWidth: 220, margin: '0 auto', width: '100%' }}>
            <Illustration id={sheetPart.art} label={sheetPart.name} />
          </div>
          {sheetPart.featureId && (
            <Link to={`/guide/${sheetPart.featureId}`} className="btn btn--quiet">
              実際の{sheetPart.name.replace(/の社殿$/, '')}について（出典つき）
            </Link>
          )}
          {cellSheet.x === 0 && cellSheet.y === 0 ? (
            <div className="stack-s">
              <strong className="small">本殿を選ぶ</strong>
              <div className="row row--wrap">
                {hondenChoices.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`btn ${p.id === game.honden ? 'btn--moss' : ''}`}
                    aria-pressed={p.id === game.honden}
                    onClick={() => dispatch({ type: 'setHonden', partId: p.id })}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <p className="tiny muted">社殿の部品は、参拝で手に入ります（春日造は春日大社など）。</p>
            </div>
          ) : (
            (() => {
              const check = canRemove(game, cellSheet.x, cellSheet.y);
              return (
                <>
                  {!check.ok && <p className="small muted">{check.reason}</p>}
                  <button
                    type="button"
                    className="btn"
                    disabled={!check.ok}
                    onClick={() => {
                      dispatch({ type: 'remove', x: cellSheet.x, y: cellSheet.y });
                      setCellSheet(null);
                    }}
                  >
                    手元に戻す
                  </button>
                </>
              );
            })()
          )}
          <button type="button" className="btn btn--quiet" onClick={() => setCellSheet(null)}>
            閉じる
          </button>
        </Sheet>
      )}
    </Screen>
  );
}
