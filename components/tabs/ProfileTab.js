import React from 'react';
import styles from './ProfileTab.module.css';

const ProfileTab = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール</h1>
      <div className={styles.content}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <span className={styles.avatarIcon}>👤</span>
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.username}>ゲストユーザー</h2>
            <p className={styles.userLevel}>レベル 1</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>総参拝数</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>連続日数</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>御朱印数</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>訪問神社</span>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>設定</h3>
          <button className={styles.settingsButton}>
            アカウント設定
          </button>
          <button className={styles.settingsButton}>
            通知設定
          </button>
          <button className={styles.settingsButton}>
            プライバシー設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;