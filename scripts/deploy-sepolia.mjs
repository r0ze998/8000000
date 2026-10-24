// ShrineNetwork を Starknet Sepolia（テストネット）にデプロイし、アプリの設定を .env.sepolia.local に書く。
//
// 使い方（パスワードは画面に表示されない入力欄で聞かれます）:
//   npm run contracts:build
//   node scripts/deploy-sepolia.mjs --account ~/.starkli-wallets/backup/account.json --keystore ~/.starkli-wallets/backup/keystore.json
//
// 安全のため:
// - 接続先のチェーンが Sepolia（SN_SEPOLIA）でなければ何もせずに止まる（メインネットには絶対に送らない）
// - 秘密鍵はメモリ上で復号するだけで、ファイルにも画面にも出さない
//
// テスト用: --rpc で別の RPC、--allow-chain で別のチェーン ID（devnet での動作確認用）を指定できる。

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { keccak_256 } from '@noble/hashes/sha3';
import { Account, RpcProvider, json, shortString } from 'starknet';

const arg = (name, fallback) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback);
const expand = (p) => p?.replace(/^~(?=$|\/)/, os.homedir());

const accountFile = expand(arg('--account'));
const keystoreFile = expand(arg('--keystore'));
const rpcUrl = arg('--rpc', 'https://api.cartridge.gg/x/starknet/sepolia');
const allowChain = arg('--allow-chain', 'SN_SEPOLIA');
const envFile = arg('--env', '.env.sepolia.local');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const artifact = (ext) => path.join(root, 'contracts/target/dev', `shrine_network_ShrineNetwork.${ext}.json`);

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}

if (!accountFile || !keystoreFile) fail('--account と --keystore を指定してください（starkli のアカウントファイルとキーストア）。');
if (!fs.existsSync(artifact('compiled_contract_class'))) fail('contracts/target がありません。先に `npm run contracts:build` を実行してください。');

/** 入力を画面に出さずにパスワードを読む */
function askHidden(question) {
  if (process.env.STARKNET_KEYSTORE_PASSWORD !== undefined) return Promise.resolve(process.env.STARKNET_KEYSTORE_PASSWORD);
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (s.startsWith(question)) rl.output.write(question);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

/** Ethereum 形式（v3, scrypt + aes-128-ctr）のキーストアを復号する。starkli のキーストアはこの形式 */
export function decryptKeystore(ks, password) {
  const c = ks.crypto ?? ks.Crypto;
  if (!c || c.kdf !== 'scrypt' || c.cipher !== 'aes-128-ctr') throw new Error('対応していないキーストアの形式です');
  const { n, r, p, dklen, salt } = c.kdfparams;
  const derived = crypto.scryptSync(Buffer.from(password, 'utf8'), Buffer.from(salt, 'hex'), dklen, { N: n, r, p, maxmem: 256 * n * r + 1024 * 1024 });
  const cipherText = Buffer.from(c.ciphertext, 'hex');
  const mac = Buffer.from(keccak_256(Buffer.concat([derived.subarray(16, 32), cipherText])));
  if (mac.toString('hex') !== c.mac.toLowerCase()) throw new Error('パスワードが違います');
  const decipher = crypto.createDecipheriv('aes-128-ctr', derived.subarray(0, 16), Buffer.from(c.cipherparams.iv, 'hex'));
  return '0x' + Buffer.concat([decipher.update(cipherText), decipher.final()]).toString('hex');
}

const accountJson = JSON.parse(fs.readFileSync(accountFile, 'utf8'));
const address = accountJson.deployment?.address;
if (accountJson.deployment?.status !== 'deployed' || !address) fail('このアカウントはまだチェーン上にデプロイされていません。');

const provider = new RpcProvider({ nodeUrl: rpcUrl });
const chainId = shortString.decodeShortString(await provider.getChainId());
if (chainId !== allowChain) fail(`接続先のチェーンが ${chainId} です。${allowChain} 以外には送りません。`);
console.log(`接続先: ${chainId}（${rpcUrl}）`);
console.log(`アカウント: ${address}`);

const password = await askHidden('キーストアのパスワード: ');
let privateKey;
try {
  privateKey = decryptKeystore(JSON.parse(fs.readFileSync(keystoreFile, 'utf8')), password);
} catch (e) {
  fail(e.message);
}

const account = new Account({ provider, address, signer: privateKey });
console.log('コントラクトを宣言・デプロイしています（1〜2分かかることがあります）…');
const res = await account.declareAndDeploy({
  contract: json.parse(fs.readFileSync(artifact('contract_class'), 'utf8')),
  casm: json.parse(fs.readFileSync(artifact('compiled_contract_class'), 'utf8')),
});
const receipt = await provider.waitForTransaction(res.deploy.transaction_hash);
const block = receipt.block_number ?? (await provider.getBlockNumber());

const env = [
  `# scripts/deploy-sepolia.mjs が ${new Date().toISOString()} に書き出した設定`,
  'VITE_CHAIN=sepolia',
  `VITE_RPC_URL=${rpcUrl}`,
  `VITE_CONTRACT_ADDRESS=${res.deploy.contract_address}`,
  `VITE_DEPLOY_BLOCK=${block}`,
  '',
].join('\n');
fs.writeFileSync(path.join(root, envFile), env);

console.log(`\n✓ デプロイしました: ${res.deploy.contract_address}`);
console.log(`  宣言 class hash: ${res.declare.class_hash}`);
console.log(`  デプロイ tx: ${res.deploy.transaction_hash}`);
console.log(`  設定を ${envFile} に書きました。\`npm run build:sepolia\` でこのコントラクトにつながるビルドを作れます。`);
