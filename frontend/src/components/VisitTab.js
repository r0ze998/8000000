import React, { useState } from 'react';
import './VisitTab.css';
import OmikujiSystem from './OmikujiSystem';
import { OMIKUJI_RARITIES } from '../data/omikujiDatabase';

const VisitTab = ({
  onShrineSelect,
  recentVisits,
  playerProfile,
  drawnOmikuji,
  onOmikujiDrawn,
  soundEffects,
  showTemporaryNotification,
  updatePlayerExperience,
  unlockAchievement,
  updatePlayerStats
}) => {
  console.log('VisitTab rendered');
  const [showOmikujiAfterVisit, setShowOmikujiAfterVisit] = useState(false);
  const [justCompletedVisit, setJustCompletedVisit] = useState(false);

  const handleShrineSelection = () => {
    soundEffects.playSound('gong');
    onShrineSelect();
  };

  const handleVisitComplete = (shrine) => {
    // 参拝が完了したらおみくじを引く
    setJustCompletedVisit(true);
    setShowOmikujiAfterVisit(true);
    showTemporaryNotification(`⛩️ ${shrine.name}への参拝を記録しました！おみくじを引いてください！`);
    soundEffects.playSound('bell');
  };

  const getOmikujiBonus = (rarity) => {
    const rarityData = OMIKUJI_RARITIES[rarity];
    return rarityData ? Math.floor(100 / rarityData.weight) : 10;
  };

  const handleOmikujiDrawn = (omikuji) => {
    // おみくじを引いた後の処理
    onOmikujiDrawn(omikuji);
    
    // レア度に応じて経験値ボーナス
    const bonus = getOmikujiBonus(omikuji.rarity);
    updatePlayerExperience(bonus);
    
    // おみくじ関連のアチーブメント
    if (omikuji.rarity === '大吉') {
      unlockAchievement('lucky-one', '幸運の持ち主');
      showTemporaryNotification('🎊 大吉を引きました！幸運の持ち主アチーブメントを獲得！');
    }
    if (drawnOmikuji.length >= 100) {
      unlockAchievement('omikuji-master', 'おみくじマスター');
    }

    // 参拝完了のメッセージ
    showTemporaryNotification(`🎋 ${omikuji.rarity}を引きました！ +${bonus} 経験値`);
    
    // おみくじ画面を閉じる
    setTimeout(() => {
      setShowOmikujiAfterVisit(false);
      setJustCompletedVisit(false);
    }, 3000);
  };

  if (showOmikujiAfterVisit) {
    return (
      <div className="visit-tab omikuji-mode">
        <div className="omikuji-overlay">
          <h2>🎋 参拝記念おみくじ</h2>
          <p className="omikuji-instruction">
            {justCompletedVisit 
              ? "参拝ありがとうございました！記念におみくじを引いてください。"
              : "おみくじを引いてみましょう。"
            }
          </p>
          <OmikujiSystem
            onOmikujiDrawn={handleOmikujiDrawn}
            userLevel={playerProfile.level}
            drawnOmikuji={drawnOmikuji}
            specialMode={justCompletedVisit ? 'shrine-visit' : 'normal'}
          />
          <button 
            className="skip-omikuji-btn"
            onClick={() => {
              setShowOmikujiAfterVisit(false);
              setJustCompletedVisit(false);
            }}
          >
            スキップ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="visit-tab">
      <div className="shrine-visit-area">
        <h2>⛩️ 神社・寺院への参拝</h2>
        <p className="visit-description">
          実際の神社や寺院を訪れて参拝記録をNFTとして保存しましょう。
          参拝後は特別なおみくじを引くことができます！
        </p>
        
        {/* メインアクション */}
        <div className="visit-actions">
          <button 
            className="large-action-btn shrine-select-btn"
            onClick={handleShrineSelection}
          >
            <span className="btn-icon">🗺️</span>
            <span className="btn-text">神社・寺院を選ぶ</span>
            <span className="btn-subtitle">GPSまたは写真で参拝を証明</span>
          </button>
          
          <button 
            className="large-action-btn omikuji-direct-btn"
            onClick={() => setShowOmikujiAfterVisit(true)}
          >
            <span className="btn-icon">🎋</span>
            <span className="btn-text">おみくじを引く</span>
            <span className="btn-subtitle">運勢を占ってみましょう</span>
          </button>
        </div>
        
        {/* 参拝の流れ */}
        <div className="visit-flow">
          <h3>🚶 参拝の流れ</h3>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>神社を選ぶ</h4>
                <p>近くの神社や行きたい寺院を選択</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>参拝する</h4>
                <p>実際に訪れて写真またはGPSで証明</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>NFT獲得</h4>
                <p>参拝記録がNFTとして記録される</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step special">
              <div className="step-number">★</div>
              <div className="step-content">
                <h4>おみくじを引く</h4>
                <p>参拝記念の特別なおみくじ</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 最近の参拝記録 */}
        {recentVisits && recentVisits.length > 0 && (
          <div className="recent-visits">
            <h3>📝 最近の参拝記録</h3>
            <div className="visits-grid">
              {recentVisits.slice(0, 6).map((visit, index) => (
                <div key={index} className="visit-card">
                  <div className="visit-image">
                    {visit.photo ? (
                      <img src={visit.photo} alt={visit.shrine?.name || '神社'} />
                    ) : (
                      <div className="no-image">⛩️</div>
                    )}
                  </div>
                  <div className="visit-info">
                    <h4>{visit.shrine?.name || '未名の神社'}</h4>
                    <p className="visit-date">
                      {new Date(visit.timestamp).toLocaleDateString('ja-JP')}
                    </p>
                    <span className="visit-method">
                      {visit.verificationMethod === 'photo' ? '📷 写真' : '📍 GPS'}
                    </span>
                    {visit.omikuji && (
                      <span className="visit-omikuji">
                        🎋 {visit.omikuji.rarity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 参拝統計 */}
        <div className="visit-stats">
          <h3>📊 あなたの参拝統計</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{recentVisits?.length || 0}</div>
              <div className="stat-label">総参拝数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {drawnOmikuji?.filter(o => o.rarity === '大吉').length || 0}
              </div>
              <div className="stat-label">大吉の数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {playerProfile?.culturalCapital || 0}
              </div>
              <div className="stat-label">文化資本</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {playerProfile?.level || 1}
              </div>
              <div className="stat-label">レベル</div>
            </div>
          </div>
        </div>
        
        {/* 参拝のコツ */}
        <div className="visit-tips">
          <h3>💯 参拝のコツ</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">📷</div>
              <h4>写真証明</h4>
              <p>神社の本殿や鳥居を撮影して証明</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📍</div>
              <h4>GPS証明</h4>
              <p>神社から500m以内で位置情報を取得</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🎋</div>
              <h4>おみくじ特典</h4>
              <p>参拝後のおみくじで運勢アップ！</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🏆</div>
              <h4>NFT獲得</h4>
              <p>参拝記録が永久保存される</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitTab;