
import { useState, useEffect } from 'react';
import { Account, RpcProvider, CallData, stark } from 'starknet';

interface AccountAbstractionState {
  account: Account | null;
  isReady: boolean;
  address: string | null;
  provider: RpcProvider;
  sessionId: string | null;
}

const ACCOUNT_CONTRACT_ADDRESS = '0x...'; // Account Abstractionコントラクトアドレス
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24時間

export const useAccountAbstraction = () => {
  const [aaState, setAAState] = useState<AccountAbstractionState>({
    account: null,
    isReady: false,
    address: null,
    provider: new RpcProvider({
      nodeUrl: 'https://starknet-testnet.public.blastapi.io'
    }),
    sessionId: null
  });

  // セッション初期化
  const initializeSession = async () => {
    try {
      // ローカルストレージからセッション情報を取得
      const storedSession = localStorage.getItem('shrine_session');
      const storedSessionTime = localStorage.getItem('shrine_session_time');
      
      let sessionId: string | null = null;
      
      if (storedSession && storedSessionTime) {
        const sessionTime = parseInt(storedSessionTime);
        const now = Date.now();
        
        // セッションが有効期限内かチェック
        if (now - sessionTime < SESSION_DURATION) {
          sessionId = storedSession;
        }
      }
      
      // 新しいセッションを作成
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('shrine_session', sessionId);
        localStorage.setItem('shrine_session_time', Date.now().toString());
      }

      // Account Abstractionアカウントを作成（セッションベース）
      const sessionSeed = stark.randomAddress();
      const account = new Account(
        aaState.provider,
        ACCOUNT_CONTRACT_ADDRESS,
        sessionSeed
      );

      setAAState(prev => ({
        ...prev,
        account,
        isReady: true,
        address: account.address,
        sessionId
      }));

    } catch (error) {
      console.error('Account Abstraction初期化エラー:', error);
    }
  };

  // セッション開始
  useEffect(() => {
    initializeSession();
  }, []);

  // NFTミント（ガスレス）
  const mintNFT = async (
    nftType: string,
    rarity: string,
    power: number,
    metadata: any
  ) => {
    if (!aaState.account || !aaState.isReady) {
      throw new Error('Account Abstractionが初期化されていません');
    }

    try {
      const calldata = CallData.compile({
        to: aaState.address || '',
        uri: JSON.stringify(metadata),
        nft_type: nftType,
        rarity: rarity,
        power: power
      });

      // ガスレスでNFTミント
      const result = await aaState.account.execute({
        contractAddress: ACCOUNT_CONTRACT_ADDRESS,
        entrypoint: 'mint_nft',
        calldata
      });

      return result;
    } catch (error) {
      console.error('NFTミントエラー:', error);
      throw error;
    }
  };

  // 文化資本獲得（ガスレス）
  const earnCulturalCapital = async (amount: number) => {
    if (!aaState.account || !aaState.isReady) return null;

    try {
      const calldata = CallData.compile({
        user: aaState.address || '',
        amount: amount
      });

      const result = await aaState.account.execute({
        contractAddress: ACCOUNT_CONTRACT_ADDRESS,
        entrypoint: 'earn_cultural_capital',
        calldata
      });

      return result;
    } catch (error) {
      console.error('文化資本獲得エラー:', error);
      return null;
    }
  };

  // セッション終了
  const endSession = () => {
    localStorage.removeItem('shrine_session');
    localStorage.removeItem('shrine_session_time');
    setAAState(prev => ({
      ...prev,
      account: null,
      isReady: false,
      address: null,
      sessionId: null
    }));
  };

  return {
    ...aaState,
    initializeSession,
    mintNFT,
    earnCulturalCapital,
    endSession
  };
};
