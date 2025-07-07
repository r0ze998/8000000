
import React, { useState, useEffect } from 'react';
import { useStarkNet } from '../../hooks/useStarkNet';
import { validateStarkNetConnection, STARKNET_TESTNET_CONFIG } from '../../utils/starknet';

const StarkNetDebug: React.FC = () => {
  const { provider, isConnected, account, connectWallet } = useStarkNet();
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const status = await validateStarkNetConnection(provider);
      setConnectionStatus(status);
    } catch (error) {
      console.error('接続チェックエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, [provider]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '15px', 
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000,
      border: '1px solid #ccc'
    }}>
      <h4>🔍 StarkNet Debug Panel</h4>
      
      <div>
        <strong>設定:</strong>
        <div>RPC: {STARKNET_TESTNET_CONFIG.rpcUrl}</div>
        <div>Chain: {STARKNET_TESTNET_CONFIG.chainId}</div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>接続状態:</strong>
        {isLoading ? (
          <div>🔄 確認中...</div>
        ) : connectionStatus ? (
          <div>
            {connectionStatus.isConnected ? (
              <>
                <div>✅ 接続済み</div>
                <div>Chain ID: {connectionStatus.chainId}</div>
                <div>Block: #{connectionStatus.blockNumber}</div>
              </>
            ) : (
              <div>❌ 接続失敗: {connectionStatus.error}</div>
            )}
          </div>
        ) : (
          <div>❓ 未確認</div>
        )}
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>ウォレット:</strong>
        {isConnected ? (
          <div>
            ✅ 接続済み<br/>
            Address: {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'N/A'}
          </div>
        ) : (
          <div>
            ❌ 未接続
            <button 
              onClick={connectWallet}
              style={{ 
                marginLeft: '5px', 
                padding: '2px 8px', 
                fontSize: '10px' 
              }}
            >
              接続
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={checkConnection}
        style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          fontSize: '11px',
          width: '100%'
        }}
      >
        🔄 再確認
      </button>
    </div>
  );
};

export default StarkNetDebug;
