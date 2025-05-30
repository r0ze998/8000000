import { useState, useCallback } from 'react';
import soundEffects from '../utils/soundEffects';

const DEFAULT_SHRINE = {
  name: '',
  level: 1,
  buildings: {},
  culturalCapital: 0,
  visitors: 0,
  blessings: 0
};

export const useShrine = () => {
  const [shrine, setShrine] = useState(DEFAULT_SHRINE);
  const [showShrineSetup, setShowShrineSetup] = useState(true);

  const createShrine = useCallback((name) => {
    if (name.trim()) {
      setShrine(prev => ({
        ...prev,
        name: name.trim()
      }));
      setShowShrineSetup(false);
      soundEffects.playSound('treeGrow');
    }
  }, []);

  const updateBuilding = useCallback((buildingType, level) => {
    setShrine(prev => ({
      ...prev,
      buildings: {
        ...prev.buildings,
        [buildingType]: level
      }
    }));
  }, []);

  const addCulturalCapital = useCallback((amount) => {
    setShrine(prev => ({
      ...prev,
      culturalCapital: prev.culturalCapital + amount,
      level: Math.floor((prev.culturalCapital + amount) / 100) + 1
    }));
  }, []);

  const addBlessings = useCallback((amount) => {
    setShrine(prev => ({
      ...prev,
      blessings: prev.blessings + amount
    }));
  }, []);

  const addVisitors = useCallback((amount) => {
    setShrine(prev => ({
      ...prev,
      visitors: prev.visitors + amount
    }));
  }, []);

  return {
    shrine,
    showShrineSetup,
    createShrine,
    updateBuilding,
    addCulturalCapital,
    addBlessings,
    addVisitors
  };
};