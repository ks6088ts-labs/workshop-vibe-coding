# workshop-vibe-coding

GitHub Copilot の AI 駆動開発（vibe coding）を体験するための包括的なワークショップです。仕様駆動開発、エンドツーエンドテスト、インタラクティブなアプリケーション開発など、様々なシナリオを通じて GitHub Copilot の活用方法を学習できます。

## 🎯 プロジェクトの目的

このワークショップは以下の学習目標を達成することを目的としています：

- **GitHub Copilot の活用法習得**: AI ペアプログラミングによる効率的な開発手法
- **仕様駆動開発の実践**: 要求から仕様書作成、実装、テストまでの一連の流れ
- **モダン開発手法の体験**: MCP（Model Context Protocol）、E2E テスト自動化など
- **実践的なアプリケーション開発**: Web アプリ、ゲーム、デザインシステムの実装

## 📋 前提条件

このワークショップを始める前に、以下の環境とツールが必要です：

### 必須要件

- **Visual Studio Code**: 最新版（[ダウンロード](https://code.visualstudio.com/)）
- **GitHub Copilot**: 有効なサブスクリプション（[詳細](https://github.com/features/copilot)）
- **Node.js**: v18 以上（[ダウンロード](https://nodejs.org/)）
- **Python**: v3.8 以上（[ダウンロード](https://www.python.org/)）
- **Git**: 最新版（[ダウンロード](https://git-scm.com/)）

### VS Code 拡張機能

以下の拡張機能をインストールしてください：

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### 推奨ツール

- **ブラウザ**: Chrome または Edge（開発者ツール使用のため）
- **ターミナル**: Git Bash、PowerShell、または任意のターミナル

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/ks6088ts-labs/workshop-vibe-coding.git
cd workshop-vibe-coding
```

### 2. VS Code でプロジェクトを開く

```bash
code .
```

### 3. GitHub Copilot の設定確認

1. VS Code で `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）を押す
2. "GitHub Copilot: Sign In" を実行
3. ブラウザでGitHubアカウントにサインイン
4. VS Code でサインインが完了していることを確認

### 4. 動作確認

以下のコマンドでPythonとNode.jsが正しくインストールされていることを確認：

```bash
python --version  # Python 3.8+ が表示されること
node --version    # Node.js v18+ が表示されること
npm --version     # npm が正しく動作すること
```

## 📚 学習シナリオ

以下のシナリオを順番に進めることで、GitHub Copilot を活用した開発手法を段階的に習得できます：

| シナリオ | 学習目標 | 難易度 | 所要時間 | YouTube |
|---------|---------|-------|---------|---------|
| [Simple Website](./scenarios/simple_website/README.md) | **基本的なvibe coding体験**<br>HTML、CSS、JavaScriptで水分摂取管理アプリを作成し、GitHub Copilot の基本的な使い方を学習 | ⭐⭐☆☆☆ | 30分 | [simple_website](https://youtu.be/VTVZ-3kbiZI) |
| [Spec Driven Flow](./scenarios/spec_driven_flows/README.md) | **仕様駆動開発の実践**<br>要求仕様から仕様書作成、コード生成までの一連の仕様駆動型アプローチを学習 | ⭐⭐⭐☆☆ | 60分 | [spec_driven_flows](https://youtu.be/Fcdfc1tF_zw) |
| [E2E Testing](./scenarios/e2e_test/README.md) | **テスト自動化の実践**<br>Playwright MCP を活用したエンドツーエンドテストの自動生成と実行方法を学習 | ⭐⭐⭐⭐☆ | 45分 | [playwright-tester](https://youtu.be/4XPozcmbL84), [playwright-explore](https://youtu.be/M25aaShYcRI) |
| [Interactive Games](./scenarios/interactive_games/README.md) | **ゲーム開発の実践**<br>仕様書ベースでインタラクティブなゲーム（エネルギーオーブ収集、テトリス）を実装 | ⭐⭐⭐☆☆ | 90分 | [energy_orb_collector](https://www.youtube.com/shorts/VgG_1tvWDvY), [tetris](https://www.youtube.com/shorts/xOtc0482w7g) |
| [Design System](./scenarios/design_system/README.md) | **MCP活用開発**<br>Material UI MCP を活用してデザインシステムに基づいたアプリケーションを実装 | ⭐⭐⭐⭐☆ | 75分 | [design_system](https://youtu.be/AXKlBduH5hU) |

### 推奨学習パス

1. **初心者向け**: Simple Website → Spec Driven Flow → Interactive Games
2. **中級者向け**: Spec Driven Flow → E2E Testing → Design System
3. **上級者向け**: 全シナリオを順番に実践

## 📁 プロジェクト構成

```
workshop-vibe-coding/
├── scenarios/                     # 各学習シナリオ
│   ├── simple_website/           # 基本的なWebアプリ開発
│   ├── spec_driven_flows/        # 仕様駆動開発
│   ├── e2e_test/                 # E2Eテスト自動化
│   ├── interactive_games/        # ゲーム開発
│   └── design_system/            # デザインシステム活用
├── spec/                         # 仕様書ファイル
├── .vscode/                      # VS Code設定
│   └── mcp.json                  # MCP サーバー設定
├── .github/                      # GitHub Actions設定
└── README.md                     # このファイル
```

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### GitHub Copilot が動作しない
- VS Code で GitHub Copilot にサインインしているか確認
- 有効なGitHub Copilot サブスクリプションがあるか確認
- VS Code を再起動してみる

#### Live Server が動作しない
- Live Server 拡張機能がインストールされているか確認
- HTMLファイルを右クリック → "Open with Live Server" を選択

#### Python/Node.js コマンドが見つからない
- 環境変数PATHにPython/Node.jsのパスが含まれているか確認
- コマンドプロンプト/ターミナルを再起動してみる

#### MCP サーバーが動作しない
- `.vscode/mcp.json` の設定が正しいか確認
- 必要な依存関係がインストールされているか確認

## 🤝 貢献ガイドライン

このプロジェクトへの貢献を歓迎します！

### 貢献方法

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/new-scenario`)
3. 変更をコミット (`git commit -am 'Add new scenario'`)
4. ブランチにプッシュ (`git push origin feature/new-scenario`)
5. プルリクエストを作成

### 貢献できる内容

- 新しい学習シナリオの追加
- 既存シナリオの改善
- ドキュメントの更新・翻訳
- バグ修正

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🔗 関連リンク

- [GitHub Copilot 公式ドキュメント](https://docs.github.com/en/copilot)
- [🤖 Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
- [Agent Mode in Action: AI Coding with Vibe and Spec-Driven Flows | BRK102](https://build.microsoft.com/en-US/sessions/BRK102?source=sessions) ([YouTube](https://www.youtube.com/watch?v=1DlNVROQ6DI))

---

**🚀 さあ、GitHub Copilot を使った AI 駆動開発の世界を探索してみましょう！**
