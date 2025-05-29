import React, { useState, useEffect } from 'react';
import { FESTIVAL_DATABASE, getSpecialNFTFestivals } from '../data/expandedShrineDatabase';
import './SpecialEvents.css';

const SpecialEvents = ({ onEventParticipate, userLocation }) => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [currentSeason, setCurrentSeason] = useState('spring');

  // 季節別特別イベント
  const seasonalEvents = {
    spring: [
      {
        id: 'sakura-festival',
        name: '桜まつり特別NFT',
        description: '全国の桜の名所で開催される桜まつり期間中に参拝すると獲得できる限定NFT',
        period: '3月下旬〜5月上旬',
        rarity: 'legendary',
        culturalValue: 180,
        specialReward: 'さくらの精霊NFT',
        participating_shrines: ['上野公園', '吉野山', '弘前公園'],
        requirements: '桜まつり期間中の参拝証明'
      }
    ],
    summer: [
      {
        id: 'summer-festival',
        name: '夏祭り特別NFT',
        description: '日本三大祭りや地域の夏祭りに参加すると獲得できる限定NFT',
        period: '7月〜8月',
        rarity: 'mythical',
        culturalValue: 250,
        specialReward: '祭り神輿NFT',
        participating_shrines: ['祇園祭', '天神祭', '神田祭'],
        requirements: '祭り参加証明または神輿担ぎ参加'
      }
    ],
    autumn: [
      {
        id: 'autumn-leaves',
        name: '紅葉狩り特別NFT',
        description: '全国の紅葉名所の神社・寺院を巡ると獲得できる限定NFT',
        period: '10月〜11月',
        rarity: 'rare',
        culturalValue: 120,
        specialReward: 'もみじの妖精NFT',
        participating_shrines: ['清水寺', '東福寺', '高台寺'],
        requirements: '紅葉期間中の複数箇所参拝'
      }
    ],
    winter: [
      {
        id: 'hatsumode',
        name: '初詣特別NFT',
        description: '新年の初詣で特別な御利益を込めた限定NFT',
        period: '1月1日〜1月15日',
        rarity: 'legendary',
        culturalValue: 200,
        specialReward: '開運招福NFT',
        participating_shrines: ['明治神宮', '伊勢神宮', '出雲大社'],
        requirements: '元旦〜三が日の参拝'
      }
    ]
  };

  const specialNFTTypes = [
    {
      id: 'goshuin-master',
      name: '御朱印マスターNFT',
      description: '100箇所の御朱印を集めた証明NFT',
      requirements: '100箇所の御朱印収集',
      rarity: 'mythical',
      culturalValue: 500,
      image: '🏆📿',
      unlockCondition: 'goshuin_count >= 100'
    },
    {
      id: 'pilgrimage-walker',
      name: '巡礼者NFT',
      description: '四国八十八箇所や西国三十三所などの巡礼完走NFT',
      requirements: '巡礼路の完歩',
      rarity: 'mythical',
      culturalValue: 1000,
      image: '🚶‍♂️⛩️',
      unlockCondition: 'pilgrimage_completed'
    },
    {
      id: 'cultural-guardian',
      name: '文化守護者NFT',
      description: '文化財保護活動に参加した証明NFT',
      requirements: '文化財保護ボランティア参加',
      rarity: 'legendary',
      culturalValue: 300,
      image: '🛡️🏛️',
      unlockCondition: 'volunteer_hours >= 10'
    },
    {
      id: 'festival-dancer',
      name: '祭り踊り手NFT',
      description: '地域の祭りで踊りや神輿を担いだ証明NFT',
      requirements: '祭り参加証明',
      rarity: 'rare',
      culturalValue: 150,
      image: '💃🎭',
      unlockCondition: 'festival_participation'
    }
  ];

  useEffect(() => {
    // 現在の季節を判定
    const month = new Date().getMonth() + 1;
    let season;
    if (month >= 3 && month <= 5) season = 'spring';
    else if (month >= 6 && month <= 8) season = 'summer';
    else if (month >= 9 && month <= 11) season = 'autumn';
    else season = 'winter';
    
    setCurrentSeason(season);
    setActiveEvents(seasonalEvents[season] || []);
  }, []);

  const handleEventParticipate = (event) => {
    const participation = {
      eventId: event.id,
      eventName: event.name,
      timestamp: new Date().toISOString(),
      culturalValue: event.culturalValue,
      rarity: event.rarity,
      specialReward: event.specialReward,
      season: currentSeason
    };

    if (onEventParticipate) {
      onEventParticipate(participation);
    }
    
    alert(`${event.name}に参加しました！特別NFT「${event.specialReward}」を獲得しました！`);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#808080',
      uncommon: '#00ff00',
      rare: '#0080ff',
      legendary: '#ff8000',
      mythical: '#ff0080'
    };
    return colors[rarity] || '#808080';
  };

  const getRarityGradient = (rarity) => {
    const gradients = {
      common: 'linear-gradient(45deg, #808080, #a0a0a0)',
      uncommon: 'linear-gradient(45deg, #00ff00, #32cd32)',
      rare: 'linear-gradient(45deg, #0080ff, #4169e1)',
      legendary: 'linear-gradient(45deg, #ff8000, #ffa500)',
      mythical: 'linear-gradient(45deg, #ff0080, #ff1493)'
    };
    return gradients[rarity] || gradients.common;
  };

  const checkUnlockCondition = (nft, userStats) => {
    // 実際の実装では、ユーザーの統計情報をチェック
    // デモ用の簡略化した条件チェック
    switch (nft.unlockCondition) {
      case 'goshuin_count >= 100':
        return (userStats?.goshuinCount || 0) >= 100;
      case 'pilgrimage_completed':
        return userStats?.pilgrimageCompleted || false;
      case 'volunteer_hours >= 10':
        return (userStats?.volunteerHours || 0) >= 10;
      case 'festival_participation':
        return userStats?.festivalParticipation || false;
      default:
        return true;
    }
  };

  return (
    <div className="special-events">
      <div className="events-header">
        <h2>🎌 特別イベント・限定NFT</h2>
        <p>季節や祭りに合わせた特別なNFTを獲得しよう</p>
      </div>

      {/* 現在の季節イベント */}
      <div className="seasonal-events">
        <h3>🌸 {currentSeason === 'spring' ? '春' : currentSeason === 'summer' ? '夏' : 
                currentSeason === 'autumn' ? '秋' : '冬'}の特別イベント</h3>
        
        <div className="events-grid">
          {activeEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h4>{event.name}</h4>
                <div 
                  className="event-rarity"
                  style={{ background: getRarityGradient(event.rarity) }}
                >
                  {event.rarity.toUpperCase()}
                </div>
              </div>
              
              <div className="event-period">📅 {event.period}</div>
              <div className="event-description">{event.description}</div>
              
              <div className="event-reward">
                <strong>🎁 特別報酬:</strong> {event.specialReward}
              </div>
              
              <div className="event-value">
                <strong>+{event.culturalValue} 文化資本</strong>
              </div>
              
              <div className="event-requirements">
                <strong>参加条件:</strong> {event.requirements}
              </div>
              
              <div className="participating-shrines">
                <strong>対象神社・寺院:</strong>
                <div className="shrine-list">
                  {event.participating_shrines.map(shrine => (
                    <span key={shrine} className="shrine-tag">{shrine}</span>
                  ))}
                </div>
              </div>
              
              <button 
                className="participate-btn"
                onClick={() => handleEventParticipate(event)}
              >
                🎯 イベント参加
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 特別NFTコレクション */}
      <div className="special-nft-collection">
        <h3>🏆 特別NFTコレクション</h3>
        <p>特定の条件を達成すると獲得できる限定NFT</p>
        
        <div className="nft-grid">
          {specialNFTTypes.map(nft => {
            const isUnlocked = checkUnlockCondition(nft, { goshuinCount: 25 }); // デモ用
            
            return (
              <div 
                key={nft.id} 
                className={`nft-card ${!isUnlocked ? 'locked' : ''}`}
              >
                <div className="nft-image">
                  {isUnlocked ? nft.image : '🔒'}
                </div>
                
                <div className="nft-header">
                  <h4>{nft.name}</h4>
                  <div 
                    className="nft-rarity"
                    style={{ background: getRarityGradient(nft.rarity) }}
                  >
                    {nft.rarity.toUpperCase()}
                  </div>
                </div>
                
                <div className="nft-description">
                  {nft.description}
                </div>
                
                <div className="nft-value">
                  <strong>+{nft.culturalValue} 文化資本</strong>
                </div>
                
                <div className="nft-requirements">
                  <strong>獲得条件:</strong> {nft.requirements}
                </div>
                
                {!isUnlocked && (
                  <div className="unlock-status">
                    🔐 条件未達成
                  </div>
                )}
                
                {isUnlocked && (
                  <button className="claim-nft-btn">
                    ✨ NFT獲得
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 過去のイベント履歴 */}
      <div className="event-history">
        <h3>📚 イベント履歴</h3>
        <div className="history-timeline">
          <div className="history-item">
            <div className="history-date">2024年1月</div>
            <div className="history-title">初詣特別NFT獲得</div>
            <div className="history-description">
              明治神宮での初詣で「開運招福NFT」を獲得しました
            </div>
          </div>
          
          <div className="history-item">
            <div className="history-date">2023年8月</div>
            <div className="history-title">夏祭り参加</div>
            <div className="history-description">
              祇園祭に参加し「祭り神輿NFT」を獲得しました
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialEvents;