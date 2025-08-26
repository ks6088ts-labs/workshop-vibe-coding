# 家族向けレストラン注文システム E2E テスト

このディレクトリには、家族向けレストラン注文システムのフロントエンド Web アプリケーション用の End-to-End（E2E）テストが含まれています。

## 概要

本テストスイートは、仕様書 `spec-process-family-restaurant-ordering-frontend.md` に基づいて作成されており、以下の主要要件をテストします：

### テスト対象の要件

- **REQ-001**: QR スキャンでテーブルに紐づく注文画面が開くこと
- **REQ-002**: カテゴリ別メニュー一覧を閲覧できること（検索・フィルタ機能含む）
- **REQ-003**: メニュー詳細に画像、価格、説明、アレルギー情報、オプションが含まれること
- **REQ-004**: カートへ追加・数量変更・削除ができること
- **REQ-005**: 注文確定を行うと、認証済みセッションで注文が API へ送信されること
- **REQ-006**: 顧客は追加注文ができること
- **REQ-007**: 会計リクエストを顧客が送れること
- **REQ-008**: 従業員は新規注文の通知を受け取り、注文詳細を閲覧・ステータス変更ができること

### 品質要件

- **PERF-001**: 初期ページロード時間が 2 秒以内
- **UX-001**: 高齢者・子供でも操作しやすい UI（大きめのタップターゲット）
- **UX-002**: 多言語対応（日本語、英語、中国語）
- **COMP-001**: Chrome/Safari（モバイル）での動作確認

## ファイル構成

```
scenarios/e2e_test/generated/
├── requirements.txt          # Python依存関係
├── pyproject.toml           # pytest設定
├── conftest.py              # テスト共通設定とPage Objectモデル
├── run_tests.sh             # テスト実行スクリプト
├── tests/
│   ├── __init__.py
│   └── test_restaurant_ordering_e2e.py  # メインE2Eテスト
└── README.md                # このファイル
```

## セットアップと実行

### 前提条件

1. Python 3.8 以上がインストールされていること
2. テスト対象の Web アプリケーションが `http://127.0.0.1:5500/scenarios/spec_driven_flows/generated/` で動作していること

### クイックスタート

1. **自動実行スクリプトを使用する場合：**

   ```bash
   cd scenarios/e2e_test/generated
   ./run_tests.sh
   ```

2. **手動実行の場合：**

   ```bash
   cd scenarios/e2e_test/generated

   # 仮想環境作成とアクティベート
   python3 -m venv venv
   source venv/bin/activate

   # 依存関係インストール
   pip install -r requirements.txt

   # Playwrightブラウザインストール
   python -m playwright install chromium

   # テスト実行
   python -m pytest tests/ -v
   ```

### テスト実行オプション

```bash
# 全テスト実行
python -m pytest tests/ -v

# スモークテストのみ実行
python -m pytest tests/ -m smoke -v

# E2Eテストのみ実行
python -m pytest tests/ -m e2e -v

# 統合テストのみ実行
python -m pytest tests/ -m integration -v

# 特定のテストクラス実行
python -m pytest tests/test_restaurant_ordering_e2e.py::TestTableSessionSetup -v

# ヘッドレスモード無効（ブラウザ表示）でデバッグ実行
python -m pytest tests/ -v --headed

# 失敗時にスクリーンショット保存
python -m pytest tests/ -v --screenshot=on
```

## テストアーキテクチャ

### Page Object Model

本テストスイートは、Page Object Model パターンを採用しており、以下のページクラスが実装されています：

- `TableSessionPage`: テーブルセッション開始ページ
- `MenuPage`: メニュー一覧ページ
- `MenuDetailDialog`: メニュー詳細ダイアログ
- `CartDialog`: カートダイアログ
- `EmployeePage`: 従業員管理ページ

### テストカテゴリ

テストは以下のマーカーで分類されています：

- `@pytest.mark.smoke`: 基本的な動作確認テスト
- `@pytest.mark.e2e`: エンドツーエンドテスト
- `@pytest.mark.integration`: 統合テスト

## テストケース詳細

### 主要テストクラス

1. **TestTableSessionSetup**: テーブルセッション開始機能
2. **TestMenuBrowsing**: メニュー閲覧・フィルタリング機能
3. **TestMenuDetails**: メニュー詳細表示機能
4. **TestCartOperations**: カート操作機能
5. **TestOrderPlacement**: 注文確定機能
6. **TestCheckoutRequest**: 会計リクエスト機能
7. **TestEmployeeOrderManagement**: 従業員注文管理機能
8. **TestMultiLanguageSupport**: 多言語対応機能
9. **TestMobileResponsiveness**: モバイル対応機能
10. **TestPerformance**: パフォーマンステスト
11. **TestEndToEndUserFlow**: 完全ユーザーフロー統合テスト

### 受入基準（Acceptance Criteria）マッピング

各テストは仕様書の受入基準に対応しています：

- `test_qr_scan_simulation_table_session_start` → AC-001
- `test_category_filtering` → AC-002
- `test_menu_item_details_display` → AC-003
- `test_add_item_to_cart` → AC-004
- `test_place_order` → AC-005
- `test_employee_order_management` → AC-006
- `test_checkout_request` → AC-007

## 設定のカスタマイズ

### ベース URL 変更

デフォルトのテスト対象 URL を変更する場合は、`conftest.py`の`base_url`フィクスチャを修正してください：

```python
@pytest.fixture(scope="session")
def base_url() -> str:
    return "http://localhost:3000"  # 変更例
```

### ブラウザ設定

モバイルビューポートサイズや User-Agent を変更する場合は、`conftest.py`の`context`フィクスチャを修正してください。

### タイムアウト設定

Playwright のデフォルトタイムアウトを変更する場合は、`conftest.py`に以下を追加：

```python
@pytest.fixture(scope="function")
def page(context: BrowserContext) -> Page:
    page = context.new_page()
    page.set_default_timeout(10000)  # 10秒
    return page
```

## トラブルシューティング

### よくある問題

1. **Web アプリケーションが起動していない**

   - `http://127.0.0.1:5500/scenarios/spec_driven_flows/generated/` にアクセスできることを確認
   - Live Server などの開発サーバーが起動していることを確認

2. **要素が見つからないエラー**

   - Web アプリケーションの実装とテストコードのセレクタが一致しているか確認
   - 動的コンテンツの場合は適切な待機処理を追加

3. **パフォーマンステストの失敗**
   - ネットワーク環境やマシンスペックを確認
   - `test_initial_page_load_performance`の閾値を調整

### ログとデバッグ

詳細なログを出力する場合：

```bash
python -m pytest tests/ -v -s --log-cli-level=DEBUG
```

失敗時のスクリーンショットを保存する場合：

```bash
python -m pytest tests/ --screenshot=only-on-failure
```

## 継続的インテグレーション

このテストスイートは GitHub Actions での自動実行に対応しています。`.github/workflows/`ディレクトリにワークフローファイルを配置することで、プルリクエスト時やマージ時の自動テスト実行が可能です。

```yaml
# .github/workflows/e2e-tests.yml の例
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: "3.9"
      - name: Install dependencies
        run: |
          cd scenarios/e2e_test/generated
          pip install -r requirements.txt
          python -m playwright install chromium
      - name: Run E2E tests
        run: |
          cd scenarios/e2e_test/generated
          python -m pytest tests/ -m e2e
```

## 貢献

テストケースの追加や改善については、以下のガイドラインに従ってください：

1. 新しい要件に対しては対応するテストケースを追加
2. Page Object パターンに従ってページクラスを拡張
3. 適切なテストマーカーを設定
4. 仕様書の受入基準との対応を明記

## ライセンス

このテストコードは、プロジェクトのメインライセンスに従います。
