#!/bin/bash

# 家族向けレストラン注文システム E2Eテスト実行スクリプト

set -e

echo "家族向けレストラン注文システム E2Eテストを開始します..."

# 仮想環境の確認
if [ ! -d "venv" ]; then
    echo "Python仮想環境を作成中..."
    python3 -m venv venv
fi

# 仮想環境をアクティベート
source venv/bin/activate

# 依存関係のインストール
echo "依存関係をインストール中..."
pip install -r requirements.txt

# Playwrightブラウザのインストール
echo "Playwrightブラウザをインストール中..."
python -m playwright install chromium

# テスト実行
echo "E2Eテストを実行中..."

# スモークテストのみ実行
echo "=== スモークテスト実行 ==="
python -m pytest tests/ -m smoke -v --tb=short

# 全E2Eテスト実行
echo "=== 全E2Eテスト実行 ==="
python -m pytest tests/ -m e2e -v --tb=short

# 統合テスト実行
echo "=== 統合テスト実行 ==="
python -m pytest tests/ -m integration -v --tb=short

echo "テスト完了!"

# 仮想環境をディアクティベート
deactivate
