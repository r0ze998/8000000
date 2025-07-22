import { useState } from 'react';

export const useShrine = () => {
  const [shrine, setShrine] = useState({
    name: '八百万神社',
    level: 1,
    culturalCapital: 50,
    blessings: 10,
    visitors: 0,
    buildings: {
      torii: 1,
      shrine: 1,
      pagoda: 0,
      garden: 0,
      teahouse: 0,
      workshop: 0,
      museum: 0,
      bathhouse: 0
    }
  });
  
  const [showShrineSetup, setShowShrineSetup] = useState(false);

  const createShrine = (shrineData) => {
    setShrine(prev => ({ ...prev, ...shrineData }));
    setShowShrineSetup(false);
  };

  const updateBuilding = (buildingType, level) => {
    setShrine(prev => ({
      ...prev,
      buildings: { ...prev.buildings, [buildingType]: level }
    }));
  };

  const addCulturalCapital = (amount) => {
    setShrine(prev => ({ ...prev, culturalCapital: prev.culturalCapital + amount }));
  };

  const addBlessings = (amount) => {
    setShrine(prev => ({ ...prev, blessings: prev.blessings + amount }));
  };

  return {
    shrine,
    showShrineSetup,
    createShrine,
    updateBuilding,
    addCulturalCapital,
    addBlessings
  };
};