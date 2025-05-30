import React from 'react';
import { BuildingComponents } from './ShrineGraphics';

const ShrineView = ({ buildings }) => {
  const renderBuildings = () => {
    return Object.entries(buildings).map(([type, level]) => {
      const BuildingComponent = BuildingComponents[type];
      if (!BuildingComponent) return null;
      
      return (
        <div key={type} className="building">
          <BuildingComponent level={level + 1} size={120} />
        </div>
      );
    });
  };

  return (
    <div className="shrine-view">
      {renderBuildings()}
      {Object.keys(buildings).length === 0 && (
        <p>神社・寺院への参拝を記録して神社村を発展させましょう</p>
      )}
    </div>
  );
};

export default ShrineView;