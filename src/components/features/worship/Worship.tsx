import React, { useState, useEffect, useRef } from 'react';
import { UserStats } from '../../../types';
import './Worship.css';
import { useAccountAbstraction } from '../../../hooks/useAccountAbstraction';
import { useGoogleMaps } from '../../../hooks/useGoogleMaps';
import { 
  calculateBaseReward, 
  getCurrentSeasonalEvent,
  getTimeOfDay,
  getRandomWeather
} from '../../../utils';
import { dropNFTFromOmikuji, generateSVGBase64 } from '../../../utils/nftUtils';
import { formatTime } from '../../../utils/formatUtils';
import { PRAYER_TYPES, PrayerType } from '../../../constants/prayerTypes';

// 分割されたコンポーネントのインポート
import ReadOnlyShrine from './ReadOnlyShrine';
import PrayerSelector from './PrayerSelector';
import BreathingGuide from './BreathingGuide';
import CompletionModal from './CompletionModal';
import UserStatsPanel from './UserStatsPanel';

const Worship: React.FC = () => {
  // Account Abstraction状態
  const { account, isReady, mintNFT, earnCulturalCapital } = useAccountAbstraction();

  // UI状態
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [selectedSound, setSelectedSound] = useState('bell');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionRewards, setCompletionRewards] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    culturalCapital: 0,
    totalNFTs: 0,
    meditationStreak: 1,
    totalWorshipSessions: 0,
    level: 1,
    experience: 0,
    streak: 1,
    totalVisits: 0,
    nftCount: 0
  });

  // 瞑想・参拝セッション状態
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [showPrayerSelectionModal, setShowPrayerSelectionModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [selectedPrayerType, setSelectedPrayerType] = useState<string>('');
  const [currentPrayerTimer, setCurrentPrayerTimer] = useState(0);
  const [isPrayerActive, setIsPrayerActive] = useState(false);

  // Google Maps関連
  const mapRef = useRef<HTMLDivElement>(null);
  const meditationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isLoaded, error, loadGoogleMapsScript, initializeMap, addMarkers } = useGoogleMaps();

  // Account Abstractionでのリアルタイムミント
  const mintRealNFT = async (nftData: any) => {
    if (!isReady || !account) return null;

    try {
      const metadata = {
        name: nftData.name,
        description: nftData.description,
        image: `data:image/svg+xml;base64,${generateSVGBase64(nftData)}`,
        attributes: [
          { trait_type: "Type", value: nftData.type },
          { trait_type: "Rarity", value: nftData.rarity },
          { trait_type: "Power", value: nftData.power },
          { trait_type: "Color", value: nftData.color },
          { trait_type: "Emoji", value: nftData.emoji }
        ]
      };

      const result = await mintNFT(
        nftData.type,
        nftData.rarity,
        nftData.power,
        metadata
      );

      return result;
    } catch (error) {
      console.error('リアルタイムNFTミントエラー:', error);
      return null;
    }
  };

  // 祈りを捧げるボタンを押した時の処理
  const handlePrayerStart = () => {
    if (!isReady) {
      alert('セッションの準備中です...');
      return;
    }
    setShowPrayerSelectionModal(true);
  };

  // 祈りの種類を選択した時の処理
  const handlePrayerTypeSelect = (prayerType: PrayerType) => {
    setSelectedPrayerType(prayerType.id);
    setSelectedDuration(prayerType.duration);
    setShowPrayerSelectionModal(false);
    setShowPrayerModal(true);
    setCurrentPrayerTimer(prayerType.duration);
    startSelectedPrayer(prayerType);
  };

  // 選択された祈りを開始
  const startSelectedPrayer = (prayerType: PrayerType) => {
    setIsPrayerActive(true);
    setIsActive(true);
    setTimeRemaining(prayerType.duration);

    // 祈りタイマー開始
    meditationTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completePrayer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 呼吸ガイド開始
    startBreathingGuide();
  };

  // 現在の祈りタイプを取得
  const getCurrentPrayerType = () => {
    return PRAYER_TYPES.find(type => type.id === selectedPrayerType);
  };

  // 呼吸ガイド
  const startBreathingGuide = () => {
    const breathingCycle = () => {
      // 吸気 (4秒)
      setBreathingPhase('inhale');
      setBreathingTimer(4);

      const inhaleTimer = setInterval(() => {
        setBreathingTimer(prev => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(inhaleTimer);

        // 保持 (4秒)
        setBreathingPhase('hold');
        setBreathingTimer(4);

        const holdTimer = setInterval(() => {
          setBreathingTimer(prev => prev - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(holdTimer);

          // 呼気 (4秒)
          setBreathingPhase('exhale');
          setBreathingTimer(4);

          const exhaleTimer = setInterval(() => {
            setBreathingTimer(prev => prev - 1);
          }, 1000);

          setTimeout(() => {
            clearInterval(exhaleTimer);
          }, 4000);
        }, 4000);
      }, 4000);
    };

    breathingCycle();
    breathingTimerRef.current = setInterval(breathingCycle, 12000); // 12秒サイクル
  };

  // 祈り完了
  const completePrayer = async () => {
    setIsActive(false);
    setIsPrayerActive(false);
    setShowPrayerModal(false);

    if (meditationTimerRef.current) {
      clearInterval(meditationTimerRef.current);
    }
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }

    // 報酬計算
    const baseReward = calculateBaseReward(selectedDuration);
    const seasonalEvent = getCurrentSeasonalEvent();
    const weather = getRandomWeather();
    const timeOfDay = getTimeOfDay();

    const rewards = {
      culturalCapital: baseReward.culturalCapital,
      experience: baseReward.experience,
      bonus: {
        seasonal: seasonalEvent ? 20 : 0,
        weather: weather.condition === 'sunny' ? 10 : 0,
        timeOfDay: timeOfDay === 'morning' ? 15 : 0
      }
    };

    const totalCulturalCapital = rewards.culturalCapital + 
      rewards.bonus.seasonal + 
      rewards.bonus.weather + 
      rewards.bonus.timeOfDay;

    // Account Abstractionで文化資本獲得
    if (isReady && earnCulturalCapital) {
      await earnCulturalCapital(totalCulturalCapital);
    }

    // おみくじ結果生成
    const omikujiResults = ['大吉', '中吉', '吉', '小吉', '末吉', '凶'];
    const omikujiResult = omikujiResults[Math.floor(Math.random() * omikujiResults.length)] || '吉';

    // NFTドロップ判定
    const droppedNFT = dropNFTFromOmikuji(omikujiResult);
    let mintResult = null;

    if (droppedNFT) {
      // リアルタイムでNFTをミント
      mintResult = await mintRealNFT(droppedNFT);

      // ローカルストレージにも保存
      const existingNFTs = JSON.parse(localStorage.getItem('shrineNFTs') || '[]');
      const updatedNFTs = [...existingNFTs, droppedNFT];
      localStorage.setItem('shrineNFTs', JSON.stringify(updatedNFTs));

      // カスタムイベントを発火してMyShrine コンポーネントに通知
      window.dispatchEvent(new CustomEvent('newNFTDropped', { 
        detail: { nft: droppedNFT, mintResult } 
      }));
    }

    setCompletionRewards({
      ...rewards,
      totalCulturalCapital,
      omikujiResult,
      droppedNFT,
      mintResult
    });

    // 統計更新
    setUserStats(prev => ({
      ...prev,
      culturalCapital: prev.culturalCapital + totalCulturalCapital,
      totalNFTs: droppedNFT ? prev.totalNFTs + 1 : prev.totalNFTs,
      totalWorshipSessions: prev.totalWorshipSessions + 1,
      level: Math.floor((prev.culturalCapital + totalCulturalCapital) / 100) + 1,
      nftCount: droppedNFT ? prev.nftCount + 1 : prev.nftCount,
      totalVisits: prev.totalVisits + 1
    }));

    setShowCompletion(true);
  };

  // 祈り停止
  const stopPrayer = () => {
    setIsActive(false);
    setIsPrayerActive(false);
    setShowPrayerModal(false);
    setTimeRemaining(0);

    if (meditationTimerRef.current) {
      clearInterval(meditationTimerRef.current);
    }
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
    }
  };

  // Google Maps初期化
  useEffect(() => {
    if (!isLoaded) {
      loadGoogleMapsScript();
    }
  }, [isLoaded, loadGoogleMapsScript]);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const map = initializeMap(mapRef.current);
      if (map) {
        addMarkers(map, []);
      }
    }
  }, [isLoaded, initializeMap, addMarkers]);

  return (
    <div className="worship">
      <div className="worship-container">
        {/* ヘッダー */}
        <div className="worship-header">
          <div className="header-content">
            <div className="title-section">
              <h1>🙏 神社参拝</h1>
              <p className="subtitle">瞑想を通じて心を清め、神聖なNFTを獲得しよう</p>
            </div>
          </div>
        </div>

        {/* 完了画面オーバーレイ */}
        <CompletionModal
          isOpen={showCompletion}
          rewards={completionRewards}
          onClose={() => setShowCompletion(false)}
        />

        {/* 祈りの種類選択モーダル */}
        <PrayerSelector
          isOpen={showPrayerSelectionModal}
          prayerTypes={PRAYER_TYPES}
          onClose={() => setShowPrayerSelectionModal(false)}
          onSelectPrayer={handlePrayerTypeSelect}
        />

        {/* アクティブ祈りモーダル */}
        {showPrayerModal && getCurrentPrayerType() && (
          <div className="duration-modal-overlay">
            <div className="duration-modal active-prayer">
              <div className="modal-header">
                <h3>{getCurrentPrayerType()?.title}</h3>
                <button 
                  className="modal-close"
                  onClick={stopPrayer}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="active-prayer-content">
                  <div className="prayer-circle-modal" style={{ borderColor: getCurrentPrayerType()?.color }}>
                    <div className="prayer-emoji-large" style={{ color: getCurrentPrayerType()?.color }}>
                      {getCurrentPrayerType()?.emoji}
                    </div>
                    <div className="timer-display">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="breathing-guide-text">
                      {breathingPhase === 'inhale' && '息を吸って'}
                      {breathingPhase === 'hold' && '息を止めて'}
                      {breathingPhase === 'exhale' && '息を吐いて'}
                    </div>
                  </div>

                  <div className="prayer-message">
                    {getCurrentPrayerType()?.message}
                  </div>

                  <div className="prayer-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${((selectedDuration - timeRemaining) / selectedDuration) * 100}%`,
                          backgroundColor: getCurrentPrayerType()?.color
                        }}
                      ></div>
                    </div>
                    <p className="time-info">
                      {formatTime(selectedDuration - timeRemaining)} / {formatTime(selectedDuration)}
                    </p>
                  </div>

                  <button 
                    className="stop-prayer-btn"
                    onClick={stopPrayer}
                  >
                    祈り終了
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* コンテンツ */}
        {!isActive ? (
          <div className="worship-content">
            {/* あなたの神社セクション */}
            <div className="shrine-section">
              <h2>⛩️ あなたの神社</h2>
              <div className="shrine-preview">
                <ReadOnlyShrine />
              </div>
            </div>

            {/* 参拝セクション */}
            <UserStatsPanel
              stats={userStats}
              isReady={isReady}
              onStartPrayer={handlePrayerStart}
            />
          </div>
        ) : (
          <div className="prayer-active">
            {/* 幻想的なマイ神社表示（読み取り専用） */}
            <div className="mystical-shrine-overlay">
              <ReadOnlyShrine className="mystical" />
            </div>

            {/* アクティブ祈り画面 */}
            <BreathingGuide
              phase={breathingPhase}
              timer={breathingTimer}
              timeRemaining={timeRemaining}
              selectedDuration={selectedDuration}
            />

            <div className="meditation-controls">
              <button className="stop-btn" onClick={stopPrayer}>
                祈り終了
              </button>
            </div>

            <div className="session-info">
              <div className="current-session">
                <span>🎵 {selectedSound === 'bell' ? '鈴の音' : 
                       selectedSound === 'nature' ? '森の音' : 
                       selectedSound === 'water' ? '川のせせらぎ' : '静寂'}</span>
                <span>⏱️ {formatTime(selectedDuration - timeRemaining)} / {formatTime(selectedDuration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 神社マップセクション */}
        <div className="shrine-map-section">
          <h3>🗾 近くの神社を探す</h3>
          <div className="map-container">
            {error ? (
              <div className="map-error">
                マップの読み込みに失敗しました: {error}
              </div>
            ) : !isLoaded ? (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>マップを読み込み中...</p>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="google-map"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worship;