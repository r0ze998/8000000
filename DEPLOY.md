# デプロイ手順

## 1. Starkliのインストール

```bash
curl https://get.starkli.sh | sh
starkliup
```

## 2. ウォレットの設定

ArgentXまたはBraavosでウォレットを作成し、Sepoliaテストネット用のETHを取得

## 3. アカウントの設定

```bash
# アカウントファイルの作成
mkdir -p ~/.starkli-wallets/deployer
starkli account fetch <YOUR_WALLET_ADDRESS> --output ~/.starkli-wallets/deployer/account.json

# キーストアの作成
starkli signer keystore from-key ~/.starkli-wallets/deployer/keystore.json
# プライベートキーを入力
```

## 4. コントラクトのデプロイ

```bash
# ビルド
scarb build

# クラスの宣言
export STARKNET_RPC="https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
starkli declare target/dev/focus_tree_HabitTracker.contract_class.json \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# デプロイ（CLASS_HASHは前のコマンドの出力から取得）
starkli deploy <CLASS_HASH> \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json
```

## 5. フロントエンドの設定

1. `frontend/src/App.js`の`CONTRACT_ADDRESS`をデプロイしたアドレスに更新
2. `cd frontend && npm install`
3. `npm start`

## テストネットETHの取得

- [Starknet Faucet](https://faucet.goerli.starknet.io/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)