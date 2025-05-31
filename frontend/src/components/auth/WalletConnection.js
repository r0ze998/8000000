import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import './WalletConnection.css';

const WalletConnection = () => {
  const { address, isConnected, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConnectors, setShowConnectors] = useState(false);

  const handleConnect = (connector) => {
    connect({ connector });
    setShowConnectors(false);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-icon">👝</div>
          <div className="wallet-details">
            <span className="wallet-address">{formatAddress(address)}</span>
            <span className="wallet-status">接続済み</span>
          </div>
        </div>
        <button 
          className="disconnect-btn"
          onClick={handleDisconnect}
          title="ウォレットを切断"
        >
          🔌
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connection">
      <button 
        className="connect-wallet-btn"
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={status === 'connecting'}
      >
        {status === 'connecting' ? (
          <>
            <span className="loading-spinner">⏳</span>
            接続中...
          </>
        ) : (
          <>
            <span className="wallet-icon">👝</span>
            ウォレット接続
          </>
        )}
      </button>

      {showConnectors && (
        <div className="connector-modal">
          <div className="connector-backdrop" onClick={() => setShowConnectors(false)} />
          <div className="connector-list">
            <h3>ウォレットを選択</h3>
            {connectors.map((connector) => (
              <button
                key={connector.id}
                className="connector-btn"
                onClick={() => handleConnect(connector)}
                disabled={status === 'connecting'}
              >
                <div className="connector-icon">
                  {connector.id === 'argentX' ? '🔶' : '🛡️'}
                </div>
                <div className="connector-info">
                  <span className="connector-name">
                    {connector.id === 'argentX' ? 'Argent X' : 'Braavos'}
                  </span>
                  <span className="connector-desc">
                    {connector.id === 'argentX' 
                      ? 'Starknet用スマートウォレット' 
                      : 'セキュアなStarknetウォレット'
                    }
                  </span>
                </div>
              </button>
            ))}
            <button 
              className="close-modal-btn"
              onClick={() => setShowConnectors(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;