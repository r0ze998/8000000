// みんなの記録（チェーン上の神社の登録・参拝数・様子の報告）を読む。画面をまたいで使い回す。

import { useCallback, useEffect, useState } from 'react';
import { useChain } from './ChainContext';
import { listRegisteredShrines, listReports, readShrineStats, type ConditionReport, type RegisteredShrine, type ShrineStats } from './client';
import { SHRINES } from '../data/shrines';

export interface Community {
  status: 'off' | 'loading' | 'ok' | 'error';
  shrines: RegisteredShrine[];
  stats: Record<string, ShrineStats>;
  reports: ConditionReport[];
  loadedAt?: number;
}

let cache: Community = { status: 'off', shrines: [], stats: {}, reports: [] };
const listeners = new Set<(c: Community) => void>();
const publish = (c: Community) => {
  cache = c;
  listeners.forEach((l) => l(c));
};

export function useCommunity() {
  const { cfg } = useChain();
  const [data, setData] = useState<Community>(cfg ? cache : { status: 'off', shrines: [], stats: {}, reports: [] });

  useEffect(() => {
    listeners.add(setData);
    return () => {
      listeners.delete(setData);
    };
  }, []);

  const reload = useCallback(async () => {
    if (!cfg) return;
    publish({ ...cache, status: 'loading' });
    try {
      const [shrines, reports] = await Promise.all([listRegisteredShrines(cfg), listReports(cfg)]);
      const ids = [...SHRINES.map((s) => s.id), ...shrines.map((s) => s.id)];
      const entries = await Promise.all(ids.map(async (id) => [id, await readShrineStats(cfg, id)] as const));
      publish({ status: 'ok', shrines, reports, stats: Object.fromEntries(entries), loadedAt: Date.now() });
    } catch {
      publish({ ...cache, status: 'error' });
    }
  }, [cfg]);

  useEffect(() => {
    if (cfg && (cache.status === 'off' || (cache.loadedAt && Date.now() - cache.loadedAt > 60_000))) void reload();
  }, [cfg, reload]);

  return { ...data, reload };
}
