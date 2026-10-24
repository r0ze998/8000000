import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { reduce, type Action, type Game } from './model';
import { loadGame, parseGame, saveGame, STORAGE_KEY, type LoadResult } from './storage';

export type StorageHealth = 'ok' | 'unavailable' | 'save-failed';

interface GameContextValue {
  game: Game;
  dispatch: (action: Action) => void;
  loadStatus: LoadResult['status'];
  backupKey?: string;
  importedName: boolean;
  health: StorageHealth;
  dismissLoadNotice: () => void;
}

const Ctx = createContext<GameContextValue | null>(null);

export function GameProvider({ children, initial }: { children: ReactNode; initial?: LoadResult }) {
  const [load] = useState<LoadResult>(() => initial ?? loadGame());
  const [loadStatus, setLoadStatus] = useState(load.status);
  const [game, dispatch] = useReducer(reduce, load.game);
  const [health, setHealth] = useState<StorageHealth>(load.status === 'unavailable' ? 'unavailable' : 'ok');
  const first = useRef(true);
  const fromOtherTab = useRef(false);

  useEffect(() => {
    // 起動直後は保存しない（壊れたデータを退避した直後に上書きしないため）
    if (first.current) {
      first.current = false;
      if (load.status !== 'fresh') return;
    }
    if (fromOtherTab.current) {
      fromOtherTab.current = false;
      return;
    }
    if (health === 'unavailable') return;
    setHealth(saveGame(game) ? 'ok' : 'save-failed');
  }, [game, health, load.status]);

  // 別のタブでの変更を取り込む
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue === null) return;
      try {
        const parsed = parseGame(JSON.parse(e.newValue));
        if (parsed) {
          fromOtherTab.current = true;
          dispatch({ type: 'replace', game: parsed });
        }
      } catch {
        /* 無視 */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const dismissLoadNotice = useCallback(() => setLoadStatus('restored'), []);

  const value = useMemo<GameContextValue>(
    () => ({
      game,
      dispatch,
      loadStatus,
      backupKey: load.status === 'recovered' ? load.backupKey : undefined,
      importedName: load.status === 'fresh' && load.importedName,
      health,
      dismissLoadNotice,
    }),
    [game, loadStatus, load, health, dismissLoadNotice],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGame must be used inside GameProvider');
  return v;
}
