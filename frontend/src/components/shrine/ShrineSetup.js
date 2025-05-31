import React, { useState } from 'react';

const ShrineSetup = ({ onCreateShrine }) => {
  const [shrineName, setShrineName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (shrineName.trim()) {
      onCreateShrine(shrineName);
    }
  };

  return (
    <div className="shrine-setup">
      <h1>⛩️ あなたの神社を創建しよう</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="神社の名前を入力（例：文化神社）"
          value={shrineName}
          onChange={(e) => setShrineName(e.target.value)}
          required
        />
        <button type="submit">創建する</button>
      </form>
    </div>
  );
};

export default ShrineSetup;