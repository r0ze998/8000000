export const STARKNET_TESTNET_CONFIG = {
  rpcUrl: 'https://starknet-testnet.public.blastapi.io',
  chainId: 'SN_SEPOLIA'
};

export const validateStarkNetConnection = async (provider: any) => {
  // モック接続チェック
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    isConnected: true,
    chainId: STARKNET_TESTNET_CONFIG.chainId,
    blockNumber: Math.floor(Math.random() * 1000000),
    error: null
  };
};