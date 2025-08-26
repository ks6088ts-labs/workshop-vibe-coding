import pytest
from playwright.sync_api import Playwright, Browser, BrowserContext, Page


@pytest.fixture(scope="session")
def browser(playwright: Playwright) -> Browser:
    """セッション全体で使用するブラウザインスタンス"""
    browser = playwright.chromium.launch(headless=True)
    yield browser
    browser.close()


@pytest.fixture(scope="function")
def context(browser: Browser) -> BrowserContext:
    """各テスト関数で新しいブラウザコンテキストを作成"""
    context = browser.new_context(
        viewport={"width": 375, "height": 667},  # モバイルサイズ（iPhone SE）
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
    )
    yield context
    context.close()


@pytest.fixture(scope="function")
def page(context: BrowserContext) -> Page:
    """各テスト関数で新しいページを作成"""
    page = context.new_page()
    return page


@pytest.fixture(scope="session")
def base_url() -> str:
    """テスト対象のベースURL"""
    return "http://127.0.0.1:5500/scenarios/spec_driven_flows/generated/"


class BasePage:
    """ベースページクラス"""

    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url

    def navigate(self):
        """ページに移動"""
        self.page.goto(self.base_url)
        self.page.wait_for_load_state("networkidle")


class TableSessionPage(BasePage):
    """テーブルセッション開始ページ"""

    # ロケーター
    TABLE_ID_INPUT = 'input[name="テーブルID"]'
    START_BUTTON = 'button:has-text("開始")'

    def start_session(self, table_id: str):
        """テーブルセッションを開始"""
        self.page.fill(self.TABLE_ID_INPUT, table_id)
        self.page.click(self.START_BUTTON)
        self.page.wait_for_selector("text=メニュー")


class MenuPage(BasePage):
    """メニューページ"""

    # ロケーター
    CATEGORY_FILTER = 'select[name="Category"]'
    SEARCH_INPUT = 'input[placeholder="Search"]'
    CART_BUTTON = 'button:has(text("🛒"))'
    CART_COUNT = ".cart-count"

    def menu_item_selector(self, item_name: str) -> str:
        """メニューアイテムのセレクタを返す"""
        return f'button:has-text("{item_name}")'

    def filter_by_category(self, category: str):
        """カテゴリでフィルタリング"""
        self.page.select_option(self.CATEGORY_FILTER, category)
        self.page.wait_for_timeout(500)  # フィルタリング完了を待機

    def search_menu(self, keyword: str):
        """メニューを検索"""
        self.page.fill(self.SEARCH_INPUT, keyword)
        self.page.wait_for_timeout(500)

    def click_menu_item(self, item_name: str):
        """メニューアイテムをクリック"""
        self.page.click(self.menu_item_selector(item_name))
        self.page.wait_for_selector("dialog")

    def open_cart(self):
        """カートを開く"""
        self.page.click(self.CART_BUTTON)
        self.page.wait_for_selector('dialog:has-text("カート")')

    def get_cart_count(self) -> int:
        """カート内の商品数を取得"""
        count_text = self.page.text_content(self.CART_COUNT)
        return int(count_text) if count_text.isdigit() else 0


class MenuDetailDialog:
    """メニュー詳細ダイアログ"""

    def __init__(self, page: Page):
        self.page = page

    # ロケーター
    DIALOG = "dialog"
    CLOSE_BUTTON = 'dialog button:has-text("✕")'
    ADD_TO_CART_BUTTON = 'dialog button:has-text("カートに追加")'
    CANCEL_BUTTON = 'dialog button:has-text("キャンセル")'
    QUANTITY_INPUT = 'dialog input[type="number"]'
    ALLERGY_INFO = 'dialog :text("アレルギー:")'

    def size_option_selector(self, size: str) -> str:
        """サイズオプションのセレクタを返す"""
        return f'dialog input[value="{size}"]'

    def select_size(self, size: str):
        """サイズを選択"""
        self.page.check(self.size_option_selector(size))

    def set_quantity(self, quantity: int):
        """数量を設定"""
        self.page.fill(self.QUANTITY_INPUT, str(quantity))

    def add_to_cart(self):
        """カートに追加"""
        self.page.click(self.ADD_TO_CART_BUTTON)
        self.page.wait_for_selector("text=追加しました")

    def cancel(self):
        """キャンセル"""
        self.page.click(self.CANCEL_BUTTON)

    def close(self):
        """ダイアログを閉じる"""
        self.page.click(self.CLOSE_BUTTON)

    def get_allergy_info(self) -> str:
        """アレルギー情報を取得"""
        return self.page.text_content(self.ALLERGY_INFO)


class CartDialog:
    """カートダイアログ"""

    def __init__(self, page: Page):
        self.page = page

    # ロケーター
    DIALOG = 'dialog:has-text("カート")'
    CLOSE_BUTTON = 'dialog button:has-text("✕")'
    CHECKOUT_REQUEST_BUTTON = 'dialog button:has-text("会計リクエスト")'
    PLACE_ORDER_BUTTON = 'dialog button:has-text("注文確定")'
    TOTAL_AMOUNT = 'dialog strong:near(:text("合計"))'
    QUANTITY_DECREASE = 'dialog button:has-text("-")'
    QUANTITY_INCREASE = 'dialog button:has-text("+")'
    REMOVE_BUTTON = 'dialog button:has-text("Remove")'

    def cart_item_selector(self, item_name: str) -> str:
        """カートアイテムのセレクタを返す"""
        return f'dialog :text("{item_name}")'

    def place_order(self):
        """注文を確定"""
        self.page.click(self.PLACE_ORDER_BUTTON)
        self.page.wait_for_selector("text=注文送信")

    def request_checkout(self):
        """会計をリクエスト"""
        self.page.click(self.CHECKOUT_REQUEST_BUTTON)

    def close(self):
        """カートを閉じる"""
        self.page.click(self.CLOSE_BUTTON)

    def get_total_amount(self) -> str:
        """合計金額を取得"""
        return self.page.text_content(self.TOTAL_AMOUNT)

    def increase_quantity(self):
        """数量を増加"""
        self.page.click(self.QUANTITY_INCREASE)

    def decrease_quantity(self):
        """数量を減少"""
        self.page.click(self.QUANTITY_DECREASE)

    def remove_item(self):
        """商品を削除"""
        self.page.click(self.REMOVE_BUTTON)


class EmployeePage(BasePage):
    """従業員ページ"""

    # ロケーター
    EMPLOYEE_MODE_BUTTON = 'button:has-text("従業員モード")'
    CUSTOMER_MODE_BUTTON = 'button:has-text("顧客モード")'
    ORDER_LIST = 'list[aria-label="Orders"]'

    def order_item_selector(self, order_id: str) -> str:
        """注文アイテムのセレクタを返す"""
        return f'text="{order_id}"'

    def status_button_selector(self, status: str) -> str:
        """ステータスボタンのセレクタを返す"""
        return f'button:has-text("{status}")'

    def switch_to_employee_mode(self):
        """従業員モードに切り替え"""
        self.page.click(self.EMPLOYEE_MODE_BUTTON)
        self.page.wait_for_selector("text=注文管理")

    def switch_to_customer_mode(self):
        """顧客モードに切り替え"""
        self.page.click(self.CUSTOMER_MODE_BUTTON)
        self.page.wait_for_selector("text=メニュー")

    def get_orders_count(self) -> int:
        """注文数を取得"""
        orders = self.page.query_selector_all(f"{self.ORDER_LIST} > li")
        return len(orders)

    def change_order_status(self, status: str):
        """注文ステータスを変更"""
        self.page.click(self.status_button_selector(status))
        self.page.wait_for_timeout(500)

    def get_order_details(self, order_id: str) -> dict:
        """注文詳細を取得"""
        # 注文詳細の情報を抽出するロジックを実装
        return {
            "id": order_id,
            "status": "placed",  # 実際の実装では要素から取得
            "table": "T1",  # 実際の実装では要素から取得
        }


@pytest.fixture
def table_session_page(page: Page, base_url: str) -> TableSessionPage:
    """テーブルセッションページのフィクスチャ"""
    return TableSessionPage(page, base_url)


@pytest.fixture
def menu_page(page: Page, base_url: str) -> MenuPage:
    """メニューページのフィクスチャ"""
    return MenuPage(page, base_url)


@pytest.fixture
def menu_detail_dialog(page: Page) -> MenuDetailDialog:
    """メニュー詳細ダイアログのフィクスチャ"""
    return MenuDetailDialog(page)


@pytest.fixture
def cart_dialog(page: Page) -> CartDialog:
    """カートダイアログのフィクスチャ"""
    return CartDialog(page)


@pytest.fixture
def employee_page(page: Page, base_url: str) -> EmployeePage:
    """従業員ページのフィクスチャ"""
    return EmployeePage(page, base_url)
