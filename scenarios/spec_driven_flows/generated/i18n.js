class I18n {
  constructor(dict, defaultLang = 'ja') { this.dict = dict; this.lang = defaultLang; }
  setLang(l) { if (this.dict[l]) { this.lang = l; this.apply(); localStorage.setItem('demo.lang', l); } }
  t(key) { return (this.dict[this.lang] && this.dict[this.lang][key]) || this.dict['en'][key] || key; }
  apply(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); el.textContent = this.t(k); });
  }
  buildSelect(sel) {
    const langs = Object.keys(this.dict); sel.innerHTML = '';
    langs.forEach(l => { const opt = document.createElement('option'); opt.value = l; opt.textContent = l; if (l === this.lang) opt.selected = true; sel.appendChild(opt); });
    sel.addEventListener('change', () => this.setLang(sel.value));
  }
}
window.I18n = I18n;
