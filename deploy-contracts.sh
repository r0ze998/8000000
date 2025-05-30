#!/bin/bash

# Cultural Shrine Starknet Deployment Script
# このスクリプトは3つのコントラクトをStarknet Sepoliaにデプロイします

echo "🏗️ Cultural Shrine コントラクトデプロイを開始します..."

# 環境変数チェック
if [ -z "$STARKNET_ACCOUNT" ] || [ -z "$STARKNET_RPC" ]; then
    echo "❌ 環境変数が設定されていません"
    echo "以下を設定してください:"
    echo "export STARKNET_ACCOUNT=<your-account-address>"
    echo "export STARKNET_RPC=https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
    exit 1
fi

# ビルド
echo "📦 コントラクトをビルド中..."
scarb build

if [ $? -ne 0 ]; then
    echo "❌ ビルドに失敗しました"
    exit 1
fi

echo "✅ ビルド完了"

# コントラクトファイルのパス
SHRINE_MANAGER="target/dev/cultural_shrine_contracts_ShrineManager.contract_class.json"
VISIT_NFT="target/dev/cultural_shrine_contracts_VisitNFT.contract_class.json"
CULTURAL_TOKEN="target/dev/cultural_shrine_contracts_CulturalToken.contract_class.json"

# 1. Cultural Token コントラクトをデプロイ
echo "🪙 Cultural Token コントラクトをデプロイ中..."
CULTURAL_TOKEN_DECLARE=$(starkli declare $CULTURAL_TOKEN --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC)
if [ $? -ne 0 ]; then
    echo "❌ Cultural Token コントラクトの宣言に失敗しました"
    exit 1
fi

# クラスハッシュ抽出
CULTURAL_TOKEN_CLASS_HASH=$(echo $CULTURAL_TOKEN_DECLARE | grep -o '0x[0-9a-fA-F]*' | tail -1)
echo "Cultural Token クラスハッシュ: $CULTURAL_TOKEN_CLASS_HASH"

# Cultural Token デプロイ（仮のコンストラクタ引数）
CULTURAL_TOKEN_DEPLOY=$(starkli deploy $CULTURAL_TOKEN_CLASS_HASH $STARKNET_ACCOUNT 0x0 0x0 --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC)
CULTURAL_TOKEN_ADDRESS=$(echo $CULTURAL_TOKEN_DEPLOY | grep -o '0x[0-9a-fA-F]*' | tail -1)
echo "✅ Cultural Token デプロイ完了: $CULTURAL_TOKEN_ADDRESS"

# 2. Shrine Manager コントラクトをデプロイ
echo "⛩️ Shrine Manager コントラクトをデプロイ中..."
SHRINE_MANAGER_DECLARE=$(starkli declare $SHRINE_MANAGER --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC)
if [ $? -ne 0 ]; then
    echo "❌ Shrine Manager コントラクトの宣言に失敗しました"
    exit 1
fi

SHRINE_MANAGER_CLASS_HASH=$(echo $SHRINE_MANAGER_DECLARE | grep -o '0x[0-9a-fA-F]*' | tail -1)
echo "Shrine Manager クラスハッシュ: $SHRINE_MANAGER_CLASS_HASH"

# Shrine Manager デプロイ
SHRINE_MANAGER_DEPLOY=$(starkli deploy $SHRINE_MANAGER_CLASS_HASH $STARKNET_ACCOUNT --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC)
SHRINE_MANAGER_ADDRESS=$(echo $SHRINE_MANAGER_DEPLOY | grep -o '0x[0-9a-fA-F]*' | tail -1)
echo "✅ Shrine Manager デプロイ完了: $SHRINE_MANAGER_ADDRESS"

# 3. Visit NFT コントラクトをデプロイ
echo "🎨 Visit NFT コントラクトをデプロイ中..."
VISIT_NFT_DECLARE=$(starkli declare $VISIT_NFT --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC)
if [ $? -ne 0 ]; then
    echo "❌ Visit NFT コントラクトの宣言に失敗しました"
    exit 1
fi

VISIT_NFT_CLASS_HASH=$(echo $VISIT_NFT_DECLARE | grep -o '0x[0-9a-fA-F]*' | tail -1)
echo "Visit NFT クラスハッシュ: $VISIT_NFT_CLASS_HASH"

# Visit NFT デプロイ
VISIT_NFT_DEPLOY=$(starkli deploy $VISIT_NFT_CLASS_HASH $STARKNET_ACCOUNT $SHRINE_MANAGER_ADDRESS --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC)
VISIT_NFT_ADDRESS=$(echo $VISIT_NFT_DEPLOY | grep -o '0x[0-9a-fA-F]*' | tail -1)
echo "✅ Visit NFT デプロイ完了: $VISIT_NFT_ADDRESS"

# デプロイ結果をファイルに保存
DEPLOYED_CONTRACTS_FILE="deployed_contracts.json"
cat > $DEPLOYED_CONTRACTS_FILE << EOF
{
  "network": "starknet-sepolia",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "contracts": {
    "shrine_manager": {
      "address": "$SHRINE_MANAGER_ADDRESS",
      "class_hash": "$SHRINE_MANAGER_CLASS_HASH"
    },
    "visit_nft": {
      "address": "$VISIT_NFT_ADDRESS", 
      "class_hash": "$VISIT_NFT_CLASS_HASH"
    },
    "cultural_token": {
      "address": "$CULTURAL_TOKEN_ADDRESS",
      "class_hash": "$CULTURAL_TOKEN_CLASS_HASH"
    }
  }
}
EOF

echo ""
echo "🎉 全コントラクトのデプロイが完了しました！"
echo ""
echo "📋 デプロイ結果:"
echo "Shrine Manager: $SHRINE_MANAGER_ADDRESS"
echo "Visit NFT: $VISIT_NFT_ADDRESS"  
echo "Cultural Token: $CULTURAL_TOKEN_ADDRESS"
echo ""
echo "📁 デプロイ情報は $DEPLOYED_CONTRACTS_FILE に保存されました"
echo ""
echo "🔗 Starknet Sepolia Explorer で確認:"
echo "https://sepolia.starkscan.co/contract/$SHRINE_MANAGER_ADDRESS"
echo "https://sepolia.starkscan.co/contract/$VISIT_NFT_ADDRESS"
echo "https://sepolia.starkscan.co/contract/$CULTURAL_TOKEN_ADDRESS"
echo ""
echo "🚀 フロントエンドの contracts/shrineContract.js ファイルを更新してください"