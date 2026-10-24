// ShrineNetwork コントラクトの読み書き。calldata と戻り値は codec.ts で自前に変換する。

import { RpcProvider, hash, num, type AccountInterface } from 'starknet';
import type { ChainConfig } from './config';
import { decodeByteArray, decodeLat, decodeLng, decodeShortId, encodeByteArray, encodeLat, encodeLng, encodeShortId, toNum } from './codec';

export interface ShrineStats {
  visits: number;
  visitors: number;
  reports: number;
  lastStatus: number;
  lastReportDay: number;
}

export interface RegisteredShrine {
  id: string;
  name: string;
  lat: number;
  lng: number;
  registrant: string;
  block: number;
}

export interface ConditionReport {
  shrineId: string;
  reporter: string;
  day: number;
  status: number;
  note: string;
  txHash: string;
}

export interface VisitEvent {
  shrineId: string;
  visitor: string;
  day: number;
  txHash: string;
}

const providers = new Map<string, RpcProvider>();
export const providerFor = (cfg: ChainConfig) => {
  let p = providers.get(cfg.rpcUrl);
  if (!p) {
    p = new RpcProvider({ nodeUrl: cfg.rpcUrl });
    providers.set(cfg.rpcUrl, p);
  }
  return p;
};

async function call(cfg: ChainConfig, entrypoint: string, calldata: string[]) {
  return providerFor(cfg).callContract({ contractAddress: cfg.contractAddress, entrypoint, calldata }, 'latest');
}

export async function readShrineStats(cfg: ChainConfig, shrineId: string): Promise<ShrineStats> {
  const r = await call(cfg, 'shrine_stats', [encodeShortId(shrineId)]);
  return { visits: toNum(r[0]), visitors: toNum(r[1]), reports: toNum(r[2]), lastStatus: toNum(r[3]), lastReportDay: toNum(r[4]) };
}

export async function readVisitorStats(cfg: ChainConfig, visitor: string) {
  const r = await call(cfg, 'visitor_stats', [visitor]);
  return { visits: toNum(r[0]), shrines: toNum(r[1]) };
}

export async function readVisitedToday(cfg: ChainConfig, visitor: string, shrineId: string) {
  const r = await call(cfg, 'has_visited_today', [visitor, encodeShortId(shrineId)]);
  return toNum(r[0]) === 1;
}

const KEY = {
  visited: num.toHex(hash.starknetKeccak('Visited')),
  registered: num.toHex(hash.starknetKeccak('ShrineRegistered')),
  reported: num.toHex(hash.starknetKeccak('ConditionReported')),
};

interface RawEvent {
  keys: string[];
  data: string[];
  transaction_hash: string;
  block_number?: number;
}

async function events(cfg: ChainConfig, keys: string[][]): Promise<RawEvent[]> {
  const provider = providerFor(cfg);
  const out: RawEvent[] = [];
  let token: string | undefined;
  for (let page = 0; page < 20; page++) {
    const res = await provider.getEvents({
      address: cfg.contractAddress,
      from_block: { block_number: cfg.deployBlock },
      to_block: 'latest',
      keys,
      chunk_size: 500,
      ...(token ? { continuation_token: token } : {}),
    });
    out.push(...(res.events as RawEvent[]));
    token = res.continuation_token;
    if (!token) break;
  }
  return out;
}

export async function listRegisteredShrines(cfg: ChainConfig): Promise<RegisteredShrine[]> {
  const evs = await events(cfg, [[KEY.registered]]);
  return evs.map((e) => {
    const d = e.data;
    const name = decodeByteArray(d, 1);
    return {
      id: decodeShortId(e.keys[1] ?? '0x0'),
      registrant: d[0] ?? '0x0',
      name: name.value,
      lat: decodeLat(toNum(d[name.next])),
      lng: decodeLng(toNum(d[name.next + 1])),
      block: e.block_number ?? 0,
    };
  });
}

export async function listReports(cfg: ChainConfig, shrineId?: string): Promise<ConditionReport[]> {
  const evs = await events(cfg, shrineId ? [[KEY.reported], [encodeShortId(shrineId)]] : [[KEY.reported]]);
  return evs
    .map((e) => ({
      shrineId: decodeShortId(e.keys[1] ?? '0x0'),
      reporter: e.keys[2] ?? '0x0',
      day: toNum(e.data[0]),
      status: toNum(e.data[1]),
      note: decodeByteArray(e.data, 2).value,
      txHash: e.transaction_hash,
    }))
    .reverse();
}

export async function listVisits(cfg: ChainConfig, visitor?: string): Promise<VisitEvent[]> {
  const evs = await events(cfg, visitor ? [[KEY.visited], [], [visitor]] : [[KEY.visited]]);
  return evs.map((e) => ({
    shrineId: decodeShortId(e.keys[1] ?? '0x0'),
    visitor: e.keys[2] ?? '0x0',
    day: toNum(e.data[0]),
    txHash: e.transaction_hash,
  }));
}

// ── 書き込み ──

export interface Sender {
  address: string;
  account: AccountInterface;
}

async function send(cfg: ChainConfig, sender: Sender, entrypoint: string, calldata: string[]) {
  const { transaction_hash } = await sender.account.execute({ contractAddress: cfg.contractAddress, entrypoint, calldata });
  return transaction_hash;
}

export const sendVisit = (cfg: ChainConfig, s: Sender, shrineId: string) => send(cfg, s, 'record_visit', [encodeShortId(shrineId)]);

export const sendRegister = (cfg: ChainConfig, s: Sender, shrineId: string, name: string, lat: number, lng: number) =>
  send(cfg, s, 'register_shrine', [encodeShortId(shrineId), ...encodeByteArray(name), String(encodeLat(lat)), String(encodeLng(lng))]);

export const sendReport = (cfg: ChainConfig, s: Sender, shrineId: string, status: number, note: string) =>
  send(cfg, s, 'report_condition', [encodeShortId(shrineId), String(status), ...encodeByteArray(note)]);

/** 送信したトランザクションの結果を待つ。失敗理由はチェーンのエラー文から短く取り出す */
export async function waitTx(cfg: ChainConfig, txHash: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  try {
    const r = await providerFor(cfg).waitForTransaction(txHash, { retryInterval: 1500 });
    if (r.isSuccess()) return { ok: true };
    const reason = 'revert_reason' in r.value ? String(r.value.revert_reason ?? '') : '';
    return { ok: false, reason: friendlyReason(reason) };
  } catch (e) {
    return { ok: false, reason: friendlyReason(e instanceof Error ? e.message : String(e)) };
  }
}

export function friendlyReason(raw: string): string {
  if (raw.includes('already visited today')) return 'この神社は今日すでにチェーンに記録されています（1日1回まで）。';
  if (raw.includes('visit before reporting')) return '報告できるのは、その神社への参拝をチェーンに記録したアカウントだけです。';
  if (raw.includes('already registered')) return 'この神社はすでにチェーンに登録されています。';
  if (raw.includes('bad name length')) return '神社の名前が長すぎます。';
  if (raw.includes('note too long')) return 'メモが長すぎます。';
  if (/User abort|rejected|declined|USER_REFUSED/i.test(raw)) return 'ウォレットで取り消されました。';
  if (/fetch|network|Failed to fetch|ECONNREFUSED|timeout/i.test(raw)) return 'チェーンにつながりませんでした。通信状態を確かめて、あとで送り直してください。';
  if (/balance|fee|Insufficient/i.test(raw)) return 'ウォレットのテスト用残高（手数料）が足りません。';
  return 'チェーンへの記録に失敗しました。あとで送り直せます。';
}
