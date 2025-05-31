import React from 'react';
import styles from './ExploreTab.module.css';

const ExploreTab = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>神社を探す</h1>
      <div className={styles.content}>
        <p className={styles.description}>
          近くの神社を見つけて、新しい参拝体験を始めましょう。
        </p>
        <div className={styles.searchBox}>
          <input 
            type="search" 
            placeholder="神社名または地域で検索..."
            className={styles.searchInput}
            aria-label="神社を検索"
          />
        </div>
        <div className={styles.list}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🗺️</span>
            <p className={styles.emptyText}>神社データを準備中です</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreTab;