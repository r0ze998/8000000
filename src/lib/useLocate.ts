import { useCallback, useState } from 'react';
import { getPosition, type LatLng, type PositionResult } from './geo';
import { useNotebook } from '../state/NotebookContext';
import { SHRINE_BY_ID } from '../data/shrines';

export type LocateState =
  | { phase: 'idle' }
  | { phase: 'locating' }
  | { phase: 'ok'; coords: LatLng; accuracyM: number; simulated: boolean }
  | { phase: 'error'; reason: Exclude<PositionResult, { ok: true }>['reason'] };

/** 位置を一度だけ取得する。デモモードでは、選んだ神社の約110m南の模擬位置を返す */
export function useLocate() {
  const { nb } = useNotebook();
  const [state, setState] = useState<LocateState>({ phase: 'idle' });

  const locate = useCallback(async () => {
    setState({ phase: 'locating' });
    if (nb.settings.demo) {
      const s = SHRINE_BY_ID[nb.settings.demoPlaceId];
      await new Promise((r) => setTimeout(r, 400));
      if (s) {
        setState({ phase: 'ok', coords: { lat: s.lat - 0.001, lng: s.lng }, accuracyM: 30, simulated: true });
        return;
      }
    }
    const r = await getPosition();
    setState(r.ok ? { phase: 'ok', coords: r.coords, accuracyM: r.accuracyM, simulated: false } : { phase: 'error', reason: r.reason });
  }, [nb.settings.demo, nb.settings.demoPlaceId]);

  return { state, locate, reset: () => setState({ phase: 'idle' }) };
}
