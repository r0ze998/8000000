
import { RpcProvider, Contract, Account } from 'starknet';

export const STARKNET_TESTNET_CONFIG = {
  rpcUrl: process.env.REACT_APP_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
  chainId: process.env.REACT_APP_STARKNET_CHAIN_ID || 'SN_SEPOLIA',
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  ethContractAddress: process.env.REACT_APP_ETH_CONTRACT_ADDRESS || '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
};

export const createProvider = () => {
  return new RpcProvider({
    nodeUrl: STARKNET_TESTNET_CONFIG.rpcUrl
  });
};

export const validateStarkNetConnection = async (provider: RpcProvider) => {
  try {
    const chainId = await provider.getChainId();
    const blockNumber = await provider.getBlockNumber();
    
    console.log('🔗 StarkNet接続確認:');
    console.log(`Chain ID: ${chainId}`);
    console.log(`最新ブロック: ${blockNumber}`);
    
    return {
      isConnected: true,
      chainId,
      blockNumber
    };
  } catch (error) {
    console.error('❌ StarkNet接続エラー:', error);
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const deployContract = async (account: Account) => {
  try {
    // コントラクトデプロイのロジック
    // これは実際のコントラクトファイルがコンパイルされた後に実装
    console.log('📦 コントラクトデプロイを開始...');
    
    // プレースホルダー - 実際のデプロイロジックは後で実装
    return {
      success: false,
      message: 'コントラクトファイルをコンパイルしてからデプロイしてください'
    };
  } catch (error) {
    console.error('❌ デプロイエラー:', error);
    throw error;
  }
};

export const testContractInteraction = async (contract: Contract) => {
  try {
    console.log('🧪 コントラクトテストを開始...');
    
    // 基本的な読み取り操作をテスト
    const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
    
    // 文化資本の取得テスト
    const culturalCapital = await contract.get_cultural_capital(testAddress);
    console.log(`文化資本: ${culturalCapital}`);
    
    return {
      success: true,
      culturalCapital: culturalCapital.toString()
    };
  } catch (error) {
    console.error('❌ コントラクトテストエラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const formatStarkNetAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
