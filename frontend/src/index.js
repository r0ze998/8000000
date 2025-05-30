import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.mobile.css';
// import App from './App'; // ブロックチェーン接続版
// import MockApp from './MockApp'; // デモモード版
// import CulturalForestApp from './CulturalForestApp'; // 文化資本特化版
import ShrineVillageApp from './ShrineVillageApp'; // 神社村特化版
import IOSWrapper from './components/IOSWrapper';
import { StarknetConfig, publicProvider, InjectedConnector } from '@starknet-react/core';
import { sepolia } from '@starknet-react/chains';

const connectors = [
  new InjectedConnector({ options: { id: 'braavos' }}),
  new InjectedConnector({ options: { id: 'argentX' }}),
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IOSWrapper>
      <StarknetConfig
        chains={[sepolia]}
        provider={publicProvider()}
        connectors={connectors}
      >
        <ShrineVillageApp />
      </StarknetConfig>
    </IOSWrapper>
  </React.StrictMode>
);