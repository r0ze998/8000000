import React from 'react';
import styles from './SimpleHomeTab.module.css';

const SimpleHomeTab = ({ onVisitStart }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>八百万の神アプリ</h1>
        <p className={styles.subtitle}>毎日の参拝で心を整える</p>
      </div>

      <div className={styles.mainCard}>
        <div className={styles.shrineImage}>
          <img src="/images/shrine-hero.webp" alt="神社の風景" />
        </div>
        <div className={styles.shrineInfo}>
          <h2 className={styles.shrineName}>今日の参拝</h2>
          <p className={styles.shrineDescription}>
            心を落ち着けて、今日も一日を始めましょう
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.primaryButton}
          onClick={onVisitStart}
          aria-label="参拝を始める"
        >
          参拝する
        </button>
        <button 
          className={styles.secondaryButton}
          aria-label="神社を探す"
        >
          近くの神社を探す
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>連続参拝</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>御朱印</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>0</span>
          <span className={styles.statLabel}>訪問神社</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomeTab;