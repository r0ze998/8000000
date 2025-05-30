import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import blockchainService from '../services/blockchainService';

export const useBlockchain = () => {
  const { account, isConnected } = useAccount();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onChainData, setOnChainData] = useState({
    culturalCapital: 0,
    tokenBalance: 0,
    nftBalance: 0,
    shrineId: null
  });

  // ブロックチェーンサービス初期化
  useEffect(() => {
    const initializeBlockchain = async () => {
      if (isConnected && account) {
        try {
          setIsLoading(true);
          setError(null);
          
          const success = await blockchainService.initialize(account);
          setIsInitialized(success);
          
          if (success) {
            await refreshOnChainData();
          }
        } catch (err) {
          console.error('Blockchain initialization error:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsInitialized(false);
        setOnChainData({
          culturalCapital: 0,
          tokenBalance: 0,
          nftBalance: 0,
          shrineId: null
        });
      }
    };

    initializeBlockchain();
  }, [isConnected, account]);

  // オンチェーンデータ更新
  const refreshOnChainData = useCallback(async () => {
    if (!isInitialized || !account) return;

    try {
      setIsLoading(true);
      
      // 並列でデータ取得
      const [culturalCapital, tokenBalance, nftBalance] = await Promise.all([
        blockchainService.getUserCulturalCapital().catch(() => 0),
        blockchainService.getCulturalTokenBalance().catch(() => 0),
        blockchainService.getNFTBalance().catch(() => 0)
      ]);

      setOnChainData({
        culturalCapital,
        tokenBalance,
        nftBalance,
        shrineId: null // TODO: ユーザーの神社IDを取得
      });
    } catch (err) {
      console.error('Failed to refresh on-chain data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, account]);

  // 神社作成（ブロックチェーン）
  const createShrineOnChain = useCallback(async (name, location) => {
    if (!isInitialized) {
      throw new Error('Blockchain not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await blockchainService.createShrine(name, location);
      await refreshOnChainData();
      
      return result;
    } catch (err) {
      console.error('Failed to create shrine on chain:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, refreshOnChainData]);

  // 参拝記録（ブロックチェーン）
  const recordVisitOnChain = useCallback(async (shrineId, verificationData) => {
    if (!isInitialized) {
      throw new Error('Blockchain not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      // 認証データからハッシュ生成
      const verificationHash = generateVerificationHash(verificationData);
      
      const visitResult = await blockchainService.recordVisit(shrineId, verificationHash);
      
      // NFTミント
      const metadataUri = await uploadMetadata(verificationData);
      const nftResult = await blockchainService.mintVisitNFT(
        visitResult.visit_id, 
        metadataUri
      );

      await refreshOnChainData();
      
      return {
        visitId: visitResult.visit_id,
        nftTokenId: nftResult.token_id,
        transactionHash: nftResult.transaction_hash
      };
    } catch (err) {
      console.error('Failed to record visit on chain:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, refreshOnChainData]);

  // 文化資本トークン転送
  const transferCulturalTokens = useCallback(async (toAddress, amount) => {
    if (!isInitialized) {
      throw new Error('Blockchain not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await blockchainService.transferCulturalTokens(toAddress, amount);
      await refreshOnChainData();
      
      return result;
    } catch (err) {
      console.error('Failed to transfer tokens:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, refreshOnChainData]);

  // 神社情報取得
  const getShrineInfo = useCallback(async (shrineId) => {
    if (!isInitialized) {
      throw new Error('Blockchain not initialized');
    }

    try {
      return await blockchainService.getShrineInfo(shrineId);
    } catch (err) {
      console.error('Failed to get shrine info:', err);
      throw err;
    }
  }, [isInitialized]);

  // トランザクション状態監視
  const watchTransaction = useCallback(async (txHash, onUpdate) => {
    if (!isInitialized) return;

    const checkStatus = async () => {
      try {
        const status = await blockchainService.getTransactionStatus(txHash);
        onUpdate(status);
        
        if (status === 'ACCEPTED_ON_L1' || status === 'ACCEPTED_ON_L2') {
          await refreshOnChainData();
          return true; // 完了
        }
        return false; // 継続監視
      } catch (err) {
        console.error('Transaction status check failed:', err);
        return false;
      }
    };

    // 定期的にステータスチェック
    const interval = setInterval(async () => {
      const completed = await checkStatus();
      if (completed) {
        clearInterval(interval);
      }
    }, 3000); // 3秒ごと

    // 初回チェック
    await checkStatus();

    return () => clearInterval(interval);
  }, [isInitialized, refreshOnChainData]);

  return {
    isInitialized,
    isLoading,
    error,
    onChainData,
    createShrineOnChain,
    recordVisitOnChain,
    transferCulturalTokens,
    getShrineInfo,
    refreshOnChainData,
    watchTransaction,
    clearError: () => setError(null)
  };
};

// ヘルパー関数
const generateVerificationHash = (verificationData) => {
  // 簡易的なハッシュ生成（実際はより堅牢な方法を使用）
  const dataString = JSON.stringify(verificationData);
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return Math.abs(hash).toString();
};

const uploadMetadata = async (verificationData) => {
  // TODO: IPFSやArweaveにメタデータをアップロード
  // 現在は簡易的なJSONとして返す
  const metadata = {
    name: `参拝記録 - ${verificationData.location || '神社'}`,
    description: `${new Date().toLocaleDateString('ja-JP')}に参拝した記録`,
    image: verificationData.photo || '',
    attributes: [
      {
        trait_type: "認証方法",
        value: verificationData.method === 'photo' ? '写真' : 'GPS'
      },
      {
        trait_type: "参拝日",
        value: new Date().toLocaleDateString('ja-JP')
      },
      {
        trait_type: "位置",
        value: verificationData.location || '不明'
      }
    ]
  };

  // 実際の実装では、ここでIPFSにアップロードしてURIを返す
  return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
};