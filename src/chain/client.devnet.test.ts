// @vitest-environment node
// 実際の devnet を起動し、コントラクトをデプロイして、アプリのチェーン層を通しで確かめる。
// contracts/target がない（scarb build 前の）環境では飛ばす。

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Account, RpcProvider, json } from 'starknet';
import { Devnet } from 'starknet-devnet';
import type { ChainConfig } from './config';
import {
  listRegisteredShrines,
  listReports,
  listVisits,
  readShrineStats,
  readVisitedToday,
  readVisitorStats,
  sendRegister,
  sendReport,
  sendVisit,
  waitTx,
  type Sender,
} from './client';

const artifact = (ext: string) => path.resolve(__dirname, '../../contracts/target/dev', `shrine_network_ShrineNetwork.${ext}.json`);
const ready = fs.existsSync(artifact('compiled_contract_class'));

describe.skipIf(!ready)('devnet 上のチェーン層', () => {
  let devnet: Devnet;
  let cfg: ChainConfig;
  let alice: Sender;
  let bob: Sender;

  beforeAll(async () => {
    // 5060/5061 は fetch で禁止されたポートなので使わない
    devnet = await Devnet.spawnVersion('latest', { args: ['--seed', '7', '--port', '5055'], stdout: 'ignore', stderr: 'ignore', maxStartupMillis: 60000 });
    const nodeUrl = 'http://127.0.0.1:5055';
    const provider = new RpcProvider({ nodeUrl });
    const [d, a, b] = await devnet.provider.getPredeployedAccounts();
    const deployer = new Account({ provider, address: d!.address, signer: d!.private_key });
    const res = await deployer.declareAndDeploy({
      contract: json.parse(fs.readFileSync(artifact('contract_class'), 'utf8')),
      casm: json.parse(fs.readFileSync(artifact('compiled_contract_class'), 'utf8')),
    });
    await provider.waitForTransaction(res.deploy.transaction_hash);
    cfg = { chain: 'devnet', rpcUrl: nodeUrl, contractAddress: res.deploy.contract_address, deployBlock: 0, label: 'test' };
    alice = { address: a!.address, account: new Account({ provider, address: a!.address, signer: a!.private_key }) };
    bob = { address: b!.address, account: new Account({ provider, address: b!.address, signer: b!.private_key }) };
  }, 120_000);

  afterAll(() => devnet?.kill());

  it('参拝を記録し、同じ日の2回目は理由付きで断られる', async () => {
    expect(await waitTx(cfg, await sendVisit(cfg, alice, 'kasuga-taisha'))).toEqual({ ok: true });
    expect(await readVisitedToday(cfg, alice.address, 'kasuga-taisha')).toBe(true);
    const second = await sendVisit(cfg, alice, 'kasuga-taisha').then(
      (h) => waitTx(cfg, h),
      (e: Error) => ({ ok: false as const, reason: e.message }),
    );
    expect(second.ok).toBe(false);

    await waitTx(cfg, await sendVisit(cfg, bob, 'kasuga-taisha'));
    expect(await readShrineStats(cfg, 'kasuga-taisha')).toMatchObject({ visits: 2, visitors: 2 });
    expect(await readVisitorStats(cfg, alice.address)).toEqual({ visits: 1, shrines: 1 });
    const visits = await listVisits(cfg, alice.address);
    expect(visits.map((v) => v.shrineId)).toEqual(['kasuga-taisha']);
  }, 60_000);

  it('日本語の神社名を登録し、イベントから読み戻せる', async () => {
    await waitTx(cfg, await sendRegister(cfg, bob, 'c-test0001', '坂の上八幡神社（さかのうえ）', 35.6812, 139.7671));
    const list = await listRegisteredShrines(cfg);
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'c-test0001', name: '坂の上八幡神社（さかのうえ）' });
    expect(list[0]!.lat).toBeCloseTo(35.681, 3);
    expect(list[0]!.lng).toBeCloseTo(139.767, 3);
  }, 60_000);

  it('参拝した人だけが、日本語のメモ付きで状況を報告できる', async () => {
    await waitTx(cfg, await sendReport(cfg, alice, 'kasuga-taisha', 1, '本殿の屋根を修復中でした。参道は通れます。'));
    const reports = await listReports(cfg, 'kasuga-taisha');
    expect(reports[0]).toMatchObject({ status: 1, note: '本殿の屋根を修復中でした。参道は通れます。' });
    expect((await readShrineStats(cfg, 'kasuga-taisha')).reports).toBe(1);

    const denied = await sendReport(cfg, alice, 'izumo-taisha', 0, '').then(
      (h) => waitTx(cfg, h),
      (e: Error) => ({ ok: false as const, reason: e.message }),
    );
    expect(denied.ok).toBe(false);
  }, 60_000);
});
