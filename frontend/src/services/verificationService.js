import { VERIFICATION_CONFIG } from '../constants/culturalActivities';

export const verificationService = {
  // 2点間の距離を計算（メートル単位）
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  },

  // GPS位置情報を取得
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  // 位置情報を検証
  async verifyLocation(userLat, userLon, shrineLat, shrineLon) {
    const distance = this.calculateDistance(userLat, userLon, shrineLat, shrineLon);
    const isValid = distance <= VERIFICATION_CONFIG.GPS_RADIUS_METERS;
    
    return {
      isValid,
      distance: Math.round(distance),
      maxDistance: VERIFICATION_CONFIG.GPS_RADIUS_METERS
    };
  },

  // 画像ファイルを検証
  validatePhotoFile(file) {
    if (!file) {
      return { isValid: false, error: 'ファイルが選択されていません' };
    }

    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: '画像ファイルを選択してください' };
    }

    const maxSize = VERIFICATION_CONFIG.PHOTO_MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `ファイルサイズは${VERIFICATION_CONFIG.PHOTO_MAX_SIZE_MB}MB以下にしてください` 
      };
    }

    return { isValid: true };
  },

  // 写真からEXIF情報を抽出（実装は簡略化）
  async extractLocationFromPhoto(file) {
    // 実際の実装では、exif-jsなどのライブラリを使用
    // ここでは簡略化したモック実装
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hasLocation: false,
          latitude: null,
          longitude: null
        });
      }, 1000);
    });
  }
};