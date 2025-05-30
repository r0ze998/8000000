#!/bin/bash

# Direct deployment using starkli with environment variables

echo "🏗️ Cultural Shrine シンプル版コントラクトデプロイを開始します..."

# 環境設定
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json
export STARKNET_RPC=https://starknet-sepolia.public.blastapi.io

# アカウントアドレス
DEPLOYER_ADDRESS="0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E"

# 秘密鍵の確認
if [ -z "$STARKNET_PRIVATE_KEY" ]; then
    echo ""
    echo "🔑 秘密鍵を設定してください："
    echo "export STARKNET_PRIVATE_KEY=<your-private-key>"
    echo ""
    echo "注意: 秘密鍵は他人に見せないでください！"
    exit 1
fi

echo "✅ 環境設定完了"

# コントラクトファイル
CONTRACT_FILE="target/dev/cultural_shrine_contracts_SimpleShrine.contract_class.json"

echo ""
echo "📝 コントラクトを宣言中..."

# starkliの最新版を使用
starkli declare $CONTRACT_FILE \
    --account $STARKNET_ACCOUNT \
    --rpc $STARKNET_RPC \
    --private-key $STARKNET_PRIVATE_KEY

echo ""
echo "注意: 宣言が成功したら、表示されたクラスハッシュを使って次のコマンドでデプロイしてください："
echo ""
echo "starkli deploy <CLASS_HASH> $DEPLOYER_ADDRESS \\"
echo "    --account $STARKNET_ACCOUNT \\"
echo "    --rpc $STARKNET_RPC \\"
echo "    --private-key \$STARKNET_PRIVATE_KEY"