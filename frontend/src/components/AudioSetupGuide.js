import React, { useState } from 'react';
import './AudioSetupGuide.css';

const AudioSetupGuide = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('guide');

  const audioFiles = [
    { name: 'etenraku.mp3', description: '越天楽 - メインBGM', youtube: 'https://www.youtube.com/watch?v=3jPPZKsVhIs' },
    { name: 'heicho.mp3', description: '平調音取 - 神社参拝時', youtube: 'https://www.youtube.com/watch?v=kEj6IQz4qYc' },
    { name: 'ryoou.mp3', description: '陵王 - 祭り', youtube: 'https://www.youtube.com/watch?v=fGPQ9CpWz74' },
    { name: 'oshikicho.mp3', description: '黄鐘調 - 瞑想', youtube: 'https://www.youtube.com/watch?v=YI0Dk3Cav5U' },
    { name: 'suzu.mp3', description: '鈴の音 - 効果音', youtube: null },
    { name: 'kane.mp3', description: '鐘の音 - 効果音', youtube: null },
    { name: 'taiko.mp3', description: '太鼓の音 - 効果音', youtube: null },
    { name: 'fue.mp3', description: '笛の音 - 効果音', youtube: null }
  ];

  const freeSources = [
    { name: '甘茶の音楽工房', url: 'https://amachamusic.chagasi.com/', description: '和風BGM多数' },
    { name: '魔王魂', url: 'https://maou.audio/', description: '和楽器の効果音' },
    { name: 'DOVA-SYNDROME', url: 'https://dova-s.jp/', description: 'フリーBGM素材' },
    { name: 'フリー音楽素材 H/MIX GALLERY', url: 'http://www.hmix.net/', description: '和風音楽素材' }
  ];

  return (
    <div className="audio-setup-guide-overlay">
      <div className="audio-setup-guide">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>🎵 雅楽音源セットアップガイド</h2>
        
        <div className="guide-tabs">
          <button 
            className={activeTab === 'guide' ? 'active' : ''} 
            onClick={() => setActiveTab('guide')}
          >
            セットアップ手順
          </button>
          <button 
            className={activeTab === 'files' ? 'active' : ''} 
            onClick={() => setActiveTab('files')}
          >
            必要なファイル
          </button>
          <button 
            className={activeTab === 'sources' ? 'active' : ''} 
            onClick={() => setActiveTab('sources')}
          >
            音源入手先
          </button>
        </div>

        {activeTab === 'guide' && (
          <div className="guide-content">
            <h3>📋 セットアップ手順</h3>
            <ol>
              <li>雅楽音源ファイルを準備します</li>
              <li><code>public/audio/</code> フォルダに音源ファイルを配置します</li>
              <li>ファイル名は指定された名前と一致させてください</li>
              <li>アプリをリロードすると音楽が再生されます</li>
            </ol>
            
            <div className="note">
              <p>⚠️ 音源ファイルが見つからない場合は、簡易的な合成音が再生されます。</p>
              <p>本物の雅楽の響きを楽しむには、実際の雅楽音源をご用意ください。</p>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="guide-content">
            <h3>📁 必要な音源ファイル</h3>
            <div className="file-list">
              {audioFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <code>{file.name}</code>
                    <span>{file.description}</span>
                  </div>
                  {file.youtube && (
                    <a href={file.youtube} target="_blank" rel="noopener noreferrer" className="youtube-link">
                      参考音源
                    </a>
                  )}
                </div>
              ))}
            </div>
            
            <div className="file-path">
              <strong>配置場所:</strong> <code>frontend/public/audio/</code>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="guide-content">
            <h3>🎼 推奨音源入手先</h3>
            <div className="source-list">
              {freeSources.map((source, index) => (
                <div key={index} className="source-item">
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <h4>{source.name}</h4>
                  </a>
                  <p>{source.description}</p>
                </div>
              ))}
            </div>
            
            <div className="note">
              <p>💡 著作権フリーまたはクリエイティブ・コモンズライセンスの音源をご利用ください。</p>
              <p>商用利用の場合は、各サイトの利用規約をご確認ください。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioSetupGuide;