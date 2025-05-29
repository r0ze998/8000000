import React, { useMemo } from 'react';
import './ForestView.css';

const TREE_TYPES = {
  NORMAL: { emoji: '🌲', name: '普通の木' },
  CHERRY: { emoji: '🌸', name: '桜の木' },
  GOLDEN: { emoji: '🌟', name: '黄金の木' },
  MYSTICAL: { emoji: '🌈', name: '神秘の木' },
};

const DECORATIONS = [
  { emoji: '🦋', name: '蝶' },
  { emoji: '🐦', name: '鳥' },
  { emoji: '🦌', name: '鹿' },
  { emoji: '🌺', name: '花' },
  { emoji: '🍄', name: 'キノコ' },
  { emoji: '💎', name: 'クリスタル' },
];

function ForestView({ trees, level, forestSize, specialTrees }) {
  const treeGrid = useMemo(() => {
    const grid = [];
    const rows = Math.floor(Math.sqrt(forestSize)) || 5;
    const cols = Math.ceil(forestSize / rows) || 5;
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const index = i * cols + j;
        if (index < trees) {
          // 特別な木を配置
          if (specialTrees.golden > 0 && index % 30 === 0) {
            row.push(TREE_TYPES.GOLDEN);
          } else if (specialTrees.mystical > 0 && index % 100 === 0) {
            row.push(TREE_TYPES.MYSTICAL);
          } else if (index % 10 === 0) {
            row.push(TREE_TYPES.CHERRY);
          } else {
            row.push(TREE_TYPES.NORMAL);
          }
        } else if (index < forestSize) {
          row.push(null); // 空きスペース
        }
      }
      grid.push(row);
    }
    return grid;
  }, [trees, forestSize, specialTrees]);

  const decorations = useMemo(() => {
    const items = [];
    const decorationCount = Math.floor(level / 2);
    for (let i = 0; i < decorationCount && i < DECORATIONS.length; i++) {
      items.push(DECORATIONS[i]);
    }
    return items;
  }, [level]);

  return (
    <div className="forest-view">
      <div className="forest-header">
        <h2>🏞️ あなたの森 - レベル {level}</h2>
        <div className="forest-stats">
          <span>🌲 {trees} 本の木</span>
          <span>📏 {forestSize} マスの土地</span>
        </div>
      </div>
      
      <div className="forest-grid">
        {treeGrid.map((row, i) => (
          <div key={i} className="forest-row">
            {row.map((cell, j) => (
              <div key={j} className="forest-cell">
                {cell ? (
                  <div className="tree" title={cell.name}>
                    {cell.emoji}
                  </div>
                ) : (
                  <div className="empty-space">·</div>
                )}
              </div>
            ))}
          </div>
        ))}
        
        {decorations.length > 0 && (
          <div className="forest-decorations">
            {decorations.map((deco, i) => (
              <div 
                key={i} 
                className="decoration"
                style={{
                  position: 'absolute',
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 3) * 20}%`,
                  animation: `float ${3 + i}s ease-in-out infinite`
                }}
              >
                {deco.emoji}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="level-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(level % 10) * 10}%` }}
          />
        </div>
        <p>次のレベルまで: {(10 - (level % 10)) * 10} EXP</p>
      </div>
    </div>
  );
}

export default ForestView;