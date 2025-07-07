import React, { useState, useEffect } from 'react';
import { useAccountAbstraction } from '../../hooks/useAccountAbstraction';
import './WelcomeOnboarding.css';

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const { isReady, address } = useAccountAbstraction();

  const steps = [
    {
      icon: '🏛️',
      title: '神社参拝アプリへようこそ',
      description: '日本の伝統文化をデジタルで体験し、心の平安を得られるアプリです。',
      detail: '毎日の参拝を通じて文化資本を獲得し、美しいNFT御朱印を集めることができます。'
    },
    {
      icon: '🎯',
      title: 'すぐに始められます',
      description: 'アカウント作成は自動で完了。ウォレットや暗号通貨の知識は一切不要です。',
      detail: '複雑な設定は必要ありません。今すぐ参拝を開始できます。'
    },
    {
      icon: '💫',
      title: 'あなた専用のアカウントを作成中...',
      description: 'セキュアで使いやすいアカウントをバックグラウンドで準備しています。',
      detail: 'このアカウントは暗号技術で保護され、あなただけの神社体験を提供します。'
    },
    {
      icon: '🎉',
      title: '準備完了！',
      description: 'すべての準備が整いました。美しい神社参拝の旅を始めましょう。',
      detail: '文化資本の獲得、NFT御朱印の収集、心の平安を求める旅が始まります。'
    }
  ];

  // Account Abstractionの準備状況に応じてステップを進める
  useEffect(() => {
    if (currentStep === 2 && isReady) {
      setTimeout(() => setCurrentStep(3), 1000);
    }
  }, [isReady, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // オンボーディング完了をローカルストレージに記録
      localStorage.setItem('shrine_onboarding_completed', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('shrine_onboarding_completed', 'true');
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isAccountCreationStep = currentStep === 2;

  return (
    <div className="welcome-onboarding-overlay">
      <div className="welcome-onboarding-modal">
        {/* ヘッダー */}
        <div className="onboarding-header">
          <button 
            className="skip-button"
            onClick={handleSkip}
            disabled={isAccountCreationStep && !isReady}
          >
            スキップ
          </button>
        </div>

        {/* ステップインジケーター */}
        <div className="step-indicator">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`step-dot ${index <= currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* メインコンテンツ */}
        <div className="onboarding-content">
          <div className="step-icon">
            {currentStepData.icon}
          </div>
          
          <h2 className="step-title">
            {currentStepData.title}
          </h2>
          
          <p className="step-description">
            {currentStepData.description}
          </p>

          {showDetails && (
            <div className="step-detail">
              <p>{currentStepData.detail}</p>
            </div>
          )}

          {/* アカウント作成ステップの特別表示 */}
          {isAccountCreationStep && (
            <div className="account-creation-status">
              <div className={`creation-spinner ${isReady ? 'completed' : 'loading'}`}>
                {isReady ? '✅' : '⏳'}
              </div>
              <div className="creation-text">
                {isReady ? (
                  <>
                    <strong>アカウント作成完了！</strong>
                    <br />
                    <span className="account-id">
                      ID: {address?.slice(0, 8)}...{address?.slice(-6)}
                    </span>
                  </>
                ) : (
                  '安全なアカウントを生成中...'
                )}
              </div>
            </div>
          )}

          <button 
            className="detail-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '詳細を隠す' : '詳細を見る'}
          </button>
        </div>

        {/* フッター */}
        <div className="onboarding-footer">
          <button 
            className="next-button"
            onClick={handleNext}
            disabled={isAccountCreationStep && !isReady}
          >
            {isLastStep ? '参拝を始める' : '次へ'}
          </button>
        </div>

        {/* 技術的補足（最後のステップのみ） */}
        {isLastStep && (
          <div className="tech-note">
            <p>
              💡 このアプリは最新のAccount Abstraction技術を使用しており、
              ブロックチェーンの利点を享受しながら従来のWebアプリと同じように使用できます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// フック：オンボーディングが必要かチェック
export const useOnboarding = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem('shrine_onboarding_completed');
    setNeedsOnboarding(!completed);
    setIsLoading(false);
  }, []);

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
  };

  return {
    needsOnboarding,
    isLoading,
    completeOnboarding
  };
};

export default WelcomeOnboarding;