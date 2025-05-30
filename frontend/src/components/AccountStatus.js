import React from 'react';
import { useAccount, useNetwork } from '@starknet-react/core';
import './AccountStatus.css';

const AccountStatus = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected) {
    return null;
  }

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x534e5f5345504f4c4941': // SN_SEPOLIA
        return 'Sepolia Testnet';
      case '0x534e5f4d41494e': // SN_MAIN
        return 'Mainnet';
      default:
        return chain?.name || 'Unknown Network';
    }
  };

  const getNetworkIcon = (chainId) => {
    switch (chainId) {
      case '0x534e5f5345504f4c4941':
        return '🧪';
      case '0x534e5f4d41494e':
        return '🌐';
      default:
        return '⚡';
    }
  };

  return (
    <div className="account-status">
      <div className="account-info">
        <div className="account-item">
          <span className="account-label">アカウント:</span>
          <span className="account-value">{formatAddress(address)}</span>
        </div>
        <div className="network-info">
          <span className="network-icon">{getNetworkIcon(chain?.id)}</span>
          <span className="network-name">{getNetworkName(chain?.id)}</span>
        </div>
      </div>
      
      <div className="connection-indicator">
        <div className="status-dot connected"></div>
        <span className="status-text">接続中</span>
      </div>
    </div>
  );
};

export default AccountStatus;