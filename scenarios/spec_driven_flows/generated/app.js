// Spec-driven Frontend (Vanilla JS) - Mock Implementation
// High-level components: State, MockAPI, EventBus, UI modules

// ---- Utility / Event Bus ----
const bus = new EventTarget();
const emit = (type, detail = {}) => bus.dispatchEvent(new CustomEvent(type, { detail }));
const on = (type, handler) => bus.addEventListener(type, handler);

// ---- State ----
const state = {
  session: null, // { token, tableId, expires }
  cart: { items: [] },
  orders: [], // staff side aggregated (in-memory)
  viewMode: 'customer' // or 'staff'
};

// ---- Mock API (simulate latency & auth) ----
const MockAPI = (() => {
  const simulate = (result, delay = 200) => new Promise(res => setTimeout(() => res(result), delay));
  const requireSession = () => { if (!state.session) { throw new Error('NO_SESSION'); } };
  return {
    scanTable: async (tableId) => {
      if (!tableId || tableId.length > 10) throw new Error('INVALID_TABLE');
      const token = 'sess_' + Math.random().toString(36).slice(2);
      return simulate({ sessionToken: token, tableId, expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() });
    },
    listMenu: async ({ category = 'all', q = '' }) => {
      let list = [...MOCK_MENU];
      if (category !== 'all') list = list.filter(m => m.category === category);
      if (q) list = list.filter(m => (m.name + m.description).toLowerCase().includes(q.toLowerCase()));
      return simulate(list, 100);
    },
    placeOrder: async () => {
      requireSession();
      if (!state.cart.items.length) throw new Error('EMPTY_CART');
      // build order
      const total = state.cart.items.reduce((s, it) => s + it.subtotal, 0);
      const order = { orderId: 'o_' + Date.now(), tableId: state.session.tableId, items: JSON.parse(JSON.stringify(state.cart.items)), total, status: 'placed', placedAt: new Date().toISOString() };
      state.orders.push(order);
      emit('order.created', { order });
      state.cart.items = [];
      return simulate(order, 180);
    },
    requestCheckout: async () => {
      requireSession();
      const payload = { requestId: 'r_' + Date.now(), tableId: state.session.tableId };
      emit('session.checkoutRequested', payload);
      return simulate(payload, 120);
    },
    updateOrderStatus: async (orderId, status) => {
      const order = state.orders.find(o => o.orderId === orderId);
      if (!order) throw new Error('NOT_FOUND');
      order.status = status;
      emit('order.updated', { orderId, status });
      return simulate(order, 120);
    }
  };
})();

// ---- UI Helpers ----
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
const formatPrice = v => '¥' + v.toLocaleString();
function toast(msg, type = 'info', timeout = 3200) {
  const region = qs('#toastRegion');
  const div = document.createElement('div');
  div.className = 'toast ' + (type === 'error' ? 'error' : type === 'success' ? 'success' : '');
  div.innerHTML = `<span>${msg}</span>`;
  region.appendChild(div);
  setTimeout(() => { div.style.opacity = 0; setTimeout(() => div.remove(), 400); }, timeout);
}
function guardSession() { if (!state.session) { toast('セッションがありません', 'error'); return false; } return true; }

// ---- Internationalization ----
const i18n = new I18n(TRANSLATIONS, localStorage.getItem('demo.lang') || 'ja');

// ---- UI: Session / Mode ----
function initSessionForm() {
  const form = qs('#sessionForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const tableId = qs('#tableIdInput').value.trim();
    if (!tableId) return;
    try {
      const data = await MockAPI.scanTable(tableId);
      state.session = { token: data.sessionToken, tableId: data.tableId, expires: data.expiresAt };
      localStorage.setItem('demo.session', JSON.stringify(state.session));
      toast('セッション開始: ' + tableId, 'success');
      qs('#sessionSection').classList.add('hidden');
      qs('#menuSection').classList.remove('hidden');
      loadMenu();
    } catch (err) { toast('開始失敗: ' + err.message, 'error'); }
  });
  // restore
  const stored = localStorage.getItem('demo.session');
  if (stored) {
    try { state.session = JSON.parse(stored); qs('#sessionSection').classList.add('hidden'); qs('#menuSection').classList.remove('hidden'); loadMenu(); }
    catch (_) { localStorage.removeItem('demo.session'); }
  }
}

function initModeToggle() {
  const btn = qs('#modeToggle');
  btn.addEventListener('click', () => {
    state.viewMode = state.viewMode === 'customer' ? 'staff' : 'customer';
    updateMode();
  });
}
function updateMode() {
  const btn = qs('#modeToggle');
  if (state.viewMode === 'staff') {
    btn.textContent = i18n.t('mode.customer');
    qs('#staffSection').classList.remove('hidden');
    qsa('[data-view="customer"]').forEach(el => el.classList.add('hidden'));
  } else {
    btn.textContent = i18n.t('mode.staff');
    qs('#staffSection').classList.add('hidden');
    if (state.session) { qs('#menuSection').classList.remove('hidden'); }
    qsa('[data-view="customer"]').forEach(el => { if (el.id !== 'menuSection' && el.id !== 'sessionSection') return; });
    if (!state.session) qs('#sessionSection').classList.remove('hidden');
  }
  renderOrders();
}

// ---- UI: Theme ----
function initThemeToggle() {
  const btn = qs('#themeToggle');
  const apply = () => { document.documentElement.setAttribute('data-theme', localStorage.getItem('demo.theme') || 'light'); };
  apply();
  btn.addEventListener('click', () => {
    const cur = localStorage.getItem('demo.theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    localStorage.setItem('demo.theme', next); apply();
  });
}

// ---- UI: Menu ----
let currentMenu = [];
async function loadMenu() {
  const cat = qs('#categoryFilter').value || 'all';
  const q = qs('#searchInput').value || '';
  const list = await MockAPI.listMenu({ category: cat, q });
  currentMenu = list;
  renderMenu();
}
function initMenuFilters() {
  const catSel = qs('#categoryFilter');
  CATEGORIES.forEach(c => { const o = document.createElement('option'); o.value = c.value; o.textContent = c.label; catSel.appendChild(o); });
  catSel.addEventListener('change', loadMenu);
  qs('#searchInput').addEventListener('input', debounce(loadMenu, 250));
}
function renderMenu() {
  const grid = qs('#menuGrid');
  grid.innerHTML = '';
  currentMenu.forEach(item => {
    const card = document.createElement('div'); card.className = 'card'; card.role = 'listitem';
    card.innerHTML = `<button class="card-btn" data-id="${item.id}" aria-label="${item.name}">
        <figure><img src="${item.imageUrl}" alt="${item.name}" loading="lazy"/></figure>
        <div class="body">
          <strong>${item.name}</strong>
          <span class="price">${formatPrice(item.price)}</span>
          <div>${item.allergies.map(a => `<span class='allergy-badge' title='${a}'>${a}</span>`).join(' ')}</div>
        </div></button>`;
    grid.appendChild(card);
  });
}
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

// ---- UI: Item Dialog ----
function initItemDialog() {
  qs('#menuGrid').addEventListener('click', e => {
    const btn = e.target.closest('button[data-id]'); if (!btn) return;
    const item = currentMenu.find(m => m.id === btn.dataset.id); if (!item) return;
    openItemDialog(item);
  });
  qs('#itemForm').addEventListener('submit', e => { e.preventDefault(); addDialogItemToCart(); });
  qs('#itemForm [data-action="close"]').addEventListener('click', closeItemDialog);
}
let activeItem = null; let activeOptionSelectors = [];
function openItemDialog(item) {
  activeItem = item; activeOptionSelectors = [];
  qs('#itemTitle').textContent = item.name;
  qs('#itemDesc').textContent = item.description;
  qs('#itemImage').src = item.imageUrl;
  const alleg = qs('#itemAllergies');
  if (item.allergies.length) { alleg.hidden = false; alleg.textContent = 'アレルギー: ' + item.allergies.join(', '); }
  else alleg.hidden = true;
  const optWrap = qs('#optionContainer'); optWrap.innerHTML = '';
  item.options.forEach(opt => {
    const fieldId = 'opt_' + opt.type;
    const div = document.createElement('div');
    div.innerHTML = `<legend>${opt.label}</legend>` + opt.values.map(v => `<label><input type='radio' name='${fieldId}' value='${v.value}' data-price='${v.priceDelta}' ${v.value === opt.values[0].value ? 'checked' : ''}/> ${v.label}</label>`).join('');
    optWrap.appendChild(div);
  });
  qs('#itemQty').value = 1;
  updateDialogPrice();
  qsa('#optionContainer input').forEach(inp => inp.addEventListener('change', updateDialogPrice));
  qs('#itemQty').addEventListener('input', updateDialogPrice);
  qs('#itemDialog').showModal();
}
function updateDialogPrice() {
  if (!activeItem) return; const qty = clamp(parseInt(qs('#itemQty').value) || 1, 1, 20);
  qs('#itemQty').value = qty;
  const extra = qsa('#optionContainer input:checked').reduce((s, i) => s + parseInt(i.dataset.price || 0), 0);
  const price = (activeItem.price + extra) * qty;
  qs('#itemPrice').textContent = formatPrice(price);
}
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function closeItemDialog() { try { qs('#itemDialog').close(); } catch (_) { /* ignored */ } }
function addDialogItemToCart() {
  if (!guardSession()) return;
  const qty = parseInt(qs('#itemQty').value) || 1; if (qty < 1) return;
  const options = {};
  activeItem.options.forEach(opt => {
    const val = qs(`#optionContainer input[name='opt_${opt.type}']:checked`)?.value;
    if (val) options[opt.type] = val;
  });
  const extra = qsa('#optionContainer input:checked').reduce((s, i) => s + parseInt(i.dataset.price || 0), 0);
  const base = activeItem.price + extra;
  state.cart.items.push({ id: activeItem.id + '_' + Math.random().toString(36).slice(2, 7), menuId: activeItem.id, name: activeItem.name, quantity: qty, options, unitPrice: base, subtotal: base * qty });
  toast('追加しました', 'success');
  closeItemDialog();
  renderCart();
}

// ---- UI: Cart ----
function initCart() {
  qs('#cartToggle').addEventListener('click', () => { toggleCart(true); });
  qs('#closeCart').addEventListener('click', () => { toggleCart(false); });
  qs('#placeOrderBtn').addEventListener('click', placeOrderHandler);
  qs('#requestCheckoutBtn').addEventListener('click', requestCheckoutHandler);
}
function toggleCart(open) { qs('#cartDrawer').classList.toggle('hidden', !open); }
function renderCart() {
  const ul = qs('#cartItems'); ul.innerHTML = '';
  state.cart.items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<h4>${item.name}</h4>
      <div class="meta">${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')}</div>
      <div class="qty-row">
        <div class="qty-group" data-id="${item.id}">
          <button data-act="dec" aria-label="decrease">-</button>
          <input type="number" value="${item.quantity}" min="1" max="20" />
          <button data-act="inc" aria-label="increase">+</button>
        </div>
        <strong>${formatPrice(item.subtotal)}</strong>
      </div>
      <div style="grid-column:1/3; text-align:right">
        <button data-act="remove" data-id="${item.id}" class="secondary" style="font-size:.65rem">Remove</button>
      </div>`;
    ul.appendChild(li);
  });
  const total = state.cart.items.reduce((s, i) => s + i.subtotal, 0); qs('#cartTotal').textContent = formatPrice(total);
  qs('#cartCount').textContent = state.cart.items.length;
  ul.addEventListener('click', cartClickHandler);
  ul.addEventListener('input', cartInputHandler);
}
function cartClickHandler(e) {
  const btn = e.target.closest('button'); if (!btn) return;
  const id = btn.dataset.id || btn.parentElement?.dataset.id; if (!id) return;
  const item = state.cart.items.find(i => i.id === id); if (!item) return;
  if (btn.dataset.act === 'remove') { state.cart.items = state.cart.items.filter(i => i.id !== id); }
  if (btn.dataset.act === 'inc') { item.quantity = clamp(item.quantity + 1, 1, 20); }
  if (btn.dataset.act === 'dec') { item.quantity = clamp(item.quantity - 1, 1, 20); }
  item.subtotal = item.unitPrice * item.quantity;
  renderCart();
}
function cartInputHandler(e) {
  if (e.target.matches('input[type="number"]')) {
    const group = e.target.closest('.qty-group');
    const id = group?.dataset.id; const item = state.cart.items.find(i => i.id === id); if (!item) return;
    item.quantity = clamp(parseInt(e.target.value) || 1, 1, 20); item.subtotal = item.unitPrice * item.quantity; renderCart();
  }
}
async function placeOrderHandler() {
  if (!guardSession()) return;
  try { const order = await MockAPI.placeOrder(); toast('注文送信: ' + order.orderId, 'success'); renderCart(); }
  catch (err) { toast('送信失敗: ' + err.message, 'error'); }
}
async function requestCheckoutHandler() {
  if (!guardSession()) return;
  try { const r = await MockAPI.requestCheckout(); toast('会計リクエスト送信', 'success'); }
  catch (err) { toast('会計失敗: ' + err.message, 'error'); }
}

// ---- Staff Orders ----
function renderOrders() {
  if (state.viewMode !== 'staff') return;
  const list = qs('#ordersList'); list.innerHTML = '';
  if (!state.orders.length) { qs('#ordersEmpty').style.display = 'block'; return; } else { qs('#ordersEmpty').style.display = 'none'; }
  state.orders.slice().reverse().forEach(order => {
    const div = document.createElement('li'); div.className = 'order-card';
    div.innerHTML = `<div class='order-header'>
      <strong>#${order.orderId}</strong>
      <span class='status' data-status='${order.status}'>${order.status}</span>
      <span>${order.tableId}</span>
    </div>
    <div class='order-items'>${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
    <div style='display:flex; gap:.5rem; flex-wrap:wrap;'>${statusButtons(order.status).map(s => `<button class='secondary small' data-act='status' data-id='${order.orderId}' data-status='${s}'>${s}</button>`).join('')}</div>`;
    list.appendChild(div);
  });
  list.addEventListener('click', staffOrderClickHandler);
}
function statusButtons(current) {
  const flow = ['placed', 'in_kitchen', 'ready', 'served'];
  const next = flow.slice(flow.indexOf(current) + 1, flow.indexOf(current) + 2);
  const extra = current !== 'cancelled' && current !== 'served' ? ['cancelled'] : [];
  return [...next, ...extra];
}
async function staffOrderClickHandler(e) {
  const btn = e.target.closest('button[data-act="status"]'); if (!btn) return;
  const id = btn.dataset.id; const status = btn.dataset.status;
  try { await MockAPI.updateOrderStatus(id, status); toast('更新: ' + status, 'success'); }
  catch (err) { toast('更新失敗: ' + err.message, 'error'); }
}

// ---- Realtime Event Bindings ----
on('order.created', e => { if (state.viewMode === 'staff') { renderOrders(); } });
on('order.updated', e => { if (state.viewMode === 'staff') { renderOrders(); } });
on('session.checkoutRequested', e => { if (state.viewMode === 'staff') { toast('会計リクエスト: ' + e.detail.tableId, 'info'); } });

// ---- Language & UI Setup ----
function initI18n() { const sel = qs('#langSelect'); i18n.buildSelect(sel); i18n.apply(); }

// ---- Theme, Mode, Menu initialization order ----
function init() {
  initI18n();
  initThemeToggle();
  initSessionForm();
  initModeToggle();
  initMenuFilters();
  initItemDialog();
  initCart();
  updateMode();
  renderCart();
}

document.addEventListener('DOMContentLoaded', init);

// Expose for debugging
window.__appState = state;
