// 参拝・報告・神社登録をチェーンに送る。結果は帳面の控え（ChainRecord）に反映する。

import { useCallback } from 'react';
import { useChain } from './ChainContext';
import { friendlyReason, readVisitedToday, sendRegister, sendReport, sendVisit, waitTx } from './client';
import { jstDay } from './codec';
import { useGame } from '../state/GameContext';
import type { Report } from '../state/model';

export type ChainBlock =
  | { kind: 'demo' }
  | { kind: 'unconfigured' }
  | { kind: 'consent' }
  | { kind: 'declined' }
  | { kind: 'disconnected' }
  | { kind: 'ready' };

export function useChainActions() {
  const { cfg, sender, status } = useChain();
  const { game, dispatch } = useGame();

  /** いまチェーンに送れるか、送れないなら何が足りないか */
  const block = useCallback(
    (demo: boolean): ChainBlock => {
      if (demo) return { kind: 'demo' };
      if (!cfg) return { kind: 'unconfigured' };
      if (game.settings.chainConsent === null) return { kind: 'consent' };
      if (game.settings.chainConsent === false) return { kind: 'declined' };
      if (!sender || status !== 'connected') return { kind: 'disconnected' };
      return { kind: 'ready' };
    },
    [cfg, sender, status, game.settings.chainConsent],
  );

  const run = useCallback(
    async (send: () => Promise<string>, set: (c: { status: 'sending' | 'confirmed' | 'failed'; txHash?: string; reason?: string }) => void) => {
      if (!cfg || !sender) return false;
      set({ status: 'sending' });
      let txHash: string | undefined;
      try {
        txHash = await send();
        set({ status: 'sending', txHash });
        const r = await waitTx(cfg, txHash);
        set(r.ok ? { status: 'confirmed', txHash } : { status: 'failed', txHash, reason: r.reason });
        return r.ok;
      } catch (e) {
        set({ status: 'failed', txHash, reason: friendlyReason(e instanceof Error ? e.message : String(e)) });
        return false;
      }
    },
    [cfg, sender],
  );

  const recordVisit = useCallback(
    (visitId: string) => {
      const v = game.visits.find((x) => x.id === visitId);
      if (!v || !cfg || !sender) return Promise.resolve(false);
      const set = (c: Parameters<Parameters<typeof run>[1]>[0]) =>
        dispatch({ type: 'setVisitChain', visitId, chain: { ...c, address: sender.address } });
      return (async () => {
        // 別の端末や前回の送信で、今日の参拝がもう記録されていれば、送らずに記録済みとする
        const already = await readVisitedToday(cfg, sender.address, v.placeId).catch(() => false);
        if (already && jstDay(Date.now()) === v.day) {
          dispatch({
            type: 'setVisitChain',
            visitId,
            chain: { status: 'confirmed', address: sender.address, reason: '今日のこの神社への参拝は、すでにこのアドレスで記録されていました。' },
          });
          return true;
        }
        return run(() => sendVisit(cfg, sender, v.placeId), set);
      })();
    },
    [game.visits, cfg, sender, run, dispatch],
  );

  /** 保存した直後にも送れるよう、報告そのものを受け取る */
  const recordReport = useCallback(
    (r: Report) => {
      if (!cfg || !sender) return Promise.resolve(false);
      return run(
        () => sendReport(cfg, sender, r.placeId, r.status, r.note),
        (c) => dispatch({ type: 'setReportChain', reportId: r.id, chain: { ...c, address: sender.address } }),
      );
    },
    [cfg, sender, run, dispatch],
  );

  const registerPlace = useCallback(
    (placeId: string) => {
      const p = game.customPlaces.find((x) => x.id === placeId);
      if (!p || p.lat === undefined || p.lng === undefined || !cfg || !sender) return Promise.resolve(false);
      return run(
        () => sendRegister(cfg, sender, p.id, p.name, p.lat!, p.lng!),
        (c) => dispatch({ type: 'setPlaceChain', placeId, chain: { ...c, address: sender.address } }),
      );
    },
    [game.customPlaces, cfg, sender, run, dispatch],
  );

  return { block, recordVisit, recordReport, registerPlace };
}
