import React, { useEffect, useRef, useState } from 'react';
import './QRScanner.css';

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    startScanning();
    
    return () => {
      stopScanning();
    };
  }, []);
  
  const startScanning = async () => {
    try {
      // カメラの許可を取得
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setScanning(true);
        
        // QRコードのスキャン開始
        scanQRCode();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('カメラへのアクセスが拒否されました。');
      setHasPermission(false);
    }
  };
  
  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setScanning(false);
  };
  
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // ビデオの準備ができているか確認
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // キャンバスサイズを設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームをキャンバスに描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // QRコードの検出（簡易版）
      // 実際の実装では、QRコードライブラリを使用
      const qrCode = detectQRCode(imageData);
      
      if (qrCode) {
        // QRコードが見つかった
        handleQRCodeFound(qrCode);
      }
    }
    
    // 次のフレームで再スキャン
    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };
  
  // QRコード検出（実際の実装では適切なライブラリを使用）
  const detectQRCode = (imageData) => {
    // プレースホルダー実装
    // 実際にはqr-scanner等のライブラリを使用
    
    // デモ用：ランダムでQRコードを検出したことにする
    if (Math.random() > 0.995) {
      return '8000000://shrine/shrine_001/' + Date.now() + '/demo_signature';
    }
    
    return null;
  };
  
  const handleQRCodeFound = (qrData) => {
    // スキャン成功音
    playSuccessSound();
    
    // 振動フィードバック
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // スキャンを停止
    stopScanning();
    
    // 結果を親コンポーネントに通知
    onScan(qrData);
  };
  
  const playSuccessSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
    audio.play().catch(e => console.log('Sound play failed:', e));
  };
  
  const handleManualInput = () => {
    // 手動入力モーダルを表示（実装省略）
    const code = prompt('神社コードを入力してください：');
    if (code) {
      onScan(`8000000://shrine/${code}/${Date.now()}/manual`);
    }
  };
  
  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        
        <div className="scanner-header">
          <h2>QRコードをスキャン</h2>
          <p>神社のQRコードを枠内に収めてください</p>
        </div>
        
        <div className="scanner-viewport">
          {hasPermission ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                className="scanner-video"
              />
              <canvas 
                ref={canvasRef} 
                className="scanner-canvas"
                style={{ display: 'none' }}
              />
              <div className="scanner-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
              </div>
              {scanning && (
                <div className="scanning-line"></div>
              )}
            </>
          ) : (
            <div className="scanner-error">
              {error ? (
                <>
                  <span className="error-icon">📷❌</span>
                  <p>{error}</p>
                  <button onClick={startScanning} className="retry-button">
                    再試行
                  </button>
                </>
              ) : (
                <div className="loading-spinner"></div>
              )}
            </div>
          )}
        </div>
        
        <div className="scanner-actions">
          <button onClick={handleManualInput} className="manual-input-button">
            <span className="button-icon">⌨️</span>
            手動で入力
          </button>
        </div>
        
        <div className="scanner-tips">
          <p className="tip">💡 QRコードが画面の枠内に収まるように調整してください</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;