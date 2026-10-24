// E2E が終わったら、テスト用 devnet（:5052）を確実に止める。
// devnet の本体は別のプロセスグループで動くため、起動スクリプトを止めても残ることがある。
import { execSync } from 'node:child_process';

export default function teardown() {
  try {
    const pids = execSync('lsof -ti tcp:5052 -sTCP:LISTEN', { encoding: 'utf8' }).split('\n').filter(Boolean);
    for (const pid of pids) {
      const cmd = execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf8' }).trim();
      if (cmd.endsWith('starknet-devnet')) process.kill(Number(pid));
    }
  } catch {
    /* 動いていなければ何もしない */
  }
}
