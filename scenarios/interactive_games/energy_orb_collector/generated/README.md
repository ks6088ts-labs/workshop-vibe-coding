# Energy Orb Collector (MVP)

Three.js を用いた 90 秒間収集型ミニゲーム。`spec.md` 仕様の MVP 実装。

## 構成

```text
index.html   : エントリ / UI コンテナ
styles.css   : レイアウト / HUD
main.js      : 初期化 & ループ
scene.js     : シーン / カメラ / 環境
input.js     : キーボード入力
player.js    : プレイヤー制御
collectibles.js : オーブ生成 / 取得処理
gameState.js : ステート & タイマー / スコア
ui.js        : DOM UI 更新
config.js    : 定数
```

## 起動

ブラウザで `index.html` を直接開くだけで動作 (ローカルファイル OK)。
Chrome のセキュリティでモジュール読み込み不可な場合は簡易 HTTP サーバを使用:

```bash
python3 -m http.server 8000
# => http://localhost:8000/scenarios/interactive_game/generated/
```

URL パラメータ `?time=60` で制限時間変更可能。

## 仕様対応状況 (抜粋)

- プレイヤー移動 (WASD/矢印)
- マウスドラッグ: カメラをプレイヤー周囲に回転 (オービット)
- オーブ生成 / ランダム再配置 / スコア加算
- 制限時間 (デフォルト 90 秒) & HUD 表示
- 残 10 秒でタイマー点滅
- 難易度スケール: 経過時間で最大オーブ数 8→10→12
- 結果画面: スコア / 平均取得数 / ハイスコア (localStorage)
- リトライフロー (TITLE→COUNTDOWN→PLAYING→RESULT)

## 拡張用 TODO

- コンボスコア (gameState.addScore 内にフック)
- 取得演出 (アニメ / フェード) 現状: 即消滅 + パルススケール
- レアオーブ / ブーストアイテム
- ゲームパッド入力 / モバイルタッチ
- オーディオ (SE / BGM)

## ライセンス

MIT (リポジトリ準拠)
