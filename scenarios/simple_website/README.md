# Simple Website シナリオ

## 🎯 学習目標

このシナリオでは、GitHub Copilot を使った基本的な vibe coding を体験します：

- **GitHub Copilot の基本操作**：プロンプトからコード生成
- **Web 開発の基礎**：HTML、CSS、JavaScript の統合
- **インタラクティブ UI の作成**：ユーザー操作とリアルタイム更新
- **ローカル開発環境の構築**：Live Server を使った開発サーバー

## 📋 前提条件

- Visual Studio Code がインストールされている
- GitHub Copilot 拡張機能が有効化されている
- [Live Server 拡張機能](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) がインストールされている

## 🚀 実装手順

### ステップ 1: プロジェクト構造の確認

まず、現在のディレクトリ構造を確認します：

```
scenarios/simple_website/
├── README.md              # このファイル
├── images/               # スクリーンショット
└── generated/            # 生成されるコード（このステップで作成）
```

### ステップ 2: GitHub Copilot でコード生成

VS Code で GitHub Copilot Chat を開き（`Ctrl+Shift+I` または `Cmd+Shift+I`）、以下のプロンプトを入力します：

```text
基本的な水分摂取量管理アプリを作成しましょう。
HTML、CSS、JavaScriptを使用します。
1日目標の96オンスに対して、水分摂取量をオンス単位で増減できる機能が必要です。
すべてのコードは scenarios/simple_website/generated ディレクトリ内に配置してください。

以下の機能を含めてください：
- 現在の摂取量の表示
- 目標に対する進捗率（パーセンテージ）
- 残り摂取量の表示
- +4oz、-4oz ボタンでの調整
- カスタム量の入力
- プログレスバーによる視覚的表示
- リセット機能
```

### ステップ 3: 生成されたファイルの確認

GitHub Copilot が以下のファイルを生成することを確認します：

- `scenarios/simple_website/generated/index.html`
- `scenarios/simple_website/generated/style.css`
- `scenarios/simple_website/generated/script.js`

### ステップ 4: ローカルサーバーでの動作確認

#### 方法 1: Live Server を使用（推奨）

1. VS Code で `scenarios/simple_website/generated/index.html` を開く
2. ファイルを右クリック → `Open with Live Server` を選択
3. ブラウザが自動で開き、アプリが表示される
4. ホットリロード機能により、コード変更が即座に反映される

#### 方法 2: Python HTTP サーバーを使用

```bash
# ターミナルで以下を実行
cd scenarios/simple_website/generated
python -m http.server 8888

# ブラウザで http://localhost:8888 にアクセス
```

### ステップ 5: 機能テスト

アプリが正しく動作することを以下の操作で確認します：

1. **初期状態の確認**
   - 摂取量が 0oz で表示される
   - 目標 96oz が表示される
   - プログレスバーが 0% で表示される

2. **水分追加のテスト**
   - `+4oz` ボタンをクリック
   - 摂取量が 4oz に増加する
   - プログレスバーが約 4.2% になる
   - 残り量が 92oz と表示される

3. **カスタム量の追加**
   - カスタム入力欄に任意の数値を入力
   - `Add` ボタンをクリック
   - 摂取量が正しく増加する

4. **減量機能のテスト**
   - `-4oz` ボタンをクリック
   - 摂取量が正しく減少する（0未満にならない）

5. **リセット機能のテスト**
   - `Reset` ボタンをクリック
   - すべての値が初期状態に戻る

## 🎨 期待される結果

正常に実装されると、以下のような水分摂取管理アプリが完成します：

![水分摂取管理アプリのスクリーンショット](./images/screenshot.png)

### 主要な機能

- **視覚的なプログレスバー**：現在の進捗を色付きバーで表示
- **リアルタイム更新**：操作に応じて即座に数値が更新
- **直感的な操作**：大きなボタンとわかりやすいラベル
- **レスポンシブデザイン**：モバイルでも見やすい表示

## 🛠️ カスタマイズのアイデア

基本機能を実装した後、以下の拡張機能を GitHub Copilot と一緒に実装してみましょう：

### 初級カスタマイズ
- **目標値の変更機能**：96oz 以外の目標を設定可能に
- **単位の切り替え**：オンス ⇔ ミリリットルの表示切り替え
- **テーマの変更**：ダークモード・ライトモードの切り替え

### 中級カスタマイズ
- **履歴機能**：1日の摂取記録を時系列で表示
- **通知機能**：一定時間経過時のリマインダー
- **統計表示**：週間・月間の摂取量グラフ

### 上級カスタマイズ
- **Local Storage 対応**：ブラウザ閉鎖後もデータを保持
- **PWA 化**：スマートフォンアプリのような操作感
- **複数ユーザー対応**：家族みんなで使える機能

## 💡 GitHub Copilot 活用のコツ

このシナリオで学べる GitHub Copilot の効果的な使い方：

### 1. 具体的なプロンプト
❌ 悪い例：「水分アプリを作って」
✅ 良い例：「96オンス目標の水分摂取管理アプリを HTML/CSS/JS で作成し、+4oz/-4oz ボタンとプログレスバーを含める」

### 2. 段階的な実装
一度にすべてを要求せず、基本機能 → 拡張機能の順で進める

### 3. コンテキストの活用
既存のコードがある場合は、そのファイルを開いた状態で追加機能を依頼する

### 4. エラーの修正
コードが動作しない場合は、エラーメッセージを GitHub Copilot に共有して修正を依頼

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### Live Server が動作しない
- Live Server 拡張機能がインストールされているか確認
- VS Code を再起動してみる
- ファイルを右クリックして「Open with Live Server」が表示されるか確認

#### 生成されたコードが動作しない
- ブラウザの開発者ツール（F12）でエラーメッセージを確認
- GitHub Copilot にエラーメッセージを共有して修正を依頼

#### プログレスバーが表示されない
- CSS ファイルが正しく読み込まれているか確認
- HTML ファイル内の CSS リンクタグを確認

## 🔗 次のステップ

Simple Website シナリオが完了したら、次のシナリオに進みましょう：

- **[Spec Driven Flow](../spec_driven_flows/README.md)**: より体系的な仕様駆動開発を学習
- **[Interactive Games](../interactive_games/README.md)**: より複雑なインタラクティブアプリケーションの作成

## 📚 参考文献

- [Agent Mode in Action: AI Coding with Vibe and Spec-Driven Flows | BRK102](https://build.microsoft.com/en-US/sessions/BRK102?source=sessions) ([YouTube](https://www.youtube.com/watch?v=1DlNVROQ6DI))
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Live Server VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
