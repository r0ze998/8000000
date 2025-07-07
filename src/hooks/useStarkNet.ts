
import { useState } from 'react';
// @ts-ignore
import { connect, disconnect, StarknetWindowObject } from 'get-starknet';
import { Contract, Account, RpcProvider } from 'starknet';

interface StarkNetState {
  wallet: StarknetWindowObject | null;
  account: Account | null;
  isConnected: boolean;
  provider: RpcProvider;
  contract: Contract | null;
}

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x...';
const STARKNET_RPC_URL = process.env.REACT_APP_STARKNET_RPC_URL || 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7';
const STARKNET_CHAIN_ID = process.env.REACT_APP_STARKNET_CHAIN_ID || 'SN_SEPOLIA';

const CONTRACT_ABI: any[] = [
  // ShrineNFTコントラクトのABI
  {
    "type": "function",
    "name": "mint_nft",
    "inputs": [
      { "name": "to", "type": "ContractAddress" },
      { "name": "uri", "type": "felt252" },
      { "name": "nft_type", "type": "felt252" },
      { "name": "rarity", "type": "felt252" },
      { "name": "power", "type": "u256" }
    ],
    "outputs": [{ "type": "u256" }],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "get_cultural_capital",
    "inputs": [{ "name": "user", "type": "ContractAddress" }],
    "outputs": [{ "type": "u256" }],
    "state_mutability": "view"
  }
];

export const useStarkNet = () => {
  const [starkNet, setStarkNet] = useState<StarkNetState>({
    wallet: null,
    account: null,
    isConnected: false,
    provider: new RpcProvider({
      nodeUrl: STARKNET_RPC_URL
    }),
    contract: null
  });

  const connectWallet = async () => {
    try {
      const wallet = await connect();
      if (wallet?.isConnected) {
        await wallet.enable();
        const account = wallet.account;
        
        const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
        
        setStarkNet(prev => ({
          ...prev,
          wallet,
          account,
          isConnected: true,
          contract
        }));
      }
    } catch (error) {
      console.error('ウォレット接続エラー:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      setStarkNet(prev => ({
        ...prev,
        wallet: null,
        account: null,
        isConnected: false,
        contract: null
      }));
    } catch (error) {
      console.error('ウォレット切断エラー:', error);
    }
  };

  const mintNFT = async (
    to: string,
    uri: string,
    nftType: string,
    rarity: string,
    power: number
  ) => {
    if (!starkNet.contract) {
      throw new Error('コントラクトが接続されていません');
    }

    try {
      const result = await starkNet.contract.mint_nft(
        to,
        uri,
        nftType,
        rarity,
        power
      );
      return result;
    } catch (error) {
      console.error('NFT発行エラー:', error);
      throw error;
    }
  };

  const earnCulturalCapital = async (user: string, amount: number) => {
    if (!starkNet.contract) {
      throw new Error('コントラクトが接続されていません');
    }

    try {
      const result = await starkNet.contract.earn_cultural_capital(user, amount);
      return result;
    } catch (error) {
      console.error('文化資本獲得エラー:', error);
      throw error;
    }
  };

  const getCulturalCapital = async (user: string) => {
    if (!starkNet.contract) {
      throw new Error('コントラクトが接続されていません');
    }

    try {
      const result = await starkNet.contract.get_cultural_capital(user);
      return result;
    } catch (error) {
      console.error('文化資本取得エラー:', error);
      throw error;
    }
  };

  return {
    ...starkNet,
    connectWallet,
    disconnectWallet,
    mintNFT,
    earnCulturalCapital,
    getCulturalCapital
  };
};
