import React, { useState } from 'react';

const ProfileScreen = ({ playerData, account, isConnected }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    bgm: false
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      {/* Header */}
      <div className="section">
        <h2 className="section-title">👤 プロフィール</h2>
        <p className="section-subtitle">あなたのアカウント情報と設定</p>
      </div>

      {/* Account Details */}
      <div className="section">
        <h3 className="section-title">🔗 アカウント詳細</h3>
        
        <div style={{ 
          background: isConnected 
            ? 'rgba(72, 187, 120, 0.1)' 
            : 'rgba(255, 107, 107, 0.1)',
          border: `1px solid ${isConnected ? 'rgba(72, 187, 120, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              fontSize: '2rem',
              color: isConnected ? '#48BB78' : '#FF6B6B'
            }}>
              {isConnected ? '🟢' : '🔴'}
            </div>
            <div>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                marginBottom: '0.3rem'
              }}>
                {isConnected ? '接続済み' : '未接続'}
              </div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {isConnected ? 'StarkNet Testnet' : 'ウォレットに接続してください'}
              </div>
            </div>
          </div>

          {isConnected && account && (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">👤</span>
                <div className="stat-value" style={{ fontSize: '0.8rem' }}>
                  {account.address}
                </div>
                <div className="stat-label">アドレス</div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💰</span>
                <div className="stat-value">
                  {account.balance}
                </div>
                <div className="stat-label">残高</div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔐</span>
                <div className="stat-value">AA</div>
                <div className="stat-label">Account Abstraction</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="section">
        <h3 className="section-title">📊 ゲーム統計</h3>
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
          <div className="stat-item">
            <span className="stat-icon">🎁</span>
            <div className="stat-value">{playerData.nftCollection.length}</div>
            <div className="stat-label">NFT数</div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⛩️</span>
            <div className="stat-value">{playerData.shrineLevel}</div>
            <div className="stat-label">神社レベル</div>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="section">
        <h3 className="section-title">⚙️ アプリ設定</h3>
        <div className="grid grid-3" style={{ gap: '1rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              通知設定
            </div>
            <button
              className={`btn ${settings.notifications ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleSetting('notifications')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {settings.notifications ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌙</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ダークモード
            </div>
            <button
              className={`btn ${settings.darkMode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleSetting('darkMode')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {settings.darkMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎵</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              BGM設定
            </div>
            <button
              className={`btn ${settings.bgm ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleSetting('bgm')}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {settings.bgm ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="section">
        <h3 className="section-title">💬 サポート</h3>
        <div className="grid grid-3" style={{ gap: '1rem' }}>
          <button className="card" style={{ cursor: 'pointer' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                使い方ガイド
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'rgba(255, 255, 255, 0.7)' 
              }}>
                基本的な使い方
              </div>
            </div>
          </button>

          <button className="card" style={{ cursor: 'pointer' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❓</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                よくある質問
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'rgba(255, 255, 255, 0.7)' 
              }}>
                FAQ
              </div>
            </div>
          </button>

          <button className="card" style={{ cursor: 'pointer' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                お問い合わせ
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'rgba(255, 255, 255, 0.7)' 
              }}>
                サポート
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="section">
        <h3 className="section-title">ℹ️ アプリ情報</h3>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '0.3rem',
                color: '#FFD700'
              }}>
                バージョン
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                2.0.0
              </div>
            </div>
            
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '0.3rem',
                color: '#FFD700'
              }}>
                技術
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Account Abstraction
              </div>
            </div>
            
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '0.3rem',
                color: '#FFD700'
              }}>
                ネットワーク
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                StarkNet Testnet
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.4'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              🙏 神社参拝アプリは、日本の伝統文化とブロックチェーン技術を融合させた革新的なスピリチュアルアプリです。
            </div>
            <div>
              あなたの祈りと文化活動が永続的にブロックチェーンに記録され、NFTとして価値を持ちます。
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="section">
        <h3 className="section-title">🗄️ データ管理</h3>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const dataStr = JSON.stringify({ playerData, settings }, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'shrine-app-backup.json';
              link.click();
            }}
          >
            📥 データをエクスポート
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm('本当にすべてのデータを削除しますか？この操作は元に戻せません。')) {
                localStorage.removeItem('shrineAppData');
                window.location.reload();
              }
            }}
            style={{ 
              background: 'rgba(255, 107, 107, 0.2)',
              borderColor: 'rgba(255, 107, 107, 0.4)',
              color: '#FF6B6B'
            }}
          >
            🗑️ データを削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;