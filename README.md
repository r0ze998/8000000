# Focus Tree on Starknet

習慣記録アプリ「Focus Tree」のStarknet実装です。

## 機能

- 習慣の作成・管理
- 習慣の完了記録
- ストリーク（連続達成）の追跡
- 7日連続で習慣を達成すると「木」を獲得
- ユーザー統計の表示

## セットアップ

### スマートコントラクトのデプロイ

1. Scarbのインストール
```bash
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh
```

2. コントラクトのビルド
```bash
cd focus-tree-starknet
scarb build
```

3. コントラクトのデプロイ（Starknet CLIまたはRemixを使用）

### フロントエンドの起動

1. 依存関係のインストール
```bash
cd frontend
npm install
```

2. App.jsの`CONTRACT_ADDRESS`を実際のコントラクトアドレスに更新

3. アプリケーションの起動
```bash
npm start
```

## 使い方

1. ArgentXまたはBraavosウォレットを接続
2. 新しい習慣を作成（名前、説明、頻度を設定）
3. 毎日習慣を完了してストリークを維持
4. 7日連続で達成すると木を獲得！

## 技術スタック

- Cairo 2.6.0+ (スマートコントラクト)
- React (フロントエンド)
- Starknet.js (ブロックチェーン連携)
- StarkNet React (ウォレット接続)