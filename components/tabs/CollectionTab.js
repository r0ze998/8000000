import React from 'react';
import styles from './CollectionTab.module.css';

const CollectionTab = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>御朱印コレクション</h1>
      <div className={styles.content}>
        <p className={styles.description}>
          参拝した神社の御朱印をデジタルで集めましょう。
        </p>
        <div className={styles.grid}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📿</span>
            <p className={styles.emptyText}>まだ御朱印がありません</p>
            <p className={styles.emptySubtext}>神社を参拝して御朱印を集めましょう</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionTab;