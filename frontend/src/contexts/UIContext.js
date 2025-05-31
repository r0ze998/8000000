import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  // タブ状態
  const [activeTab, setActiveTab] = useState('home');
  
  // モーダル状態
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showShrineSelector, setShowShrineSelector] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedShrineForVerification, setSelectedShrineForVerification] = useState(null);
  
  // ページング状態
  const [goshuinchoPage, setGoshuinchoPage] = useState(0);

  // タブ変更
  const changeTab = (newTab) => {
    console.log(`Tab change from ${activeTab} to ${newTab}`);
    setActiveTab(newTab);
  };

  // アクティビティモーダル
  const openActivityModal = (activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const closeActivityModal = () => {
    setShowActivityModal(false);
    setSelectedActivity(null);
  };

  // 神社選択モーダル
  const openShrineSelector = () => {
    setShowShrineSelector(true);
  };

  const closeShrineSelector = () => {
    setShowShrineSelector(false);
  };

  // 認証モーダル
  const openVerification = (shrine) => {
    setSelectedShrineForVerification(shrine);
    setShowVerification(true);
  };

  const closeVerification = () => {
    setShowVerification(false);
    setSelectedShrineForVerification(null);
  };

  const value = {
    // タブ
    activeTab,
    changeTab,
    
    // アクティビティモーダル
    showActivityModal,
    selectedActivity,
    openActivityModal,
    closeActivityModal,
    
    // 神社選択
    showShrineSelector,
    openShrineSelector,
    closeShrineSelector,
    
    // 認証
    showVerification,
    selectedShrineForVerification,
    openVerification,
    closeVerification,
    
    // ページング
    goshuinchoPage,
    setGoshuinchoPage
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};