# アカウントのアクティベート手順

## 問題
ウォレットアドレス: 0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E
がまだオンチェーンにデプロイされていません。

## 解決方法

### 1. ウォレットでアカウントをアクティベート
ArgentXまたはBraavosで：
1. Sepoliaネットワークに接続されていることを確認
2. **"Deploy Account"** または **"Activate Account"** ボタンをクリック
3. トランザクションを承認（少額のガス代が必要）

### 2. または、Faucetから直接送金を受ける
一部のFaucetは自動的にアカウントをデプロイします：
- https://faucet.starknet.io/
- https://sepoliafaucet.com/

### 3. アクティベート後の確認
```bash
starkli account fetch 0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E \
    --output ~/.starkli-wallets/deployer/account.json \
    --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7
```

成功すると、account.jsonファイルが作成されます。