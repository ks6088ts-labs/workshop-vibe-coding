# ファミリーレストラン注文システム テストケース

## 1. 多言語対応機能テスト

### テストケース 1.1: 言語切り替え

```javascript
// 日本語→英語の切り替えテスト
await page.getByLabel("Language").selectOption(["en"]);
await expect(page.locator("h2")).toContainText("Menu");
await expect(page.getByRole("button", { name: "Staff Mode" })).toBeVisible();

// 英語→中国語の切り替えテスト
await page.getByLabel("Language").selectOption(["zh"]);
await expect(page.locator("h2")).toContainText("菜单");
```

## 2. カテゴリーフィルター機能テスト

### テストケース 2.1: Food カテゴリーフィルター

```javascript
await page.getByLabel("Category").selectOption(["Food"]);
await expect(
  page.getByRole("button", { name: "Margherita Pizza" })
).toBeVisible();
await expect(page.getByRole("button", { name: "Caesar Salad" })).toBeVisible();
await expect(
  page.getByRole("button", { name: "Iced Coffee" })
).not.toBeVisible();
```

### テストケース 2.2: Drink カテゴリーフィルター

```javascript
await page.getByLabel("Category").selectOption(["Drink"]);
await expect(page.getByRole("button", { name: "Iced Coffee" })).toBeVisible();
await expect(page.getByRole("button", { name: "Orange Juice" })).toBeVisible();
await expect(
  page.getByRole("button", { name: "Margherita Pizza" })
).not.toBeVisible();
```

## 3. 検索機能テスト

### テストケース 3.1: 部分一致検索

```javascript
await page.getByRole("searchbox", { name: "Search" }).fill("Coffee");
await expect(page.getByRole("button", { name: "Iced Coffee" })).toBeVisible();
await expect(
  page.getByRole("button", { name: "Margherita Pizza" })
).not.toBeVisible();
```

### テストケース 3.2: 検索結果がない場合

```javascript
await page.getByRole("searchbox", { name: "Search" }).fill("NonExistent");
await expect(page.locator("list")).toBeEmpty();
```

## 4. 商品詳細・注文機能テスト

### テストケース 4.1: 商品詳細表示

```javascript
await page.getByRole("button", { name: "Margherita Pizza" }).click();
await expect(page.getByRole("dialog")).toBeVisible();
await expect(page.locator("h3")).toContainText("Margherita Pizza");
await expect(
  page.getByText("Classic tomato, mozzarella & basil")
).toBeVisible();
```

### テストケース 4.2: サイズ選択と価格更新

```javascript
await page.getByRole("button", { name: "Margherita Pizza" }).click();
await page.getByRole("radio", { name: "M" }).click();
await expect(page.locator("status")).toContainText("¥980");
await page.getByRole("radio", { name: "L" }).click();
await expect(page.locator("status")).toContainText("¥1,180");
```

### テストケース 4.3: 数量変更と価格計算

```javascript
await page.getByRole("button", { name: "Margherita Pizza" }).click();
await page.getByRole("spinbutton", { name: "数量" }).fill("3");
await expect(page.locator("status")).toContainText("¥2,640"); // 880 * 3
```

### テストケース 4.4: カート追加成功

```javascript
await page.getByRole("button", { name: "Margherita Pizza" }).click();
await page.getByRole("button", { name: "カートに追加" }).click();
await expect(page.getByText("追加しました")).toBeVisible();
await expect(page.getByRole("button", { name: "🛒 1" })).toBeVisible();
```

## 5. カート管理機能テスト

### テストケース 5.1: カート内容表示

```javascript
// 事前にアイテムを追加
await page.getByRole("button", { name: "Margherita Pizza" }).click();
await page.getByRole("radio", { name: "M" }).click();
await page.getByRole("spinbutton", { name: "数量" }).fill("2");
await page.getByRole("button", { name: "カートに追加" }).click();

// カートを開いて確認
await page.getByRole("button", { name: "🛒" }).click();
await expect(page.getByRole("dialog", { name: "Cart" })).toBeVisible();
await expect(page.getByText("Margherita Pizza")).toBeVisible();
await expect(page.getByText("size: M")).toBeVisible();
await expect(page.getByText("¥1,960")).toBeVisible();
```

### テストケース 5.2: カート内数量変更

```javascript
await page.getByRole("button", { name: "🛒" }).click();
await page.getByRole("button", { name: "decrease" }).click();
await expect(page.getByRole("spinbutton")).toHaveValue("1");
await expect(page.getByText("¥980")).toBeVisible();
```

### テストケース 5.3: アイテム削除

```javascript
await page.getByRole("button", { name: "🛒" }).click();
await page.getByRole("button", { name: "Remove" }).click();
await expect(page.getByRole("button", { name: "🛒 0" })).toBeVisible();
```

## 6. テーマ切り替え機能テスト

### テストケース 6.1: ダークモード切り替え

```javascript
await page.getByRole("button", { name: "Toggle theme" }).click();
// テーマが変更されたことをCSSクラスまたはスタイルで確認
await expect(page.locator("body")).toHaveClass(/dark/);
```

## 7. エンドツーエンドシナリオテスト

### テストケース 7.1: 完全注文フロー

```javascript
// 1. 言語を英語に変更
await page.getByLabel("Language").selectOption(["en"]);

// 2. Foodカテゴリーでフィルター
await page.getByLabel("Category").selectOption(["Food"]);

// 3. Pizzaを検索
await page.getByRole("searchbox", { name: "Search" }).fill("Pizza");

// 4. 商品を選択・カスタマイズ
await page.getByRole("button", { name: "Margherita Pizza" }).click();
await page.getByRole("radio", { name: "L" }).click();
await page.getByRole("spinbutton", { name: "数量" }).fill("2");
await page.getByRole("button", { name: "Add to Cart" }).click();

// 5. カートで確認
await page.getByRole("button", { name: "🛒" }).click();
await expect(page.getByText("size: L")).toBeVisible();
await expect(page.getByRole("spinbutton")).toHaveValue("2");

// 6. 注文確定
await page.getByRole("button", { name: "注文確定" }).click();
```

## テスト実行前提条件

- URL: http://127.0.0.1:5500/scenarios/spec_driven_flows/generated/
- ブラウザ: Chrome/Chromium
- 画面解像度: 1920x1080 (推奨)

## 予想される問題点とエッジケース

1. ネットワーク遅延によるレスポンス遅延
2. 大量の同時アクセス時のパフォーマンス
3. 無効な数量入力（負の数、ゼロ、文字列）
4. ブラウザの戻るボタン使用時の状態管理
5. セッション切れ時の動作
