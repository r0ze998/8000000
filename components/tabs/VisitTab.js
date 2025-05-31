import React from 'react';
import styles from './VisitTab.module.css';

const VisitTab = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>参拝</h1>
      <div className={styles.content}>
        <p className={styles.description}>
          近くの神社を訪れて、心を込めて参拝しましょう。
        </p>
        <div className={styles.placeholder}>
          <p>参拝機能は準備中です</p>
        </div>
      </div>
    </div>
  );
};

export default VisitTab;