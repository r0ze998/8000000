// Capacitorネイティブ機能のラッパー
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

class NativeServices {
  // プラットフォーム判定
  isNative() {
    return Capacitor.isNativePlatform();
  }

  // カメラ機能
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: true
      });

      return {
        success: true,
        dataUrl: image.dataUrl,
        format: image.format,
        path: image.path
      };
    } catch (error) {
      console.error('カメラエラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // フォトライブラリから選択
  async selectPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return {
        success: true,
        dataUrl: image.dataUrl,
        format: image.format
      };
    } catch (error) {
      console.error('フォトライブラリエラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // GPS位置情報取得
  async getCurrentPosition() {
    try {
      // 位置情報の権限をリクエスト
      const permissions = await Geolocation.requestPermissions();
      
      if (permissions.location === 'granted' || permissions.location === 'prompt') {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });

        return {
          success: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
      } else {
        return {
          success: false,
          error: '位置情報の権限が拒否されました'
        };
      }
    } catch (error) {
      console.error('GPS エラー:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 位置情報の監視
  async watchPosition(callback) {
    try {
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
        (position) => {
          callback({
            success: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        }
      );

      return watchId;
    } catch (error) {
      console.error('位置情報監視エラー:', error);
      return null;
    }
  }

  // 位置情報監視の停止
  async clearWatch(watchId) {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
    }
  }

  // 距離計算（メートル単位）
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

const nativeServices = new NativeServices();
export default nativeServices;