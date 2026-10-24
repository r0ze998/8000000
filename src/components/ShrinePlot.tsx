// 自分の神社の敷地。中央が本殿。いまの広さの外側に、次に広がる一周を「まだ入れない土地」として見せる。

import { Illustration } from './Illustration';
import { PART_BY_ID } from '../data/parts';
import { canPlace, cellKey, levelOf, type Game } from '../state/model';

interface Props {
  game: Game;
  selected?: string | null;
  onCell?: (x: number, y: number) => void;
  /** 一覧などで小さく見せるとき */
  compact?: boolean;
  /** 新しく置いた・広がったマスを光らせる */
  highlight?: Set<string>;
}

export function ShrinePlot({ game, selected, onCell, compact, highlight }: Props) {
  const level = levelOf(game);
  const showRing = !compact && Boolean(level.next);
  const R = level.radius + (showRing ? 1 : 0);
  const size = R * 2 + 1;
  const byCell = new Map(game.placements.map((p) => [cellKey(p.x, p.y), p.partId]));
  const honden = PART_BY_ID[game.honden] ?? PART_BY_ID.hokora!;

  const cells = [];
  for (let y = -R; y <= R; y++) {
    for (let x = -R; x <= R; x++) {
      const locked = Math.abs(x) > level.radius || Math.abs(y) > level.radius;
      const isCenter = x === 0 && y === 0;
      const partId = isCenter ? honden.id : byCell.get(cellKey(x, y));
      const part = partId ? PART_BY_ID[partId] : undefined;
      const placeable = !locked && !part && selected ? canPlace(game, x, y, selected).ok : false;
      const label = locked
        ? 'まだ入れない土地'
        : isCenter
          ? `本殿：${honden.name}`
          : part
            ? part.name
            : placeable
              ? '置ける'
              : '空き地';
      const cls = [
        'plot__cell',
        locked && 'plot__cell--locked',
        isCenter && 'plot__cell--center',
        part?.kind === 'path' && 'plot__cell--path',
        placeable && 'plot__cell--placeable',
        highlight?.has(cellKey(x, y)) && 'plot__cell--new',
      ]
        .filter(Boolean)
        .join(' ');
      cells.push(
        onCell && !locked ? (
          <button key={cellKey(x, y)} type="button" className={cls} aria-label={`${label}（${x}, ${y}）`} onClick={() => onCell(x, y)}>
            {part && part.kind !== 'path' && <Illustration id={part.art} />}
          </button>
        ) : (
          <span key={cellKey(x, y)} className={cls} aria-hidden={locked || undefined} title={label}>
            {part && part.kind !== 'path' && <Illustration id={part.art} />}
          </span>
        ),
      );
    }
  }

  return (
    <div className={`plot${compact ? ' plot--compact' : ''}${selected ? ' plot--placing' : ''}`}>
      <div
        className="plot__grid"
        // 広くなっても指で押せるよう、1マス 36px より小さくしない（はみ出す分は横にスクロール）
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, minWidth: compact ? undefined : size * 36 }}
        role={onCell ? 'group' : 'img'}
        aria-label={`${game.name}の境内（${level.size}×${level.size}）`}
      >
        {cells}
      </div>
    </div>
  );
}
