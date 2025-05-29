# ArgentX アカウントアクティベート完全ガイド

## 状況別の対処法

### ❓ 「Deploy Account」ボタンが見つからない場合

1. **設定を確認**
   - ArgentXの右上の「⚙️」設定アイコンをクリック
   - 「Developer settings」を開く
   - 「Show testnet accounts」がONになっているか確認

2. **ネットワークを再確認**
   - メイン画面上部のネットワーク名をクリック
   - 「Testnet」セクションから「Sepolia」を選択
   - ページをリフレッシュ（ArgentXを閉じて開き直す）

### 💰 ETH残高が足りない場合

1. [Starknet Faucet](https://faucet.starknet.io/)にアクセス
2. アドレスを入力：`0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E`
3. 「Send」をクリック
4. 数分待つとETHが届く

### 🔄 強制的にアカウントをデプロイする方法

最も確実な方法：
1. ArgentXで「Send」をクリック
2. 送信先（Recipient）に同じアドレスを入力：
   ```
   0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E
   ```
3. Amount: `0.000001` ETH
4. 「Review send」→「Confirm」
5. これで必ずアカウントがデプロイされます

### ✅ 成功の確認方法

以下のいずれかで確認：
1. ArgentXの「Activity」タブに「Contract deployed」が表示
2. [Starkscan](https://sepolia.starkscan.co/contract/0x033904fd0d7F57614A4AE9340Aa72B61a9e960DBcE38a67e13d6d36Daf6ce14E)でアドレスを検索して確認

### 🚨 よくある問題

**「Insufficient funds」エラー**
→ Faucetから再度ETHを取得

**「Network error」**
→ ネットワークをMainnetに切り替えて、再度Sepoliaに戻す

**トランザクションが進まない**
→ ArgentXを一度閉じて、再度開く