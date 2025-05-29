import React, { useState, useRef } from 'react';
import { verificationService } from '../services/verificationService';
import { VERIFICATION_CONFIG } from '../constants/culturalActivities';
import nativeServices from '../services/nativeServices';
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

  // 写真から位置情報を抽出
  const extractLocationFromPhoto = async (file) => {
    setVerificationStatus('写真から位置情報を確認中...');
    const result = await verificationService.extractLocationFromPhoto(file);
    if (result.hasLocation) {
      setVerificationStatus('✅ 写真の位置情報が確認されました');
    } else {
      setVerificationStatus('写真が確認されました');
    }
  };

  // GPS位置情報取得
  const getGPSLocation = async () => {
    setIsVerifying(true);
    setVerificationStatus('現在地を取得中...');

    try {
      const position = await verificationService.getCurrentPosition();
      setGpsLocation(position);
      
      // 神社の位置と比較
      const verification = await verificationService.verifyLocation(
        position.latitude,
        position.longitude,
        shrine.location.lat,
        shrine.location.lng
      );

      if (verification.isValid) {
        setVerificationStatus(`✅ ${shrine.name}の近くにいることを確認しました（${verification.distance}m）`);
      } else {
        setVerificationStatus(`❌ ${shrine.name}から離れています（${verification.distance}m）`);
      }
    } catch (error) {
      setVerificationStatus('❌ 位置情報の取得に失敗しました');
    } finally {
      setIsVerifying(false);
    }
  };


  // 参拝を確認
  const confirmVisit = () => {
    const verificationData = {
      method: verificationMethod,
      timestamp: new Date().toISOString()
    };

    if (verificationMethod === VERIFICATION_CONFIG.VERIFICATION_METHODS.PHOTO && photoPreview) {
      verificationData.photo = photoPreview;
    } else if (verificationMethod === VERIFICATION_CONFIG.VERIFICATION_METHODS.GPS && gpsLocation) {
      verificationData.location = gpsLocation;
    }

    onVerified(verificationData);
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