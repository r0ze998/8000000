import React from 'react';
import { useAccountAbstraction } from '../../hooks/useAccountAbstraction';
import './AccountStatus.css';

interface AccountStatusProps {
  showDetails?: boolean;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ showDetails = false }) => {
  const { isReady, sessionId, address } = useAccountAbstraction();

  if (!showDetails) {
    return (
      <div className="account-status-minimal">
        <div className={`status-indicator ${isReady ? 'ready' : 'loading'}`}>
          {isReady ? '🟢' : '🟡'}
        </div>
        <span className="status-text">
          {isReady ? '参拝準備完了' : '準備中...'}
        </span>
      </div>
    );
  }

  return (
    <div className="account-status-detailed">
      <div className="account-header">
        <h3>🏛️ あなたの神社アカウント</h3>
        <div className={`status-badge ${isReady ? 'ready' : 'loading'}`}>
          {isReady ? '✅ 準備完了' : '⏳ 初期化中'}
        </div>
      </div>
      
      {isReady && (
        <div className="account-info">
          <div className="info-item">
            <span className="info-label">🆔 参拝者ID:</span>
            <span className="info-value">
              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '生成中...'}
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">📅 セッション:</span>
            <span className="info-value">
              {sessionId ? `${sessionId.slice(8, 16)}` : '未開始'}
            </span>
          </div>
          
          <div className="account-features">
            <div className="feature-item">
              <span className="feature-icon">💫</span>
              <span className="feature-text">自動文化資本管理</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span className="feature-text">NFT御朱印自動保存</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <span className="feature-text">セキュア認証システム</span>
            </div>
          </div>
          
          <div className="account-note">
            <p>
              💡 このアカウントは自動で作成されました。
              暗号通貨の知識は不要で、すぐに参拝を始められます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatus;