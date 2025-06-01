import React, { useState } from 'react';

const StoryCreationSystem = ({ visitData, onStoryComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    culturalContext: '',
    artStyle: 'traditional',
    mintPrice: 0.01,
    royalty: 10
  });

  const handleInputChange = (field, value) => {
    setStoryData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onStoryComplete(storyData);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      border: '1px solid #333'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #333',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#fff',
      margin: 0,
      paddingRight: '40px'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      padding: '20px',
      gap: '10px'
    },
    stepDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#444',
      transition: 'all 0.3s ease'
    },
    stepDotActive: {
      backgroundColor: '#ff6b6b',
      width: '24px',
      borderRadius: '4px'
    },
    content: {
      padding: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      color: '#ccc',
      fontSize: '14px',
      marginBottom: '8px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      padding: '20px',
      borderTop: '1px solid #333'
    },
    button: {
      flex: 1,
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    primaryButton: {
      backgroundColor: '#ff6b6b',
      color: '#fff'
    },
    secondaryButton: {
      backgroundColor: '#2a2a2a',
      color: '#ccc',
      border: '1px solid #444'
    },
    reviewSection: {
      backgroundColor: '#2a2a2a',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    reviewLabel: {
      color: '#888',
      fontSize: '12px',
      marginBottom: '4px'
    },
    reviewValue: {
      color: '#fff',
      fontSize: '16px'
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>基本情報 (Basic Information)</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>物語のタイトル (Story Title)</label>
              <input
                type="text"
                style={styles.input}
                value={storyData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="例: 月下の茶会"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>物語の説明 (Story Description)</label>
              <textarea
                style={styles.textarea}
                value={storyData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="この場所で起きた物語を詳しく説明してください..."
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>文化的背景 (Cultural Context)</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>文化的な要素 (Cultural Elements)</label>
              <textarea
                style={styles.textarea}
                value={storyData.culturalContext}
                onChange={(e) => handleInputChange('culturalContext', e.target.value)}
                placeholder="この物語に含まれる文化的な要素、伝統、習慣などを説明してください..."
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>場所の情報 (Location Info)</label>
              <div style={styles.reviewSection}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={styles.reviewLabel}>緯度・経度</div>
                  <div style={styles.reviewValue}>
                    {visitData?.latitude?.toFixed(6)}, {visitData?.longitude?.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div style={styles.reviewLabel}>訪問日時</div>
                  <div style={styles.reviewValue}>
                    {new Date(visitData?.timestamp || Date.now()).toLocaleString('ja-JP')}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>アート生成設定 (Art Generation)</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>アートスタイル (Art Style)</label>
              <select
                style={styles.select}
                value={storyData.artStyle}
                onChange={(e) => handleInputChange('artStyle', e.target.value)}
              >
                <option value="traditional">伝統的な日本画</option>
                <option value="ukiyo-e">浮世絵スタイル</option>
                <option value="watercolor">水彩画</option>
                <option value="digital">デジタルアート</option>
                <option value="anime">アニメスタイル</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>販売価格 (ETH)</label>
              <input
                type="number"
                style={styles.input}
                value={storyData.mintPrice}
                onChange={(e) => handleInputChange('mintPrice', parseFloat(e.target.value))}
                step="0.001"
                min="0"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>ロイヤリティ (%)</label>
              <input
                type="number"
                style={styles.input}
                value={storyData.royalty}
                onChange={(e) => handleInputChange('royalty', parseInt(e.target.value))}
                min="0"
                max="50"
              />
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>確認とミント (Review & Mint)</h3>
            <div style={styles.reviewSection}>
              <div style={{ marginBottom: '12px' }}>
                <div style={styles.reviewLabel}>タイトル</div>
                <div style={styles.reviewValue}>{storyData.title || '未設定'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={styles.reviewLabel}>説明</div>
                <div style={styles.reviewValue}>{storyData.description || '未設定'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={styles.reviewLabel}>文化的背景</div>
                <div style={styles.reviewValue}>{storyData.culturalContext || '未設定'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={styles.reviewLabel}>アートスタイル</div>
                <div style={styles.reviewValue}>
                  {storyData.artStyle === 'traditional' && '伝統的な日本画'}
                  {storyData.artStyle === 'ukiyo-e' && '浮世絵スタイル'}
                  {storyData.artStyle === 'watercolor' && '水彩画'}
                  {storyData.artStyle === 'digital' && 'デジタルアート'}
                  {storyData.artStyle === 'anime' && 'アニメスタイル'}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={styles.reviewLabel}>価格</div>
                <div style={styles.reviewValue}>{storyData.mintPrice} ETH</div>
              </div>
              <div>
                <div style={styles.reviewLabel}>ロイヤリティ</div>
                <div style={styles.reviewValue}>{storyData.royalty}%</div>
              </div>
            </div>
            <div style={{ backgroundColor: '#2a2a2a', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
              <p style={{ color: '#ff6b6b', fontSize: '14px', margin: 0 }}>
                ⚠️ NFTとしてミントすると、ブロックチェーン上に永続的に記録されます
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>物語を作成 (Create Story)</h2>
          <button style={styles.closeButton} onClick={onCancel}>
            ×
          </button>
        </div>

        <div style={styles.stepIndicator}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              style={{
                ...styles.stepDot,
                ...(currentStep === step ? styles.stepDotActive : {})
              }}
            />
          ))}
        </div>

        <div style={styles.content}>
          {renderStepContent()}
        </div>

        <div style={styles.buttonGroup}>
          {currentStep > 1 && (
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleBack}
            >
              戻る
            </button>
          )}
          {currentStep < 4 ? (
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleNext}
              disabled={!storyData.title || !storyData.description}
            >
              次へ
            </button>
          ) : (
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleComplete}
            >
              ミントする
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCreationSystem;