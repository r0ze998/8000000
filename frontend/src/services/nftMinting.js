// NFT Minting Service for Verified Shrine Visits

import { Contract, Provider, Account } from 'starknet';

class NFTMintingService {
  constructor() {
    this.provider = null;
    this.account = null;
    this.contract = null;
    this.initialized = false;
  }

  // NFTミンティングサービスの初期化
  async initialize() {
    try {
      // Starknet プロバイダーの初期化（テスト用）
      this.provider = new Provider({ sequencer: { network: 'goerli-alpha' } });
      this.initialized = true;
      console.log('NFT Minting Service initialized');
    } catch (error) {
      console.error('NFT Minting Service initialization failed:', error);
    }
  }

  // 参拝認証データからNFTメタデータを生成
  generateNFTMetadata(verificationData) {
    const { shrine, verificationMethod, photo, gpsLocation, timestamp, metadata } = verificationData;
    
    // レアリティを決定
    const rarity = this.calculateRarity(verificationData);
    
    // NFTメタデータ
    const nftMetadata = {
      name: `${shrine?.name || '神社・寺院'} 参拝記録`,
      description: `${shrine?.name || '神社・寺院'}への参拝を記録したNFT。${verificationMethod}認証により確認済み。`,
      image: photo || this.generateDefaultImage(shrine),
      external_url: `https://cultural-shrine-village.app/shrine/${shrine?.id}`,
      
      // 基本属性
      attributes: [
        {
          trait_type: "神社・寺院名",
          value: shrine?.name || '不明'
        },
        {
          trait_type: "種別",
          value: shrine?.type === 'shrine' ? '神社' : '寺院'
        },
        {
          trait_type: "所在地",
          value: `${shrine?.prefecture || ''}${shrine?.city || ''}`
        },
        {
          trait_type: "認証方法",
          value: this.getVerificationMethodName(verificationMethod)
        },
        {
          trait_type: "レアリティ",
          value: rarity.name
        },
        {
          trait_type: "参拝日時",
          value: new Date(timestamp).toLocaleDateString('ja-JP')
        }
      ],
      
      // 位置情報（プライバシー考慮で大まかな位置のみ）
      location: metadata?.location ? {
        prefecture: shrine?.prefecture,
        city: shrine?.city,
        // 詳細な緯度経度は保存しない（プライバシー保護）
      } : null,
      
      // 認証データ
      verification: {
        method: verificationMethod,
        timestamp: timestamp,
        verified: true,
        distance: verificationData.distance,
        accuracy: gpsLocation?.accuracy
      },
      
      // ゲーム用属性
      gameAttributes: {
        culturalValue: this.calculateCulturalValue(verificationData),
        resourceRewards: this.calculateResourceRewards(verificationData),
        buildingUnlocks: this.getBuildingUnlocks(verificationData),
        rarity: rarity
      }
    };

    return nftMetadata;
  }

  // レアリティ計算
  calculateRarity(verificationData) {
    const { verificationMethod, shrine, gpsLocation, timestamp } = verificationData;
    
    let points = 0;
    
    // 認証方法による加点
    if (verificationMethod === 'both') points += 3;
    else if (verificationMethod === 'gps') points += 2;
    else points += 1;
    
    // 神社の希少性による加点
    if (shrine?.rarity === 'legendary') points += 5;
    else if (shrine?.rarity === 'epic') points += 3;
    else if (shrine?.rarity === 'rare') points += 2;
    else points += 1;
    
    // GPS精度による加点
    if (gpsLocation?.accuracy < 10) points += 2;
    else if (gpsLocation?.accuracy < 50) points += 1;
    
    // 時間による加点（早朝・夜間）
    const hour = new Date(timestamp).getHours();
    if (hour < 6 || hour > 20) points += 1;
    
    // 季節イベントによる加点
    const season = this.getCurrentSeason();
    if (this.isSeasonalEvent(shrine, season)) points += 2;
    
    // レアリティ判定
    if (points >= 10) return { name: 'Mythical', level: 6, color: '#ff1744' };
    if (points >= 8) return { name: 'Legendary', level: 5, color: '#ff9800' };
    if (points >= 6) return { name: 'Epic', level: 4, color: '#9c27b0' };
    if (points >= 4) return { name: 'Rare', level: 3, color: '#2196f3' };
    if (points >= 2) return { name: 'Uncommon', level: 2, color: '#4caf50' };
    return { name: 'Common', level: 1, color: '#9e9e9e' };
  }

  // 文化価値計算
  calculateCulturalValue(verificationData) {
    const baseValue = 50;
    const rarity = this.calculateRarity(verificationData);
    
    return baseValue * rarity.level;
  }

  // リソース報酬計算
  calculateResourceRewards(verificationData) {
    const { verificationMethod, shrine } = verificationData;
    const rarity = this.calculateRarity(verificationData);
    
    const baseRewards = {
      faith: 10,
      wood: 5,
      stone: 3,
      water: 2
    };
    
    // 認証方法による倍率
    const methodMultiplier = {
      photo: 1.0,
      gps: 1.2,
      both: 1.5
    };
    
    // レアリティによる倍率
    const rarityMultiplier = rarity.level * 0.5;
    
    // 神社タイプによる特別報酬
    const typeBonus = shrine?.type === 'shrine' ? 
      { bamboo: 2, cloth: 1 } : 
      { bronze: 1, paper: 2 };
    
    const multiplier = methodMultiplier[verificationMethod] * (1 + rarityMultiplier);
    
    const rewards = {};
    Object.entries(baseRewards).forEach(([resource, amount]) => {
      rewards[resource] = Math.floor(amount * multiplier);
    });
    
    // タイプボーナス追加
    Object.entries(typeBonus).forEach(([resource, amount]) => {
      rewards[resource] = (rewards[resource] || 0) + amount;
    });
    
    return rewards;
  }

  // 建物アンロック判定
  getBuildingUnlocks(verificationData) {
    const rarity = this.calculateRarity(verificationData);
    const unlocks = [];
    
    // レアリティに応じて建物をアンロック
    if (rarity.level >= 3) {
      unlocks.push('decorative_lantern_bronze');
    }
    if (rarity.level >= 4) {
      unlocks.push('shrine_kagura_decorated');
    }
    if (rarity.level >= 5) {
      unlocks.push('temple_pagoda_ancient');
    }
    if (rarity.level >= 6) {
      unlocks.push('special_golden_torii');
    }
    
    return unlocks;
  }

  // 認証方法名の取得
  getVerificationMethodName(method) {
    const names = {
      photo: '写真認証',
      gps: 'GPS認証',
      both: '写真・GPS認証'
    };
    return names[method] || '不明';
  }

  // デフォルト画像生成（SVG）
  generateDefaultImage(shrine) {
    const type = shrine?.type || 'shrine';
    const icon = type === 'shrine' ? '⛩️' : '🏛️';
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#fff8e1"/>
            <stop offset="100%" style="stop-color:#ffcc02"/>
          </radialGradient>
        </defs>
        <rect width="300" height="300" fill="url(#bg)"/>
        <text x="150" y="180" font-size="120" text-anchor="middle">${icon}</text>
        <text x="150" y="220" font-size="16" text-anchor="middle" fill="#333">
          ${shrine?.name || '神社・寺院'}
        </text>
        <text x="150" y="240" font-size="12" text-anchor="middle" fill="#666">
          参拝記録NFT
        </text>
      </svg>
    `)}`;
  }

  // 現在の季節取得
  getCurrentSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  // 季節イベント判定
  isSeasonalEvent(shrine, season) {
    // 特定の神社・寺院が季節イベント対象かチェック
    const seasonalShrines = {
      spring: ['伊勢神宮', '明治神宮', '上野公園'],
      summer: ['祇園祭', '天神祭', '神田祭'],
      autumn: ['清水寺', '東福寺', '高台寺'],
      winter: ['初詣対象神社']
    };
    
    return seasonalShrines[season]?.includes(shrine?.name) || false;
  }

  // ブロックチェーンへのNFTミント（簡易版）
  async mintNFT(nftMetadata, userAddress) {
    try {
      // 実際の実装では、ここでStarknetコントラクトを呼び出し
      console.log('Minting NFT:', nftMetadata);
      
      // シミュレーション用の遅延
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // NFTトークンID生成（実際にはコントラクトから返される）
      const tokenId = Date.now().toString();
      
      // ミント結果
      const mintResult = {
        success: true,
        tokenId: tokenId,
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`,
        metadata: nftMetadata,
        timestamp: new Date().toISOString()
      };
      
      console.log('NFT Minted Successfully:', mintResult);
      return mintResult;
      
    } catch (error) {
      console.error('NFT Minting Error:', error);
      throw new Error('NFTのミントに失敗しました');
    }
  }

  // NFT一覧取得
  async getUserNFTs(userAddress) {
    try {
      // 実際の実装では、ブロックチェーンからNFTを取得
      // ここでは localStorage から取得
      const storedNFTs = localStorage.getItem(`nfts_${userAddress}`);
      return storedNFTs ? JSON.parse(storedNFTs) : [];
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }

  // NFT保存（ローカル）
  async saveNFTLocally(nft, userAddress) {
    try {
      const existingNFTs = await this.getUserNFTs(userAddress);
      existingNFTs.push(nft);
      localStorage.setItem(`nfts_${userAddress}`, JSON.stringify(existingNFTs));
    } catch (error) {
      console.error('Error saving NFT locally:', error);
    }
  }

  // ユーザーのNFT統計取得
  async getUserNFTStats(userAddress) {
    try {
      const nfts = await this.getUserNFTs(userAddress);
      
      const stats = {
        total: nfts.length,
        byRarity: {},
        byType: {},
        totalCulturalValue: 0,
        averageRarity: 0
      };
      
      nfts.forEach(nft => {
        const rarity = nft.metadata?.gameAttributes?.rarity?.name || 'Common';
        const type = nft.metadata?.attributes?.find(attr => attr.trait_type === '種別')?.value || '不明';
        const culturalValue = nft.metadata?.gameAttributes?.culturalValue || 0;
        
        stats.byRarity[rarity] = (stats.byRarity[rarity] || 0) + 1;
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        stats.totalCulturalValue += culturalValue;
      });
      
      return stats;
    } catch (error) {
      console.error('Error calculating NFT stats:', error);
      return null;
    }
  }
}

// シングルトンインスタンス
const nftMintingService = new NFTMintingService();

export default nftMintingService;