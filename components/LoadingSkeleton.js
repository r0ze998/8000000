import React from 'react';
import styles from './LoadingSkeleton.module.css';

const LoadingSkeleton = ({ type = 'default', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'home':
        return (
          <div className={styles.homeContainer}>
            <div className={styles.header}>
              <div className={styles.circle} />
              <div className={styles.titleGroup}>
                <div className={styles.title} />
                <div className={styles.subtitle} />
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardImage} />
              <div className={styles.cardContent}>
                <div className={styles.cardTitle} />
                <div className={styles.cardText} />
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <div className={styles.button} />
              <div className={styles.button} />
            </div>
          </div>
        );

      case 'goshuin-grid':
        return (
          <div className={styles.grid}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={styles.goshuinCard}>
                <div className={styles.goshuinImage} />
                <div className={styles.goshuinTitle} />
                <div className={styles.goshuinDate} />
              </div>
            ))}
          </div>
        );

      case 'shrine-list':
        return (
          <div className={styles.list}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={styles.shrineItem}>
                <div className={styles.shrineImage} />
                <div className={styles.shrineContent}>
                  <div className={styles.shrineName} />
                  <div className={styles.shrineLocation} />
                  <div className={styles.shrineDistance} />
                </div>
              </div>
            ))}
          </div>
        );

      case 'profile-stats':
        return (
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar} />
              <div className={styles.profileInfo}>
                <div className={styles.username} />
                <div className={styles.userLevel} />
              </div>
            </div>
            <div className={styles.statsGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.statCard}>
                  <div className={styles.statValue} />
                  <div className={styles.statLabel} />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.defaultContainer}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={styles.defaultItem}>
                <div className={styles.line} />
                <div className={styles.line} style={{ width: '80%' }} />
                <div className={styles.line} style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={styles.skeleton} role="status" aria-live="polite">
      <span className={styles.srOnly}>読み込み中...</span>
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton;