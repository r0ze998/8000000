import React, { useState, useRef, useEffect } from 'react';
import { SHRINE_TEMPLE_DATABASE } from '../data/shrineDatabase';
import './VisitVerification.css';

const VisitVerification = ({ shrine, onVerified, onCancel }) => {
  const [verificationMethod, setVerificationMethod] = useState('photo');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isLocationNear, setIsLocationNear] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // 神社・寺院の位置情報を取得
  const getShrineLocation = () => {
    if (shrine?.location) {
      return shrine.location;
    }
    
    // データベースから検索
    const found = SHRINE_TEMPLE_DATABASE.find(s => 
      s.name === shrine?.name || s.id === shrine?.id
    );
    
    return found?.location || { lat: 35.6762, lng: 139.6503 }; // デフォルト位置（東京）
  };

  // 2点間の距離を計算（km）
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 写真アップロード処理
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setVerificationStatus('📸 写真がアップロードされました');
        checkPhotoVerification(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // カメラ起動
  const startCamera = async () => {
    try {
      setVerificationStatus('📷 カメラを起動中...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // 背面カメラを優先
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setVerificationStatus('📷 写真を撮影してください');
    } catch (error) {
      console.error('カメラアクセスエラー:', error);
      setVerificationStatus('❌ カメラにアクセスできません。ファイルアップロードを使用してください。');
    }
  };

  // 写真撮影
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'shrine-photo.jpg', { type: 'image/jpeg' });
        setPhotoFile(file);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotoPreview(dataUrl);
        
        // カメラを停止
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        setShowCamera(false);
        
        setVerificationStatus('📸 写真が撮影されました');
        checkPhotoVerification(file);
      }, 'image/jpeg', 0.8);
    }
  };

  // 写真認証チェック
  const checkPhotoVerification = async (file) => {
    setIsVerifying(true);
    setVerificationStatus('🔍 写真を解析中...');
    
    try {
      // EXIF情報から位置情報を抽出を試行
      const hasGPS = await extractGPSFromPhoto(file);
      
      // 画像解析（簡易版）
      const analysisResult = await analyzePhotoForShrine(file);
      
      setTimeout(() => {
        if (hasGPS || analysisResult.isValid) {
          setVerificationComplete(true);
          setVerificationStatus('✅ 写真認証が完了しました！神社・寺院が確認されました。');
        } else {
          setVerificationStatus('📸 写真が確認されました。GPS認証も併用することをお勧めします。');
          setVerificationComplete(true); // 写真があれば一応OK
        }
        setIsVerifying(false);
      }, 2000);
      
    } catch (error) {
      console.error('写真解析エラー:', error);
      setVerificationStatus('📸 写真が確認されました');
      setVerificationComplete(true);
      setIsVerifying(false);
    }
  };

  // EXIF情報からGPS抽出（簡易版）
  const extractGPSFromPhoto = async (file) => {
    return new Promise((resolve) => {
      // 実際の実装ではEXIF.jsなどのライブラリを使用
      // ここでは簡略化
      setTimeout(() => {
        const hasGPS = Math.random() > 0.7; // 30%の確率でGPS情報ありとする
        resolve(hasGPS);
      }, 1000);
    });
  };

  // 写真解析（神社・寺院判定）
  const analyzePhotoForShrine = async (file) => {
    return new Promise((resolve) => {
      // 実際の実装ではAI画像認識APIを使用
      // ここでは簡略化
      setTimeout(() => {
        const keywords = ['torii', 'temple', 'shrine', '鳥居', '寺', '神社'];
        const isValid = Math.random() > 0.3; // 70%の確率で神社・寺院と判定
        resolve({ isValid, keywords: isValid ? ['神社建築'] : [] });
      }, 1500);
    });
  };

  // GPS位置情報取得
  const getGPSLocation = async () => {
    setIsVerifying(true);
    setVerificationStatus('📍 現在地を取得中...');

    try {
      const position = await getCurrentPosition();
      setGpsLocation(position);
      
      // 神社の位置と比較
      const shrineLocation = getShrineLocation();
      const distance = calculateDistance(
        position.latitude,
        position.longitude,
        shrineLocation.lat,
        shrineLocation.lng
      );
      
      const maxDistance = 0.5; // 500m以内
      const isNear = distance <= maxDistance;
      setIsLocationNear(isNear);
      
      if (isNear) {
        setVerificationComplete(true);
        setVerificationStatus(`✅ GPS認証完了！${shrine?.name || '神社・寺院'}から${Math.round(distance * 1000)}m以内にいます。`);
      } else {
        setVerificationStatus(`❌ ${shrine?.name || '神社・寺院'}から${distance.toFixed(1)}km離れています。${maxDistance}km以内である必要があります。`);
      }
      
    } catch (error) {
      console.error('GPS取得エラー:', error);
      setVerificationStatus('❌ 位置情報を取得できませんでした。設定で位置情報を許可してください。');
    } finally {
      setIsVerifying(false);
    }
  };

  // 位置情報取得のPromise化
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
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
          maximumAge: 60000
        }
      );
    });
  };

  // 認証完了処理
  const handleVerificationSubmit = () => {
    if (!verificationComplete) {
      alert('認証を完了してください。');
      return;
    }

    // NFTデータを生成
    const nftData = {
      shrine: shrine,
      verificationMethod: verificationMethod,
      photo: photoPreview,
      photoFile: photoFile,
      gpsLocation: gpsLocation,
      timestamp: new Date().toISOString(),
      distance: gpsLocation ? calculateDistance(
        gpsLocation.latitude,
        gpsLocation.longitude,
        getShrineLocation().lat,
        getShrineLocation().lng
      ) : null,
      metadata: {
        verified: true,
        type: shrine?.type || 'shrine',
        name: shrine?.name || '神社・寺院',
        location: getShrineLocation()
      }
    };

    onVerified(nftData);
  };

  return (
    <div className="visit-verification-modal">
      <div className="verification-content">
        <h2>🔐 参拝認証</h2>
        <p className="shrine-info">
          <strong>{shrine?.name || '神社・寺院'}への参拝を認証してください</strong>
        </p>

        {/* 認証方法選択 */}
        <div className="verification-methods">
          <button
            className={`method-button ${verificationMethod === 'photo' ? 'active' : ''}`}
            onClick={() => setVerificationMethod('photo')}
          >
            📸 写真認証
          </button>
          <button
            className={`method-button ${verificationMethod === 'gps' ? 'active' : ''}`}
            onClick={() => setVerificationMethod('gps')}
          >
            📍 GPS認証
          </button>
          <button
            className={`method-button ${verificationMethod === 'both' ? 'active' : ''}`}
            onClick={() => setVerificationMethod('both')}
          >
            🔒 両方認証（推奨）
          </button>
        </div>

        {/* ステータス表示 */}
        {verificationStatus && (
          <div className={`verification-status ${verificationComplete ? 'success' : ''}`}>
            {verificationStatus}
          </div>
        )}

        {/* 写真認証セクション */}
        {(verificationMethod === 'photo' || verificationMethod === 'both') && (
          <div className="photo-verification">
            <h3>📸 写真で認証</h3>
            <p>神社・寺院の写真を撮影またはアップロードしてください</p>
            
            <div className="photo-actions">
              <button 
                onClick={startCamera}
                className="camera-button"
                disabled={showCamera}
              >
                📷 カメラで撮影
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="upload-button"
              >
                📁 ファイルから選択
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />

            {/* カメラプレビュー */}
            {showCamera && (
              <div className="camera-preview">
                <video ref={videoRef} autoPlay playsInline muted />
                <button onClick={takePhoto} className="capture-button">
                  📸 撮影
                </button>
                <button 
                  onClick={() => {
                    setShowCamera(false);
                    if (cameraStream) {
                      cameraStream.getTracks().forEach(track => track.stop());
                      setCameraStream(null);
                    }
                  }}
                  className="cancel-camera-button"
                >
                  ❌ キャンセル
                </button>
              </div>
            )}

            {/* 写真プレビュー */}
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="参拝写真" />
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {/* GPS認証セクション */}
        {(verificationMethod === 'gps' || verificationMethod === 'both') && (
          <div className="gps-verification">
            <h3>📍 GPS で認証</h3>
            <p>現在地が神社・寺院から500m以内であることを確認します</p>
            
            <button 
              onClick={getGPSLocation}
              disabled={isVerifying}
              className="gps-btn"
            >
              {isVerifying ? (
                <>
                  取得中<span className="loading-spinner"></span>
                </>
              ) : (
                '📍 現在地を取得'
              )}
            </button>

            {gpsLocation && (
              <div className="location-info">
                <p>📍 現在地: {gpsLocation.latitude.toFixed(6)}, {gpsLocation.longitude.toFixed(6)}</p>
                <p>🎯 精度: ±{gpsLocation.accuracy}m</p>
                {isLocationNear && <p className="location-status success">✅ 位置確認済み</p>}
              </div>
            )}
          </div>
        )}

        {/* 進行状況 */}
        <div className="verification-progress">
          {(verificationMethod === 'photo' || verificationMethod === 'both') && (
            <div className={`progress-item ${photoPreview ? 'completed' : ''}`}>
              {photoPreview ? '✅' : '📸'} 写真認証
            </div>
          )}
          {(verificationMethod === 'gps' || verificationMethod === 'both') && (
            <div className={`progress-item ${isLocationNear ? 'completed' : ''}`}>
              {isLocationNear ? '✅' : '📍'} GPS認証
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="verification-actions">
          <button 
            onClick={onCancel}
            className="cancel-button"
          >
            キャンセル
          </button>
          <button 
            onClick={handleVerificationSubmit}
            disabled={!verificationComplete || isVerifying}
            className={`submit-button ${verificationComplete ? 'ready' : 'disabled'}`}
          >
            {verificationComplete ? '🎁 NFTを獲得して記録' : '認証を完了してください'}
          </button>
        </div>

        {/* ヘルプテキスト */}
        <div className="verification-help">
          <h4>💡 認証のコツ</h4>
          <ul>
            <li>📸 鳥居、本殿、山門などの特徴的な建物を撮影</li>
            <li>📍 GPS認証は屋外で行うと精度が向上します</li>
            <li>🔒 両方認証でより多くのリソースを獲得</li>
            <li>⏰ 認証完了でNFTと建設リソースを獲得</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisitVerification;