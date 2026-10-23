import React from 'react';
import "./PrayerSelector.css";

interface PrayerType {
  id: string;
  title: string;
  description: string;
  message: string;
  duration: number;
  color: string;
  emoji: string;
}

interface PrayerSelectorProps {
  isOpen: boolean;
  prayerTypes: PrayerType[];
  onClose: () => void;
  onSelectPrayer: (prayerType: PrayerType) => void;
}

const PrayerSelector: React.FC<PrayerSelectorProps> = ({ 
  isOpen, 
  prayerTypes, 
  onClose, 
  onSelectPrayer 
}) => {
  if (!isOpen) return null;

  return (
    <div className="duration-modal-overlay">
      <div className="duration-modal prayer-selection">
        <div className="modal-header">
          <h3>🙏 祈りの種類を選択</h3>
          <button 
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="prayer-types-grid">
            {prayerTypes.map(prayerType => (
              <div
                key={prayerType.id}
                className="prayer-type-card"
                onClick={() => onSelectPrayer(prayerType)}
                style={{ borderColor: prayerType.color }}
              >
                <div className="prayer-emoji" style={{ color: prayerType.color }}>
                  {prayerType.emoji}
                </div>
                <h4>{prayerType.title}</h4>
                <p className="prayer-description">{prayerType.description}</p>
                <div className="prayer-duration">
                  ⏱️ {Math.floor(prayerType.duration / 60)}分間
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerSelector;