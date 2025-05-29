# Starknet Sepolia テストネット デプロイメントガイド

## 前提条件

1. **ArgentXまたはBraavosウォレット**のインストール
2. **Sepolia ETH**の取得（テストネット用）

## 1. ウォレットの準備

### ArgentXの場合:
1. ArgentX拡張機能を開く
2. Settings → Developer settings → Enable testnet を有効化
3. ネットワークを「Sepolia Testnet」に切り替え
4. ウォレットアドレスをコピー

### テストネットETHの取得:
- [Starknet Sepolia Faucet](https://faucet.starknet.io/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

## 2. アカウントのセットアップ

```bash
# ディレクトリの作成
mkdir -p ~/.starkli-wallets/deployer

# アカウント情報の取得（ウォレットアドレスを置き換えてください）
starkli account fetch YOUR_WALLET_ADDRESS --output ~/.starkli-wallets/deployer/account.json --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7

# キーストアの作成（プライベートキーが必要）
starkli signer keystore from-key ~/.starkli-wallets/deployer/keystore.json
```

**重要**: プライベートキーの取得方法
- ArgentX: Settings → Account → Export Private Key
- Braavos: Settings → Privacy & Security → Export Private Key

## 3. コントラクトのビルド

```bash
cd /Users/r0ze/Library/Mobile Documents/com~apple~CloudDocs/dev/focus tree strk/focus-tree-starknet
scarb build
```

## 4. デプロイの実行

```bash
# 環境変数の設定
export STARKNET_RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
export STARKNET_ACCOUNT=~/.starkli-wallets/deployer/account.json
export STARKNET_KEYSTORE=~/.starkli-wallets/deployer/keystore.json

# クラスの宣言
starkli declare target/dev/focus_tree_HabitTracker.contract_class.json

# コントラクトのデプロイ（CLASS_HASHは上記コマンドの出力から取得）
starkli deploy CLASS_HASH --salt 0x1234

# または、デプロイスクリプトを実行
./deploy.sh
```

## 5. フロントエンドの設定

1. `frontend/src/App.js`を開く
2. `CONTRACT_ADDRESS`を実際のデプロイアドレスに更新
3. アプリケーションを再起動

```javascript
const CONTRACT_ADDRESS = "0x実際のコントラクトアドレス";
```

## トラブルシューティング

### "Account not deployed"エラー
- ウォレットが正しくデプロイされているか確認
- テストネットETHが十分にあるか確認

### "Class already declared"エラー
- 既に宣言済みのクラスです。deployコマンドに進んでください

### トランザクションが失敗する
- ガス代用のETHが十分にあるか確認
- RPCエンドポイントが正しいか確認