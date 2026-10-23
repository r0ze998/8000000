
import React from 'react';
import AccountStatus from '../../common/AccountStatus';
import './Profile.css';

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>👤 プロフィール</h2>
        <p className="profile-subtitle">あなたのアカウント情報と設定</p>
      </div>
      
      <div className="profile-content">
        {/* アカウント詳細 */}
        <section className="profile-section">
          <AccountStatus showDetails={true} />
        </section>

        {/* その他のプロフィール設定 */}
        <section className="profile-section">
          <h3>🎨 アプリ設定</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="setting-label">🔔 通知設定</span>
              <button className="setting-button">設定</button>
            </div>
            <div className="setting-item">
              <span className="setting-label">🌙 ダークモード</span>
              <button className="setting-button">オフ</button>
            </div>
            <div className="setting-item">
              <span className="setting-label">🎵 BGM設定</span>
              <button className="setting-button">設定</button>
            </div>
          </div>
        </section>

        {/* ヘルプ・サポート */}
        <section className="profile-section">
          <h3>💬 サポート</h3>
          <div className="support-grid">
            <button className="support-item">
              <span className="support-icon">📚</span>
              <span className="support-text">使い方ガイド</span>
            </button>
            <button className="support-item">
              <span className="support-icon">❓</span>
              <span className="support-text">よくある質問</span>
            </button>
            <button className="support-item">
              <span className="support-icon">✉️</span>
              <span className="support-text">お問い合わせ</span>
            </button>
          </div>
        </section>

        {/* アプリ情報 */}
        <section className="profile-section">
          <h3>ℹ️ アプリについて</h3>
          <div className="app-info">
            <div className="info-item">
              <span className="info-label">バージョン:</span>
              <span className="info-value">2.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">技術:</span>
              <span className="info-value">Account Abstraction</span>
            </div>
            <div className="info-item">
              <span className="info-label">ネットワーク:</span>
              <span className="info-value">StarkNet Testnet</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
