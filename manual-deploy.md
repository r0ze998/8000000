# 手動デプロイ手順

## 1. アカウント情報の取得

ウォレットアドレスをコピーして、以下のコマンドを実行：

```bash
# ディレクトリ作成
mkdir -p ~/.starkli-wallets/deployer

# アカウント情報取得（YOUR_WALLET_ADDRESSを実際のアドレスに置き換え）
starkli account fetch YOUR_WALLET_ADDRESS \
    --output ~/.starkli-wallets/deployer/account.json \
    --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7
```

## 2. キーストアの作成

プライベートキーをエクスポート：
- ArgentX: Settings → Account → Export Private Key
- Braavos: Settings → Privacy & Security → Export Private Key

```bash
# キーストア作成（パスワードを設定）
starkli signer keystore from-key ~/.starkli-wallets/deployer/keystore.json
```

## 3. コントラクトのデプロイ

```bash
# デプロイスクリプトを実行
./deploy-testnet.sh
```

これで自動的に：
- コントラクトクラスが宣言される
- コントラクトがデプロイされる
- フロントエンドが更新される