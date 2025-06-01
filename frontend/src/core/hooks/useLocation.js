import { useState, useEffect, useCallback } from 'react';
import { SHRINES } from '../constants/shrines';

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  
  // 位置情報の取得を開始
  useEffect(() => {
    startLocationTracking();
    
    return () => {
      stopLocationTracking();
    };
  }, []);
  
  // 位置情報追跡開始
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('位置情報がサポートされていません');
      return;
    }
    
    setIsTracking(true);
    
    // 初回の位置情報取得
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      { enableHighAccuracy: true }
    );
    
    // 継続的な位置情報追跡
    const watchId = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
    // クリーンアップ用にIDを保存
    window.locationWatchId = watchId;
  };
  
  // 位置情報追跡停止
  const stopLocationTracking = () => {
    if (window.locationWatchId) {
      navigator.geolocation.clearWatch(window.locationWatchId);
      window.locationWatchId = null;
    }
    setIsTracking(false);
  };
  
  // 位置情報取得成功
  const handleLocationSuccess = (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    setCurrentLocation({
      lat: latitude,
      lng: longitude,
      accuracy: accuracy,
      timestamp: position.timestamp
    });
    
    setLocationError(null);
  };
  
  // 位置情報取得エラー
  const handleLocationError = (error) => {
    let errorMessage = '位置情報の取得に失敗しました';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = '位置情報の使用が許可されていません';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = '位置情報が利用できません';
        break;
      case error.TIMEOUT:
        errorMessage = '位置情報の取得がタイムアウトしました';
        break;
    }
    
    setLocationError(errorMessage);
    console.error('Location error:', error);
  };
  
  // 近くの神社をチェック
  const checkNearbyShrine = useCallback(async (location) => {
    if (!location) return null;
    
    try {
      // 実際の実装では、バックエンドAPIを呼び出して近くの神社を取得
      // ここではダミーデータを使用
      const nearbyShrine = findNearestShrine(location);
      
      if (nearbyShrine && nearbyShrine.distance <= 100) { // 100m以内
        return nearbyShrine;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to check nearby shrine:', error);
      return null;
    }
  }, []);
  
  // 最も近い神社を検索（ダミー実装）
  const findNearestShrine = (location) => {
    let nearestShrine = null;
    let minDistance = Infinity;
    
    SHRINES.forEach(shrine => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        shrine.location.lat,
        shrine.location.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestShrine = {
          ...shrine,
          distance: Math.round(distance)
        };
      }
    });
    
    return nearestShrine;
  };
  
  // 2点間の距離を計算（メートル）
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
  };
  
  // 特定の神社での位置確認
  const verifyShrine = useCallback(async (shrineId) => {
    if (!currentLocation) return false;
    
    const shrine = SHRINES.find(s => s.id === shrineId);
    if (!shrine) return false;
    
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      shrine.location.lat,
      shrine.location.lng
    );
    
    // 50m以内なら参拝可能
    return distance <= 50;
  }, [currentLocation]);
  
  return {
    currentLocation,
    locationError,
    isTracking,
    checkNearbyShrine,
    verifyShrine,
    startLocationTracking,
    stopLocationTracking
  };
};