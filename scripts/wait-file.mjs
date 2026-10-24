// ファイルができるまで待つ（devnet のデプロイが終わってからビルドするため）。
// Usage: node scripts/wait-file.mjs <path> [timeoutSec]
import fs from 'node:fs';

const [file, timeout = '120'] = process.argv.slice(2);
const until = Date.now() + Number(timeout) * 1000;
while (!fs.existsSync(file)) {
  if (Date.now() > until) {
    console.error(`timed out waiting for ${file}`);
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 500));
}
