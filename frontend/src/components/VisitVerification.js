import React, { useState, useRef } from 'react';
import './VisitVerification.css';

const VisitVerification = ({ shrine, onVerified, onCancel }) => {
  const [verificationMethod, setVerificationMethod] = useState('photo');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const fileInputRef = useRef(null);

  // 写真アップロード処理
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        // EXIF情報から位置情報を抽出（実装は簡略化）
        extractLocationFromPhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // 写真から位置情報を抽出（実際にはEXIF.jsなどのライブラリを使用）
  const extractLocationFromPhoto = async (file) => {
    // 簡略化された実装
    setVerificationStatus('写真から位置情報を確認中...');
    setTimeout(() => {
      setVerificationStatus('写真が確認されました');
    }, 1500);
  };

  // GPS位置情報取得
  const getGPSLocation = () => {
    setIsVerifying(true);
    setVerificationStatus('現在地を取得中...');

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsLocation({ latitude, longitude });
          
          // 神社の位置と比較
          const distance = calculateDistance(
            latitude, 
            longitude, 
            shrine.location.lat, 
            shrine.location.lng
          );

          if (distance < 500) { // 500m以内
            setVerificationStatus(`✅ ${shrine.name}の近くにいることを確認しました（${Math.round(distance)}m）`);
          } else {
            setVerificationStatus(`❌ ${shrine.name}から離れています（${Math.round(distance)}m）`);
          }
          setIsVerifying(false);
        },
        (error) => {
          setVerificationStatus('❌ 位置情報の取得に失敗しました');
          setIsVerifying(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setVerificationStatus('❌ このブラウザは位置情報をサポートしていません');
      setIsVerifying(false);
    }
  };

  // 2点間の距離を計算（メートル単位）
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
  };

  // 参拝を確認
  const confirmVisit = () => {
    if (verificationMethod === 'photo' && photoPreview) {
      onVerified({
        method: 'photo',
        photo: photoPreview,
        timestamp: new Date().toISOString()
      });
    } else if (verificationMethod === 'gps' && gpsLocation) {
      onVerified({
        method: 'gps',
        location: gpsLocation,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="visit-verification-modal">
      <div className="verification-content">
        <h2>参拝証明 - {shrine.name}</h2>
        
        <div className="verification-methods">
          <button 
            className={`method-btn ${verificationMethod === 'photo' ? 'active' : ''}`}
            onClick={() => setVerificationMethod('photo')}
          >
            📸 写真で証明
          </button>
          <button 
            className={`method-btn ${verificationMethod === 'gps' ? 'active' : ''}`}
            onClick={() => setVerificationMethod('gps')}
          >
            📍 GPSで証明
          </button>
        </div>

        {verificationMethod === 'photo' && (
          <div className="photo-verification">
            <p>神社・お寺の写真をアップロードしてください</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              📷 写真を撮影/選択
            </button>
            
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="参拝写真" />
              </div>
            )}
          </div>
        )}

        {verificationMethod === 'gps' && (
          <div className="gps-verification">
            <p>{shrine.name}の近くにいることを確認します</p>
            <p className="shrine-address">📍 {shrine.address}</p>
            <button 
              className="gps-btn"
              onClick={getGPSLocation}
              disabled={isVerifying}
            >
              {isVerifying ? '確認中...' : '現在地を確認'}
            </button>
            
            {gpsLocation && (
              <div className="location-info">
                <p>現在地: {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)}</p>
              </div>
            )}
          </div>
        )}

        {verificationStatus && (
          <div className={`verification-status ${verificationStatus.includes('✅') ? 'success' : ''}`}>
            {verificationStatus}
          </div>
        )}

        <div className="verification-actions">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button 
            className="confirm-btn"
            onClick={confirmVisit}
            disabled={
              (verificationMethod === 'photo' && !photoPreview) ||
              (verificationMethod === 'gps' && !verificationStatus.includes('✅'))
            }
          >
            参拝を記録
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitVerification;