# Spec Driven Flow シナリオ

## 手順

GitHub Copilot の各モードを切り替えながら、仕様策定からコード生成、動作確認までを行います。

| Feature             | Prompt                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom chat modes   | [chatmodes/specification.chatmode.md](https://github.com/github/awesome-copilot/blob/main/chatmodes/specification.chatmode.md)                                   |
| Custom instructions | [instructions/spec-driven-workflow-v1.instructions.md](https://github.com/github/awesome-copilot/blob/main/instructions/spec-driven-workflow-v1.instructions.md) |
| Prompt files        | [prompts/create-specification.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/create-specification.prompt.md)                             |

1. 仕様策定の対象となるシステムの簡潔な要求仕様を生成する

ChatGPT/Microsoft Copilot/Gemini などで適当なシステムの仕様を作成する以下のようなプロンプトを与えます。

```text
仕様駆動型開発のサンプルとして、ファミリーレストランのオーダーシステムを題材としてあげます。
このシステムのフロントエンドのウェブアプリを作るにあたり、適切な要求仕様を簡潔にまとめてください。
```

2. 1 で出力された仕様を GitHub Copilot の Custom Chat Mode (Specification) に入力し、フォーマットの要求仕様書を生成する。

```text
お客様のご要望にお応えできるよう、ファミリーレストランのオーダーシステムフロントエンドウェブアプリの要件定義プロンプトを以下に簡潔にまとめました。

## ユースケースの特定
\---
まず、このシステムを利用する**ユーザーの種類**と、それぞれの**ユーザーが何を行うか**を明確に特定します。

### お客様 (顧客)
* **目的:** 席からメニューを閲覧し、注文する
    * **行動:**
        1.  QRコードをスキャンしてテーブルに紐づいた注文画面を開く。
        2.  メニューカテゴリを選択してメニューリストを表示する。
        3.  メニュー詳細を確認する（画像、価格、説明、アレルギー情報など）。
        4.  メニューを注文カートに追加する（数量の増減、オプションの選択）。
        5.  注文内容を確認・確定する。
        6.  追加注文する。
        7.  会計をリクエストする。

### 従業員
* **目的:** テーブルからの注文を確認し、顧客からのリクエストを管理する
    * **行動:**
        1.  新規注文の通知を受け取る。
        2.  テーブルごとに注文内容を確認する。
        3.  注文を厨房に送信する。
        4.  顧客からの会計リクエストを処理する。
        5.  注文内容の修正やキャンセルを処理する。

## 主要機能と画面
\---
ユースケースに基づき、具体的な**機能**とそれに対応する**画面**を定義します。

### 顧客向け機能と画面
* **メニュー閲覧画面:** カテゴリ別のメニュー表示、検索機能。
* **メニュー詳細画面:** 商品情報、画像、価格、オプション選択。
* **カート画面:** 注文内容の確認、数量変更、削除。
* **注文確定画面:** 最終確認、注文送信ボタン。
* **会計リクエスト画面:** 合計金額表示、会計リクエスト送信ボタン。

### 従業員向け機能と画面
* **注文管理画面:** 新規注文の通知、テーブルごとの注文リスト表示、注文のステータス管理。
* **個別注文詳細画面:** 特定のテーブルの注文内容、顧客からのリクエスト情報。

## 非機能要件
\---
パフォーマンス、セキュリティ、アクセシビリティなど、システムが**満たすべき品質要件**を定義します。

* **パフォーマンス:**
    * ページの読み込み速度: 2秒以内。
    * 注文確定処理: 1秒以内。
* **セキュリティ:**
    * テーブルごとの注文データは**認証されたセッション**でのみアクセス可能とする。
    * 不正なAPIリクエストを防止する仕組みを導入する。
* **ユーザビリティ:**
    * 直感的で分かりやすいUI/UX。
    * **高齢者**や**子供**でも操作しやすいデザイン。
    * **多言語対応**（日本語、英語、中国語など）。
* **互換性:**
    * 主要な**スマートフォンブラウザ**（Chrome, Safariなど）に対応。
    * **iOS**および**Android**デバイスでの動作保証。

上記のプロンプトは、開発チームが**テスト駆動開発（TDD）**を行うための具体的な**テストケース**を考案する出発点となります。

**例:**
* **顧客向け機能のテストケース:**
    * 「QRコードをスキャンしたら正しいテーブルの注文画面が表示されるか」
    * 「カートに商品を追加・削除・数量変更が正しくできるか」
    * 「アレルギー情報が正しく表示されるか」

* **従業員向け機能のテストケース:**
    * 「新しい注文が入ったらリアルタイムで通知が来るか」
    * 「注文を『調理中』から『提供済み』にステータス変更できるか」
```

仕様書が [spec-process-family-restaurant-ordering-frontend.md](../../spec/spec-process-family-restaurant-ordering-frontend.md) に生成されます。

# 参考文献

- [Agent Mode in Action: AI Coding with Vibe and Spec-Driven Flows | BRK102](https://build.microsoft.com/en-US/sessions/BRK102?source=sessions), [YouTube](https://www.youtube.com/watch?v=1DlNVROQ6DI)
- [Customize AI responses in VS Code](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [🤖 Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
