#!/bin/bash

# Starknet環境設定スクリプト

echo "🔧 Starknet環境を設定中..."

# アカウント設定
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json
export STARKNET_RPC=https://starknet-sepolia.public.blastapi.io/rpc/v0_7

# PATH設定
export PATH="$HOME/.local/bin:$PATH"

echo "✅ 環境設定完了"
echo "アカウント: 0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E"
echo "ネットワーク: Starknet Sepolia"

# アカウント残高確認
echo ""
echo "💰 アカウント残高を確認中..."
starkli account balance 0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E --rpc $STARKNET_RPC