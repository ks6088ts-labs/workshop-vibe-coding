# Spec Driven Flow フロントエンド (Generated)

本ディレクトリは `spec/spec-process-family-restaurant-ordering-frontend.md` の要件 (REQ/AC/SEC/PERF/UX など) を元にした学習/デモ用途のフロントエンド実装サンプルです。バックエンドは未接続であり、モック API と擬似リアルタイムイベントで挙動を再現します。

## 構成

- `index.html` ルート HTML。モード切替 (顧客 / 従業員) は右上トグル。
- `styles.css` モバイルファースト + ダーク/ライト対応変数。
- `app.js` エントリ。状態管理、モック API、UI コンポーネント初期化。
- `mock-data.js` 初期メニュー/カテゴリ/翻訳辞書。
- `i18n.js` 簡易 i18n ランタイム。

## 主な要件マッピング (抜粋)

| Requirement | 実装ノート |
|-------------|------------|
| REQ-001 | QR スキャンはテーブル ID 入力 + 開始ボタンで代替。セッショントークン擬似発行。 |
| REQ-002 | カテゴリフィルタ, 検索インプット, メニューカード。 |
| REQ-003 | メニューカード/モーダルに画像, 説明, アレルギー, オプション (サイズ/追加トッピング例)。 |
| REQ-004 | カートドロワー: 追加/数量変更/削除/オプション反映。合計計算。 |
| REQ-005 | "注文確定" でモック API -> order.created イベントをスタッフ側へブロードキャスト。応答 1 秒以内 (setTimeout で <300ms)。 |
| REQ-006 | セッション継続中に追加注文可 (カートをクリアし再度確定で order.created)。 |
| REQ-007 | 会計リクエストボタン -> session.checkoutRequested イベント。 |
| REQ-008 | スタッフビュー: リアルタイム(擬似)で注文リスト更新, ステータス変更ボタン -> order.updated。 |
| REQ-009 / SEC-001 | セッショントークン (localStorage) 無い操作は警告トースト & ブロック。 |
| SEC-002 | 入力バリデーション (テーブル ID / quantity / options) と簡易 rate limit (連打ガード) を一部実装。 |
| UX-001 | 大きめボタン, コントラスト, focus outline, キーボード操作, aria 属性。 |
| UX-002 | ヘッダー言語選択 (ja/en/zh)。 |
| PERF-001 | クリティカル CSS を1ファイル。遅延不要な最小 JS。画像はサンプル (data URL)。 |
| PERF-002 | モック API 応答を短時間化。 |

## 起動

任意の静的サーバで `index.html` を開くだけ:

```bash
cd scenarios/spec_driven_flows/generated
python -m http.server 8888
# -> http://localhost:8888
```

## モード説明

- 顧客モード: テーブル ID でセッション開始 → メニュー選択 → カート → 注文確定 / 会計リクエスト。
- スタッフモード: 右上トグル。リアルタイム欄に注文が流入。ステータス変更で UI 更新。

## 今後の拡張候補

- 本物の WebSocket / SSE 置換
- MSW 導入とテストスイート追加
- Lighthouse 自動計測ワークフロー
- React/TypeScript 実装への発展

## ライセンス

リポジトリルートの `LICENSE` に従います。
