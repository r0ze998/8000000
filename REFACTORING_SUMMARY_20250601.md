# リファクタリング概要 (2025/06/01)

## 実施内容

### 1. 重複ファイルの削除
- **Tab関連コンポーネント**: 3箇所に散在していたVisitTab.jsを統合
- **Audio関連**: 5つの類似サービスをaudioManager.jsに統合
- **未使用CSSファイル**: JSファイルがない12個のCSSファイルを削除

### 2. ディレクトリ構造の最適化
`frontend/src/components/`を機能別に整理：
```
components/
├── audio/          # Audio関連（4ファイル）
├── shrine/         # 神社関連（6ファイル）
├── village/        # 村関連（1ファイル）
├── player/         # プレイヤー関連（2ファイル）
├── visit/          # 参拝関連（2ファイル）
├── ui/             # UI部品（8ファイル）
├── gamification/   # ゲーミフィケーション（6ファイル）
├── collection/     # コレクション関連（3ファイル）
├── integration/    # 外部連携（2ファイル）
└── tabs/           # Tabコンポーネント（VisitTab）
```

### 3. Audio機能の統合
削除したファイル：
- BGMController.js
- gagakuAudio.js
- simpleGagaku.js
- webAudioGagaku.js
- bgmPlayer.js
- useBGM.js
- bgmUtils.js

統合先：`audioManager.js`（すべての音楽管理機能を一元化）

### 4. インポートパスの修正
以下のファイルのインポートパスを更新：
- ShrineVillageApp.js（15箇所）
- App.refactored.js（10箇所）
- SimpleAudioToggle.js（audioManagerを使用）
- BGMManager.js（audioManagerを使用）

### 5. バレルファイルの作成
各機能ディレクトリにindex.jsを作成し、インポートを簡潔化：
```javascript
// 例：audio/index.js
export { default as AudioControls } from './AudioControls';
export { default as BGMManager } from './BGMManager';
// ...
```

## 改善効果

1. **コードの重複削減**: Audio関連で約70%のコード削減
2. **構造の明確化**: 80個以上のファイルが平坦に配置されていた状態から、9つの機能別ディレクトリに整理
3. **保守性の向上**: 関連ファイルが同じディレクトリに配置され、見つけやすくなった
4. **インポートの簡潔化**: バレルファイルにより、複数のコンポーネントを一行でインポート可能

## 今後の推奨事項

1. **App.refactored.jsへの移行**: より良いアーキテクチャを持つApp.refactored.jsへの段階的移行
2. **Tabコンポーネントの統一**: 現在componentsとcomponents/tabsに分散しているTabコンポーネントの整理
3. **featuresディレクトリの活用**: 既に存在するfeaturesディレクトリを活用した機能別モジュール化
4. **テストの追加**: リファクタリング後の動作確認のためのテストスイートの作成