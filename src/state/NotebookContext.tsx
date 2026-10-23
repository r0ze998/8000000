import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { reduce, type Action, type Notebook } from './model';
import { loadNotebook, parseNotebook, saveNotebook, STORAGE_KEY, type LoadResult } from './storage';

export type StorageHealth = 'ok' | 'unavailable' | 'save-failed';

interface NotebookContextValue {
  nb: Notebook;
  dispatch: (action: Action) => void;
  /** 起動時の読み込み結果（壊れたデータを退避したか等） */
  loadStatus: LoadResult['status'];
  backupKey?: string;
  importedTitle: boolean;
  health: StorageHealth;
  dismissLoadNotice: () => void;
}

const Ctx = createContext<NotebookContextValue | null>(null);

export function NotebookProvider({ children, initial }: { children: ReactNode; initial?: LoadResult }) {
  const [load] = useState<LoadResult>(() => initial ?? loadNotebook());
  const [loadStatus, setLoadStatus] = useState(load.status);
  const [nb, dispatch] = useReducer(reduce, load.notebook);
  const [health, setHealth] = useState<StorageHealth>(load.status === 'unavailable' ? 'unavailable' : 'ok');
  const skipNextSave = useRef(true);

  useEffect(() => {
    // 初回描画では保存しない（復元直後の上書きで退避前のデータを失わないため）
    if (skipNextSave.current) {
      skipNextSave.current = false;
      if (load.status !== 'fresh') return;
    }
    if (health === 'unavailable') return;
    setHealth(saveNotebook(nb) ? 'ok' : 'save-failed');
  }, [nb, health, load.status]);

  // 別のタブで帳面が変わったら取り込む
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue === null) return;
      try {
        const parsed = parseNotebook(JSON.parse(e.newValue));
        if (parsed) {
          skipNextSave.current = true;
          dispatch({ type: 'replace', notebook: parsed });
        }
      } catch {
        /* 無視 */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const dismissLoadNotice = useCallback(() => setLoadStatus('restored'), []);

  const value = useMemo<NotebookContextValue>(
    () => ({
      nb,
      dispatch,
      loadStatus,
      backupKey: load.status === 'recovered' ? load.backupKey : undefined,
      importedTitle: load.status === 'fresh' && load.importedTitle,
      health,
      dismissLoadNotice,
    }),
    [nb, loadStatus, load, health, dismissLoadNotice],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotebook() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useNotebook must be used inside NotebookProvider');
  return v;
}
