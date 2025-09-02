# Design System シナリオ

## 🎯 学習目標

このシナリオでは、MCP（Model Context Protocol）を活用したデザインシステム駆動開発を実践します：

- **MCP の理解と活用**：Material UI MCP サーバーとの連携
- **デザインシステム駆動開発**：一貫したデザイン原則に基づく実装
- **モダンフロントエンド技術**：React + TypeScript + Vite + Material UI
- **GitHub Copilot との高度な連携**：外部知識ソースとの統合

## 📋 前提条件

- [Spec Driven Flow シナリオ](../spec_driven_flows/README.md) の完了（推奨）
- Node.js v18+ がインストールされている
- React の基本的な理解
- TypeScript の基本的な理解

## 🛠️ 使用技術スタック

- **React**: UIライブラリ
- **TypeScript**: 型安全なJavaScript
- **Vite**: 高速ビルドツール
- **Material UI**: デザインシステム
- **MCP (Model Context Protocol)**: 外部知識ソースとの連携

## 🚀 セットアップ手順

### ステップ 1: ベースプロジェクトの準備

#### Material UI サンプルプロジェクトのクローン

```bash
# Material UI リポジトリをクローン
git clone https://github.com/mui/material-ui.git

# Vite + TypeScript サンプルに移動
cd material-ui/examples/material-ui-vite-ts

# 依存関係をインストール
npm install

# 開発サーバーを起動して動作確認
npm run dev
# ブラウザで http://localhost:5173 にアクセス
```

### ステップ 2: MCP サーバーの設定

#### Material UI MCP の追加

1. `.vscode/mcp.json` ファイルを確認・編集：

```json
{
  "servers": {
    "mui-mcp": {
      "command": "npx",
      "args": ["@mui/mcp-server"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

2. VS Code を再起動して MCP サーバーを有効化

#### MCP 接続の確認

VS Code で GitHub Copilot Chat を開き、以下のテストプロンプトを実行：

```text
Material UI の Button コンポーネントの使用方法を教えてください。

---

## Use the mui-mcp server to answer any MUI questions --

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question
```

### ステップ 3: プロジェクトのカスタマイズ

#### Microsoft To Do 風アプリの実装

MCP サーバーとの連携を確認できたら、以下のプロンプトで本格的なアプリケーションを実装します：

```text
Material UI のデザインシステムを活用して Microsoft To Do のようなタスク管理アプリを実装してください。

以下の機能を含めてください：
- タスクの追加・編集・削除
- タスクの完了・未完了の切り替え
- カテゴリ別タスク管理
- 期限の設定と表示
- 検索・フィルタリング機能
- ダークモード・ライトモードの切り替え
- レスポンシブデザイン

技術要件：
- React + TypeScript
- Material UI コンポーネントの効果的な活用
- 状態管理（useState, useReducer）
- Local Storage でのデータ永続化
- モダンなES6+構文

---

## Use the mui-mcp server to answer any MUI questions --

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question
```

## 📱 実装する機能詳細

### コア機能

#### 1. タスク管理機能
- **タスク追加**: Material UI の TextField と Button を使用
- **タスク編集**: インライン編集または モーダルダイアログ
- **タスク削除**: 確認ダイアログ付きの削除機能
- **完了切り替え**: Checkbox での状態管理

#### 2. カテゴリ機能
- **カテゴリ作成**: Chip または Tag コンポーネント
- **カテゴリ割り当て**: Select または Autocomplete
- **カテゴリフィルタ**: サイドバーまたはタブでの絞り込み

#### 3. 期限管理
- **期限設定**: DatePicker コンポーネント
- **期限通知**: 期限が近づいたタスクのハイライト
- **期限ソート**: 期限順での並び替え

### UI/UX 機能

#### 1. レスポンシブデザイン
- **モバイル**: 単一カラムレイアウト
- **タブレット**: 2カラムレイアウト
- **デスクトップ**: 3カラムレイアウト

#### 2. テーマ切り替え
- **ライトモード**: Material UI の light theme
- **ダークモード**: Material UI の dark theme
- **システム設定**: OS の設定に自動追従

#### 3. 検索・フィルタ
- **テキスト検索**: タスク名・説明での検索
- **ステータスフィルタ**: 完了・未完了での絞り込み
- **期限フィルタ**: 今日・今週・今月での絞り込み

## 🏗️ プロジェクト構造

推奨されるファイル構造：

```
material-ui-vite-ts/
├── src/
│   ├── components/           # 再利用可能なコンポーネント
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── SearchBar.tsx
│   ├── hooks/               # カスタムフック
│   │   ├── useTasks.ts
│   │   ├── useCategories.ts
│   │   └── useLocalStorage.ts
│   ├── types/               # TypeScript 型定義
│   │   └── task.ts
│   ├── utils/               # ユーティリティ関数
│   │   └── dateUtils.ts
│   ├── theme/               # Material UI テーマ設定
│   │   └── theme.ts
│   ├── App.tsx             # メインアプリケーション
│   └── main.tsx            # エントリーポイント
├── package.json
└── README.md
```

## 🧪 動作確認手順

### ステップ 1: 基本機能のテスト

#### タスク操作の確認
1. **タスク追加**:
   - タスク名を入力して追加ボタンクリック
   - タスクがリストに表示されることを確認

2. **タスク編集**:
   - タスクをクリックまたは編集ボタンを押す
   - インライン編集またはダイアログで編集
   - 変更が保存されることを確認

3. **タスク削除**:
   - 削除ボタンクリック
   - 確認ダイアログが表示される
   - 削除後にリストから消えることを確認

### ステップ 2: UI/UX 機能のテスト

#### レスポンシブデザイン
1. ブラウザウィンドウのサイズを変更
2. 各画面サイズで適切なレイアウトが表示されることを確認
3. モバイル表示でのナビゲーションメニューの動作確認

#### テーマ切り替え
1. テーマ切り替えボタンをクリック
2. ライト・ダークモードの切り替え確認
3. 設定がブラウザリロード後も保持されることを確認

### ステップ 3: データ永続化のテスト

#### Local Storage
1. タスクを追加・編集
2. ブラウザをリロード
3. データが保持されていることを確認
4. ブラウザの開発者ツールで Local Storage の内容確認

## 🎨 Material UI コンポーネント活用例

### 推奨コンポーネント

| 機能 | Material UI コンポーネント | 用途 |
|------|---------------------------|------|
| タスク入力 | TextField, Button | テキスト入力とフォーム送信 |
| タスクリスト | List, ListItem, ListItemText | タスク一覧の表示 |
| 完了チェック | Checkbox, FormControlLabel | タスクの完了状態管理 |
| カテゴリ | Chip, Select, Autocomplete | カテゴリの表示と選択 |
| 期限設定 | DatePicker (MUI X) | 日付選択 |
| ダイアログ | Dialog, DialogTitle, DialogContent | 編集・削除の確認画面 |
| ナビゲーション | AppBar, Drawer, Tabs | アプリケーションナビゲーション |
| 検索 | TextField with SearchIcon | 検索入力フィールド |
| フィルタ | ToggleButton, ButtonGroup | フィルタ選択 |
| テーマ切り替え | IconButton, Switch | ダーク・ライトモード切り替え |

### コンポーネントカスタマイズ例

```typescript
// カスタムテーマ例
const theme = createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

## 🛠️ トラブルシューティング

### MCP 関連の問題

#### MCP サーバーが起動しない
1. `.vscode/mcp.json` の設定を確認
2. VS Code を完全に再起動
3. `@mui/mcp-server` パッケージが最新版か確認

#### GitHub Copilot が MCP を使用しない
1. プロンプトの末尾に MCP 使用指示を追加
2. 質問を具体的に Material UI コンポーネントに関連させる
3. MCP サーバーとの接続状態を確認

### 開発環境の問題

#### Vite 開発サーバーが起動しない
1. Node.js のバージョンを確認（v18+ 必須）
2. `node_modules` を削除して `npm install` を再実行
3. ポート 5173 が他のプロセスで使用されていないか確認

#### TypeScript エラー
1. 型定義ファイルが正しくインポートされているか確認
2. `@types/*` パッケージが必要な場合はインストール
3. `tsconfig.json` の設定を確認

### Material UI 関連の問題

#### コンポーネントが正しく表示されない
1. Material UI のバージョンを確認
2. 必要な依存関係がインストールされているか確認
3. CSS-in-JS が正しく動作しているか確認

## 💡 GitHub Copilot + MCP 活用のコツ

### 効果的なプロンプト例

**MCP を活用した質問**:
```text
Material UI の DataGrid コンポーネントでソート機能を実装したいです。列ごとのソート設定とカスタムソート関数の実装方法を教えてください。

---

## Use the mui-mcp server to answer any MUI questions --
```

**段階的な実装依頼**:
```text
現在のタスクリストコンポーネントに、ドラッグ&ドロップによる並び替え機能を追加してください。Material UI の DnD 関連コンポーネントを使用して実装してください。
```

### MCP の効果的な使用場面

1. **新しいコンポーネントの学習**: 公式ドキュメントの最新情報を取得
2. **ベストプラクティスの確認**: Material UI 推奨の実装パターン
3. **トラブルシューティング**: 特定のコンポーネントの問題解決

## 🎯 学習ポイント

このシナリオで習得できるスキル：

### 技術的スキル
1. **MCP の理解**: 外部知識ソースとの連携方法
2. **デザインシステム**: 一貫したUI/UX実装
3. **React + TypeScript**: モダンフロントエンド開発
4. **状態管理**: 複雑なアプリケーション状態の管理

### 開発プロセス
1. **外部リソース活用**: 公式ドキュメントとの効率的な連携
2. **段階的実装**: 機能を段階的に追加する開発手法
3. **品質保証**: TypeScript による型安全性の確保

## 🔗 次のステップ

Design System シナリオが完了したら、以下の拡張を検討してください：

### アプリケーション拡張
- **データベース連携**: バックエンド API との連携
- **ユーザー認証**: Firebase Auth や Auth0 の統合
- **リアルタイム機能**: WebSocket や SSE の実装

### 他シナリオとの連携
- **[E2E Testing](../e2e_test/README.md)**: Playwright での UI テスト自動化
- **デプロイメント**: Vercel や Netlify での本番展開

## 📚 参考文献

- [Material UI 公式ドキュメント](https://mui.com/)
- [Model Context Protocol (MCP) for MUI](https://mui.com/material-ui/getting-started/mcp/)
- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)
- [Vite 公式ドキュメント](https://vitejs.dev/)
- [🤖 Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
