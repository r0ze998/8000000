import React, { useState, useEffect, useRef } from 'react';
import { useHabitLoop } from '../core/hooks/useHabitLoop';
import { screenReader } from '../utils/accessibility';

const QuickVisitFlow = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1); // 1: 確認, 2: 認証中, 3: 完了
  const [visitMethod, setVisitMethod] = useState('location'); // location or qr
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const { canVisit, nearbyShrine, triggerVisit, todayVisited } = useHabitLoop();
  const startTimeRef = useRef(Date.now());
  
  useEffect(() => {
    // フローの開始をアナウンス
    screenReader.announce('参拝認証フローを開始します');
    
    // 自動的に方法を決定
    if (nearbyShrine) {
      setVisitMethod('location');
    } else {
      setVisitMethod('qr');
    }
  }, [nearbyShrine]);
  
  // ステップ1: 確認（1タップ目）
  const handleConfirm = async () => {
    if (todayVisited) {
      setError('今日は既に参拝済みです');
      return;
    }
    
    setStep(2);
    setIsProcessing(true);
    screenReader.announce('参拝を実行しています');
    
    try {
      // 実際の参拝処理（2タップ目の効果）
      const visitResult = await triggerVisit();
      
      if (visitResult) {
        setResult(visitResult);
        setStep(3);
        screenReader.announce('参拝が完了しました');
      }
    } catch (err) {
      console.error('Visit failed:', err);
      setError(err.message || '参拝に失敗しました');
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // ステップ3: 完了（3タップ目）
  const handleComplete = () => {
    const totalTime = Date.now() - startTimeRef.current;
    
    // パフォーマンス測定
    if (totalTime < 3000) { // 3秒以内
      console.log(`Quick visit completed in ${totalTime}ms`);
    }
    
    screenReader.announce('参拝フローが完了しました');
    onComplete?.(result);
  };
  
  // エラーリトライ
  const handleRetry = () => {
    setError(null);
    setStep(1);
  };
  
  // キャンセル
  const handleCancel = () => {
    screenReader.announce('参拝をキャンセルしました');
    onCancel?.();
  };
  
  return (
    <div className="quick-visit-overlay" role="dialog" aria-modal="true" aria-label="参拝認証">
      <div className="quick-visit-container">
        
        {/* ステップ1: 確認 */}
        {step === 1 && (
          <div className="visit-step step-confirm">
            <button 
              className="close-button"
              onClick={handleCancel}
              aria-label="閉じる"
            >
              ✕
            </button>
            
            <div className="step-content">
              <div className="shrine-info">
                <div className="shrine-icon">⛩️</div>
                <h2 className="shrine-name">
                  {nearbyShrine ? nearbyShrine.name : '神社参拝'}
                </h2>
                <p className="visit-method">
                  {visitMethod === 'location' ? (
                    <>
                      <span className="method-icon">📍</span>
                      位置情報で認証
                    </>
                  ) : (
                    <>
                      <span className="method-icon">📱</span>
                      QRコードで認証
                    </>
                  )}
                </p>
              </div>
              
              {error && (
                <div className="error-message" role="alert">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}
              
              <div className="action-area">
                <button
                  className="visit-confirm-button"
                  onClick={handleConfirm}
                  disabled={!canVisit || todayVisited}
                  aria-label="参拝を実行"
                >
                  <span className="button-content">
                    <span className="button-icon">🙏</span>
                    <span className="button-text">参拝する</span>
                  </span>
                  <div className="tap-indicator">1/3</div>
                </button>
                
                {error && (
                  <button
                    className="retry-button"
                    onClick={handleRetry}
                    aria-label="もう一度試す"
                  >
                    もう一度試す
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* ステップ2: 処理中 */}
        {step === 2 && (
          <div className="visit-step step-processing">
            <div className="step-content">
              <div className="processing-animation">
                <div className="shrine-icon processing">⛩️</div>
                <div className="processing-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>
              
              <h2 className="processing-text">参拝中...</h2>
              <p className="processing-desc">
                {visitMethod === 'location' ? '位置情報を確認しています' : 'QRコードを認証しています'}
              </p>
              
              <div className="tap-indicator">2/3</div>
            </div>
          </div>
        )}
        
        {/* ステップ3: 完了 */}
        {step === 3 && result && (
          <div className="visit-step step-complete">
            <div className="step-content">
              <div className="success-animation">
                <div className="success-icon">✅</div>
                <div className="success-particles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="particle" style={{
                      '--delay': `${i * 0.1}s`,
                      '--angle': `${i * 60}deg`
                    }} />
                  ))}
                </div>
              </div>
              
              <h2 className="success-title">参拝完了！</h2>
              <p className="success-desc">
                {result.visit.shrineName}での参拝を記録しました
              </p>
              
              {/* 簡潔な報酬表示 */}
              <div className="quick-rewards">
                <div className="reward-summary">
                  <span className="reward-icon">📜</span>
                  <span className="reward-text">
                    {result.reward.rewards.length}個の報酬を獲得
                  </span>
                </div>
                
                {result.visit.streak && (
                  <div className="streak-update">
                    <span className="streak-icon">🔥</span>
                    <span className="streak-text">
                      {result.visit.streak}日連続達成！
                    </span>
                  </div>
                )}
              </div>
              
              <div className="action-area">
                <button
                  className="complete-button"
                  onClick={handleComplete}
                  aria-label="完了"
                >
                  <span className="button-content">
                    <span className="button-icon">✨</span>
                    <span className="button-text">完了</span>
                  </span>
                  <div className="tap-indicator">3/3</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Quick Visit Flow - 3タップ以内参拝認証 */

        .quick-visit-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        @keyframes fadeIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px);
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(10px);
          }
        }

        .quick-visit-container {
          width: 90%;
          max-width: 400px;
          max-height: 80vh;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Close Button */
        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: scale(1.1);
        }

        /* Step Base */
        .visit-step {
          position: relative;
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .step-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          text-align: center;
        }

        /* Step 1: Confirm */
        .step-confirm {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .shrine-info {
          margin-bottom: 32px;
        }

        .shrine-icon {
          font-size: 64px;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          animation: gentleBounce 2s ease-in-out infinite;
        }

        @keyframes gentleBounce {
          0%, 50%, 100% { 
            transform: translateY(0); 
          }
          25% { 
            transform: translateY(-4px); 
          }
          75% { 
            transform: translateY(-2px); 
          }
        }

        .shrine-name {
          font-size: 24px;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .visit-method {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .method-icon {
          font-size: 18px;
        }

        /* Error Message */
        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          border: 1px solid #fcc;
        }

        .error-icon {
          font-size: 16px;
        }

        /* Action Area */
        .action-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        /* Visit Confirm Button */
        .visit-confirm-button {
          position: relative;
          width: 100%;
          min-height: 72px;
          background: linear-gradient(135deg, #007AFF, #0056CC);
          border: none;
          border-radius: 20px;
          color: white;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
        }

        .visit-confirm-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
        }

        .visit-confirm-button:active {
          transform: translateY(0);
        }

        .visit-confirm-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
        }

        .button-icon {
          font-size: 24px;
        }

        /* Tap Indicator */
        .tap-indicator {
          position: absolute;
          top: 8px;
          right: 12px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Retry Button */
        .retry-button {
          background: none;
          border: 2px solid #007AFF;
          color: #007AFF;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-button:hover {
          background: #007AFF;
          color: white;
        }

        /* Step 2: Processing */
        .step-processing {
          background: linear-gradient(135deg, #007AFF, #0056CC);
          color: white;
        }

        .processing-animation {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 32px;
        }

        .shrine-icon.processing {
          font-size: 48px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1); 
            opacity: 0.8; 
          }
        }

        .processing-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .ring {
          position: absolute;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: ripple 2s ease-out infinite;
        }

        .ring-1 {
          width: 60px;
          height: 60px;
          margin: -30px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 90px;
          height: 90px;
          margin: -45px;
          animation-delay: 0.5s;
        }

        .ring-3 {
          width: 120px;
          height: 120px;
          margin: -60px;
          animation-delay: 1s;
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .processing-text {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        .processing-desc {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }

        /* Step 3: Complete */
        .step-complete {
          background: linear-gradient(135deg, #34C759, #30D158);
          color: white;
        }

        .success-animation {
          position: relative;
          margin-bottom: 32px;
        }

        .success-icon {
          font-size: 72px;
          animation: successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes successBounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-particles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: particleExplosion 1s ease-out var(--delay) forwards;
        }

        @keyframes particleExplosion {
          0% {
            transform: rotate(var(--angle)) translateX(0) scale(0);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateX(60px) scale(0);
            opacity: 0;
          }
        }

        .success-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }

        .success-desc {
          font-size: 16px;
          opacity: 0.9;
          margin: 0 0 24px 0;
          line-height: 1.4;
        }

        /* Quick Rewards */
        .quick-rewards {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }

        .reward-summary,
        .streak-update {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .reward-summary {
          margin-bottom: 8px;
        }

        .reward-icon,
        .streak-icon {
          font-size: 16px;
        }

        /* Complete Button */
        .complete-button {
          position: relative;
          width: 100%;
          min-height: 72px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .complete-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
          .quick-visit-container {
            background: #1c1c1e;
          }
          
          .step-confirm {
            background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%);
          }
          
          .shrine-name {
            color: #ffffff;
          }
          
          .close-button {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .quick-visit-overlay,
          .quick-visit-container,
          .shrine-icon,
          .ring,
          .success-icon,
          .particle {
            animation: none !important;
          }
          
          .visit-confirm-button:hover,
          .complete-button:hover {
            transform: none;
          }
        }

        /* Responsive */
        @media (max-width: 375px) {
          .quick-visit-container {
            width: 95%;
            border-radius: 20px;
          }
          
          .step-content {
            padding: 32px 24px;
          }
          
          .shrine-icon {
            font-size: 56px;
          }
          
          .shrine-name {
            font-size: 20px;
          }
          
          .visit-confirm-button,
          .complete-button {
            min-height: 64px;
          }
          
          .button-content {
            font-size: 16px;
          }
        }

        /* High Contrast */
        @media (prefers-contrast: high) {
          .quick-visit-container {
            border: 3px solid #000;
          }
          
          .visit-confirm-button {
            background: #000;
            border: 2px solid #fff;
          }
          
          .retry-button {
            border-color: #000;
            color: #000;
          }
          
          .retry-button:hover {
            background: #000;
            color: #fff;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickVisitFlow;