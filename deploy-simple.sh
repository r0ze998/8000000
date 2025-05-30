#!/bin/bash

# Simple Shrine Contract Deployment Script

echo "🏗️ Cultural Shrine シンプル版コントラクトデプロイを開始します..."

# 環境設定
export PATH="$HOME/.local/bin:$PATH"
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json
export STARKNET_RPC=https://starknet-sepolia.public.blastapi.io/rpc/v0_7

# アカウントアドレス
DEPLOYER_ADDRESS="0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E"

echo "✅ 環境設定完了"
echo "アカウント: $DEPLOYER_ADDRESS"
echo "ネットワーク: Starknet Sepolia"

# 残高確認
echo ""
echo "💰 アカウント残高を確認中..."
BALANCE=$(starkli balance $DEPLOYER_ADDRESS --rpc $STARKNET_RPC)
echo "残高: $BALANCE ETH"

if [ "$BALANCE" = "0.000000000000000000" ]; then
    echo "❌ アカウントにETHがありません！"
    echo "以下のFaucetからSepolia ETHを取得してください："
    echo "- https://faucet.starknet.io/"
    echo "- ArgentXアプリ内のFaucet"
    exit 1
fi

# ビルド確認
echo ""
echo "📦 ビルド済みファイルを確認中..."
CONTRACT_FILE="target/dev/cultural_shrine_contracts_SimpleShrine.contract_class.json"

if [ ! -f "$CONTRACT_FILE" ]; then
    echo "❌ コントラクトファイルが見つかりません"
    echo "scarb build を実行してください"
    exit 1
fi

echo "✅ コントラクトファイル確認済み"

# キーストアファイルが必要か確認
echo ""
echo "🔑 デプロイには秘密鍵が必要です"
echo "ArgentXから秘密鍵をエクスポートしてください："
echo "1. ArgentXアプリを開く"
echo "2. 設定 → セキュリティ → 秘密鍵をエクスポート"
echo "3. パスワードを入力して秘密鍵を表示"
echo ""
read -p "秘密鍵を準備できましたか？ (y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "デプロイを中止しました"
    exit 1
fi

# キーストアファイル作成
echo ""
echo "🔐 キーストアファイルを作成中..."
KEYSTORE_PATH=~/.starkli-wallets/deployer/keystore.json

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "starkli signer keystore new コマンドを使用してキーストアを作成してください"
    echo "または、秘密鍵を直接使用する場合は環境変数 STARKNET_PRIVATE_KEY を設定してください"
    exit 1
fi

# コントラクト宣言
echo ""
echo "📝 コントラクトを宣言中..."
DECLARE_OUTPUT=$(starkli declare $CONTRACT_FILE --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC --keystore $KEYSTORE_PATH 2>&1)

if [ $? -ne 0 ]; then
    # 既に宣言されている場合はエラーメッセージからクラスハッシュを抽出
    if echo "$DECLARE_OUTPUT" | grep -q "already declared"; then
        CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oE '0x[0-9a-fA-F]+' | tail -1)
        echo "✅ コントラクトは既に宣言されています: $CLASS_HASH"
    else
        echo "❌ コントラクト宣言に失敗しました"
        echo "$DECLARE_OUTPUT"
        exit 1
    fi
else
    CLASS_HASH=$(echo "$DECLARE_OUTPUT" | grep -oE '0x[0-9a-fA-F]+' | tail -1)
    echo "✅ コントラクト宣言完了: $CLASS_HASH"
fi

# コントラクトデプロイ
echo ""
echo "🚀 コントラクトをデプロイ中..."
DEPLOY_OUTPUT=$(starkli deploy $CLASS_HASH $DEPLOYER_ADDRESS --account $STARKNET_ACCOUNT --rpc $STARKNET_RPC --keystore $KEYSTORE_PATH 2>&1)

if [ $? -ne 0 ]; then
    echo "❌ デプロイに失敗しました"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE '0x[0-9a-fA-F]+' | tail -1)
echo "✅ デプロイ完了: $CONTRACT_ADDRESS"

# デプロイ結果を保存
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat > deployed_simple_shrine.json << EOF
{
  "network": "starknet-sepolia",
  "deployed_at": "$TIMESTAMP",
  "deployer": "$DEPLOYER_ADDRESS",
  "contract": {
    "name": "SimpleShrine",
    "address": "$CONTRACT_ADDRESS",
    "class_hash": "$CLASS_HASH"
  }
}
EOF

echo ""
echo "🎉 デプロイが完了しました！"
echo ""
echo "📋 デプロイ情報:"
echo "コントラクトアドレス: $CONTRACT_ADDRESS"
echo "クラスハッシュ: $CLASS_HASH"
echo ""
echo "🔗 Starknet Explorer で確認:"
echo "https://sepolia.starkscan.co/contract/$CONTRACT_ADDRESS"
echo ""
echo "📁 デプロイ情報は deployed_simple_shrine.json に保存されました"
echo ""
echo "🚀 フロントエンドの contracts/shrineContract.js を以下で更新してください:"
echo "SHRINE_CONTRACT_ADDRESS = \"$CONTRACT_ADDRESS\""