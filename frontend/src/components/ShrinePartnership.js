import React, { useState, useEffect } from 'react';
import './ShrinePartnership.css';

function ShrinePartnership({ userProfile, onOfferingMade, onPartnershipJoin }) {
  const [partnerShrines, setPartnerShrines] = useState([]);
  const [offeringAmount, setOfferingAmount] = useState(100);
  const [selectedShrine, setSelectedShrine] = useState(null);
  const [showOfferingModal, setShowOfferingModal] = useState(false);
  const [shrineApplications, setShrineApplications] = useState([]);

  // パートナー神社の初期データ
  useEffect(() => {
    setPartnerShrines([
      {
        id: 'meiji',
        name: '明治神宮',
        location: '東京都渋谷区',
        isVerified: true,
        partnershipLevel: 'プラチナ',
        specialNFTs: ['明治天皇記念NFT', '初詣限定NFT'],
        currentOfferings: 2500000,
        monthlyVisitors: 15000,
        culturalEvents: ['正月祭', '例大祭', '神楽奉納'],
        collaborations: ['君の名は。コラボ', '鬼滅の刃コラボ'],
        description: '東京を代表する神社として、現代文化との融合を積極的に推進',
        benefits: ['限定NFT優先発行', '特別参拝ツアー', 'VIP御朱印'],
        dataContribution: 'デジタル御朱印データベース、参拝者行動分析'
      },
      {
        id: 'fushimi',
        name: '伏見稲荷大社',
        location: '京都府京都市',
        isVerified: true,
        partnershipLevel: 'ゴールド',
        specialNFTs: ['千本鳥居NFT', '稲荷神使い狐NFT'],
        currentOfferings: 1800000,
        monthlyVisitors: 22000,
        culturalEvents: ['稲荷祭', '火焚祭'],
        collaborations: ['いなり、こんこん、恋いろは'],
        description: '千本鳥居で有名な稲荷神社の総本宮、国際観光客に人気',
        benefits: ['鳥居建立デジタル証明書', '狐面NFT', '商売繁盛お守り'],
        dataContribution: '国際観光客データ、鳥居保全状況'
      },
      {
        id: 'itsukushima',
        name: '厳島神社',
        location: '広島県廿日市市',
        isVerified: true,
        partnershipLevel: 'プラチナ',
        specialNFTs: ['海上鳥居NFT', '満潮干潮NFT'],
        currentOfferings: 2200000,
        monthlyVisitors: 18000,
        culturalEvents: ['管絃祭', '桃花祭'],
        collaborations: ['もののけ姫ロケ地'],
        description: '日本三景の一つ、海上に浮かぶ鳥居で世界的に有名',
        benefits: ['潮汐カレンダーNFT', '世界遺産証明書', '特別拝観券'],
        dataContribution: '潮汐データ連携、世界遺産保全レポート'
      }
    ]);

    // 申請中の神社（神社側からの参加申請）
    setShrineApplications([
      {
        id: 'apply1',
        name: '北野天満宮',
        location: '京都府京都市',
        proposedBenefits: '学問成就NFT、梅の季節限定コレクション',
        expectedVisitors: 8000,
        culturalAssets: '天神様信仰、梅園、宝物館',
        collaborationIdeas: '受験アプリとの連携、学習系アニメコラボ'
      }
    ]);
  }, []);

  // デジタルお布施システム
  const handleOffering = async (shrine) => {
    try {
      // ブロックチェーントランザクション
      const offeringData = {
        shrineId: shrine.id,
        amount: offeringAmount,
        userId: userProfile.id,
        timestamp: new Date().toISOString(),
        purpose: 'cultural_preservation',
        nftReward: true
      };

      // お布施NFTを生成
      const offeringNFT = {
        id: `offering_${Date.now()}`,
        shrine: shrine.name,
        amount: offeringAmount,
        date: new Date().toLocaleDateString('ja-JP'),
        benefitLevel: getOfferingBenefitLevel(offeringAmount),
        specialMessage: getOfferingMessage(shrine, offeringAmount)
      };

      // 神社の月間お布施額を更新
      setPartnerShrines(prev => prev.map(s => 
        s.id === shrine.id 
          ? { ...s, currentOfferings: s.currentOfferings + offeringAmount }
          : s
      ));

      onOfferingMade(offeringNFT);
      setShowOfferingModal(false);
      
      // ユーザーに特典付与
      const rewards = calculateOfferingRewards(offeringAmount, shrine);
      return rewards;

    } catch (error) {
      console.error('お布施処理エラー:', error);
    }
  };

  // お布施額に応じた特典レベル
  const getOfferingBenefitLevel = (amount) => {
    if (amount >= 10000) return 'プラチナ支援者';
    if (amount >= 5000) return 'ゴールド支援者';
    if (amount >= 1000) return 'シルバー支援者';
    return 'ブロンズ支援者';
  };

  // 神社ごとのお布施メッセージ
  const getOfferingMessage = (shrine, amount) => {
    const messages = {
      meiji: `明治神宮への ${amount}円のご奉納、誠にありがとうございます。皇室の弥栄と文化の発展をお祈り申し上げます。`,
      fushimi: `伏見稲荷大社への ${amount}円のご奉納、感謝申し上げます。商売繁盛と千本鳥居の保全に活用させていただきます。`,
      itsukushima: `厳島神社への ${amount}円のご奉納、ありがとうございます。海上鳥居の保全と世界遺産の維持に努めます。`
    };
    return messages[shrine.id] || `${shrine.name}への温かいご支援、ありがとうございます。`;
  };

  // お布施特典の計算
  const calculateOfferingRewards = (amount, shrine) => {
    const baseRewards = {
      culturalCapital: Math.floor(amount / 10),
      experience: Math.floor(amount / 50),
      specialItems: []
    };

    if (amount >= 1000) {
      baseRewards.specialItems.push(`${shrine.name}デジタル御朱印`);
    }
    if (amount >= 5000) {
      baseRewards.specialItems.push(`${shrine.name}限定お守りNFT`);
    }
    if (amount >= 10000) {
      baseRewards.specialItems.push(`${shrine.name}VIP参拝証明書`);
    }

    return baseRewards;
  };

  // 神社のコラボレーション提案
  const proposeCollaboration = (shrine, collaborationType) => {
    const collaborationProposal = {
      shrineId: shrine.id,
      type: collaborationType,
      proposer: userProfile.id,
      details: generateCollaborationIdea(shrine, collaborationType),
      timestamp: new Date().toISOString()
    };

    // コミュニティ投票に送信
    return collaborationProposal;
  };

  const generateCollaborationIdea = (shrine, type) => {
    const ideas = {
      anime: `${shrine.name}を舞台としたアニメ作品とのコラボレーション。聖地巡礼マップとAR体験の提供。`,
      game: `${shrine.name}をフィーチャーしたゲーム内イベント。特別クエストと限定アイテムの配布。`,
      tourism: `${shrine.name}周辺の観光ルート開発。地元商店街との連携イベント企画。`,
      education: `${shrine.name}の歴史と文化を学ぶ教育プログラム。学校向けの体験学習コンテンツ。`
    };
    return ideas[type] || '新しいコラボレーション企画';
  };

  return (
    <div className="shrine-partnership">
      <div className="partnership-header">
        <h2>🤝 神社パートナーシップ</h2>
        <p>神社と共に文化を守り、発展させるプログラム</p>
      </div>

      {/* パートナー神社一覧 */}
      <div className="partner-shrines">
        <h3>✨ パートナー神社</h3>
        <div className="shrines-grid">
          {partnerShrines.map(shrine => (
            <div key={shrine.id} className={`shrine-card ${shrine.partnershipLevel.toLowerCase()}`}>
              <div className="shrine-header">
                <h4>{shrine.name}</h4>
                <div className="verification-badge">
                  {shrine.isVerified && <span className="verified">✓ 認定済み</span>}
                  <span className={`level ${shrine.partnershipLevel.toLowerCase()}`}>
                    {shrine.partnershipLevel}
                  </span>
                </div>
              </div>

              <div className="shrine-info">
                <p className="location">📍 {shrine.location}</p>
                <p className="description">{shrine.description}</p>
              </div>

              <div className="shrine-stats">
                <div className="stat">
                  <span className="value">{shrine.currentOfferings.toLocaleString()}</span>
                  <span className="label">今月のお布施総額（円）</span>
                </div>
                <div className="stat">
                  <span className="value">{shrine.monthlyVisitors.toLocaleString()}</span>
                  <span className="label">月間参拝者数</span>
                </div>
              </div>

              {/* 特別NFTコレクション */}
              <div className="special-nfts">
                <h5>🎨 特別NFTコレクション</h5>
                <div className="nft-tags">
                  {shrine.specialNFTs.map((nft, index) => (
                    <span key={index} className="nft-tag">{nft}</span>
                  ))}
                </div>
              </div>

              {/* 文化イベント */}
              <div className="cultural-events">
                <h5>🎭 文化イベント</h5>
                <div className="event-tags">
                  {shrine.culturalEvents.map((event, index) => (
                    <span key={index} className="event-tag">{event}</span>
                  ))}
                </div>
              </div>

              {/* コラボレーション */}
              <div className="collaborations">
                <h5>🎌 コラボレーション実績</h5>
                <div className="collab-tags">
                  {shrine.collaborations.map((collab, index) => (
                    <span key={index} className="collab-tag">{collab}</span>
                  ))}
                </div>
              </div>

              {/* 参拝者特典 */}
              <div className="benefits">
                <h5>🎁 参拝者特典</h5>
                <ul>
                  {shrine.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {/* アクションボタン */}
              <div className="shrine-actions">
                <button 
                  className="offering-btn"
                  onClick={() => {
                    setSelectedShrine(shrine);
                    setShowOfferingModal(true);
                  }}
                >
                  💰 お布施をする
                </button>
                <button 
                  className="collaborate-btn"
                  onClick={() => proposeCollaboration(shrine, 'general')}
                >
                  🤝 コラボ提案
                </button>
                <button 
                  className="visit-btn"
                  onClick={() => onPartnershipJoin(shrine)}
                >
                  ⛩️ 参拝する
                </button>
              </div>

              {/* データ貢献情報 */}
              <div className="data-contribution">
                <h5>📊 データ貢献</h5>
                <p>{shrine.dataContribution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 神社申請セクション */}
      <div className="shrine-applications">
        <h3>📝 参加申請中の神社</h3>
        <div className="applications-grid">
          {shrineApplications.map(application => (
            <div key={application.id} className="application-card">
              <h4>{application.name}</h4>
              <p className="location">📍 {application.location}</p>
              <div className="proposal-details">
                <h5>提案内容:</h5>
                <p><strong>特典:</strong> {application.proposedBenefits}</p>
                <p><strong>予想参拝者:</strong> {application.expectedVisitors.toLocaleString()}人/月</p>
                <p><strong>文化資産:</strong> {application.culturalAssets}</p>
                <p><strong>コラボアイデア:</strong> {application.collaborationIdeas}</p>
              </div>
              <button className="vote-btn">🗳️ 承認投票</button>
            </div>
          ))}
        </div>
      </div>

      {/* お布施モーダル */}
      {showOfferingModal && selectedShrine && (
        <div className="offering-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>💰 {selectedShrine.name}へのお布施</h3>
              <button 
                className="close-btn"
                onClick={() => setShowOfferingModal(false)}
              >
                ×
              </button>
            </div>

            <div className="offering-form">
              <div className="amount-selector">
                <label>お布施額:</label>
                <div className="amount-buttons">
                  {[100, 500, 1000, 5000, 10000].map(amount => (
                    <button
                      key={amount}
                      className={`amount-btn ${offeringAmount === amount ? 'selected' : ''}`}
                      onClick={() => setOfferingAmount(amount)}
                    >
                      ¥{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={offeringAmount}
                  onChange={(e) => setOfferingAmount(parseInt(e.target.value) || 0)}
                  placeholder="カスタム金額"
                  min="100"
                />
              </div>

              <div className="offering-benefits">
                <h4>🎁 この金額での特典:</h4>
                <div className="benefit-level">
                  <span className="level-badge">{getOfferingBenefitLevel(offeringAmount)}</span>
                </div>
                <ul>
                  {calculateOfferingRewards(offeringAmount, selectedShrine).specialItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  <li>文化資本 +{Math.floor(offeringAmount / 10)}</li>
                  <li>経験値 +{Math.floor(offeringAmount / 50)}</li>
                </ul>
              </div>

              <div className="offering-purpose">
                <h4>💝 お布施の使い道:</h4>
                <ul>
                  <li>神社建物・施設の保全 (40%)</li>
                  <li>文化イベントの開催 (25%)</li>
                  <li>デジタル化推進 (20%)</li>
                  <li>地域活性化事業 (15%)</li>
                </ul>
              </div>

              <button 
                className="confirm-offering-btn"
                onClick={() => handleOffering(selectedShrine)}
              >
                お布施を納める
              </button>
            </div>
          </div>
        </div>
      )}

      {/* パートナーシップ統計 */}
      <div className="partnership-stats">
        <h3>📈 パートナーシップ統計</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{partnerShrines.length}</span>
            <span className="stat-label">パートナー神社数</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {partnerShrines.reduce((sum, shrine) => sum + shrine.currentOfferings, 0).toLocaleString()}
            </span>
            <span className="stat-label">今月の総お布施額（円）</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {partnerShrines.reduce((sum, shrine) => sum + shrine.monthlyVisitors, 0).toLocaleString()}
            </span>
            <span className="stat-label">月間総参拝者数</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {partnerShrines.reduce((sum, shrine) => sum + shrine.specialNFTs.length, 0)}
            </span>
            <span className="stat-label">特別NFT種類数</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShrinePartnership;