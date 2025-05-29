import React, { useState, useEffect } from 'react';
import { getBeltRank } from './CulturalBelt';
import './CommunityHub.css';

const CommunityHub = ({ userProfile, onAddPost }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: '山田太郎',
      authorBelt: getBeltRank(850),
      shrine: '伏見稲荷大社',
      location: '京都府京都市',
      timestamp: '2024-05-25T10:30:00Z',
      content: '千本鳥居を歩いていると、心が洗われるような気持ちになりました。外国人観光客の方々も多く、日本の文化が世界に愛されていることを実感できました。',
      images: ['https://example.com/fushimi1.jpg'],
      wisdom: '文化は国境を越えて人々の心をつなぐ',
      likes: 15,
      comments: 3,
      culturalValue: 130,
      rarity: 'legendary',
      tags: ['千本鳥居', '国際交流', '心の浄化']
    },
    {
      id: 2,
      author: '佐藤花子',
      authorBelt: getBeltRank(450),
      shrine: '浅草寺',
      location: '東京都台東区',
      timestamp: '2024-05-24T14:15:00Z',
      content: '雷門をくぐって仲見世通りを歩くと、江戸時代の雰囲気を感じられます。人形焼きを食べながら本堂へ。観音様に手を合わせる瞬間、東京の喧騒を忘れました。',
      images: [],
      wisdom: '伝統は現代の中に生き続ける',
      likes: 8,
      comments: 1,
      culturalValue: 120,
      rarity: 'legendary',
      tags: ['仲見世通り', '人形焼き', '観音様']
    },
    {
      id: 3,
      author: '田中一郎',
      authorBelt: getBeltRank(280),
      shrine: '根津神社',
      location: '東京都文京区',
      timestamp: '2024-05-23T16:45:00Z',
      content: 'つつじ祭りの時期に訪問。満開のつつじが境内を彩り、まるで別世界のようでした。地元の方々が大切に守ってきた美しさに感動。',
      images: [],
      wisdom: '季節の美しさは地域の宝',
      likes: 12,
      comments: 2,
      culturalValue: 70,
      rarity: 'uncommon',
      tags: ['つつじ祭り', '季節の美', '地域文化']
    }
  ]);

  const [newPost, setNewPost] = useState({
    content: '',
    wisdom: '',
    tags: '',
    shrine: ''
  });

  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const popularTags = [
    '千本鳥居', '桜', '紅葉', '御朱印', '祭り', '伝統建築',
    '石庭', '竹林', '仏像', '神様', '願掛け', '心の平安',
    '歴史', '文化財', '地域交流', '季節の美', '外国人観光'
  ];

  const handleAddPost = () => {
    if (!newPost.content || !newPost.shrine) return;

    const post = {
      id: Date.now(),
      author: userProfile?.name || 'あなた',
      authorBelt: getBeltRank(userProfile?.culturalCapital || 0),
      shrine: newPost.shrine,
      location: '場所情報',
      timestamp: new Date().toISOString(),
      content: newPost.content,
      wisdom: newPost.wisdom,
      images: [],
      likes: 0,
      comments: 0,
      culturalValue: 50,
      rarity: 'common',
      tags: selectedTags
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', wisdom: '', tags: '', shrine: '' });
    setSelectedTags([]);
    setShowNewPostForm(false);
    
    if (onAddPost) onAddPost(post);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#808080',
      uncommon: '#00ff00',
      rare: '#0080ff',
      legendary: '#ff8000',
      mythical: '#ff0080'
    };
    return colors[rarity] || '#808080';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return '1時間以内';
    if (diffHours < 24) return `${diffHours}時間前`;
    return `${Math.floor(diffHours / 24)}日前`;
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="community-hub">
      <div className="community-header">
        <h2>🏘️ 文化コミュニティ</h2>
        <p>みんなの文化体験を共有しよう</p>
        
        <button 
          className="new-post-btn"
          onClick={() => setShowNewPostForm(true)}
        >
          ✍️ 体験を共有する
        </button>
      </div>

      {/* 新規投稿フォーム */}
      {showNewPostForm && (
        <div className="new-post-modal">
          <div className="new-post-form">
            <h3>文化体験を共有</h3>
            
            <input
              type="text"
              placeholder="訪問した神社・寺院名"
              value={newPost.shrine}
              onChange={(e) => setNewPost({...newPost, shrine: e.target.value})}
              className="shrine-input"
            />
            
            <textarea
              placeholder="あなたの体験を詳しく教えてください..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className="content-textarea"
              rows={4}
            />
            
            <input
              type="text"
              placeholder="得られた知恵や気づき"
              value={newPost.wisdom}
              onChange={(e) => setNewPost({...newPost, wisdom: e.target.value})}
              className="wisdom-input"
            />

            {/* タグ選択 */}
            <div className="tag-selection">
              <p>タグを選択（複数選択可）:</p>
              <div className="tag-grid">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleAddPost} className="submit-btn">
                投稿する
              </button>
              <button 
                onClick={() => setShowNewPostForm(false)} 
                className="cancel-btn"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 投稿一覧 */}
      <div className="posts-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="author-info">
                <div className="author-name">{post.author}</div>
                <div 
                  className="author-belt"
                  style={{ 
                    background: post.authorBelt.gradient,
                    color: post.authorBelt.level >= 8 ? '#fff' : '#333'
                  }}
                >
                  {post.authorBelt.name}
                </div>
              </div>
              <div className="post-meta">
                <div className="timestamp">{formatTimestamp(post.timestamp)}</div>
                <div 
                  className="rarity-badge"
                  style={{ backgroundColor: getRarityColor(post.rarity) }}
                >
                  {post.shrine}
                </div>
              </div>
            </div>

            <div className="post-location">
              📍 {post.location}
            </div>

            <div className="post-content">
              {post.content}
            </div>

            {post.wisdom && (
              <div className="post-wisdom">
                💭 「{post.wisdom}」
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}

            <div className="post-stats">
              <div className="cultural-value">
                +{post.culturalValue} 文化資本
              </div>
            </div>

            <div className="post-actions">
              <button 
                className="like-btn"
                onClick={() => handleLike(post.id)}
              >
                ❤️ {post.likes}
              </button>
              <button className="comment-btn">
                💬 {post.comments}
              </button>
              <button className="share-btn">
                🔗 共有
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;