import React, { createContext, useContext, useState, useCallback } from 'react';
import nftMintingService from '../services/nftMinting';
import { useNotification } from '../hooks/useNotification';
import soundEffects from '../utils/soundEffects';

const VisitContext = createContext();

export const useVisit = () => {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error('useVisit must be used within VisitProvider');
  }
  return context;
};

export const VisitProvider = ({ children }) => {
  const { showNotification } = useNotification();
  
  // 参拝履歴
  const [recentVisits, setRecentVisits] = useState([
    {
      shrine: { name: '明治神宮' },
      timestamp: new Date().toISOString(),
      verificationMethod: 'photo',
      photo: null
    },
    {
      shrine: { name: '伏見稲荷大社' },
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      verificationMethod: 'gps',
      photo: null
    }
  ]);

  // NFTコレクション
  const [nftCollection, setNftCollection] = useState([]);

  // 参拝記録追加
  const addVisit = useCallback(async (shrine, verificationData) => {
    const newVisit = {
      shrine,
      timestamp: new Date().toISOString(),
      verificationMethod: verificationData.method,
      photo: verificationData.photo || null,
      nftId: null
    };

    try {
      const nftMetadata = nftMintingService.generateNFTMetadata({
        ...verificationData,
        shrine
      });
      
      const mintResult = await nftMintingService.mintNFT(nftMetadata, 'user-address');
      
      if (mintResult.success) {
        newVisit.nftId = mintResult.nft.id;
        setNftCollection(prev => [...prev, mintResult.nft]);
        showNotification('✨ 参拝証明NFTが発行されました！');
      }
    } catch (error) {
      console.error('NFTミントエラー:', error);
    }

    setRecentVisits(prev => [newVisit, ...prev]);
    showNotification(`⛩️ ${shrine.name}への参拝を記録しました！`);
    soundEffects.playSound('bell');
    
    return newVisit;
  }, [showNotification]);

  // NFT生成
  const mintVisitNFT = useCallback(async (verificationData) => {
    try {
      showNotification('🔄 NFTを生成中...');
      
      const nftMetadata = nftMintingService.generateNFTMetadata(verificationData);
      const mintResult = await nftMintingService.mintNFT(nftMetadata, 'user-address');
      
      if (mintResult.success) {
        setNftCollection(prev => [...prev, mintResult.nft]);
        showNotification('✨ NFTが生成されました！');
        return mintResult.nft;
      }
    } catch (error) {
      console.error('NFT生成エラー:', error);
      showNotification('❌ NFT生成に失敗しました。');
      throw error;
    }
  }, [showNotification]);

  const value = {
    recentVisits,
    nftCollection,
    addVisit,
    mintVisitNFT
  };

  return (
    <VisitContext.Provider value={value}>
      {children}
    </VisitContext.Provider>
  );
};