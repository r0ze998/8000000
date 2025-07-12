// =============================================================================
// Notification Service - Habit Formation Triggers
// =============================================================================

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private morningReminderTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.checkPermission();
  }

  // 通知権限をチェック
  private async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  // 通知権限をリクエスト
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('このブラウザは通知をサポートしていません');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('通知権限リクエストエラー:', error);
      return false;
    }
  }

  // 通知を表示
  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-192x192.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        data: options.data
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        // アプリを開いて参拝画面へ
        if (options.data?.action === 'open-worship') {
          window.location.href = '/worship';
        }
      };
    } catch (error) {
      console.error('通知表示エラー:', error);
    }
  }

  // 朝の参拝リマインダーを設定
  scheduleMorningReminder(hour: number = 6, minute: number = 0) {
    // 既存のタイマーをクリア
    if (this.morningReminderTimeout) {
      clearTimeout(this.morningReminderTimeout);
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hour, minute, 0, 0);

    // 今日の指定時刻が過ぎていない場合は今日に設定
    const today = new Date(now);
    today.setHours(hour, minute, 0, 0);
    
    const targetTime = today > now ? today : tomorrow;
    const timeUntilNotification = targetTime.getTime() - now.getTime();

    this.morningReminderTimeout = setTimeout(() => {
      this.showMorningReminder();
      // 次の日のリマインダーを設定
      this.scheduleMorningReminder(hour, minute);
    }, timeUntilNotification);

    console.log(`朝の参拝リマインダーを設定しました: ${targetTime.toLocaleString()}`);
  }

  // 朝の参拝リマインダーを表示
  private async showMorningReminder() {
    const motivationalMessages = [
      '今日も素晴らしい一日を始めましょう',
      '朝の参拝で心を清めませんか？',
      '新しい一日の始まりに感謝を',
      '今日はどんな願いを込めますか？',
      '連続記録を更新しましょう！'
    ];

    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    await this.showNotification({
      title: '🌅 おはようございます',
      body: message || '朝の参拝の時間です',
      tag: 'morning-reminder',
      requireInteraction: true,
      data: { action: 'open-worship' }
    });
  }

  // 近くの神社検出通知
  async notifyNearbyShrine(shrineName: string, distance: number) {
    const formattedDistance = distance < 1 
      ? `${Math.round(distance * 1000)}m` 
      : `${distance.toFixed(1)}km`;

    await this.showNotification({
      title: '⛩️ 神社が近くにあります',
      body: `${shrineName}まで${formattedDistance} - 参拝しませんか？`,
      tag: 'nearby-shrine',
      data: { action: 'open-worship', shrineName }
    });
  }

  // 連続記録達成通知
  async notifyStreakAchievement(streakDays: number) {
    const milestones: { [key: number]: string } = {
      3: '3日連続達成！素晴らしいスタートです',
      7: '1週間連続！習慣が身についてきました',
      14: '2週間連続！立派な記録です',
      30: '1ヶ月連続！驚異的な継続力です',
      100: '100日連続！伝説の参拝者です'
    };

    const message = milestones[streakDays];
    if (message) {
      await this.showNotification({
        title: '🏆 連続記録達成！',
        body: message,
        tag: 'streak-achievement',
        requireInteraction: true
      });
    }
  }

  // レアNFTドロップ通知
  async notifyRareNFTDrop(nftName: string, rarity: string) {
    const rarityEmojis: { [key: string]: string } = {
      common: '⚪',
      uncommon: '🟢',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟡'
    };

    await this.showNotification({
      title: `${rarityEmojis[rarity] || '🎁'} レアアイテムゲット！`,
      body: `${nftName}を獲得しました`,
      tag: 'nft-drop',
      requireInteraction: true
    });
  }

  // 特別イベント通知
  async notifySpecialEvent(eventName: string, description: string) {
    await this.showNotification({
      title: '🎊 特別イベント開催中',
      body: `${eventName}: ${description}`,
      tag: 'special-event',
      requireInteraction: true
    });
  }

  // リマインダーをキャンセル
  cancelMorningReminder() {
    if (this.morningReminderTimeout) {
      clearTimeout(this.morningReminderTimeout);
      this.morningReminderTimeout = null;
      console.log('朝の参拝リマインダーをキャンセルしました');
    }
  }

  // 通知設定を保存
  saveNotificationSettings(settings: {
    morningReminder: boolean;
    reminderTime: string;
    nearbyShrine: boolean;
    achievements: boolean;
  }) {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    if (settings.morningReminder) {
      const [hour, minute] = settings.reminderTime.split(':').map(Number);
      this.scheduleMorningReminder(hour, minute);
    } else {
      this.cancelMorningReminder();
    }
  }

  // 通知設定を読み込み
  loadNotificationSettings() {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.morningReminder) {
        const [hour, minute] = settings.reminderTime.split(':').map(Number);
        this.scheduleMorningReminder(hour, minute);
      }
      return settings;
    }
    
    // デフォルト設定
    return {
      morningReminder: true,
      reminderTime: '06:00',
      nearbyShrine: true,
      achievements: true
    };
  }
}

// シングルトンインスタンス
export const notificationService = new NotificationService();

// Hookedモデルのトリガー実装
export const setupHabitTriggers = () => {
  // 通知設定を読み込み
  const settings = notificationService.loadNotificationSettings();
  
  // 朝のリマインダーを設定
  if (settings.morningReminder) {
    const [hour, minute] = settings.reminderTime.split(':').map(Number);
    notificationService.scheduleMorningReminder(hour, minute);
  }
  
  // ページ表示時に近くの神社をチェック（デモ用）
  if (settings.nearbyShrine && 'geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // デモ: ランダムに近くの神社を通知
        const demoShrines = [
          { name: '明治神宮', distance: 0.8 },
          { name: '浅草寺', distance: 1.2 },
          { name: '氷川神社', distance: 0.5 }
        ];
        
        const chance = Math.random();
        if (chance < 0.3) { // 30%の確率で通知
          const shrine = demoShrines[Math.floor(Math.random() * demoShrines.length)];
          if (shrine) {
            setTimeout(() => {
              notificationService.notifyNearbyShrine(shrine.name, shrine.distance);
            }, 5000); // 5秒後に通知
          }
        }
      },
      (error) => {
        console.log('位置情報の取得に失敗しました:', error);
      }
    );
  }
};