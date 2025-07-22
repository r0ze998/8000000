import React from 'react';

export const ShrineSelector = ({ onShrineSelect, onClose }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', color: 'black' }}>
      <h2>神社を選択</h2>
      <button onClick={() => onShrineSelect({ name: '伏見稲荷大社', type: 'shrine' })}>伏見稲荷大社</button>
      <button onClick={onClose}>閉じる</button>
    </div>
  </div>
);

export const GameCanvas = ({ userProfile, onCulturalActivity }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '20px' }}>
    <h2>🎮 文化探索ゲーム</h2>
    <p>プレイヤー: {userProfile.name}</p>
    <button onClick={() => onCulturalActivity({ type: '神社参拝', culturalCapital: 50 })}>
      神社参拝 (+50文化資本)
    </button>
  </div>
);

export const VisitVerification = ({ shrine, onVerified, onCancel }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', color: 'black' }}>
      <h2>{shrine.name} 参拝証明</h2>
      <button onClick={() => onVerified({ timestamp: Date.now(), method: 'photo' })}>証明完了</button>
      <button onClick={onCancel}>キャンセル</button>
    </div>
  </div>
);

export const ShrineSetup = ({ onCreateShrine }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>神社をセットアップ</h1>
    <button onClick={() => onCreateShrine({ name: 'あなたの神社', level: 1 })}>
      神社を作成
    </button>
  </div>
);

export const ShrineView = ({ buildings }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
    <h3>神社建物</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {Object.entries(buildings).map(([building, level]) => (
        <div key={building} style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}>
          {building}: レベル {level}
        </div>
      ))}
    </div>
  </div>
);

export const ActivityButtons = ({ onActivitySelect, onShrineSelect }) => (
  <div className="activity-buttons">
    <button className="activity-button" onClick={() => onActivitySelect('reading')}>📚 読書</button>
    <button className="activity-button" onClick={() => onActivitySelect('meditation')}>🧘 瞑想</button>
    <button className="activity-button" onClick={() => onActivitySelect('tea')}>🍵 茶道</button>
    <button className="activity-button" onClick={onShrineSelect}>⛩️ 神社参拝</button>
  </div>
);

export const ActivityModal = ({ activity, onClose, onSubmit }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: 'white', padding: '20px', borderRadius: '10px', color: 'black' }}>
      <h2>活動記録: {activity}</h2>
      <button onClick={() => onSubmit(activity, {})}>記録する</button>
      <button onClick={onClose}>キャンセル</button>
    </div>
  </div>
);

export const NFTCollection = ({ collection }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '20px 0' }}>
    <h3>NFTコレクション ({collection.length})</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
      {collection.slice(0, 6).map((nft, i) => (
        <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px' }}>
          <small>{nft.name || nft.type}</small>
        </div>
      ))}
    </div>
  </div>
);

export const VillageMembersSection = ({ members, onVisitFriend }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '20px 0' }}>
    <h3>村のメンバー</h3>
    {members.map(member => (
      <div key={member.id} style={{ padding: '10px', margin: '5px 0', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{member.name} - {member.shrine}</span>
        <button onClick={() => onVisitFriend(member)}>訪問</button>
      </div>
    ))}
  </div>
);

export const SimpleAudioToggle = () => (
  <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
    <button style={{ padding: '10px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
      🔊
    </button>
  </div>
);