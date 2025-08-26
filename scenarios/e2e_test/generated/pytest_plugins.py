# Playwright設定ファイル
from playwright.sync_api import Page, BrowserContext


def pytest_configure(config):
    """pytest設定"""
    config.addinivalue_line("markers", "smoke: 基本的な動作確認テスト")
    config.addinivalue_line("markers", "e2e: エンドツーエンドテスト")
    config.addinivalue_line("markers", "integration: 統合テスト")


def pytest_runtest_setup(item):
    """各テスト実行前の設定"""
    pass


def pytest_runtest_teardown(item):
    """各テスト実行後のクリーンアップ"""
    pass


# スクリーンショット保存設定
def pytest_runtest_makereport(item, call):
    """テスト失敗時のスクリーンショット保存"""
    if call.when == "call" and call.excinfo is not None:
        page = item.funcargs.get("page")
        if page:
            screenshot_path = f"screenshots/failed_{item.name}.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved: {screenshot_path}")


# ブラウザ設定のカスタマイズ
def browser_context_args(browser_context_args):
    """ブラウザコンテキストのデフォルト設定"""
    return {
        **browser_context_args,
        "viewport": {"width": 375, "height": 667},  # iPhone SE サイズ
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
        "device_scale_factor": 2,
        "is_mobile": True,
        "has_touch": True,
    }
