import React, { useState, useEffect, useRef } from 'react';
import { useHabitLoop } from '../core/hooks/useHabitLoop';
import { screenReader } from '../utils/accessibility';
import './QuickVisitFlow.css';

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
    </div>
  );
};

export default QuickVisitFlow;