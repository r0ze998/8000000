import React, { useState } from 'react';
import { CULTURAL_ACTIVITIES } from '../constants/culturalActivities';
import { SHRINE_TEMPLE_DATABASE } from '../data/shrineDatabase';
import VisitVerification from './VisitVerification';

const ActivityModal = ({ activity, onClose, onSubmit }) => {
  const [details, setDetails] = useState({
    location: '',
    description: '',
    wisdom: '',
    blessing: ''
  });
  
  const [showVerification, setShowVerification] = useState(false);
  const [selectedShrine, setSelectedShrine] = useState(null);
  const [availableShrines, setAvailableShrines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 神社・寺院を検索
  const searchShrines = (term) => {
    if (!term) {
      setAvailableShrines([]);
      return;
    }
    
    const filtered = SHRINE_TEMPLE_DATABASE.filter(shrine =>
      shrine.name.includes(term) ||
      shrine.city.includes(term) ||
      shrine.prefecture.includes(term)
    ).slice(0, 10); // 最大10件表示
    
    setAvailableShrines(filtered);
  };

  // 神社・寺院選択
  const handleShrineSelect = (shrine) => {
    setSelectedShrine(shrine);
    setDetails({...details, location: shrine.name});
    setSearchTerm(shrine.name);
    setAvailableShrines([]);
  };

  // 認証開始
  const handleStartVerification = () => {
    if (!selectedShrine) {
      alert('神社・寺院を選択してください');
      return;
    }
    setShowVerification(true);
  };

  // 認証完了
  const handleVerificationComplete = (verificationData) => {
    // 認証データと入力データを結合
    const combinedData = {
      ...details,
      verificationData,
      shrine: selectedShrine,
      verified: true
    };
    
    onSubmit(activity, combinedData);
    setShowVerification(false);
  };

  // 従来の投稿方法
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 認証が必要な場合は認証画面へ
    if (selectedShrine) {
      handleStartVerification();
    } else {
      // 神社選択が必須
      alert('神社・寺院を選択してください');
    }
  };

  if (!activity) return null;

  const activityInfo = CULTURAL_ACTIVITIES[activity];

  // 認証画面表示中
  if (showVerification) {
    return (
      <VisitVerification
        shrine={selectedShrine}
        onVerified={handleVerificationComplete}
        onCancel={() => setShowVerification(false)}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🔐 {activityInfo.emoji} {activityInfo.name}を記録</h2>
        
        {/* 認証必須の説明 */}
        <div className="verification-required-notice">
          <p><strong>📍 実際の参拝が必要です</strong></p>
          <p>写真またはGPS認証により、実際に神社・寺院を訪れたことを確認してNFTを獲得します。</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* 神社・寺院検索 */}
          <div className="shrine-selector">
            <label>🏛️ 神社・寺院を選択 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="神社・寺院名または地域で検索（例：明治神宮、清水寺、渋谷区）"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchShrines(e.target.value);
              }}
              required
            />
            
            {/* 検索結果 */}
            {availableShrines.length > 0 && (
              <div className="shrine-search-results">
                {availableShrines.map(shrine => (
                  <div
                    key={shrine.id}
                    className="shrine-result-item"
                    onClick={() => handleShrineSelect(shrine)}
                  >
                    <div className="shrine-name">
                      {shrine.type === 'shrine' ? '⛩️' : '🏛️'} {shrine.name}
                    </div>
                    <div className="shrine-location">
                      📍 {shrine.prefecture}{shrine.city}
                    </div>
                    {shrine.description && (
                      <div className="shrine-description">
                        {shrine.description.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* 選択した神社 */}
            {selectedShrine && (
              <div className="selected-shrine">
                <h4>選択中の{selectedShrine.type === 'shrine' ? '神社' : '寺院'}</h4>
                <div className="shrine-card">
                  <div className="shrine-header">
                    {selectedShrine.type === 'shrine' ? '⛩️' : '🏛️'} {selectedShrine.name}
                  </div>
                  <div className="shrine-details">
                    <p>📍 {selectedShrine.prefecture}{selectedShrine.city}</p>
                    {selectedShrine.deity && <p>⭐ {selectedShrine.deity}</p>}
                    {selectedShrine.benefits && (
                      <p>🙏 {selectedShrine.benefits.join('・')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 参拝詳細 */}
          <div className="visit-details">
            <label>📝 参拝の詳細</label>
            <textarea
              placeholder={activity === 'shrine' ? 'お祈りした内容、感じたことなど' : '読経や瞑想の体験、学んだことなど'}
              value={details.description}
              onChange={(e) => setDetails({...details, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="visit-details">
            <label>🙏 祈願・気づき</label>
            <input
              type="text"
              placeholder={activity === 'shrine' ? '祈願内容（例：家族の健康、合格祈願）' : '得た気づきや学び'}
              value={details.wisdom}
              onChange={(e) => setDetails({...details, wisdom: e.target.value})}
            />
          </div>

          <div className="visit-details">
            <label>✨ ご利益・功徳</label>
            <input
              type="text"
              placeholder={activity === 'shrine' ? '受けたご利益（例：心の平安、新たな決意）' : '心の平安や功徳'}
              value={details.blessing}
              onChange={(e) => setDetails({...details, blessing: e.target.value})}
            />
          </div>

          {/* NFT獲得予告 */}
          {selectedShrine && (
            <div className="nft-preview">
              <h4>🎁 獲得予定のNFT</h4>
              <div className="nft-card-preview">
                <div className="nft-icon">
                  {selectedShrine.type === 'shrine' ? '⛩️' : '🏛️'}
                </div>
                <div className="nft-info">
                  <p><strong>{selectedShrine.name} 参拝記録</strong></p>
                  <p>📸/📍 認証完了でNFTを獲得</p>
                  <p>🏗️ 村建設リソースも同時獲得</p>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="submit" 
              className="verify-button"
              disabled={!selectedShrine}
            >
              🔐 参拝を認証してNFT獲得
            </button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;