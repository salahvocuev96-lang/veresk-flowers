/* VERESK — общий код: шапка, подвал, корзина, избранное, поиск, карточки */
(function () {
  const VK = window.VK;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
  const img = (n, small) => `assets/img/${n}${small ? '-s' : ''}.webp`;
  const params = () => new URLSearchParams(location.search);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Object.assign(VK, { $, $$, esc, fmt, img, params, reduced });

  /* ---------- Иконки (Lucide-стиль, stroke 1.5) ---------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    bag: '<path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    camera: '<path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-2-3Z"/><circle cx="12" cy="13" r="3.5"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.5 12 2.5c-.5 3-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7Z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    truck: '<path d="M14 18V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.7 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    tg: '<path d="m21.5 4.5-3 15.2c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.7 13.7 2.2 12.3c-1-.3-1-1 .2-1.5L20.2 4c.8-.3 1.6.2 1.3.5Z"/>',
    wa: '<path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.6L3 21Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.2-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2L9 9.5Z"/>'
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n] || ''}</svg>`;
  VK.icon = icon;

  /* ---------- Хранилище (localStorage с защитой) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('vk_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('vk_' + k, JSON.stringify(v)); } catch (e) { /* приватный режим */ } }
  };
  VK.store = store;
  VK.byId = id => VK.products.find(p => p.id === +id);
  VK.priceFor = (p, sizeKey = 'S', packKey = 'paper') => {
    const s = VK.sizes.find(x => x.key === sizeKey) || VK.sizes[0];
    const pk = VK.packs.find(x => x.key === packKey) || VK.packs[0];
    return Math.round(p.price * s.k / 100) * 100 + pk.add;
  };

  /* Корзина */
  const cart = {
    items() { return store.get('cart', []).filter(i => VK.byId(i.id)); },
    save(list) { store.set('cart', list); document.dispatchEvent(new CustomEvent('vk:cart')); },
    add(id, size = 'S', pack = 'paper', qty = 1) {
      const list = cart.items(); const key = `${id}-${size}-${pack}`;
      const ex = list.find(i => i.key === key);
      if (ex) ex.qty = Math.min(ex.qty + qty, 99); else list.push({ key, id: +id, size, pack, qty });
      cart.save(list);
    },
    setQty(key, qty) { const list = cart.items(); const it = list.find(i => i.key === key); if (!it) return; it.qty = Math.max(1, Math.min(99, qty)); cart.save(list); },
    remove(key) { cart.save(cart.items().filter(i => i.key !== key)); },
    clear() { cart.save([]); },
    count() { return cart.items().reduce((s, i) => s + i.qty, 0); },
    line(i) { return VK.priceFor(VK.byId(i.id), i.size, i.pack) * i.qty; },
    total() { return cart.items().reduce((s, i) => s + cart.line(i), 0); }
  };
  VK.cart = cart;
  VK.delivery = { free: 15000, cost: 590, express: 990 };

  /* Избранное */
  const fav = {
    list() { return store.get('fav', []); },
    has(id) { return fav.list().includes(+id); },
    toggle(id) {
      id = +id; let l = fav.list();
      const on = !l.includes(id);
      l = on ? [...l, id] : l.filter(x => x !== id);
      store.set('fav', l); document.dispatchEvent(new CustomEvent('vk:fav', { detail: { id, on } }));
      return on;
    }
  };
  VK.fav = fav;

  /* ---------- Toast ---------- */
  let toastTimer;
  VK.toast = (msg, link) => {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.innerHTML = `${icon('check')}<span>${esc(msg)}</span>${link ? `<a href="${link.href}">${esc(link.text)}</a>` : ''}`;
    t.classList.add('is-on'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 3800);
  };

  /* ---------- Шапка ---------- */
  const NAV = [
    { href: 'catalog.html', label: 'Каталог', mega: true, key: 'catalog' },
    { href: 'catalog.html?cat=rozy', label: 'Розы', key: 'rozy' },
    { href: 'catalog.html?cat=piony', label: 'Пионы', key: 'piony' },
    { href: 'catalog.html?cat=sezonnye', label: 'Сезонное', key: 'sezonnye' },
    { href: 'catalog.html?cat=premium', label: 'Премиум', key: 'premium' },
    { href: 'delivery.html', label: 'Доставка', key: 'delivery' },
    { href: 'about.html', label: 'О нас', key: 'about' }
  ];
  function activeKey() {
    const page = document.body.dataset.page;
    if (page === 'catalog') { const c = params().get('cat'); return NAV.some(n => n.key === c) ? c : 'catalog'; }
    return page;
  }
  function renderHeader() {
    const host = $('#site-header'); if (!host) return;
    const act = activeKey();
    const B = VK.brand;
    host.className = 'header';
    host.innerHTML = `
      <div class="header__bar container">
        <button class="icon-btn header__burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mnav" data-open-menu>${icon('menu')}</button>
        <a class="logo" href="index.html" aria-label="${B.name} — на главную"><span class="logo__word">${B.logo}</span><span class="logo__tag">${B.tagline}</span></a>
        <nav class="nav" aria-label="Основная навигация">
          <ul class="nav__list">
            ${NAV.map(n => `<li class="nav__item${n.mega ? ' has-mega' : ''}">
              <a class="nav__link${act === n.key ? ' is-active' : ''}" href="${n.href}"${act === n.key ? ' aria-current="page"' : ''}>${n.label}</a>
              ${n.mega ? `<button class="nav__toggle" type="button" aria-label="Разделы каталога" aria-expanded="false" aria-controls="mega">${icon('chevron')}</button>` : ''}
            </li>`).join('')}
          </ul>
        </nav>
        <div class="header__tools">
          <a class="header__phone" href="${B.phoneHref}">${B.phone}</a>
          <a class="icon-btn show-md" href="${B.phoneHref}" aria-label="Позвонить: ${B.phone}">${icon('phone')}</a>
          <a class="icon-btn hide-md" href="${B.telegram}" aria-label="Написать в Telegram">${icon('tg')}</a>
          <a class="icon-btn hide-md" href="${B.whatsapp}" aria-label="Написать в WhatsApp">${icon('wa')}</a>
          <button class="icon-btn" type="button" aria-label="Поиск" data-open-search>${icon('search')}</button>
          <a class="icon-btn hide-sm" href="favorites.html" aria-label="Избранное"><span class="icon-btn__in">${icon('heart')}<span class="count" data-fav-count hidden></span></span></a>
          <button class="icon-btn" type="button" aria-label="Корзина" data-open-cart><span class="icon-btn__in">${icon('bag')}<span class="count" data-cart-count hidden></span></span></button>
        </div>
      </div>
      <div class="mega" id="mega" hidden>
        <div class="container mega__in">
          <div class="mega__col">
            <p class="label">Разделы</p>
            <ul>${VK.categories.map(c => `<li><a href="catalog.html?cat=${c.slug}">${c.name}</a></li>`).join('')}<li><a href="catalog.html">Весь каталог</a></li></ul>
          </div>
          <div class="mega__col">
            <p class="label">По поводу</p>
            <ul>${VK.occasions.map(c => `<li><a href="catalog.html?occ=${c.slug}">${c.name}</a></li>`).join('')}</ul>
          </div>
          <div class="mega__col">
            <p class="label">Для кого</p>
            <ul>${VK.recipients.map(c => `<li><a href="catalog.html?occ=${c.slug}">${c.name}</a></li>`).join('')}</ul>
          </div>
          <a class="mega__promo" href="catalog.html?cat=sezonnye">
            <img src="${img('b17', true)}" alt="" width="400" height="500" loading="lazy">
            <span class="label">Сейчас в сезоне</span>
            <span class="mega__promo-title">Георгины и осенние букеты</span>
          </a>
        </div>
      </div>`;

    // Мобильное меню
    const m = document.createElement('div');
    m.innerHTML = `
      <div class="drawer drawer--left" id="mnav" role="dialog" aria-modal="true" aria-label="Меню" hidden>
        <div class="drawer__head">
          <a class="logo" href="index.html"><span class="logo__word">${B.logo}</span></a>
          <button class="icon-btn" type="button" aria-label="Закрыть меню" data-close>${icon('x')}</button>
        </div>
        <div class="drawer__body mnav">
          <ul class="mnav__main">
            ${NAV.filter(n => !n.mega).concat([{ href: 'reviews.html', label: 'Отзывы' }, { href: 'faq.html', label: 'Вопросы и ответы' }, { href: 'contacts.html', label: 'Контакты' }, { href: 'favorites.html', label: 'Избранное' }]).map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}
          </ul>
          <details class="mnav__group" open>
            <summary>Каталог ${icon('chevron')}</summary>
            <ul>${VK.categories.map(c => `<li><a href="catalog.html?cat=${c.slug}">${c.name}</a></li>`).join('')}<li><a href="catalog.html">Весь каталог</a></li></ul>
          </details>
          <details class="mnav__group">
            <summary>По поводу ${icon('chevron')}</summary>
            <ul>${VK.occasions.concat(VK.recipients).map(c => `<li><a href="catalog.html?occ=${c.slug}">${c.name}</a></li>`).join('')}</ul>
          </details>
          <div class="mnav__contacts">
            <a class="mnav__phone" href="${B.phoneHref}">${B.phone}</a>
            <p>${B.hours}</p>
            <div class="mnav__social">
              <a class="btn btn--outline btn--sm" href="${B.telegram}">${icon('tg')} Telegram</a>
              <a class="btn btn--outline btn--sm" href="${B.whatsapp}">${icon('wa')} WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer drawer--right" id="mcart" role="dialog" aria-modal="true" aria-labelledby="mcart-title" hidden>
        <div class="drawer__head">
          <h2 class="drawer__title" id="mcart-title">Корзина</h2>
          <button class="icon-btn" type="button" aria-label="Закрыть корзину" data-close>${icon('x')}</button>
        </div>
        <div class="drawer__body" data-mini-cart></div>
        <div class="drawer__foot" data-mini-foot></div>
      </div>
      <div class="search" id="search" role="dialog" aria-modal="true" aria-label="Поиск по каталогу" hidden>
        <div class="container search__in">
          <form class="search__form" action="catalog.html" role="search">
            ${icon('search')}
            <label class="sr-only" for="search-q">Поиск букетов</label>
            <input id="search-q" name="q" type="search" placeholder="Розы, пионы, «для мамы»…" autocomplete="off">
            <button class="icon-btn" type="button" aria-label="Закрыть поиск" data-close>${icon('x')}</button>
          </form>
          <div class="search__hints">
            <span class="label">Часто ищут</span>
            ${['Пионы', 'Розы', 'Тюльпаны', 'Маме', 'В вазе', 'Белые'].map(h => `<button type="button" class="chip" data-hint="${h}">${h}</button>`).join('')}
          </div>
          <div class="search__res" data-search-res aria-live="polite"></div>
        </div>
      </div>
      <div class="scrim" data-scrim hidden></div>`;
    document.body.append(...m.children);
  }

  /* ---------- Подвал ---------- */
  function renderFooter() {
    const host = $('#site-footer'); if (!host) return;
    const B = VK.brand;
    host.className = 'footer';
    host.innerHTML = `
      <div class="container">
        <div class="footer__top">
          <div class="footer__brand">
            <a class="logo logo--lg" href="index.html"><span class="logo__word">${B.logo}</span><span class="logo__tag">${B.tagline}</span></a>
            <p class="footer__note">Авторские букеты с доставкой по Москве и области. Собираем под заказ и присылаем фото перед отправкой.</p>
          </div>
          <div class="footer__contacts">
            <a class="footer__phone" href="${B.phoneHref}">${B.phone}</a>
            <p><a href="${B.telegram}">Telegram</a> · <a href="${B.whatsapp}">WhatsApp</a> · <a href="mailto:${B.email}">${B.email}</a></p>
            <p>${B.address} · ${B.hours}</p>
          </div>
        </div>
        <nav class="footer__nav" aria-label="Разделы сайта">
          ${[['catalog.html', 'Каталог'], ['delivery.html', 'Доставка и оплата'], ['about.html', 'О нас'], ['reviews.html', 'Отзывы'], ['faq.html', 'Вопросы и ответы'], ['contacts.html', 'Контакты'], ['contacts.html#order', 'Индивидуальный заказ'], ['favorites.html', 'Избранное']].map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
        </nav>
        <details class="footer__cats">
          <summary class="label">Разделы каталога и подборки ${icon('plus')}</summary>
          <div class="footer__cats-in">
            ${VK.categories.concat(VK.occasions.map(o => ({ slug: o.slug, name: o.name, occ: 1 })), VK.recipients.map(o => ({ slug: o.slug, name: 'Букет ' + o.name.toLowerCase(), occ: 1 }))).map(c => `<a href="catalog.html?${c.occ ? 'occ' : 'cat'}=${c.slug}">${c.name}</a>`).join('')}
          </div>
        </details>
        <div class="footer__legal">
          <span>© ${new Date().getFullYear()} ${B.name} — демонстрационный проект</span>
          <span>Контакты, цены и отзывы на сайте вымышлены. Фото: Unsplash.</span>
        </div>
      </div>`;
  }

  /* ---------- Счётчики ---------- */
  function updateCounts() {
    const c = cart.count(), f = fav.list().length;
    $$('[data-cart-count]').forEach(e => { e.textContent = c; e.hidden = !c; });
    $$('[data-fav-count]').forEach(e => { e.textContent = f; e.hidden = !f; });
    const cb = $('[data-open-cart]'); if (cb) cb.setAttribute('aria-label', c ? `Корзина, товаров: ${c}` : 'Корзина');
  }

  /* ---------- Мини-корзина ---------- */
  function lineHTML(i, mini) {
    const p = VK.byId(i.id); const pk = VK.packs.find(x => x.key === i.pack);
    return `<li class="line" data-key="${i.key}">
      <a class="line__img" href="product.html?id=${p.id}"><img src="${img(p.imgs[0], true)}" alt="" width="400" height="500" loading="lazy"></a>
      <div class="line__info">
        <a class="line__name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <p class="line__meta">Размер ${i.size} · ${pk ? pk.name : ''}</p>
        <div class="line__row">
          <div class="qty qty--sm" role="group" aria-label="Количество">
            <button type="button" data-dec aria-label="Уменьшить">${icon('minus')}</button>
            <output aria-live="polite">${i.qty}</output>
            <button type="button" data-inc aria-label="Увеличить">${icon('plus')}</button>
          </div>
          <span class="line__price">${fmt(cart.line(i))}</span>
        </div>
      </div>
      <button class="line__rm" type="button" data-rm aria-label="Удалить ${esc(p.name)}">${icon(mini ? 'x' : 'trash')}</button>
    </li>`;
  }
  VK.lineHTML = lineHTML;
  function renderMiniCart() {
    const body = $('[data-mini-cart]'), foot = $('[data-mini-foot]'); if (!body) return;
    const items = cart.items();
    if (!items.length) {
      body.innerHTML = `<div class="empty"><p class="empty__title">Корзина пока пуста</p><p>Загляните в каталог — там сезонные букеты и наши хиты.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>`;
      foot.innerHTML = ''; return;
    }
    body.innerHTML = `<ul class="lines">${items.map(i => lineHTML(i, true)).join('')}</ul>`;
    const t = cart.total(); const left = VK.delivery.free - t;
    foot.innerHTML = `
      <p class="free-note">${left > 0 ? `До бесплатной доставки — ${fmt(left)}` : 'Доставка по Москве — бесплатно'}</p>
      <div class="progress" aria-hidden="true"><span style="transform:scaleX(${Math.min(1, t / VK.delivery.free)})"></span></div>
      <div class="sum-row"><span>Итого</span><strong>${fmt(t)}</strong></div>
      <a class="btn btn--primary btn--block" href="cart.html">Оформить заказ</a>`;
  }
  VK.bindLines = function (root) {
    root.addEventListener('click', e => {
      const li = e.target.closest('.line'); if (!li) return;
      const k = li.dataset.key; const it = cart.items().find(i => i.key === k); if (!it) return;
      if (e.target.closest('[data-inc]')) cart.setQty(k, it.qty + 1);
      else if (e.target.closest('[data-dec]')) { if (it.qty > 1) cart.setQty(k, it.qty - 1); }
      else if (e.target.closest('[data-rm]')) {
        const snapshot = cart.items();
        cart.remove(k);
        VK.toast('Букет удалён из корзины');
        const t = $('#toast'); const u = document.createElement('button'); u.type = 'button'; u.textContent = 'Вернуть'; u.className = 'toast__undo';
        u.onclick = () => { cart.save(snapshot); t.classList.remove('is-on'); }; t.appendChild(u);
      }
    });
  };

  /* ---------- Оверлеи: меню, корзина, поиск ---------- */
  let lastFocus = null, openEl = null;
  function openLayer(el) {
    closeLayer(true);
    lastFocus = document.activeElement; openEl = el;
    el.hidden = false; $('[data-scrim]').hidden = el.id === 'search';
    document.documentElement.classList.add('is-locked');
    requestAnimationFrame(() => { el.classList.add('is-open'); $('[data-scrim]').classList.add('is-open'); });
    const f = el.querySelector('input, [data-close]'); f && setTimeout(() => f.focus(), 60);
    if (el.id === 'mnav') $('[data-open-menu]').setAttribute('aria-expanded', 'true');
  }
  function closeLayer(silent) {
    if (!openEl) return;
    const el = openEl; openEl = null;
    el.classList.remove('is-open'); $('[data-scrim]').classList.remove('is-open');
    document.documentElement.classList.remove('is-locked');
    setTimeout(() => { el.hidden = true; $('[data-scrim]').hidden = true; }, reduced ? 0 : 260);
    if (el.id === 'mnav') $('[data-open-menu]').setAttribute('aria-expanded', 'false');
    if (!silent && lastFocus) lastFocus.focus();
  }
  VK.openCart = () => { renderMiniCart(); openLayer($('#mcart')); };
  VK.openLayer = openLayer; VK.closeLayer = closeLayer;

  function searchProducts(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    const words = q.split(/\s+/);
    return VK.products.filter(p => {
      const hay = [p.name, p.eyebrow, ...p.flowers.map(f => VK.flowers[f]), ...p.cats.map(c => (VK.categories.find(x => x.slug === c) || {}).name),
        ...p.occ.map(o => ((VK.occasions.concat(VK.recipients)).find(x => x.slug === o) || {}).name), ...p.colors.map(c => VK.colors[c].name), ...(p.comp || [])].join(' ').toLowerCase();
      return words.every(w => hay.includes(w.slice(0, Math.max(3, w.length - 2))));
    });
  }
  VK.searchProducts = searchProducts;
  function renderSearch(q) {
    const box = $('[data-search-res]'); if (!box) return;
    if (!q.trim()) { box.innerHTML = ''; return; }
    const r = searchProducts(q);
    box.innerHTML = r.length
      ? `<p class="search__count">Найдено: ${r.length}</p><ul class="search__list">${r.slice(0, 6).map(p => `<li><a href="product.html?id=${p.id}"><img src="${img(p.imgs[0], true)}" alt="" width="400" height="500"><span><span class="search__name">${esc(p.name)}</span><span class="search__price">от ${fmt(p.price)}</span></span></a></li>`).join('')}</ul>${r.length > 6 ? `<a class="link-arrow" href="catalog.html?q=${encodeURIComponent(q)}">Все результаты ${icon('arrow')}</a>` : ''}`
      : `<p class="search__count">Ничего не нашли по запросу «${esc(q)}». Попробуйте «розы», «пионы» или <a href="contacts.html#order">закажите индивидуальный букет</a>.</p>`;
  }

  function bindGlobal() {
    document.addEventListener('click', e => {
      const t = e.target;
      if (t.closest('[data-open-menu]')) return openLayer($('#mnav'));
      if (t.closest('[data-open-cart]')) { e.preventDefault(); return VK.openCart(); }
      if (t.closest('[data-open-search]')) return openLayer($('#search'));
      if (t.closest('[data-close]') || t.closest('[data-scrim]')) return closeLayer();
      const hint = t.closest('[data-hint]'); if (hint) { const i = $('#search-q'); i.value = hint.dataset.hint; renderSearch(i.value); i.focus(); return; }
      const fb = t.closest('[data-fav]');
      if (fb) { e.preventDefault(); const on = fav.toggle(fb.dataset.fav); VK.toast(on ? 'Добавлено в избранное' : 'Удалено из избранного', on ? { href: 'favorites.html', text: 'Открыть' } : null); return; }
      const add = t.closest('[data-add]');
      if (add) { e.preventDefault(); cart.add(add.dataset.add); add.classList.add('is-done'); setTimeout(() => add.classList.remove('is-done'), 1200); VK.toast('Букет добавлен в корзину', { href: 'cart.html', text: 'В корзину' }); return; }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeLayer(); closeMega(); }
      if (e.key === 'Tab' && openEl) { // фокус-ловушка
        const f = $$('a[href], button:not([disabled]), input, select, textarea, summary', openEl).filter(x => x.offsetParent !== null);
        if (!f.length) return; const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    const si = $('#search-q'); let st;
    si && si.addEventListener('input', () => { clearTimeout(st); st = setTimeout(() => renderSearch(si.value), 160); });
    VK.bindLines($('#mcart'));
    document.addEventListener('vk:cart', () => { updateCounts(); if (openEl && openEl.id === 'mcart') renderMiniCart(); });
    document.addEventListener('vk:fav', e => { updateCounts(); $$(`[data-fav="${e.detail.id}"]`).forEach(b => setFavBtn(b, e.detail.on)); });

    // Мега-меню
    const item = $('.has-mega'), mega = $('#mega'), tg = $('.nav__toggle');
    let mt;
    const openMega = () => { clearTimeout(mt); mega.hidden = false; requestAnimationFrame(() => mega.classList.add('is-open')); tg.setAttribute('aria-expanded', 'true'); };
    function closeMega() { if (!mega || mega.hidden) return; mega.classList.remove('is-open'); tg.setAttribute('aria-expanded', 'false'); mt = setTimeout(() => { mega.hidden = true; }, 200); }
    VK.closeMega = closeMega;
    if (item && window.matchMedia('(hover: hover)').matches) {
      [item, mega].forEach(el => { el.addEventListener('mouseenter', openMega); el.addEventListener('mouseleave', () => { mt = setTimeout(closeMega, 120); }); });
    }
    tg && tg.addEventListener('click', () => (mega.hidden ? openMega() : closeMega()));
    mega && mega.addEventListener('focusout', e => { if (!mega.contains(e.relatedTarget) && !item.contains(e.relatedTarget)) closeMega(); });

    // Тень у шапки при прокрутке
    const h = $('#site-header');
    const onS = () => h && h.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onS, { passive: true }); onS();
  }
  function closeMega() { VK.closeMega && VK.closeMega(); }

  /* ---------- Карточка букета ---------- */
  function setFavBtn(b, on) { b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); }
  VK.card = function (p, opts = {}) {
    const on = fav.has(p.id);
    const eager = opts.eager ? 'eager' : 'lazy';
    return `<article class="card${opts.cls ? ' ' + opts.cls : ''}">
      <div class="card__media">
        <a href="product.html?id=${p.id}" class="card__link" tabindex="-1" aria-hidden="true">
          <img src="${img(p.imgs[0], true)}" srcset="${img(p.imgs[0], true)} 400w, ${img(p.imgs[0])} 800w" sizes="(max-width: 767px) 50vw, 25vw" alt="${esc(p.name)} — ${esc(p.eyebrow.toLowerCase())}" width="400" height="500" loading="${eager}" decoding="async">
          <img class="card__alt" src="${img(p.imgs[1], true)}" alt="" width="400" height="500" loading="lazy" decoding="async">
        </a>
        ${p.badge ? `<span class="badge${p.badge === 'Скидка' ? ' badge--accent' : ''}">${p.badge}</span>` : ''}
        <button class="card__fav${on ? ' is-on' : ''}" type="button" data-fav="${p.id}" aria-pressed="${on}" aria-label="В избранное: ${esc(p.name)}">${icon('heart')}</button>
        <button class="card__add" type="button" data-add="${p.id}" aria-label="Добавить в корзину: ${esc(p.name)}">${icon('bag')}<span>В корзину</span></button>
      </div>
      <div class="card__body">
        <p class="label card__eyebrow">${esc(p.eyebrow)}</p>
        <h3 class="card__title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <p class="card__price">от ${fmt(p.price)}${p.oldPrice ? ` <s>${fmt(p.oldPrice)}</s>` : ''}</p>
      </div>
    </article>`;
  };

  /* ---------- Появление при прокрутке ---------- */
  VK.reveal = function (root = document) {
    const els = $$('[data-reveal]:not(.is-in)', root);
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; const kids = $$('.card, [data-stagger]', el);
      kids.forEach((k, i) => k.style.setProperty('--d', `${Math.min(i, 8) * 45}ms`));
      el.classList.add('is-in'); io.unobserve(el);
    }), { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    els.forEach(e => io.observe(e));
    // Страховка: при быстрой прокрутке/переходе по якорю показываем всё, что уже выше нижней границы экрана
    if (!VK._revealSafety) {
      VK._revealSafety = true; let t;
      window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(() => {
        $$('[data-reveal]:not(.is-in)').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); });
      }, 120); }, { passive: true });
    }
  };

  /* ---------- Валидация форм ---------- */
  VK.validate = function (form) {
    let firstBad = null;
    $$('.field__err', form).forEach(e => e.remove());
    $$('[aria-invalid]', form).forEach(e => e.removeAttribute('aria-invalid'));
    $$('input, textarea, select', form).forEach(f => {
      let msg = '';
      const v = f.value.trim();
      if (f.required && !v && f.type !== 'checkbox') msg = 'Заполните это поле';
      else if (f.type === 'checkbox' && f.required && !f.checked) msg = 'Нужно ваше согласие';
      else if (f.type === 'tel' && v && v.replace(/\D/g, '').length < 10) msg = 'Укажите номер полностью: 10–11 цифр';
      else if (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) msg = 'Проверьте адрес: пример name@mail.ru';
      if (msg) {
        const id = (f.id || f.name) + '-err';
        const e = document.createElement('p'); e.className = 'field__err'; e.id = id; e.setAttribute('role', 'alert'); e.textContent = msg;
        (f.closest('.field') || f.parentElement).appendChild(e);
        f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', id);
        firstBad = firstBad || f;
      }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  };
  VK.phoneMask = function (inp) {
    inp.addEventListener('input', () => {
      let d = inp.value.replace(/\D/g, ''); if (d.startsWith('8')) d = '7' + d.slice(1); if (!d.startsWith('7')) d = '7' + d; d = d.slice(0, 11);
      const p = ['+7'];
      if (d.length > 1) p.push(' (' + d.slice(1, 4)); if (d.length >= 4) p.push(') ' + d.slice(4, 7)); if (d.length >= 7) p.push('-' + d.slice(7, 9)); if (d.length >= 9) p.push('-' + d.slice(9, 11));
      inp.value = p.join('');
    });
  };
  /* Универсальная демо-форма: заявка/обратная связь */
  VK.bindForm = function (form, okText) {
    if (!form) return;
    $$('input[type="tel"]', form).forEach(VK.phoneMask);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!VK.validate(form)) return;
      const btn = form.querySelector('[type="submit"]'); btn.disabled = true; btn.classList.add('is-loading');
      setTimeout(() => {
        btn.disabled = false; btn.classList.remove('is-loading');
        form.innerHTML = `<div class="form-ok" tabindex="-1">${icon('check')}<p class="form-ok__title">Спасибо, заявка принята</p><p>${okText || 'Менеджер свяжется с вами в течение 15 минут в рабочее время.'}</p><p class="muted small">Демо-режим: данные никуда не отправляются.</p></div>`;
        form.querySelector('.form-ok').focus();
      }, 700);
    });
  };

  /* ---------- Модальное окно «Заказать звонок» ---------- */
  VK.callback = function (context) {
    let m = $('#cb-modal');
    if (!m) {
      m = document.createElement('div'); m.id = 'cb-modal'; m.className = 'modal'; m.hidden = true;
      m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'cb-title');
      document.body.appendChild(m);
    }
    m.innerHTML = `<div class="modal__box">
        <button class="icon-btn modal__x" type="button" aria-label="Закрыть" data-close>${icon('x')}</button>
        <h2 class="h3" id="cb-title">Звонок флориста</h2>
        <p class="muted">${context ? `Букет «${esc(context)}». ` : ''}Перезвоним в течение 15 минут, поможем с выбором и оформим заказ.</p>
        <form class="form" novalidate>
          <div class="field"><label for="cb-name">Имя</label><input id="cb-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="cb-phone">Телефон <span aria-hidden="true">*</span></label><input id="cb-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>
          <button class="btn btn--primary btn--block" type="submit">Жду звонка</button>
          <p class="small muted">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
        </form></div>`;
    VK.bindForm($('form', m));
    openLayer(m);
    $('[data-scrim]').hidden = false;
  };

  /* ---------- Аккордеоны (плавное раскрытие details) ---------- */
  VK.accordions = function (root = document) {
    $$('details.acc', root).forEach(d => {
      const s = $('summary', d), body = $('.acc__body', d); if (!body || d._b) return; d._b = 1;
      s.addEventListener('click', e => {
        if (reduced) return;
        e.preventDefault();
        if (d.open) {
          body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 200, easing: 'cubic-bezier(.55,.06,.68,.19)' }).onfinish = () => { d.open = false; };
        } else {
          d.open = true; const h = body.offsetHeight;
          body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.22,.61,.36,1)' });
        }
      });
    });
  };

  /* ---------- Инициализация ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderHeader(); renderFooter(); bindGlobal(); updateCounts();
    const pg = document.body.dataset.page;
    if (VK.pages && VK.pages[pg]) VK.pages[pg]();
    VK.accordions(); VK.reveal();
    $$('form[data-demo-form]').forEach(f => VK.bindForm(f, f.dataset.ok));
  });
  VK.pages = VK.pages || {};
})();
