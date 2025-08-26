// Mock menu & translations (would be fetched from backend in real implementation)
const MOCK_MENU = [
  {
    id: 'm-001', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella & basil', price: 980,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23ffe1d6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%23ff6b4a">Pizza</text></svg>',
    allergies: ['dairy', 'gluten'],
    category: 'food',
    options: [{ type: 'size', label: 'Size', values: [{ value: 'S', label: 'S', priceDelta: -100 }, { value: 'M', label: 'M', priceDelta: 0 }, { value: 'L', label: 'L', priceDelta: 200 }] }]
  },
  {
    id: 'm-002', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons', price: 780,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23d6ffe6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%231b7f50">Salad</text></svg>',
    allergies: ['gluten'], category: 'food',
    options: [{ type: 'protein', label: 'Add Protein', values: [{ value: 'none', label: 'None', priceDelta: 0 }, { value: 'chicken', label: 'Chicken +200', priceDelta: 200 }] }]
  },
  {
    id: 'm-003', name: 'Iced Coffee', description: 'Cold brew style', price: 450,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23d6edff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%230072ce">Coffee</text></svg>',
    allergies: [], category: 'drink',
    options: [{ type: 'size', label: 'Size', values: [{ value: 'R', label: 'Regular', priceDelta: 0 }, { value: 'L', label: 'Large +100', priceDelta: 100 }] }]
  },
  {
    id: 'm-004', name: 'Orange Juice', description: 'Fresh & pulp', price: 400,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23fff6d6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%23fa9d1a">Juice</text></svg>',
    allergies: [], category: 'drink', options: []
  }
];

const CATEGORIES = [{ value: 'all', label: 'All' }, { value: 'food', label: 'Food' }, { value: 'drink', label: 'Drink' }];

const TRANSLATIONS = {
  ja: {
    'app.title': 'Family Order',
    'mode.staff': '従業員モード',
    'mode.customer': '顧客モード',
    'session.startTitle': 'テーブルを開始',
    'session.tableId': 'テーブルID',
    'session.startBtn': '開始',
    'session.hint': 'QR スキャンを模擬しています。テーブル ID を入力してください。',
    'menu.title': 'メニュー',
    'item.quantity': '数量',
    'item.addCart': 'カートに追加',
    'common.cancel': 'キャンセル',
    'cart.title': 'カート',
    'cart.total': '合計',
    'cart.placeOrder': '注文確定',
    'cart.requestCheckout': '会計リクエスト',
    'staff.title': '注文管理',
    'staff.empty': '注文はまだありません',
    'footer.disclaimer': 'モックデータによるデモ実装'
  },
  en: {
    'app.title': 'Family Order',
    'mode.staff': 'Staff Mode',
    'mode.customer': 'Customer Mode',
    'session.startTitle': 'Start Table',
    'session.tableId': 'Table ID',
    'session.startBtn': 'Start',
    'session.hint': 'Simulating QR scan; enter a table ID.',
    'menu.title': 'Menu',
    'item.quantity': 'Qty',
    'item.addCart': 'Add to Cart',
    'common.cancel': 'Cancel',
    'cart.title': 'Cart',
    'cart.total': 'Total',
    'cart.placeOrder': 'Place Order',
    'cart.requestCheckout': 'Request Checkout',
    'staff.title': 'Order Management',
    'staff.empty': 'No orders yet',
    'footer.disclaimer': 'Demo with mock data'
  },
  zh: {
    'app.title': '家庭点餐',
    'mode.staff': '员工模式',
    'mode.customer': '顾客模式',
    'session.startTitle': '开始餐桌',
    'session.tableId': '桌号',
    'session.startBtn': '开始',
    'session.hint': '模拟二维码扫描，输入桌号。',
    'menu.title': '菜单',
    'item.quantity': '数量',
    'item.addCart': '加入购物车',
    'common.cancel': '取消',
    'cart.title': '购物车',
    'cart.total': '合计',
    'cart.placeOrder': '下单',
    'cart.requestCheckout': '请求结账',
    'staff.title': '订单管理',
    'staff.empty': '暂无订单',
    'footer.disclaimer': '使用模拟数据的演示'
  }
};
