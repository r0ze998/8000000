
import React from 'react';
import { useStarkNet } from '../../hooks/useStarkNet';
import './WalletConnect.css';

const WalletConnect: React.FC = () => {
  const { isConnected, account, connectWallet, disconnectWallet } = useStarkNet();

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button 
          className="connect-wallet-btn"
          onClick={connectWallet}
        >
          <span className="wallet-icon">🔗</span>
          StarkNetウォレットに接続
        </button>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info">
            <span className="wallet-icon">✅</span>
            <span className="wallet-address">
              {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
            </span>
          </div>
          <button 
            className="disconnect-wallet-btn"
            onClick={disconnectWallet}
          >
            切断
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
