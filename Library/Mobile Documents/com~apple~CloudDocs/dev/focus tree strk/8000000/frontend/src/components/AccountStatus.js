import React from 'react';

const AccountStatus = ({ isConnected, account, onConnect, onDisconnect }) => {
  return (
    <div className={`account-status ${isConnected ? 'connected' : 'disconnected'}`}>
      {isConnected ? (
        <>
          <span>🟢</span>
          <span>{account?.address || 'Connected'}</span>
          <button 
            onClick={onDisconnect}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              opacity: 0.7
            }}
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <span>🔴</span>
          <span>未接続</span>
          <button 
            onClick={onConnect}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              textDecoration: 'underline'
            }}
          >
            接続
          </button>
        </>
      )}
    </div>
  );
};

export default AccountStatus;