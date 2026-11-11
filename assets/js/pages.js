/* VERESK — логика страниц */
(function () {
  const VK = window.VK; const { $, $$, esc, fmt, img, icon } = VK;
  const occAll = () => VK.occasions.concat(VK.recipients);
  const catName = s => (VK.categories.find(c => c.slug === s) || {}).name;
  const stars = n => `<span class="stars" aria-label="Оценка ${n} из 5">${[1, 2, 3, 4, 5].map(i => icon('star', i > n ? 'off' : '')).join('')}</span>`;
  const reviewHTML = r => `<article class="review" data-stagger>${stars(r.rating)}<p class="review__text">«${esc(r.text)}»</p><p class="review__by"><span><strong>${esc(r.name)}</strong> · ${esc(r.date)}</span><span>${esc(r.product || '')}</span></p></article>`;
  const accHTML = (q, a, cls = '') => `<details class="acc ${cls}"><summary>${q}${icon('plus')}</summary><div class="acc__body"><div>${a}</div></div></details>`;
  VK.reviewHTML = reviewHTML; VK.accHTML = accHTML;

  /* ================= ГЛАВНАЯ ================= */
  VK.pages.home = function () {
    // Слайдер
    const hero = $('.hero'); const slides = $$('.hero__slide', hero), copies = $$('.hero__copy', hero), dots = $$('.hero__dot', hero);
    let i = 0, timer; const T = 6500;
    hero.style.setProperty('--hero-t', T + 'ms');
    function go(n) {
      dots.forEach((d, k) => { d.classList.remove('is-active'); d.classList.toggle('is-done', k < n); d.setAttribute('aria-current', k === n ? 'true' : 'false'); });
      slides.forEach((s, k) => s.classList.toggle('is-active', k === n));
      copies.forEach((c, k) => { c.classList.toggle('is-active', k === n); c.setAttribute('aria-hidden', k !== n); });
      void dots[n].offsetWidth; dots[n].classList.add('is-active'); i = n; schedule();
    }
    function schedule() { clearTimeout(timer); if (!VK.reduced && !hero.classList.contains('is-paused')) timer = setTimeout(() => go((i + 1) % slides.length), T); }
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    const pb = $('.hero__pause');
    const setPause = on => { hero.classList.toggle('is-paused', on); pb.setAttribute('aria-label', on ? 'Продолжить показ' : 'Остановить показ'); pb.innerHTML = on ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>'; if (on) clearTimeout(timer); else go(i); };
    pb.addEventListener('click', () => setPause(!hero.classList.contains('is-paused')));
    hero.addEventListener('focusin', () => { hero.classList.add('is-paused'); clearTimeout(timer); });
    if (VK.reduced) setPause(true);
    go(0);
    // Свайп
    let sx = null; hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go((i + (dx < 0 ? 1 : slides.length - 1)) % slides.length); sx = null; });

    // Категории
    const tiles = ['avtorskie', 'rozy', 'piony', 'tyulpany', 'sezonnye', 'premium', 'korziny'].map(s => VK.categories.find(c => c.slug === s));
    $('#home-cats').innerHTML = tiles.map(c => `<a class="cat" href="catalog.html?cat=${c.slug}" data-stagger>
        <div class="cat__img"><img src="${img(c.img, true)}" srcset="${img(c.img, true)} 400w, ${img(c.img)} 800w" sizes="(max-width:1023px) 50vw, 25vw" alt="" width="400" height="500" loading="lazy"></div>
        <span class="cat__name">${c.name}${icon('arrow')}</span></a>`).join('') +
      `<a class="cat cat--custom" href="contacts.html#order" data-stagger><div class="cat__img"><div><p>Соберём букет по&nbsp;вашему описанию</p><span class="label" style="color:inherit">Оставить заявку</span></div></div><span class="cat__name">Индивидуальный заказ${icon('arrow')}</span></a>`;

    // Сезон
    $('#home-season').innerHTML = VK.products.filter(p => p.season).sort((a, b) => b.popular - a.popular).slice(0, 4).map(p => VK.card(p)).join('');

    // Популярные с вкладками
    const tabs = [['all', 'Все'], ['rozy', 'Розы'], ['piony', 'Пионы'], ['tyulpany', 'Тюльпаны'], ['mono', 'Монобукеты']];
    const tl = $('#pop-tabs'), pg = $('#home-popular');
    tl.innerHTML = tabs.map(([k, n], j) => `<button class="chip${j ? '' : ' is-active'}" role="tab" type="button" id="tab-${k}" aria-selected="${!j}" aria-controls="home-popular" data-tab="${k}">${n}</button>`).join('');
    const drawPop = k => {
      pg.innerHTML = VK.products.filter(p => k === 'all' || p.cats.includes(k)).sort((a, b) => b.popular - a.popular).slice(0, 8).map(p => VK.card(p)).join('');
      pg.setAttribute('aria-labelledby', 'tab-' + k);
      if (!VK.reduced) pg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
    };
    tl.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; $$('[data-tab]', tl).forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); }); drawPop(b.dataset.tab); });
    tl.addEventListener('keydown', e => { if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return; const all = $$('[data-tab]', tl); const n = all.indexOf(document.activeElement) + (e.key === 'ArrowRight' ? 1 : -1); const t = all[(n + all.length) % all.length]; t.focus(); t.click(); });
    drawPop('all');

    // Бестселлеры
    $('#home-best').innerHTML = VK.products.slice().sort((a, b) => b.popular - a.popular).slice(0, 4).map((p, k) => VK.card(p).replace('<div class="card__media">', `<div class="card__media"><span class="rank" aria-hidden="true">${String(k + 1).padStart(2, '0')}</span>`)).join('');

    // Отзывы и FAQ
    $('#home-reviews').innerHTML = VK.reviews.slice(0, 3).map(reviewHTML).join('');
    $('#home-faq').innerHTML = VK.faq.slice(0, 6).map(f => accHTML(f.q, f.a)).join('');

    // Подборка по поводу
    const row = (t, list) => `<div class="picker__row"><p class="label">${t}</p><div class="picker__links">${list.map(o => `<a class="chip" href="catalog.html?${o.f || 'occ'}=${o.slug}">${o.name}</a>`).join('')}</div></div>`;
    $('#picker').innerHTML = row('По поводу', VK.occasions) + row('Для кого', VK.recipients) +
      row('По цветку', [{ f: 'cat', slug: 'rozy', name: 'Розы' }, { f: 'cat', slug: 'piony', name: 'Пионы' }, { f: 'cat', slug: 'tyulpany', name: 'Тюльпаны' }, { f: 'flower', slug: 'dahlia', name: 'Георгины' }, { f: 'flower', slug: 'hydrangea', name: 'Гортензии' }, { f: 'cat', slug: 'mono', name: 'Монобукеты' }]) +
      row('По бюджету', [{ f: 'max', slug: 8000, name: 'До 8 000 ₽' }, { f: 'max', slug: 15000, name: 'До 15 000 ₽' }, { f: 'min', slug: 15000, name: 'От 15 000 ₽' }]);
  };

  /* ================= КАТАЛОГ ================= */
  VK.pages.catalog = function () {
    const P = VK.params();
    const S = {
      cat: P.get('cat') || '', q: P.get('q') || '', sort: P.get('sort') || 'popular',
      occ: P.getAll('occ'), flower: P.getAll('flower'), color: P.getAll('color'),
      min: +P.get('min') || 0, max: +P.get('max') || 0
    };
    const grid = $('#cat-grid');
    const filtersBox = $('#filters-body');

    function filtered(st = S) {
      let l = VK.products.filter(p =>
        (!st.cat || p.cats.includes(st.cat)) &&
        (!st.occ.length || st.occ.some(o => p.occ.includes(o))) &&
        (!st.flower.length || st.flower.some(f => p.flowers.includes(f))) &&
        (!st.color.length || st.color.some(c => p.colors.includes(c))) &&
        (!st.min || p.price >= st.min) && (!st.max || p.price <= st.max));
      if (st.q) { const ids = VK.searchProducts(st.q).map(p => p.id); l = l.filter(p => ids.includes(p.id)); }
      const s = { popular: (a, b) => b.popular - a.popular, asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price, new: (a, b) => b.created - a.created }[st.sort];
      return l.sort(s || ((a, b) => b.popular - a.popular));
    }
    function syncURL() {
      const u = new URLSearchParams();
      if (S.cat) u.set('cat', S.cat); if (S.q) u.set('q', S.q); if (S.sort !== 'popular') u.set('sort', S.sort);
      S.occ.forEach(v => u.append('occ', v)); S.flower.forEach(v => u.append('flower', v)); S.color.forEach(v => u.append('color', v));
      if (S.min) u.set('min', S.min); if (S.max) u.set('max', S.max);
      history.replaceState(null, '', 'catalog.html' + (u.toString() ? '?' + u : ''));
    }
    function title() {
      if (S.q) return `Поиск: «${esc(S.q)}»`;
      if (S.cat) return catName(S.cat) || 'Каталог';
      if (S.occ.length === 1) { const o = occAll().find(x => x.slug === S.occ[0]); if (o) return o.slug in { love: 1, mama: 1, colleague: 1, bride: 1, kids: 1 } ? 'Букеты ' + o.name.toLowerCase() : 'Букеты ' + o.name.toLowerCase().replace('на ', 'на ').replace('букет на сегодня', 'на сегодня'); }
      return 'Каталог букетов';
    }
    function activeChips() {
      const ch = [];
      S.occ.forEach(v => { const o = occAll().find(x => x.slug === v); o && ch.push(['occ', v, o.name]); });
      S.flower.forEach(v => ch.push(['flower', v, VK.flowers[v]]));
      S.color.forEach(v => ch.push(['color', v, VK.colors[v].name]));
      if (S.min) ch.push(['min', S.min, 'от ' + fmt(S.min)]);
      if (S.max) ch.push(['max', S.max, 'до ' + fmt(S.max)]);
      if (S.q) ch.push(['q', S.q, '«' + S.q + '»']);
      return ch;
    }
    function render() {
      const list = filtered();
      $('#cat-title').innerHTML = title();
      document.title = title().replace(/&[^;]+;/g, '"') + ' — Вереск';
      $('#crumb-cur').textContent = S.cat ? catName(S.cat) : (S.q ? 'Поиск' : 'Каталог');
      $('#cat-count').textContent = `${list.length} ${plural(list.length, ['букет', 'букета', 'букетов'])}`;
      $$('#subcats .chip').forEach(c => { const on = c.dataset.cat === S.cat; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
      $('#sort').value = S.sort;
      const ch = activeChips();
      $('#active-filters').innerHTML = ch.map(([k, v, n]) => `<button class="chip" type="button" data-rmf="${k}" data-v="${esc(v)}" aria-label="Убрать фильтр ${esc(n)}">${esc(n)} ${icon('x')}</button>`).join('') + (ch.length > 1 ? `<button class="chip" type="button" data-reset>Сбросить всё</button>` : '');
      const nf = S.occ.length + S.flower.length + S.color.length + (S.min ? 1 : 0) + (S.max ? 1 : 0);
      $('#filter-btn-n').textContent = nf ? `(${nf})` : '';
      grid.innerHTML = list.length ? list.map((p, k) => VK.card(p, { eager: k < 4 })).join('') :
        `<div class="cat-empty empty"><p class="empty__title">Таких букетов пока нет</p><p>Попробуйте ослабить фильтры — или флорист соберёт букет специально для вас.</p><div style="display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center"><button class="btn btn--outline" type="button" data-reset>Сбросить фильтры</button><a class="btn btn--primary" href="contacts.html#order">Индивидуальный заказ</a></div></div>`;
      grid.classList.remove('is-in'); VK.reveal(grid.parentElement);
      requestAnimationFrame(() => grid.classList.add('is-in'));
      syncURL(); drawFilters();
    }
    function plural(n, f) { const a = n % 100, b = n % 10; return f[a > 10 && a < 20 ? 2 : b === 1 ? 0 : b >= 2 && b <= 4 ? 1 : 2]; }

    // Подкатегории
    $('#subcats').innerHTML = `<button class="chip" type="button" data-cat="">Все</button>` + VK.categories.map(c => `<button class="chip" type="button" data-cat="${c.slug}">${c.name}</button>`).join('');
    $('#subcats').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; S.cat = b.dataset.cat; S.q = ''; render(); });
    $('#sort').addEventListener('change', e => { S.sort = e.target.value; render(); });
    document.addEventListener('click', e => {
      const r = e.target.closest('[data-rmf]');
      if (r) { const k = r.dataset.rmf, v = r.dataset.v; if (Array.isArray(S[k])) S[k] = S[k].filter(x => x !== v); else S[k] = k === 'q' ? '' : 0; render(); }
      if (e.target.closest('[data-reset]')) { Object.assign(S, { occ: [], flower: [], color: [], min: 0, max: 0, q: '' }); render(); }
    });

    // Фильтры (панель)
    const group = (key, t, items) => `<div class="filters__group"><h3>${t}</h3><div class="filters__list">${items.map(([v, n, sw]) => `<button type="button" class="chip" data-f="${key}" data-v="${v}" aria-pressed="${S[key].includes(v)}">${sw ? `<span class="swatch" style="background:${sw}"></span>` : ''}${n}</button>`).join('')}</div></div>`;
    function drawFilters() {
      filtersBox.innerHTML =
        group('occ', 'Повод', VK.occasions.map(o => [o.slug, o.name])) +
        group('occ', 'Для кого', VK.recipients.map(o => [o.slug, o.name])) +
        group('flower', 'Цветы', Object.entries(VK.flowers).map(([k, v]) => [k, v])) +
        group('color', 'Цвет', Object.entries(VK.colors).map(([k, v]) => [k, v.name, v.hex])) +
        `<div class="filters__group"><h3>Цена, ₽</h3><div class="price-range">
          <div class="field"><label for="f-min">от</label><input id="f-min" type="number" inputmode="numeric" min="0" step="500" placeholder="3 900" value="${S.min || ''}"></div>
          <div class="field"><label for="f-max">до</label><input id="f-max" type="number" inputmode="numeric" min="0" step="500" placeholder="32 000" value="${S.max || ''}"></div></div></div>`;
      $('#filters-apply').textContent = `Показать ${filtered().length}`;
    }
    filtersBox.addEventListener('click', e => {
      const b = e.target.closest('[data-f]'); if (!b) return;
      const k = b.dataset.f, v = b.dataset.v;
      S[k] = S[k].includes(v) ? S[k].filter(x => x !== v) : [...S[k], v];
      render();
      const again = $(`[data-f="${k}"][data-v="${v}"]`, filtersBox); again && again.focus();
    });
    filtersBox.addEventListener('change', e => {
      if (e.target.id === 'f-min') S.min = Math.max(0, +e.target.value || 0);
      if (e.target.id === 'f-max') S.max = Math.max(0, +e.target.value || 0);
      render();
    });
    $('#filter-open').addEventListener('click', () => VK.openLayer($('#filters')));
    $('#filters-apply').addEventListener('click', () => VK.closeLayer());
    $('#filters-reset').addEventListener('click', () => { Object.assign(S, { occ: [], flower: [], color: [], min: 0, max: 0 }); render(); });
    render();
  };

  /* ================= ТОВАР ================= */
  VK.pages.product = function () {
    const p = VK.byId(VK.params().get('id'));
    const root = $('#product');
    if (!p) {
      root.innerHTML = `<div class="empty" style="padding:6rem 0"><p class="empty__title">Букет не найден</p><p>Возможно, он закончился или ссылка устарела.</p><a class="btn btn--primary" href="catalog.html">В каталог</a></div>`;
      return;
    }
    document.title = `${p.name} — ${p.eyebrow.toLowerCase()} с доставкой — Вереск`;
    const st = { size: 'M', pack: 'paper', qty: 1 };
    const gimgs = p.imgs.slice(0, 3);
    const tags = ['Размер M', 'Размер L', 'Размер S'];
    const c0 = p.cats[0];
    const sizeName = { S: 'Компактный', M: 'Стандарт', L: 'Пышный', XL: 'Роскошный' };
    root.innerHTML = `
      <nav aria-label="Хлебные крошки"><ol class="crumbs"><li><a href="index.html">Главная</a></li><li><a href="catalog.html">Каталог</a></li><li><a href="catalog.html?cat=${c0}">${catName(c0)}</a></li><li aria-current="page">${esc(p.name)}</li></ol></nav>
      <div class="pd">
        <div>
          <p class="gallery__note">На фото — разные сборки этого букета. Цветы могут меняться по сезону, гамма и размер сохраняются. Фото вашего букета пришлём до отправки.</p>
          <div class="gallery" id="gallery" aria-label="Фотографии букета">
            ${gimgs.map((g, k) => `<button class="gallery__item" type="button" data-k="${k}" aria-label="Увеличить фото ${k + 1}"><img src="${img(g)}" alt="${esc(p.name)}, фото ${k + 1}" width="800" height="1000" ${k ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"><span class="gallery__tag">${tags[k]}</span></button>`).join('')}
          </div>
          <div class="gallery__dots" aria-hidden="true">${gimgs.map((_, k) => `<span class="${k ? '' : 'is-on'}"></span>`).join('')}</div>
        </div>
        <div class="pinfo">
          <div class="pinfo__top">
            <div><p class="label">${esc(p.eyebrow)}</p><h1>${esc(p.name)}</h1></div>
            <button class="pfav${VK.fav.has(p.id) ? ' is-on' : ''}" type="button" data-fav="${p.id}" aria-pressed="${VK.fav.has(p.id)}" aria-label="В избранное">${icon('heart')}</button>
          </div>
          <div class="pinfo__tags">${p.badge ? `<span class="tag">${p.badge}</span>` : ''}${p.cats.map(c => `<a class="tag" href="catalog.html?cat=${c}">${catName(c)}</a>`).join('')}</div>
          <p class="pprice" aria-live="polite"><span id="pprice"></span>${p.oldPrice ? `<s id="pold"></s>` : ''}</p>
          <fieldset class="pgroup fieldset" style="gap:0">
            <div class="pgroup__head"><legend class="legend" style="font:inherit;font-size:var(--fs-12);font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin:0">Размер</legend><span id="pdiam"></span></div>
            <div class="opts">${VK.sizes.map(s => `<label class="opt opt--size"><input type="radio" name="size" value="${s.key}" ${s.key === st.size ? 'checked' : ''}><span>${s.key}<small>${sizeName[s.key]}</small></span></label>`).join('')}</div>
          </fieldset>
          <fieldset class="pgroup fieldset" style="gap:0">
            <div class="pgroup__head"><legend style="font-size:var(--fs-12);font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin:0;padding:0">Оформление</legend></div>
            <div class="opts">${VK.packs.map(k => `<label class="opt"><input type="radio" name="pack" value="${k.key}" ${k.key === st.pack ? 'checked' : ''}><span>${k.name}<small>${k.add ? '+ ' + fmt(k.add) : 'включено'}</small></span></label>`).join('')}</div>
          </fieldset>
          <div class="pbuy">
            <div class="qty" role="group" aria-label="Количество"><button type="button" id="q-dec" aria-label="Уменьшить">${icon('minus')}</button><input id="q-val" type="number" min="1" max="99" value="1" aria-label="Количество"><button type="button" id="q-inc" aria-label="Увеличить">${icon('plus')}</button></div>
            <button class="btn btn--primary" type="button" id="buy"><span>В корзину</span><span class="btn__sep"></span><span id="buy-meta"></span></button>
          </div>
          <button class="btn btn--outline btn--block" type="button" id="callme">${icon('phone')} Звонок флориста</button>
          <ul class="perks">
            <li>${icon('camera')} Пришлём фото букета перед отправкой</li>
            <li>${icon('drop')} Влажная упаковка, подкормка и инструкция по уходу</li>
            <li>${icon('pen')} Подпишем открытку от руки — бесплатно</li>
          </ul>
          <div class="pdesc is-clamped" id="pdesc"><p>${esc(p.desc)}</p><button class="link-arrow" type="button" aria-expanded="false">Читать полностью</button></div>
          <div>
            ${accHTML('Состав', `<ul class="comp">${(p.comp || []).map(c => `<li><span>${esc(c)}</span></li>`).join('')}</ul><p class="small muted" style="margin-top:.75rem">Состав указан для размера M. В других размерах меняется количество цветов.</p>`, 'acc--sm')}
            ${accHTML('Размеры', `<table class="sizes-table"><thead><tr><th>Размер</th><th>Диаметр</th><th>Цена</th></tr></thead><tbody>${VK.sizes.map(s => `<tr><td>${s.key} · ${sizeName[s.key]}</td><td>≈ ${s.d} см</td><td>${fmt(VK.priceFor(p, s.key))}</td></tr>`).join('')}</tbody></table>`, 'acc--sm')}
            ${accHTML('Доставка', `<p>По Москве в пределах МКАД — ${fmt(VK.delivery.cost)}, бесплатно от ${fmt(VK.delivery.free)}. Срочная доставка за 2–3 часа — ${fmt(VK.delivery.express)}. Интервал — 2 часа, круглосуточно при заказе до 20:00.</p><a class="link-arrow" href="delivery.html">Подробнее о доставке ${icon('arrow')}</a>`, 'acc--sm')}
            ${accHTML('Гарантии', `<p>Если букет не понравится или начнёт вянуть раньше 3 дней при соблюдении инструкции — заменим бесплатно. Напишите нам с фото в течение 24 часов.</p>`, 'acc--sm')}
          </div>
        </div>
      </div>`;

    const priceEl = $('#pprice'), oldEl = $('#pold'), meta = $('#buy-meta'), qv = $('#q-val');
    function update() {
      const pr = VK.priceFor(p, st.size, st.pack);
      priceEl.textContent = fmt(pr * st.qty);
      if (oldEl) oldEl.textContent = fmt(Math.round(p.oldPrice * VK.sizes.find(s => s.key === st.size).k / 100) * 100 * st.qty + VK.packs.find(k => k.key === st.pack).add * st.qty);
      meta.textContent = `${st.size} · ${fmt(pr * st.qty)}`;
      $('#pdiam').textContent = `диаметр ≈ ${VK.sizes.find(s => s.key === st.size).d} см`;
      qv.value = st.qty;
      const sb = $('#sticky-price'); if (sb) sb.textContent = fmt(pr * st.qty);
    }
    root.addEventListener('change', e => {
      if (e.target.name === 'size') st.size = e.target.value;
      if (e.target.name === 'pack') st.pack = e.target.value;
      if (e.target.id === 'q-val') st.qty = Math.max(1, Math.min(99, +e.target.value || 1));
      update();
    });
    $('#q-dec').onclick = () => { st.qty = Math.max(1, st.qty - 1); update(); };
    $('#q-inc').onclick = () => { st.qty = Math.min(99, st.qty + 1); update(); };
    const buy = () => { VK.cart.add(p.id, st.size, st.pack, st.qty); VK.toast(`«${p.name}» в корзине`, { href: 'cart.html', text: 'Оформить' }); setTimeout(VK.openCart, 250); };
    $('#buy').onclick = buy;
    $('#callme').onclick = () => VK.callback(p.name);
    const d = $('#pdesc'), db = $('button', d);
    db.onclick = () => { const open = d.classList.toggle('is-clamped'); db.textContent = open ? 'Читать полностью' : 'Свернуть'; db.setAttribute('aria-expanded', !open); };
    update();

    // Галерея: точки + лайтбокс
    const gal = $('#gallery'), gd = $$('.gallery__dots span');
    gal.addEventListener('scroll', () => { const k = Math.round(gal.scrollLeft / gal.clientWidth); gd.forEach((s, j) => s.classList.toggle('is-on', j === k)); }, { passive: true });
    gal.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) lightbox(+b.dataset.k); });
    function lightbox(k) {
      const lb = document.createElement('div'); lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Просмотр фото');
      const draw = () => { lb.innerHTML = `<img src="${img(gimgs[k])}" alt="${esc(p.name)}, фото ${k + 1}" width="800" height="1000"><button class="icon-btn lightbox__x" aria-label="Закрыть">${icon('x')}</button><button class="icon-btn lightbox__prev" aria-label="Предыдущее фото">${icon('arrowL')}</button><button class="icon-btn lightbox__next" aria-label="Следующее фото">${icon('arrow')}</button>`; $('.lightbox__x', lb).focus(); };
      const close = () => { lb.remove(); document.removeEventListener('keydown', key); document.documentElement.classList.remove('is-locked'); gal.querySelector(`[data-k="${k}"]`).focus(); };
      const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { k = (k + 1) % gimgs.length; draw(); } if (e.key === 'ArrowLeft') { k = (k + gimgs.length - 1) % gimgs.length; draw(); } };
      lb.addEventListener('click', e => { if (e.target.closest('.lightbox__x') || e.target === lb) close(); else if (e.target.closest('.lightbox__next')) { k = (k + 1) % gimgs.length; draw(); } else if (e.target.closest('.lightbox__prev')) { k = (k + gimgs.length - 1) % gimgs.length; draw(); } });
      document.addEventListener('keydown', key); document.body.appendChild(lb); document.documentElement.classList.add('is-locked'); draw();
    }

    // Липкая кнопка на мобильном
    const sb = document.createElement('div'); sb.className = 'sticky-buy';
    sb.innerHTML = `<span class="sticky-buy__p" id="sticky-price"></span><button class="btn btn--primary" type="button">В корзину</button>`;
    document.body.appendChild(sb); $('button', sb).onclick = buy; update();
    const mainBuy = $('#buy'); let raf = 0;
    const checkSticky = () => { raf = 0; sb.classList.toggle('is-on', mainBuy.getBoundingClientRect().bottom < 0); };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(checkSticky); }, { passive: true });
    checkSticky();

    // Похожие
    const sim = VK.products.filter(x => x.id !== p.id).map(x => ({ x, s: x.cats.filter(c => p.cats.includes(c)).length * 3 + x.flowers.filter(f => p.flowers.includes(f)).length * 2 + x.colors.filter(c => p.colors.includes(c)).length }))
      .sort((a, b) => b.s - a.s || b.x.popular - a.x.popular).slice(0, 4).map(o => o.x);
    $('#similar').innerHTML = sim.map(x => VK.card(x)).join('');
  };

  /* ================= КОРЗИНА + ОФОРМЛЕНИЕ ================= */
  VK.pages.cart = function () {
    const root = $('#cart-root');
    let delivery = 'standard';
    const dCost = () => delivery === 'pickup' ? 0 : delivery === 'express' ? VK.delivery.express : (VK.cart.total() >= VK.delivery.free ? 0 : VK.delivery.cost);
    function summary() {
      const t = VK.cart.total(), dc = dCost();
      $('#sum').innerHTML = `<h2>Ваш заказ</h2><dl>
        <dt>Букеты (${VK.cart.count()})</dt><dd>${fmt(t)}</dd>
        <dt>Доставка</dt><dd>${dc ? fmt(dc) : 'бесплатно'}</dd>
        <dt>Открытка</dt><dd>бесплатно</dd>
        <dt style="align-self:end">Итого</dt><dd class="total">${fmt(t + dc)}</dd></dl>
        ${t < VK.delivery.free && delivery === 'standard' ? `<p class="free-note">Добавьте букетов на ${fmt(VK.delivery.free - t)} — и доставка будет бесплатной</p><div class="progress"><span style="transform:scaleX(${t / VK.delivery.free})"></span></div>` : ''}
        <button class="btn btn--primary btn--block" type="submit" form="checkout">Оформить заказ</button>
        <p class="small muted" style="margin-top:.75rem">Демо-сайт: оплата не проводится, заказ никуда не отправляется.</p>`;
    }
    function draw() {
      const items = VK.cart.items();
      if (!items.length) {
        root.innerHTML = `<div class="empty" style="padding:5rem 0"><p class="empty__title">В корзине пока пусто</p><p>Выберите букет в каталоге или закажите индивидуальный.</p><div style="display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center"><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a><a class="btn btn--outline" href="contacts.html#order">Индивидуальный заказ</a></div></div>`;
        return;
      }
      if (!$('#checkout')) build();
      $('#cart-lines').innerHTML = items.map(i => VK.lineHTML(i)).join('');
      summary();
    }
    function build() {
      const today = new Date(); const iso = d => d.toISOString().slice(0, 10);
      root.innerHTML = `
        <div class="cartp">
          <div>
            <ol class="steps" aria-label="Шаги оформления"><li class="is-on">1. Корзина</li><li class="is-on">2. Доставка</li><li>3. Подтверждение</li></ol>
            <ul class="lines" id="cart-lines"></ul>
            <form class="form" id="checkout" novalidate style="margin-top:3rem;gap:2.5rem">
              <fieldset class="fieldset"><legend>Ваши контакты</legend>
                <div class="form__row">
                  <div class="field"><label for="c-name">Имя <span aria-hidden="true">*</span></label><input id="c-name" name="name" autocomplete="name" required></div>
                  <div class="field"><label for="c-phone">Телефон <span aria-hidden="true">*</span></label><input id="c-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></div>
                </div>
                <div class="field"><label for="c-email">E-mail</label><input id="c-email" name="email" type="email" autocomplete="email" inputmode="email"><p class="field__hint">Пришлём чек и фото букета перед отправкой</p></div>
                <label class="check"><input type="checkbox" id="c-self" checked> Я сам(а) получу букет</label>
                <div class="form__row" id="recipient" hidden>
                  <div class="field"><label for="r-name">Имя получателя <span aria-hidden="true">*</span></label><input id="r-name" name="rname"></div>
                  <div class="field"><label for="r-phone">Телефон получателя <span aria-hidden="true">*</span></label><input id="r-phone" name="rphone" type="tel" inputmode="tel" placeholder="+7 (___) ___-__-__"></div>
                </div>
              </fieldset>
              <fieldset class="fieldset"><legend>Доставка</legend>
                <div class="opts" role="radiogroup">
                  <label class="opt"><input type="radio" name="dtype" value="standard" checked><span>Курьером по Москве<small>${fmt(VK.delivery.cost)}, бесплатно от ${fmt(VK.delivery.free)}</small></span></label>
                  <label class="opt"><input type="radio" name="dtype" value="express"><span>Срочно за 2–3 часа<small>${fmt(VK.delivery.express)}</small></span></label>
                  <label class="opt"><input type="radio" name="dtype" value="pickup"><span>Самовывоз из студии<small>бесплатно</small></span></label>
                </div>
                <div class="form__row">
                  <div class="field"><label for="c-date">Дата <span aria-hidden="true">*</span></label><input id="c-date" name="date" type="date" min="${iso(today)}" value="${iso(today)}" required></div>
                  <div class="field"><label for="c-time">Интервал</label><select id="c-time" name="time">${['09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00', '21:00–23:00'].map(t => `<option>${t}</option>`).join('')}</select></div>
                </div>
                <div class="field" id="addr-field"><label for="c-addr">Адрес <span aria-hidden="true">*</span></label><input id="c-addr" name="address" autocomplete="street-address" required placeholder="Улица, дом, квартира"><p class="field__hint">Не знаете адрес? Напишите «уточнить у получателя» — мы сами позвоним.</p></div>
                <div class="field"><label for="c-card">Текст открытки</label><textarea id="c-card" name="card" maxlength="300" placeholder="Подпишем от руки"></textarea></div>
              </fieldset>
              <fieldset class="fieldset"><legend>Оплата</legend>
                <div class="opts">
                  <label class="opt"><input type="radio" name="pay" value="card" checked><span>${icon('card')} Картой онлайн<small>демо</small></span></label>
                  <label class="opt"><input type="radio" name="pay" value="sbp"><span>СБП<small>демо</small></span></label>
                  <label class="opt"><input type="radio" name="pay" value="link"><span>Ссылка от менеджера<small>после подтверждения</small></span></label>
                </div>
                <p class="demo-note">${icon('shield')}<span>Это демонстрационный магазин: реальная оплата не подключена, деньги не списываются. После нажатия «Оформить заказ» вы увидите экран подтверждения.</span></p>
                <label class="check"><input type="checkbox" name="agree" required> Согласен(на) с условиями оферты и обработкой персональных данных</label>
              </fieldset>
            </form>
          </div>
          <aside class="summary" id="sum" aria-label="Итог заказа"></aside>
        </div>`;
      VK.bindLines($('#cart-lines'));
      $$('input[type="tel"]', root).forEach(VK.phoneMask);
      const self = $('#c-self'), rec = $('#recipient');
      self.onchange = () => { rec.hidden = self.checked; $$('input', rec).forEach(i => { i.required = !self.checked; }); };
      root.addEventListener('change', e => {
        if (e.target.name === 'dtype') { delivery = e.target.value; const pick = delivery === 'pickup'; $('#addr-field').hidden = pick; $('#c-addr').required = !pick; summary(); }
      });
      $('#checkout').addEventListener('submit', e => {
        e.preventDefault(); const f = e.target;
        if (!VK.validate(f)) return;
        const btn = $('#sum [type="submit"]'); btn.disabled = true; btn.classList.add('is-loading');
        setTimeout(() => {
          const no = 'VR-' + String(Date.now()).slice(-6);
          const order = { no, items: VK.cart.items(), total: VK.cart.total() + dCost(), date: f.date.value, time: f.time.value, created: new Date().toISOString() };
          const orders = VK.store.get('orders', []); orders.unshift(order); VK.store.set('orders', orders.slice(0, 10));
          VK.cart.clear();
          root.innerHTML = `<div class="success" tabindex="-1">${icon('check')}<p class="label">Заказ ${no}</p><h1 class="h1">Спасибо! Заказ оформлен</h1>
            <p class="lead">Флорист соберёт букет к ${new Date(order.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}, ${order.time}. Перед отправкой мы пришлём фото на согласование.</p>
            <p class="demo-note">${icon('shield')}<span>Демо-режим: заказ сохранён только в вашем браузере, оплата не проводилась. Сумма заказа — ${fmt(order.total)}.</span></p>
            <div style="display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center"><a class="btn btn--primary" href="catalog.html">Вернуться в каталог</a><a class="btn btn--outline" href="index.html">На главную</a></div></div>`;
          $('.success').focus(); window.scrollTo({ top: 0, behavior: VK.reduced ? 'auto' : 'smooth' });
        }, 900);
      });
    }
    document.addEventListener('vk:cart', () => { if ($('.success')) return; draw(); });
    draw();
  };

  /* ================= ИЗБРАННОЕ ================= */
  VK.pages.favorites = function () {
    const g = $('#fav-grid');
    const draw = () => {
      const l = VK.fav.list().map(VK.byId).filter(Boolean);
      $('#fav-count').textContent = l.length ? `Сохранено: ${l.length}` : '';
      g.innerHTML = l.length ? l.map(p => VK.card(p)).join('') : `<div class="cat-empty empty"><p class="empty__title">Здесь пока пусто</p><p>Нажимайте ♡ на карточках букетов, чтобы сохранить понравившиеся.</p><a class="btn btn--primary" href="catalog.html">Перейти в каталог</a></div>`;
    };
    document.addEventListener('vk:fav', draw); draw();
  };

  /* ================= ОТЗЫВЫ ================= */
  VK.pages.reviews = function () {
    const box = $('#all-reviews');
    const draw = () => {
      const mine = VK.store.get('reviews', []);
      const all = mine.concat(VK.reviews);
      const avg = (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1).replace('.', ',');
      $('#rating').innerHTML = `<span class="rating__n">${avg}</span><span>${stars(Math.round(parseFloat(avg.replace(',', '.'))))}<br><span class="small muted">${all.length} отзывов на сайте (демо)</span></span>`;
      box.innerHTML = all.map(reviewHTML).join('');
      box.classList.add('is-in');
    };
    draw();
    const f = $('#review-form');
    f.addEventListener('submit', e => {
      e.preventDefault(); if (!VK.validate(f)) return;
      const r = { name: f.rname.value.trim(), rating: +(f.querySelector('[name="rating"]:checked') || { value: 5 }).value, text: f.rtext.value.trim(), date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }), product: 'Ваш отзыв · сохранён в браузере' };
      const mine = VK.store.get('reviews', []); mine.unshift(r); VK.store.set('reviews', mine);
      f.reset(); draw(); VK.toast('Спасибо! Отзыв опубликован (демо)');
      box.firstElementChild && box.firstElementChild.scrollIntoView({ behavior: VK.reduced ? 'auto' : 'smooth', block: 'center' });
    });
  };

  /* ================= FAQ ================= */
  VK.pages.faq = function () {
    const groups = [...new Set(VK.faq.map(f => f.g))];
    const nav = $('#faq-nav'), list = $('#faq-list');
    nav.innerHTML = ['Все', ...groups].map((g, i) => `<button class="chip${i ? '' : ' is-active'}" type="button" aria-pressed="${!i}" data-g="${g}">${g}</button>`).join('');
    const draw = g => { list.innerHTML = VK.faq.filter(f => g === 'Все' || f.g === g).map(f => accHTML(f.q, f.a)).join(''); VK.accordions(list); };
    nav.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; $$('[data-g]', nav).forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); }); draw(b.dataset.g); });
    draw('Все');
  };
})();
