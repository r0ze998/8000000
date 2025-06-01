import React, { useState, useEffect } from 'react';
import { useHabitLoop } from '../../core/hooks/useHabitLoop';
import VisitFAB from './VisitFAB';
import RewardModal from './RewardModal';
import QRScanner from './QRScanner';
import './VisitFlow.css';

const VisitFlow = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [visitMode, setVisitMode] = useState(null); // 'location' or 'qr'
  
  const {
    canVisit,
    nearbyShrine,
    streak,
    todayVisited,
    isVisiting,
    triggerVisit
  } = useHabitLoop();
  
  // FABをクリックしたときの処理
  const handleFABClick = () => {
    if (todayVisited) {
      showVisitedMessage();
      return;
    }
    
    if (nearbyShrine) {
      // 近くに神社がある場合は位置情報で参拝
      handleLocationVisit();
    } else {
      // 近くに神社がない場合はQRコードスキャン
      setShowQRScanner(true);
      setVisitMode('qr');
    }
  };
  
  // 位置情報による参拝
  const handleLocationVisit = async () => {
    setVisitMode('location');
    
    try {
      const result = await triggerVisit();
      if (result) {
        setCurrentReward(result.reward);
        setShowReward(true);
        
        // 参拝成功を記録
        trackVisitSuccess('location', result);
      }
    } catch (error) {
      console.error('Visit failed:', error);
      showErrorMessage('参拝に失敗しました。もう一度お試しください。');
    }
  };
  
  // QRコードによる参拝
  const handleQRScan = async (qrData) => {
    setShowQRScanner(false);
    
    try {
      // QRコードのデータを検証
      const shrineData = parseQRCode(qrData);
      if (!shrineData) {
        showErrorMessage('無効なQRコードです。');
        return;
      }
      
      // QRコードで参拝を記録
      const result = await triggerVisit({
        shrineId: shrineData.shrineId,
        verificationMethod: 'qr',
        qrData: qrData
      });
      
      if (result) {
        setCurrentReward(result.reward);
        setShowReward(true);
        
        // 参拝成功を記録
        trackVisitSuccess('qr', result);
      }
    } catch (error) {
      console.error('QR visit failed:', error);
      showErrorMessage('参拝に失敗しました。もう一度お試しください。');
    }
  };
  
  // QRコードのパース
  const parseQRCode = (qrData) => {
    try {
      // QRコードフォーマット: 8000000://shrine/{shrineId}/{timestamp}/{signature}
      const match = qrData.match(/^8000000:\/\/shrine\/([^\/]+)\/([^\/]+)\/([^\/]+)$/);
      if (!match) return null;
      
      const [, shrineId, timestamp, signature] = match;
      
      // タイムスタンプの検証（24時間以内）
      const qrTime = parseInt(timestamp);
      const now = Date.now();
      if (now - qrTime > 24 * 60 * 60 * 1000) {
        showErrorMessage('QRコードの有効期限が切れています。');
        return null;
      }
      
      // 署名の検証（簡易版）
      // 実際の実装では適切な署名検証を行う
      
      return { shrineId, timestamp, signature };
    } catch (error) {
      console.error('QR parse error:', error);
      return null;
    }
  };
  
  // 既に参拝済みのメッセージ
  const showVisitedMessage = () => {
    const message = document.createElement('div');
    message.className = 'visit-message visited';
    message.innerHTML = `
      <span class="message-icon">✅</span>
      <span class="message-text">今日は既に参拝済みです！</span>
      <span class="message-streak">🔥 ${streak}日連続</span>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  };
  
  // エラーメッセージ表示
  const showErrorMessage = (text) => {
    const message = document.createElement('div');
    message.className = 'visit-message error';
    message.innerHTML = `
      <span class="message-icon">❌</span>
      <span class="message-text">${text}</span>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  };
  
  // 参拝成功の記録
  const trackVisitSuccess = (method, result) => {
    // Analytics記録
    if (window.gtag) {
      window.gtag('event', 'visit_complete', {
        method: method,
        shrine_id: result.visit.shrineId,
        streak: result.visit.streak,
        reward_count: result.reward.rewards.length,
        has_legendary: result.reward.rewards.some(r => r.rarity === 'legendary')
      });
    }
  };
  
  return (
    <>
      {/* 参拝FAB */}
      <VisitFAB 
        onClick={handleFABClick}
        canVisit={canVisit && !todayVisited}
        nearbyShrine={nearbyShrine}
        streak={streak}
        todayVisited={todayVisited}
        isVisiting={isVisiting}
      />
      
      {/* QRスキャナー */}
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
      
      {/* 報酬モーダル */}
      {showReward && currentReward && (
        <RewardModal 
          reward={currentReward}
          onClose={() => {
            setShowReward(false);
            setCurrentReward(null);
          }}
        />
      )}
    </>
  );
};

export default VisitFlow;