import React from 'react';

// App Store審査用のプライバシー情報コンポーネント
function PrivacyInfo() {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      left: '10px', 
      fontSize: '12px', 
      color: 'rgba(255,255,255,0.5)',
      zIndex: 1000,
      maxWidth: '200px'
    }}>
      <details>
        <summary>プライバシー情報</summary>
        <div style={{ 
          background: 'rgba(0,0,0,0.8)', 
          padding: '10px', 
          borderRadius: '5px',
          marginTop: '5px'
        }}>
          <p><strong>データの取り扱い:</strong></p>
          <ul style={{ fontSize: '10px', paddingLeft: '15px' }}>
            <li>📷 カメラ: 神社参拝の写真認証のみ</li>
            <li>📍 位置情報: GPS認証のみ（送信されません）</li>
            <li>💾 データ保存: デバイス内のみ</li>
            <li>🔒 個人情報: 収集しません</li>
            <li>🌐 通信: ブロックチェーン接続のみ</li>
          </ul>
          <p style={{ fontSize: '10px', marginTop: '10px' }}>
            このアプリは個人情報を収集・送信しません。
            すべてのデータはお客様のデバイス内で管理されます。
          </p>
        </div>
      </details>
    </div>
  );
}

export default PrivacyInfo;