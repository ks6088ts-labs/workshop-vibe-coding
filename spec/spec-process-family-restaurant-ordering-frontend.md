---
title: 家族向けレストラン オーダーシステム（フロントエンド）仕様
version: 1.0
date_created: 2025-08-26
last_updated: 2025-08-26
owner: Frontend/Product Team
tags: [process, design, app, frontend]
---

# Introduction

本仕様は、ファミリーレストラン向けテーブル注文フロントエンドウェブアプリ（以降「本システム」）の要件定義を、開発チームおよび自動生成 AI が実装・テスト可能な形式で記述したものです。目的は、TDD（テスト駆動開発）や自動テスト作成の出発点となる明確で機械可読な仕様を提供することです。

## 1. Purpose & Scope

目的: 席からのセルフ注文体験を提供し、従業員側で注文確認・ステータス管理をできること。

適用範囲:

- 顧客向けブラウザベースの注文 UI（モバイルファースト）
- 従業員向け注文管理画面（ブラウザ）
- API とリアルタイム通知を通じた注文データの送受信

想定読者: フロントエンド開発者、テスター、プロダクトオーナー、AI コード生成エージェント

前提:

- バックエンドは認証済み API を提供する（エンドポイントは本仕様でコントラクトを定義）
- モバイルブラウザ（Chrome/Safari）を主ターゲットとする

## 2. Definitions

- QR: Quick Response code。テーブル ID を含む URL を利用する想定。
- テーブルセッション: QR スキャンで生成される、テーブルに紐づく一時的なセッション（認証トークンを含む）。
- カート: 顧客が選択したメニュー項目の集合。オプションや数量を含む。
- 注文ステータス: draft, placed, in_kitchen, ready, served, cancelled など。

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: QR スキャンでテーブルに紐づく注文画面が開くこと（テーブル ID が読み込まれ、対応するセッションが開始される）。
- **REQ-002**: カテゴリ別メニュー一覧を閲覧できること。検索・フィルタが可能であること。
- **REQ-003**: メニュー詳細に画像、価格、説明、アレルギー情報、オプションが含まれること。
- **REQ-004**: カートへ追加・数量変更・削除ができること。オプション選択が反映されること。
- **REQ-005**: 注文確定を行うと、認証済みセッションで注文が API へ送信され、従業員側に通知されること。
- **REQ-006**: 顧客は追加注文ができる（既存のテーブルセッションを用いる）。
- **REQ-007**: 会計リクエストを顧客が送れること（従業員に通知される）。
- **REQ-008**: 従業員は新規注文の通知を受け取り、テーブル毎の注文詳細を閲覧・ステータス変更・厨房送信ができること。
- **REQ-009**: 注文データは認証されたセッションのみアクセス可能であること（SEC-001 と整合）。

セキュリティ要件:

- **SEC-001**: テーブルセッション及び注文 API は認証（短期トークンまたは JWT）で保護すること。
- **SEC-002**: 不正 API リクエストを防ぐために CSRF 対策、入力バリデーション、レート制限の実装を想定すること。

パフォーマンス要件:

- **PERF-001**: 初期ページロード: 2 秒以内（モバイル回線想定）。
- **PERF-002**: 注文確定 API 応答（クライアント観点）: 1 秒以内を目標とする。

ユーザビリティ / アクセシビリティ:

- **UX-001**: UI は高齢者・子供でも操作しやすい（大きめのタップターゲット、明瞭なラベル、簡易モード）
- **UX-002**: 多言語対応（日本語、英語、中国語）をサポートすること（i18n 設計）

互換性:

- **COMP-001**: Chrome / Safari（モバイル）で表示・操作可能であること。

ガイドライン:

- **GUD-001**: フロントエンドはコンポーネント志向（例: React + TypeScript を推奨）で実装すること。ただし実装ライブラリはプロジェクトで決定する。

## 4. Interfaces & Data Contracts

概略: API は REST（注文作成等）と WebSocket または Server-Sent Events (SSE) によるリアルタイム通知を想定。

### 認証

- クライアントは QR で受け取ったテーブル用の短期トークンを用いて API を呼ぶ。

### REST エンドポイント（例）

- POST /api/sessions/scan

  - 入力: { "tableId": "T1" }

  - 出力: { "sessionToken": "...", "tableId": "T1", "expiresAt": "..." }

- GET /api/menus?category=...&q=...

  - 出力: [ { "id","name","price","description","imageUrl","allergies":[],"options": [...] } ]

- POST /api/sessions/{sessionId}/cart

  - 入力: { "items": [ {"menuId","options","quantity"} ] }

  - 出力: カートの現在状態

- POST /api/sessions/{sessionId}/orders

  - 入力: { "cartId","notes" }

  - 出力: { "orderId","status","placedAt" }

- POST /api/sessions/{sessionId}/request-checkout

  - 入力: { "notes" }

  - 出力: { "requestId","status" }

### リアルタイム通知（WebSocket/SSE）イベント（従業員側購読）

- event: order.created -> payload: { orderId, tableId, summary }

- event: order.updated -> payload: { orderId, status }

- event: session.checkoutRequested -> payload: { tableId, requestId }

### データモデル例（JSON スキーマ抜粋）

```json
{
  "Order": {
    "orderId": "string",
    "tableId": "string",
    "items": [
      {
        "menuId": "string",
        "name": "string",
        "options": {},
        "quantity": 1,
        "price": 1000
      }
    ],
    "total": 1200,
    "status": "placed"
  }
}
```

認証/セッション契約:

- クライアントはすべての注文操作でセッショントークンを HTTP ヘッダ（Authorization: Bearer ...）で送る。

## 5. Acceptance Criteria

- **AC-001**: Given 顧客が QR をスキャンしたとき、When テーブル ID のセッションを取得すると、Then 顧客は該当テーブルの注文画面へ移動しセッションが開始される。
- **AC-002**: Given カテゴリ選択、When カテゴリを選ぶと、Then 該当するメニュー一覧が表示される（ページネーションまたは無限スクロールで負荷対策）。
- **AC-003**: Given メニュー詳細画面、When アレルギー情報が存在すると、Then 明確に表示され警告アイコンが表示される。
- **AC-004**: Given カート操作、When 商品を追加・数量変更・削除すると、Then カートの合計と明細が正しく更新される。
- **AC-005**: Given 注文確定、When 顧客が確定操作を行うと、Then 注文は API に登録され、従業員側にリアルタイム通知が送信される。API 応答は 1 秒以内で成功もしくはエラーを返す。
- **AC-006**: Given 従業員が注文管理画面を開く、When 新規注文が入ると、Then リアルタイムで画面に通知が表示され、注文詳細へドリルダウンできる。
- **AC-007**: Given 会計リクエスト、When 顧客が会計をリクエストすると、Then 従業員は注文管理側でその旨を確認できる。
- **AC-008**: Given 不正トークン、When API 呼び出しが行われると、Then 403/401 が返されアクセスが拒否される。

## 6. Test Automation Strategy

- Test Levels: Unit (コンポーネント), Integration (API スタブ/モック), End-to-End (Cypress によるユーザーフロー)
- Frameworks: React Testing Library + Jest（ユニット/統合）、Cypress（E2E）、MSW (Mock Service Worker) を API モックに利用
- CI: GitHub Actions でプルリクエスト時にユニットと E2E（簡易）を実行。E2E はフルパスで nightly またはマージ時に実行。
- Coverage Requirements: フロントエンド主要ロジックで 70% 以上（推奨）。
- Test Data Management: テスト用フィクスチャと Factory を用意し、E2E ではテスト用バックエンド環境かモックを利用する。
- Performance Testing: Lighthouse スクリプトで初期ロードと主要画面のパフォーマンスを定期検査。

## 7. Rationale & Context

- モバイルファースト設計は来店時の利用環境を想定したもの。QR ベースのセッションはテーブル間の分離と簡易導線を両立するため採用。
- リアルタイムは注文処理業務の効率化のため必須。SSE/WS は導入コストと運用性で選定可能。

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: バックエンド注文 API - 認証付き REST API とリアルタイム通知を提供すること。

### Third-Party Services

- **SVC-001**: CDN/画像配信 - メニュー画像の高速配信
- **SVC-002**: 翻訳管理（i18n）サービス（任意）

### Infrastructure Dependencies

- **INF-001**: HTTPS 経由で配信される静的ホスティング（例: S3+CloudFront / static web host）

### Data Dependencies

- **DAT-001**: メニュー／アレルギーデータはバックエンドで正規化され、API で提供されること

### Technology Platform Dependencies

- **PLT-001**: モダンブラウザを想定（ES2020 相当の JS サポート）

### Compliance Dependencies

- **COM-001**: 個人情報を扱う場合はプライバシー法規（例: 個人情報保護法）に準拠

## 9. Examples & Edge Cases

- QR が無効または期限切れ:
  - 顧客は再スキャンを促される。既存セッションが残っている場合は再接続を試みる。
- 同一テーブルで複数端末からの同時注文:
  - カートにはローカルの楽観更新を行い、注文確定時にサーバ側のコンフリクト解決を行う（例: 最終合計の再確認と差額提示）。
- オプション選択で互いに排他な選択肢がある場合:
  - UI でラジオボタンを用い排他を保証する。

コード/データ例（注文送信ペイロード）:

```json
{
  "sessionToken": "...",
  "cart": {
    "items": [{ "menuId": "m-001", "quantity": 2, "options": { "size": "L" } }],
    "notes": "アレルギー: エビ不可"
  }
}
```

## 10. Validation Criteria

- すべての **REQ-\*** は少なくとも 1 つの自動化可能な受入テスト（AC-\*\*\*）を持つこと。
- CI でユニットテストが成功し、E2E のハッピーパスがグリーンであること（マージ条件）。
- パフォーマンスチェック（Lighthouse）が規定閾値を満たすこと（初期ロード <= 2s を想定）。

### 10.1 要件と受入基準のマッピング

以下は本仕様内で定義した要件（REQ-**_）と、対応する受入基準（AC-_**）の明確なマッピングです。自動テスト生成やトレーサビリティに利用してください。

- REQ-001 -> AC-001
- REQ-002 -> AC-002
- REQ-003 -> AC-003
- REQ-004 -> AC-004
- REQ-005 -> AC-005
- REQ-006 -> AC-005
- REQ-007 -> AC-007
- REQ-008 -> AC-006
- REQ-009 -> AC-008 (SEC-001 と整合)

### 10.2 機械可読スキーマ（JSON Schema）

以下の JSON Schema は、API 契約とフロントエンドの型定義生成（例: TypeScript 型）に直接利用できることを意図しています。必要に応じてスキーマ名と $id を調整してください。

#### Order schema

```json
{
  "$id": "https://example.com/schemas/order.json",
  "type": "object",
  "required": ["orderId", "tableId", "items", "total", "status"],
  "properties": {
    "orderId": { "type": "string" },
    "tableId": { "type": "string" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["menuId", "quantity", "price"],
        "properties": {
          "menuId": { "type": "string" },
          "name": { "type": "string" },
          "options": { "type": "object" },
          "quantity": { "type": "integer", "minimum": 1 },
          "price": { "type": "integer", "minimum": 0 }
        }
      }
    },
    "total": { "type": "integer", "minimum": 0 },
    "status": {
      "type": "string",
      "enum": ["draft", "placed", "in_kitchen", "ready", "served", "cancelled"]
    },
    "placedAt": { "type": ["string", "null"], "format": "date-time" }
  }
}
```

#### MenuItem schema

```json
{
  "$id": "https://example.com/schemas/menu-item.json",
  "type": "object",
  "required": ["id", "name", "price"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "price": { "type": "integer", "minimum": 0 },
    "imageUrl": { "type": "string", "format": "uri" },
    "allergies": { "type": "array", "items": { "type": "string" } },
    "options": { "type": "array", "items": { "type": "object" } }
  }
}
```

#### Session schema

```json
{
  "$id": "https://example.com/schemas/session.json",
  "type": "object",
  "required": ["sessionToken", "tableId", "expiresAt"],
  "properties": {
    "sessionToken": { "type": "string" },
    "tableId": { "type": "string" },
    "expiresAt": { "type": "string", "format": "date-time" }
  }
}
```

### 10.3 検証チェックリスト（品質ゲート）

- ビルド/レンダリング: Markdown がレンダリング可能で、CI のドキュメント生成ジョブ（ある場合）を通過すること。
- スキーマ整合性: JSON Schema はスキーマバリデータで検証可能であること（例: ajv）。
- テストカバレッジ: 上記の各 REQ に対して少なくとも 1 つの自動テスト（AC）を関連付け、CI で実行されること。

## 11. Related Specifications / Further Reading

- 店舗運用フロー仕様（未作成）
- バックエンド API 契約書（別途参照）

```

```
