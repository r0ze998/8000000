
import React, { useState, useEffect } from 'react';
import { useAccountAbstraction } from '../../hooks/useAccountAbstraction';
import { validateStarkNetConnection, STARKNET_TESTNET_CONFIG } from '../../utils/starknet';

const StarkNetDebug: React.FC = () => {
  const { provider, isReady, address, sessionId } = useAccountAbstraction();
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
      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', 
      padding: '16px', 
      borderRadius: '12px',
      fontSize: '12px',
      maxWidth: '320px',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>🏛️ Account Abstraction Debug</h4>
      
      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#475569' }}>ネットワーク設定:</strong>
        <div style={{ color: '#64748b', fontSize: '11px' }}>
          <div>RPC: {STARKNET_TESTNET_CONFIG.rpcUrl}</div>
          <div>Chain: {STARKNET_TESTNET_CONFIG.chainId}</div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#475569' }}>接続状態:</strong>
        {isLoading ? (
          <div style={{ color: '#f59e0b' }}>🔄 確認中...</div>
        ) : connectionStatus ? (
          <div>
            {connectionStatus.isConnected ? (
              <>
                <div style={{ color: '#22c55e' }}>✅ 接続済み</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  Chain ID: {connectionStatus.chainId}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  Block: #{connectionStatus.blockNumber}
                </div>
              </>
            ) : (
              <div style={{ color: '#ef4444' }}>❌ 接続失敗: {connectionStatus.error}</div>
            )}
          </div>
        ) : (
          <div style={{ color: '#94a3b8' }}>❓ 未確認</div>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <strong style={{ color: '#475569' }}>Account Abstraction:</strong>
        <div>
          <div style={{ 
            color: isReady ? '#22c55e' : '#f59e0b',
            fontWeight: '500'
          }}>
            {isReady ? '✅ 準備完了' : '⏳ 初期化中'}
          </div>
          {address && (
            <div style={{ 
              fontSize: '10px', 
              fontFamily: 'monospace',
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '4px 6px',
              borderRadius: '4px',
              marginTop: '4px',
              color: '#374151'
            }}>
              {address.slice(0, 8)}...{address.slice(-6)}
            </div>
          )}
          {sessionId && (
            <div style={{ 
              fontSize: '10px',
              color: '#64748b',
              marginTop: '2px'
            }}>
              Session: {sessionId.slice(8, 16)}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={checkConnection}
        style={{ 
          marginTop: '8px', 
          padding: '6px 12px', 
          fontSize: '11px',
          width: '100%',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        🔄 接続再確認
      </button>
      
      <div style={{
        marginTop: '12px',
        padding: '8px',
        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        borderRadius: '6px',
        fontSize: '10px',
        color: '#1e40af'
      }}>
        💡 ウォレットレス設計により、ユーザーは暗号通貨の知識なしで利用可能
      </div>
    </div>
  );
};

export default StarkNetDebug;
