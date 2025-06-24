import React from 'react';

const NFTCollection = ({ collection }) => {
  if (collection.length === 0) {
    return (
      <div className="nft-section">
        <h2>参拝記録コレクション</h2>
        <p className="empty-collection">まだ参拝記録がありません</p>
        <p className="empty-description">神社や寺院を参拝して記録を残しましょう</p>
      </div>
    );
  }

  return (
    <div className="nft-section">
      <h2>参拝記録コレクション</h2>
      <div className="nft-grid">
        {collection.map((nft) => (
          <div key={nft.id} className="nft-card">
            <div className="nft-header">
              <span className="nft-type">{nft.type === 'shrine' ? '⛩️' : '🏛️'}</span>
              <span className="nft-name">{nft.name}</span>
            </div>
            <div className="nft-details">
              <p className="nft-location">📍 {nft.location}</p>
              {nft.description && <p className="nft-description">{nft.description}</p>}
              <p className="nft-exp">+{nft.experience} 文化資本</p>
              {nft.verificationMethod && (
                <p className="nft-verification">
                  {nft.verificationMethod === 'photo' ? '📸 写真証明' : '📍 GPS証明'}
                </p>
              )}
            </div>
            <div className="nft-footer">
              <span className="nft-rarity rarity-{nft.rarity}">{nft.rarity}</span>
              <span className="nft-timestamp">
                {new Date(nft.timestamp).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTCollection;