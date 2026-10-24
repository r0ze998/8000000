// 公開 RPC に starknet.js から読み取りができるかを確かめる（書き込みはしない）。
// Usage: node scripts/rpc-check.mjs <rpcUrl> [...]
import { RpcProvider, hash, num } from 'starknet';

const STRK = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
for (const url of process.argv.slice(2)) {
  const p = new RpcProvider({ nodeUrl: url });
  try {
    const block = await p.getBlockNumber();
    const call = await p.callContract({ contractAddress: STRK, entrypoint: 'decimals', calldata: [] }, 'latest');
    const ev = await p.getEvents({
      address: STRK,
      from_block: { block_number: block - 3 },
      to_block: 'latest',
      keys: [[num.toHex(hash.starknetKeccak('Transfer'))]],
      chunk_size: 5,
    });
    console.log(`OK   ${url} block=${block} decimals=${Number(call[0])} events=${ev.events.length}`);
  } catch (e) {
    console.log(`FAIL ${url} ${e.message.split('\n')[0]}`);
  }
}
