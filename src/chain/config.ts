// チェーン接続の設定。ビルド時の環境変数で決まる（.env.example を参照）。
// 設定がなければ「チェーン未接続」として、記録は端末内にだけ残る。

export type ChainName = 'devnet' | 'sepolia';

export interface ChainConfig {
  chain: ChainName;
  rpcUrl: string;
  contractAddress: string;
  deployBlock: number;
  /** devnet のテスト用アカウント。devnet 以外では使わない */
  devAccount?: { address: string; privateKey: string };
  label: string;
  explorerTx?: (hash: string) => string;
  explorerContract?: (address: string) => string;
}

const env = import.meta.env;

function read(): ChainConfig | null {
  const chain = env.VITE_CHAIN as string | undefined;
  const rpcUrl = env.VITE_RPC_URL as string | undefined;
  const contractAddress = env.VITE_CONTRACT_ADDRESS as string | undefined;
  if ((chain !== 'devnet' && chain !== 'sepolia') || !rpcUrl || !contractAddress) return null;
  const deployBlock = Number(env.VITE_DEPLOY_BLOCK ?? 0) || 0;
  if (chain === 'devnet') {
    const address = env.VITE_DEV_ACCOUNT_ADDRESS as string | undefined;
    const privateKey = env.VITE_DEV_ACCOUNT_KEY as string | undefined;
    return {
      chain,
      rpcUrl,
      contractAddress,
      deployBlock,
      devAccount: address && privateKey ? { address, privateKey } : undefined,
      label: 'ローカル開発チェーン（devnet）',
    };
  }
  return {
    chain,
    rpcUrl,
    contractAddress,
    deployBlock,
    label: 'Starknet テストネット（Sepolia）',
    explorerTx: (h) => `https://sepolia.voyager.online/tx/${h}`,
    explorerContract: (a) => `https://sepolia.voyager.online/contract/${a}`,
  };
}

export const CHAIN: ChainConfig | null = read();
