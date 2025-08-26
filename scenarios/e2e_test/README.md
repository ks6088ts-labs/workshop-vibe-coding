# E2E テストシナリオ

[Playwright MCP](https://github.com/microsoft/playwright-mcp) を活用して、[Spec Driven Flow シナリオ](../spec_driven_flows/README.md)で実施したウェブフロントエンドの E2E テストコードを自動生成します。

## 手順

1. [Spec Driven Flow シナリオ](../spec_driven_flows/README.md)で生成したフロントエンドをローカルで起動します。(Live Server など)
2. Playwright MCP を起動します
3. [仕様書](../../spec/spec-process-family-restaurant-ordering-frontend.md)を読み込ませます
4. 以下のプロンプトを GitHub Copilot の playwright-tester モードで実行してください。

```text
#file:spec-process-family-restaurant-ordering-frontend.md の要求仕様を元に作られた以下で動作しているフロントエンドウェブアプリの E2E テストコードを Python で作成してください。
http://127.0.0.1:5500/scenarios/spec_driven_flows/generated/
作成したコードは scenarios/e2e_test/generated 以下のディレクトリに格納してください。
```

**実行ログの抜粋**

````text
最後に、作成されたファイルの一覧を確認しましょう。 完璧です！家族向けレストラン注文システムの E2E テストコードを作成しました。

## 作成した E2E テストの概要

### 🎯 主な成果

1. **完全な E2E テストスイート**: 仕様書の全要件をカバーするテストコード
2. **Page Object Model**: 保守性の高いテスト構造
3. **包括的なテストカバレッジ**: 機能、パフォーマンス、ユーザビリティテスト
4. **CI/CD 対応**: GitHub Actions 用ワークフロー
5. **詳細なドキュメント**: README と実行手順

### 📁 作成されたファイル構成

\```
scenarios/e2e_test/generated/
├── requirements.txt                          # Python依存関係
├── pyproject.toml                           # pytest設定
├── conftest.py                              # テスト共通設定とPage Objects
├── pytest_plugins.py                       # Playwright設定
├── run_tests.sh                             # テスト実行スクリプト
├── README.md                                # 詳細ドキュメント
├── .github-workflows-e2e-tests.yml         # GitHub Actions設定
└── tests/
    ├── __init__.py
    └── test_restaurant_ordering_e2e.py      # メインE2Eテスト
\```

### 🧪 テスト対象機能

仕様書の以下の要件に対応したテストを作成：

- **REQ-001**: QR スキャン → テーブルセッション開始
- **REQ-002**: カテゴリ別メニュー閲覧・フィルタリング
- **REQ-003**: メニュー詳細（画像、価格、アレルギー情報、オプション）
- **REQ-004**: カート操作（追加、数量変更、削除）
- **REQ-005**: 注文確定と API 送信
- **REQ-006**: 追加注文機能
- **REQ-007**: 会計リクエスト
- **REQ-008**: 従業員注文管理画面
- **品質要件**: パフォーマンス、モバイル対応、多言語対応

### 🏗️ テストアーキテクチャの特徴

1. **Page Object Pattern**: 各画面を独立したクラスで管理
2. **モバイルファースト**: iPhone SE サイズでのテスト実行
3. **マーカーベース分類**: smoke、e2e、integration テストの分離
4. **エラーハンドリング**: 失敗時のスクリーンショット自動保存
5. **CI/CD 準備**: GitHub Actions 用ワークフロー含

### 🚀 実行方法

1. **クイックスタート**:

   \```bash
   cd scenarios/e2e_test/generated
   ./run_tests.sh
   \```

2. **個別実行**:

   \```bash
   # スモークテストのみ
   python -m pytest tests/ -m smoke -v

   # 全E2Eテスト
   python -m pytest tests/ -m e2e -v

   # 統合テスト
   python -m pytest tests/ -m integration -v
   \```

### 🔍 実際の Web アプリ探索結果に基づく実装

テストコードは、実際に以下の機能を探索して確認した内容に基づいて作成されています：

1. ✅ テーブル ID 入力によるセッション開始
2. ✅ カテゴリフィルタ（All、Food、Drink）
3. ✅ メニューアイテム（Pizza、Salad、Coffee、Juice）
4. ✅ メニュー詳細ダイアログ（サイズ選択、数量、アレルギー情報）
5. ✅ カート機能（追加、合計表示、注文確定）
6. ✅ 従業員モード（注文管理、ステータス変更）
7. ✅ 多言語切り替え（日本語、英語、中国語）

この E2E テストスイートにより、レストラン注文システムの品質を継続的に保証し、回帰テストの自動化が可能になります。
````

# 参考文献

- [🤖 Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
  - [chatmodes/playwright-tester.chatmode.md](https://github.com/github/awesome-copilot/blob/main/chatmodes/playwright-tester.chatmode.md)
  - [instructions/playwright-python.instructions.md](https://github.com/github/awesome-copilot/blob/main/instructions/playwright-python.instructions.md)
  - [instructions/playwright-typescript.instructions.md](https://github.com/github/awesome-copilot/blob/main/instructions/playwright-typescript.instructions.md)
  - [prompts/playwright-automation-fill-in-form.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/playwright-automation-fill-in-form.prompt.md)
  - [prompts/playwright-explore-website.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/playwright-explore-website.prompt.md)
  - [prompts/playwright-generate-test.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/playwright-generate-test.prompt.md)
