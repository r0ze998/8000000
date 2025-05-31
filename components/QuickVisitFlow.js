import React, { useState } from 'react';
import styles from './QuickVisitFlow.module.css';

const QuickVisitFlow = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState('ready');

  const handleStart = () => {
    setStep('visiting');
    // Simulate visit process
    setTimeout(() => {
      setStep('complete');
    }, 3000);
  };

  const handleComplete = () => {
    onComplete({ success: true });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {step === 'ready' && (
          <>
            <h2 className={styles.title}>参拝の準備</h2>
            <div className={styles.content}>
              <p className={styles.instruction}>
                心を落ち着けて、参拝の準備をしましょう。
              </p>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>⛩️</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.primaryButton}
                onClick={handleStart}
              >
                参拝を始める
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={onCancel}
              >
                キャンセル
              </button>
            </div>
          </>
        )}

        {step === 'visiting' && (
          <>
            <h2 className={styles.title}>参拝中...</h2>
            <div className={styles.content}>
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>心を込めて参拝しています</p>
              </div>
            </div>
          </>
        )}

        {step === 'complete' && (
          <>
            <h2 className={styles.title}>参拝完了！</h2>
            <div className={styles.content}>
              <div className={styles.successIcon}>✨</div>
              <p className={styles.successMessage}>
                本日の参拝が完了しました。
                御朱印を獲得しました！
              </p>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.primaryButton}
                onClick={handleComplete}
              >
                完了
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickVisitFlow;