# 8000000 - 八百万の神アプリ

日本の神社文化とWeb3を融合した、新しい形の参拝体験アプリです。

## 機能

- 🏮 デジタル神社の創建・管理
- ⛩️ バーチャル参拝とリアル神社訪問記録
- 🎌 おみくじシステム（大吉〜凶）
- 📿 御朱印帳コレクション（NFT対応）
- 🎵 タブごとに変わるBGMシステム
- 📱 iOS/Android対応のモバイルアプリ
- 🌸 季節に応じたエフェクト表示

## セットアップ

### インストール

1. リポジトリのクローン
```bash
git clone https://github.com/r0ze998/cultural-shrine-village-starknet.git 8000000
cd 8000000
```

2. 依存関係のインストール
```bash
cd frontend
npm install
```

### アプリケーションの起動

```bash
npm start
```

アプリは http://localhost:3000 で起動します。

## 使い方

1. 初回起動時に神社名を設定
2. 5つのタブで機能を切り替え：
   - 🏠 ホーム：近くの神社情報
   - 🗺️ 探索：神社マップ
   - ⛩️ 参拝：おみくじを引く
   - 📚 学び：神社の歴史
   - 👤 プロフィール：実績確認

## デプロイ

### Vercelでのデプロイ

```bash
vercel --prod
```

Root Directory: `frontend`
Framework: `Create React App`

## 技術スタック

- **Frontend**: React, Capacitor (iOS/Android対応)
- **Blockchain**: Starknet (Cairo 2.6.0+), Starknet.js
- **ウォレット**: StarkNet React (ArgentX, Braavos対応)
- **Deployment**: Vercel
- **Audio**: Web Audio API (BGMシステム)
- **State Management**: React Context API

## ライセンス

MIT License

## 作者

8000000 Development Team

---

🌸 日本の伝統文化をデジタルで未来へ 🌸