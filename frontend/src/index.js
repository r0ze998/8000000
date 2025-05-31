import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.mobile.css';
import IOSWrapper from './components/IOSWrapper';
import ShrineVillageApp from './ShrineVillageApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <IOSWrapper>
      <ShrineVillageApp />
    </IOSWrapper>
  </React.StrictMode>
);