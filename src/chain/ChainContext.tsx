// チェーンへの接続状態。devnet ではテスト用アカウントを使い、Sepolia ではウォレット拡張（Argent X / Braavos）を使う。

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Account, WalletAccount } from 'starknet';
import { CHAIN, type ChainConfig } from './config';
import { providerFor, type Sender } from './client';

export type ChainStatus = 'unconfigured' | 'disconnected' | 'connecting' | 'connected' | 'error';

interface ChainCtx {
  cfg: ChainConfig | null;
  status: ChainStatus;
  sender: Sender | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Ctx = createContext<ChainCtx | null>(null);

export function ChainProvider({ children }: { children: ReactNode }) {
  const cfg = CHAIN;
  const [status, setStatus] = useState<ChainStatus>(cfg ? 'disconnected' : 'unconfigured');
  const [sender, setSender] = useState<Sender | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!cfg) return;
    setStatus('connecting');
    setError(null);
    try {
      const provider = providerFor(cfg);
      if (cfg.chain === 'devnet' && cfg.devAccount) {
        const account = new Account({ provider, address: cfg.devAccount.address, signer: cfg.devAccount.privateKey });
        setSender({ address: cfg.devAccount.address, account });
      } else {
        const { connect: getWallet } = await import('@starknet-io/get-starknet');
        const swo = await getWallet({ modalMode: 'alwaysAsk', modalTheme: 'system' });
        if (!swo) throw new Error('USER_REFUSED');
        // get-starknet と starknet.js で型の版がずれているだけで、実体は同じウォレットオブジェクト
        const account = await WalletAccount.connect(provider, swo as unknown as Parameters<typeof WalletAccount.connect>[1]);
        setSender({ address: account.address, account });
      }
      setStatus('connected');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        /USER_REFUSED|reject|abort/i.test(msg)
          ? 'ウォレットの接続が取り消されました。'
          : 'ウォレットに接続できませんでした。Argent X または Braavos をインストールし、Sepolia テストネットに切り替えてから試してください。',
      );
      setStatus('error');
    }
  }, [cfg]);

  const disconnect = useCallback(() => {
    setSender(null);
    setStatus(cfg ? 'disconnected' : 'unconfigured');
  }, [cfg]);

  // devnet ではテスト用アカウントにすぐつなぐ
  useEffect(() => {
    if (cfg?.chain === 'devnet' && cfg.devAccount) void connect();
  }, [cfg, connect]);

  const value = useMemo(() => ({ cfg, status, sender, error, connect, disconnect }), [cfg, status, sender, error, connect, disconnect]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChain() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useChain must be used inside ChainProvider');
  return v;
}
