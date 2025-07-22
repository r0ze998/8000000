import React, { useState, useEffect, useRef } from 'react';
import ReadOnlyShrine from './ReadOnlyShrine';
import PrayerModal from './PrayerModal';
import PrayerSelectionModal from './PrayerSelectionModal';
import CompletionModal from './CompletionModal';

const PRAYER_TYPES = {
  meditation: { name: '🧘 瞑想', duration: 300, color: '#4299E1' },
  gratitude: { name: '🙏 感謝', duration: 180, color: '#FFD700' },
  peace: { name: '🌸 平和', duration: 240, color: '#F687B3' },
  health: { name: '💪 健康', duration: 360, color: '#48BB78' },
  goals: { name: '🎯 目標達成', duration: 420, color: '#9F7AEA' },
  fortune: { name: '🌟 開運', duration: 480, color: '#ED8936' }
};

const OMIKUJI_RESULTS = ['大吉', '中吉', '吉', '小吉', '末吉', '凶'];

const WorshipScreen = ({ 
  playerData, 
  addCulturalCapital, 
  addWorshipCount, 
  addNFT, 
  shrineName, 
  setShrineName 
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(shrineName);
  const [showPrayerSelection, setShowPrayerSelection] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activePrayer, setActivePrayer] = useState(null);
  const [prayerTimer, setPrayerTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale
  const [completionResult, setCompletionResult] = useState(null);

  const timerRef = useRef(null);
  const breathingRef = useRef(null);

  useEffect(() => {
    if (isTimerActive && prayerTimer > 0) {
      timerRef.current = setInterval(() => {
        setPrayerTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            completePrayer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerActive, prayerTimer]);

  useEffect(() => {
    if (isTimerActive) {
      const phases = ['息を吸って', '息を止めて', '息を吐いて'];
      const durations = [4000, 2000, 6000]; // 4秒吸う、2秒止める、6秒吐く
      let currentPhaseIndex = 0;

      const cycleBreathing = () => {
        setBreathingPhase(phases[currentPhaseIndex]);
        breathingRef.current = setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          cycleBreathing();
        }, durations[currentPhaseIndex]);
      };

      cycleBreathing();
    }

    return () => clearTimeout(breathingRef.current);
  }, [isTimerActive]);

  const handleNameEdit = () => {
    if (isEditingName) {
      setShrineName(editedName);
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
    }
  };

  const handlePrayerStart = (prayerType) => {
    setActivePrayer(prayerType);
    setPrayerTimer(PRAYER_TYPES[prayerType].duration);
    setShowPrayerSelection(false);
    setShowPrayerModal(true);
    setIsTimerActive(true);
  };

  const stopPrayer = () => {
    setIsTimerActive(false);
    setShowPrayerModal(false);
    setPrayerTimer(0);
    setActivePrayer(null);
  };

  const completePrayer = () => {
    if (!activePrayer) return;

    const prayer = PRAYER_TYPES[activePrayer];
    const baseReward = Math.floor(prayer.duration / 60) * 10; // 1分あたり10文化資本
    const bonusMultiplier = Math.random() < 0.3 ? 2 : 1; // 30%の確率でボーナス
    const finalReward = baseReward * bonusMultiplier;
    
    const omikujiResult = OMIKUJI_RESULTS[Math.floor(Math.random() * OMIKUJI_RESULTS.length)];
    const hasNFTDrop = Math.random() < 0.15; // 15%の確率でNFTドロップ

    let nftDrop = null;
    if (hasNFTDrop) {
      const rarities = ['common', 'rare', 'epic', 'legendary'];
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      nftDrop = {
        type: 'prayer_artifact',
        rarity,
        name: `${prayer.name.split(' ')[1]}の証`,
        emoji: prayer.name.split(' ')[0],
        color: prayer.color,
        prayerType: activePrayer
      };
      addNFT(nftDrop);
    }

    setCompletionResult({
      prayerName: prayer.name,
      omikujiResult,
      culturalCapital: finalReward,
      experience: Math.floor(finalReward / 2),
      bonus: bonusMultiplier > 1,
      nftDrop
    });

    addCulturalCapital(finalReward);
    addWorshipCount();

    setShowPrayerModal(false);
    setShowCompletionModal(true);
    setActivePrayer(null);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Shrine Name Section */}
      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'white',
                fontSize: '1.2rem',
                flex: 1
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleNameEdit()}
              autoFocus
            />
          ) : (
            <h2 style={{ flex: 1, color: '#FFD700', fontSize: '1.5rem' }}>
              ⛩️ {shrineName}
            </h2>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleNameEdit}
            style={{ padding: '0.5rem' }}
          >
            {isEditingName ? '💾' : '✏️'}
          </button>
        </div>

        {/* Shrine Preview */}
        <ReadOnlyShrine 
          nftCollection={playerData.nftCollection}
          shrineLevel={playerData.shrineLevel}
        />

        <div className="stats-grid" style={{ marginTop: '1rem' }}>
          <div className="stat-item">
            <span className="stat-icon">🎁</span>
            <div className="stat-value">{playerData.nftCollection.length}</div>
            <div className="stat-label">所持NFT</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <div className="stat-value">{playerData.nftCollection.filter(nft => nft.placed).length}</div>
            <div className="stat-label">配置済み</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🌟</span>
            <div className="stat-value">{new Set(playerData.nftCollection.map(nft => nft.rarity)).size}</div>
            <div className="stat-label">レア度種類</div>
          </div>
        </div>
      </div>

      {/* Worship Statistics */}
      <div className="section">
        <h3 className="section-title">🙏 参拝統計</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <div className="stat-value">{playerData.culturalCapital}</div>
            <div className="stat-label">文化資本</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🙏</span>
            <div className="stat-value">{playerData.worshipCount}</div>
            <div className="stat-label">参拝回数</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <div className="stat-value">{playerData.level}</div>
            <div className="stat-label">レベル</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <div className="stat-value">{playerData.streak}</div>
            <div className="stat-label">連続記録</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn btn-primary btn-large"
            onClick={() => setShowPrayerSelection(true)}
          >
            🙏 祈りを捧げる
          </button>
        </div>
      </div>

      {/* Google Maps Section - Simplified for now */}
      <div className="section">
        <h3 className="section-title">🗺️ 近くの神社</h3>
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '1rem' }}>地図を読み込み中...</span>
        </div>
      </div>

      {/* Modals */}
      {showPrayerSelection && (
        <PrayerSelectionModal
          prayerTypes={PRAYER_TYPES}
          onSelect={handlePrayerStart}
          onClose={() => setShowPrayerSelection(false)}
        />
      )}

      {showPrayerModal && activePrayer && (
        <PrayerModal
          prayer={PRAYER_TYPES[activePrayer]}
          timeRemaining={prayerTimer}
          breathingPhase={breathingPhase}
          onStop={stopPrayer}
        />
      )}

      {showCompletionModal && completionResult && (
        <CompletionModal
          result={completionResult}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
};

export default WorshipScreen;