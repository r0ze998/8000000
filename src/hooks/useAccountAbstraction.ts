import { useState, useEffect } from 'react';

interface AccountAbstractionState {
  account: any | null;
  isReady: boolean;
  address: string | null;
  provider: any;
  sessionId: string | null;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24時間

export const useAccountAbstraction = () => {
  const [aaState, setAAState] = useState<AccountAbstractionState>({
    account: null,
    isReady: false,
    address: null,
    provider: { mock: true },
    sessionId: null
  });

  // セッション初期化（モック版）
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

      // モックアカウント作成
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;

      setAAState(prev => ({
        ...prev,
        account: { mock: true, address: mockAddress },
        isReady: true,
        address: mockAddress,
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

  // NFTミント（モック版）
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
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { transactionHash: `0x${Math.random().toString(16).substr(2, 64)}` };
    } catch (error) {
      console.error('NFTミントエラー:', error);
      throw error;
    }
  };

  // 文化資本獲得（モック版）
  const earnCulturalCapital = async (amount: number) => {
    if (!aaState.account || !aaState.isReady) return null;

    try {
      // モック処理
      await new Promise(resolve => setTimeout(resolve, 500));
      return { transactionHash: `0x${Math.random().toString(16).substr(2, 64)}` };
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