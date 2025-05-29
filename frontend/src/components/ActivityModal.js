import React, { useState } from 'react';
import { CULTURAL_ACTIVITIES } from '../constants/culturalActivities';

const ActivityModal = ({ activity, onClose, onSubmit }) => {
  const [details, setDetails] = useState({
    location: '',
    description: '',
    wisdom: '',
    blessing: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(activity, details);
  };

  if (!activity) return null;

  const activityInfo = CULTURAL_ACTIVITIES[activity];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{activityInfo.emoji} {activityInfo.name}を記録</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="場所（例：明治神宮）"
            value={details.location}
            onChange={(e) => setDetails({...details, location: e.target.value})}
            required
          />
          <textarea
            placeholder="体験の詳細"
            value={details.description}
            onChange={(e) => setDetails({...details, description: e.target.value})}
            rows={3}
          />
          <input
            type="text"
            placeholder="得た知恵や学び"
            value={details.wisdom}
            onChange={(e) => setDetails({...details, wisdom: e.target.value})}
          />
          <input
            type="text"
            placeholder="受けたご利益"
            value={details.blessing}
            onChange={(e) => setDetails({...details, blessing: e.target.value})}
          />
          <div className="modal-actions">
            <button type="submit">NFTとして記録</button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;