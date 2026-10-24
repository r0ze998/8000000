// ローカルの Starknet devnet を起動し、ShrineNetwork をデプロイして、
// アプリが devnet に接続するための設定を .env.devnet.local に書き出す。
// 開発・E2E テスト専用。ここで使う鍵は devnet が決まった seed から作るテスト用の鍵で、実資産はない。
//
// Usage: node scripts/devnet.mjs [--port 5050] [--env .env.devnet.local] [--once]
// ポート 5060/5061 は fetch で禁止されているので使わないこと。
import { Devnet } from 'starknet-devnet';
import { Account, RpcProvider, json } from 'starknet';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const arg = (name, fallback) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback);
const port = Number(arg('--port', 5050));
// E2E では別のファイルに書き、開発用の設定を上書きしない
const envFile = arg('--env', '.env.devnet.local');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const artifact = (ext) => path.join(root, 'contracts/target/dev', `shrine_network_ShrineNetwork.${ext}.json`);

process.on('unhandledRejection', (e) => {
  console.error('devnet setup failed:', e?.stack ?? e);
  process.exit(1);
});

if (!fs.existsSync(artifact('contract_class')) || !fs.existsSync(artifact('compiled_contract_class'))) {
  console.error('contracts/target がありません。先に `cd contracts && scarb build` を実行してください。');
  process.exit(1);
}

// 前回の設定が残っていると、新しい devnet とずれたアドレスでビルドされてしまうので先に消す
fs.rmSync(path.join(root, envFile), { force: true });

// 前回強制終了されて残った devnet が同じポートを使っていたら止める（starknet-devnet だけを対象にする）
try {
  const pids = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const pid of pids) {
    const cmd = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8' }).trim();
    if (cmd.endsWith('starknet-devnet')) process.kill(Number(pid));
  }
  if (pids.length) await new Promise((r) => setTimeout(r, 500));
} catch {
  /* 使われていなければ何もしない */
}

const devnet = await Devnet.spawnVersion('latest', {
  args: ['--seed', '42', '--port', String(port), '--accounts', '3'],
  stdout: 'ignore',
  stderr: 'ignore',
  maxStartupMillis: 60000,
});
// 止められたら devnet 本体も止める（残ると出力のパイプが閉じず、Playwright が終われない）
for (const sig of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
  process.on(sig, () => {
    devnet.kill();
    process.exit(0);
  });
}
const rpcUrl = `http://127.0.0.1:${port}`;
const provider = new RpcProvider({ nodeUrl: rpcUrl });
const accounts = await devnet.provider.getPredeployedAccounts();
const [deployer, player] = accounts;
const account = new Account({ provider, address: deployer.address, signer: deployer.private_key });

const res = await account.declareAndDeploy({
  contract: json.parse(fs.readFileSync(artifact('contract_class'), 'utf8')),
  casm: json.parse(fs.readFileSync(artifact('compiled_contract_class'), 'utf8')),
});
await provider.waitForTransaction(res.deploy.transaction_hash);
const block = await provider.getBlockNumber();

const env = [
  '# scripts/devnet.mjs が書き出した、ローカル devnet 用の設定（テスト用の鍵・実資産なし）',
  'VITE_CHAIN=devnet',
  `VITE_RPC_URL=${rpcUrl}`,
  `VITE_CONTRACT_ADDRESS=${res.deploy.contract_address}`,
  `VITE_DEPLOY_BLOCK=${Math.max(0, block - 1)}`,
  `VITE_DEV_ACCOUNT_ADDRESS=${player.address}`,
  `VITE_DEV_ACCOUNT_KEY=${player.private_key}`,
  '',
].join('\n');
fs.writeFileSync(path.join(root, envFile), env);

console.log(`devnet ready on ${rpcUrl}`);
console.log(`ShrineNetwork deployed at ${res.deploy.contract_address}`);

if (process.argv.includes('--once')) {
  devnet.kill();
  process.exit(0);
}
// プロセスを生かしておく（Ctrl+C で devnet も止まる）。起動元が終わったら一緒に終わる
const parent = process.ppid;
setInterval(() => {
  try {
    process.kill(parent, 0);
  } catch {
    devnet.kill();
    process.exit(0);
  }
}, 1000);
