import React, { useState } from 'react';
import './ProfileTab.css';
import GoshuinchoCollection from './GoshuinchoCollection';
import ShrinePartnership from './ShrinePartnership';

const ProfileTab = ({
  userProfile,
  playerStats,
  achievements,
  nftCollection,
  drawnOmikuji,
  recentVisits,
  myShrine,
  soundEffects,
  showTemporaryNotification,
  onShareProfile,
  onExportData,
  goshuinchoPage,
  onPageChange
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showPartnership, setShowPartnership] = useState(false);

  const getAchievementProgress = () => {
    const totalAchievements = 50; // 仮の総アチーブメント数
    const unlockedCount = Object.keys(achievements || {}).length;
    return { unlocked: unlockedCount, total: totalAchievements };
  };

  const getOmikujiStats = () => {
    if (!drawnOmikuji || drawnOmikuji.length === 0) return {};
    
    const stats = drawnOmikuji.reduce((acc, omikuji) => {
      acc[omikuji.rarity] = (acc[omikuji.rarity] || 0) + 1;
      return acc;
    }, {});
    
    return stats;
  };

  const sections = [
    { id: 'overview', label: '概要', icon: '📊' },
    { id: 'achievements', label: '実績', icon: '🏆' },
    { id: 'collection', label: 'コレクション', icon: '📚' },
    { id: 'stats', label: '統計', icon: '📈' },
    { id: 'settings', label: '設定', icon: '⚙️' }
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    soundEffects.playSound('koto');
  };

  const omikujiStats = getOmikujiStats();
  const achievementProgress = getAchievementProgress();

  return (
    <div className="profile-tab">
      {/* プロフィールヘッダー */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-image">
            {userProfile.avatar || '👤'}
          </div>
          <div className="level-badge">Lv.{userProfile.level || 1}</div>
        </div>
        <div className="profile-info">
          <h2>{userProfile.name || 'プレイヤー'}</h2>
          <p className="profile-title">{userProfile.title || '神社巡礼者'}</p>
          <div className="profile-stats-row">
            <span>⛩️ {recentVisits?.length || 0} 参拝</span>
            <span>📚 {userProfile.culturalCapital || 0} 文化資本</span>
            <span>🎋 {drawnOmikuji?.length || 0} おみくじ</span>
          </div>
        </div>
      </div>

      {/* セクションナビゲーション */}
      <div className="section-nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleSectionChange(section.id)}
          >
            <span className="section-icon">{section.icon}</span>
            <span className="section-label">{section.label}</span>
          </button>
        ))}
      </div>

      {/* コンテンツセクション */}
      <div className="profile-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            {/* クイック統計 */}
            <div className="quick-stats">
              <div className="stat-card primary">
                <div className="stat-icon">🏅</div>
                <div className="stat-content">
                  <div className="stat-value">{userProfile.level || 1}</div>
                  <div className="stat-label">レベル</div>
                </div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">⛩️</div>
                <div className="stat-content">
                  <div className="stat-value">{recentVisits?.length || 0}</div>
                  <div className="stat-label">参拝数</div>
                </div>
              </div>
              <div className="stat-card warning">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <div className="stat-value">{userProfile.streak || 0}日</div>
                  <div className="stat-label">連続参拝</div>
                </div>
              </div>
              <div className="stat-card info">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-value">{achievementProgress.unlocked}/{achievementProgress.total}</div>
                  <div className="stat-label">実績</div>
                </div>
              </div>
            </div>

            {/* 最近の活動 */}
            <div className="recent-activity">
              <h3>📅 最近の活動</h3>
              <div className="activity-list">
                {recentVisits?.slice(0, 5).map((visit, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">⛩️</div>
                    <div className="activity-content">
                      <h4>{visit.shrine?.name || '神社'}</h4>
                      <p>{new Date(visit.timestamp).toLocaleDateString('ja-JP')}</p>
                    </div>
                    {visit.omikuji && (
                      <span className="activity-badge">{visit.omikuji.rarity}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 神社パートナーシップ */}
            <div className="partnership-preview">
              <h3>🤝 神社パートナーシップ</h3>
              <p>神社との特別な関係を築き、文化保護に貢献しましょう</p>
              <button
                className="partnership-btn"
                onClick={() => {
                  setShowPartnership(true);
                  soundEffects.playSound('gong');
                }}
              >
                詳細を見る
              </button>
            </div>
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className="achievements-section">
            <h3>🏆 獲得実績</h3>
            <div className="achievements-grid">
              {Object.entries(achievements || {}).map(([id, achievement]) => (
                <div key={id} className="achievement-card unlocked">
                  <div className="achievement-icon">{achievement.icon || '🏅'}</div>
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    {new Date(achievement.unlockedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              ))}
            </div>
            
            <h3 className="locked-title">🔒 未獲得実績</h3>
            <div className="achievements-grid">
              <div className="achievement-card locked">
                <div className="achievement-icon">🌸</div>
                <h4>桜マスター</h4>
                <p>桜の季節に10箇所の神社を参拝</p>
              </div>
              <div className="achievement-card locked">
                <div className="achievement-icon">⚡</div>
                <h4>パワースポット巡礼者</h4>
                <p>有名なパワースポット20箇所を制覇</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'collection' && (
          <div className="collection-section">
            {/* 御朱印帳 */}
            <div className="goshuincho-area">
              <h3>📖 御朱印帳コレクション</h3>
              <GoshuinchoCollection
                collection={nftCollection}
                currentPage={goshuinchoPage}
                onPageChange={onPageChange}
              />
            </div>

            {/* おみくじコレクション */}
            <div className="omikuji-collection">
              <h3>🎋 おみくじコレクション</h3>
              <div className="omikuji-stats">
                {Object.entries(omikujiStats).map(([rarity, count]) => (
                  <div key={rarity} className="omikuji-stat">
                    <span className="rarity-name">{rarity}</span>
                    <span className="rarity-count">×{count}</span>
                  </div>
                ))}
              </div>
              <div className="total-omikuji">
                <span>総数:</span>
                <span className="total-count">{drawnOmikuji?.length || 0}枚</span>
              </div>
            </div>

            {/* 神社建築コレクション */}
            <div className="building-collection">
              <h3>🏛️ 神社建築コレクション</h3>
              <div className="building-grid">
                {myShrine?.buildings?.map((building, index) => (
                  <div key={index} className="building-item">
                    <div className="building-icon">{building.icon}</div>
                    <span>{building.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'stats' && (
          <div className="stats-section">
            <h3>📊 詳細統計</h3>
            
            {/* 参拝統計 */}
            <div className="stat-category">
              <h4>⛩️ 参拝統計</h4>
              <div className="detailed-stats">
                <div className="stat-item">
                  <span className="stat-name">総参拝数</span>
                  <span className="stat-value">{playerStats?.totalVisits || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">ユニーク神社数</span>
                  <span className="stat-value">{playerStats?.uniqueShrines || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">最長連続参拝</span>
                  <span className="stat-value">{playerStats?.longestStreak || 0}日</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">総移動距離</span>
                  <span className="stat-value">{playerStats?.totalDistance || 0}km</span>
                </div>
              </div>
            </div>

            {/* 文化活動統計 */}
            <div className="stat-category">
              <h4>📚 文化活動統計</h4>
              <div className="detailed-stats">
                <div className="stat-item">
                  <span className="stat-name">文化資本総額</span>
                  <span className="stat-value">{userProfile.culturalCapital || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">完了レッスン</span>
                  <span className="stat-value">{playerStats?.completedLessons || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">参加イベント</span>
                  <span className="stat-value">{playerStats?.eventsJoined || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">寄付総額</span>
                  <span className="stat-value">¥{playerStats?.totalDonations || 0}</span>
                </div>
              </div>
            </div>

            {/* ゲーム統計 */}
            <div className="stat-category">
              <h4>🎮 ゲーム統計</h4>
              <div className="detailed-stats">
                <div className="stat-item">
                  <span className="stat-name">プレイ時間</span>
                  <span className="stat-value">{playerStats?.playTime || 0}時間</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">獲得NFT</span>
                  <span className="stat-value">{nftCollection?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">村レベル</span>
                  <span className="stat-value">{myShrine?.level || 1}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-name">フレンド数</span>
                  <span className="stat-value">{playerStats?.friendCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="settings-section">
            <h3>⚙️ 設定</h3>
            
            {/* プロフィール設定 */}
            <div className="settings-group">
              <h4>プロフィール設定</h4>
              <div className="setting-item">
                <label>ニックネーム</label>
                <input 
                  type="text" 
                  value={userProfile.name || ''} 
                  placeholder="プレイヤー名を入力"
                  className="setting-input"
                />
              </div>
              <div className="setting-item">
                <label>称号</label>
                <select className="setting-select">
                  <option>神社巡礼者</option>
                  <option>文化探求者</option>
                  <option>おみくじマスター</option>
                </select>
              </div>
            </div>

            {/* 通知設定 */}
            <div className="settings-group">
              <h4>通知設定</h4>
              <div className="setting-item toggle">
                <label>イベント通知</label>
                <input type="checkbox" className="toggle-input" defaultChecked />
              </div>
              <div className="setting-item toggle">
                <label>フレンドからの通知</label>
                <input type="checkbox" className="toggle-input" defaultChecked />
              </div>
            </div>

            {/* データ管理 */}
            <div className="settings-group">
              <h4>データ管理</h4>
              <button 
                className="setting-btn"
                onClick={() => {
                  onShareProfile();
                  showTemporaryNotification('📤 プロフィールを共有しました');
                }}
              >
                プロフィールを共有
              </button>
              <button 
                className="setting-btn secondary"
                onClick={() => {
                  onExportData();
                  showTemporaryNotification('💾 データをエクスポートしました');
                }}
              >
                データをエクスポート
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 神社パートナーシップ詳細 */}
      {showPartnership && (
        <div className="partnership-overlay">
          <button
            className="close-btn"
            onClick={() => setShowPartnership(false)}
          >
            ✕
          </button>
          <div className="partnership-content">
            <ShrinePartnership
              userProfile={userProfile}
              onOfferingMade={(offering) => {
                showTemporaryNotification(`💰 ${offering.shrine}へのお布施を納めました！`);
                soundEffects.playSound('bell');
              }}
              onPartnershipJoin={(shrine) => {
                showTemporaryNotification(`🤝 ${shrine.name}のパートナーになりました！`);
                soundEffects.playSound('gong');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;