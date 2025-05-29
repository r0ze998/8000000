#!/bin/bash

echo "=== Starknet Account Setup ==="
echo ""
echo "このスクリプトを実行する前に："
echo "1. ArgentX/Braavosでテストネットを有効化"
echo "2. Sepoliaネットワークに切り替え"
echo "3. テストネットETHを取得"
echo ""
read -p "準備ができたらEnterを押してください..."

# ディレクトリの作成
mkdir -p ~/.starkli-wallets/deployer

# ウォレットアドレスの入力
echo ""
read -p "ウォレットアドレスを入力してください (0x...): " WALLET_ADDRESS

# アカウント情報の取得
echo "アカウント情報を取得中..."
starkli account fetch "$WALLET_ADDRESS" \
    --output ~/.starkli-wallets/deployer/account.json \
    --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7

if [ $? -eq 0 ]; then
    echo "✅ アカウント情報を取得しました"
else
    echo "❌ アカウント情報の取得に失敗しました"
    exit 1
fi

# キーストアの作成
echo ""
echo "次に、プライベートキーが必要です："
echo "- ArgentX: Settings → Account → Export Private Key"
echo "- Braavos: Settings → Privacy & Security → Export Private Key"
echo ""
echo "プライベートキーを入力すると、パスワードの設定を求められます。"
read -p "準備ができたらEnterを押してください..."

starkli signer keystore from-key ~/.starkli-wallets/deployer/keystore.json

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ セットアップが完了しました！"
    echo ""
    echo "次のステップ:"
    echo "./deploy-testnet.sh を実行してコントラクトをデプロイしてください"
else
    echo "❌ キーストアの作成に失敗しました"
    exit 1
fi