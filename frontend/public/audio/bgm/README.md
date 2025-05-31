# BGMファイルの配置について

このディレクトリにBGM用のMP3ファイルを配置してください。

## 必要なファイル

以下のファイル名でMP3ファイルを配置すると、BGMコントローラーで自動的に認識されます：

- `shrine-ambient.mp3` - 神社の環境音
- `forest-sounds.mp3` - 森の音
- `meditation.mp3` - 瞑想音楽
- `traditional-japanese.mp3` - 伝統的な日本音楽

## ファイルの要件

- **フォーマット**: MP3形式
- **ファイルサイズ**: 5MB以下を推奨（読み込み速度のため）
- **品質**: 128kbps以上を推奨
- **ループ**: シームレスにループできるよう、曲の最初と最後が自然につながるものが理想的

## 著作権について

- 著作権フリーの音楽のみを使用してください
- クリエイティブ・コモンズライセンスの音楽を使用する場合は、ライセンス条件を確認してください
- 商用利用が可能な音楽を選んでください

## 推奨音源サイト

- Freesound.org
- Zapsplat（無料アカウント）
- YouTube Audio Library（ダウンロード可能な楽曲）
- 甘茶の音楽工房
- DOVA-SYNDROME

## BGMの追加方法

新しいBGMを追加する場合は、`src/components/BGMController.js`の以下の部分を編集してください：

```javascript
// デフォルトのBGMトラックを登録
bgmPlayer.addTrack('新しいトラック名', '/audio/bgm/新しいファイル名.mp3');
```

そして、selectオプションにも追加：

```javascript
<option value="新しいトラック名">表示名</option>
```