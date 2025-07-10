
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Service Workerを無効化（開発中のエラーを防ぐため）
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
