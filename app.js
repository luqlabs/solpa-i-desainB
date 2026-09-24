'use strict';

(() => {
  const shades = window.SOLPACI_SHADES;
  const params = new URLSearchParams(location.search);
  const pageName = document.body.dataset.page;
  const storageKey = 'solpaci-b-demo-cart-v1';
  let storageAvailable = true;
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch { storageAvailable = false; return null; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); } catch { storageAvailable = false; }
  }
  const lang = (params.get('lang') || readStorage('solpaci-b-lang')) === 'en' ? 'en' : 'id';
  const t = (id, en) => lang === 'en' ? en : id;
  const label = shade => shade.label[lang === 'en' ? 1 : 0];
  const money = number => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  const url = (file, query = {}) => `${file}.html?${new URLSearchParams({ ...query, lang })}`;
  const arrow = '<span aria-hidden="true">↗</span>';
  const buttonLink = (file, text, secondary = false, query = {}) => `<a class="button${secondary ? ' secondary' : ''}" href="${url(file, query)}">${text}${arrow}</a>`;
  const notice = t('Aset, shade, harga & copy adalah demo. Bukan toko aktif.', 'Assets, shades, prices & copy are demos. Not a live store.');
  let cart = [];
  try {
    const raw = JSON.parse(readStorage(storageKey) || '[]');
    if (Array.isArray(raw)) {
      cart = shades.flatMap(shade => {
        const item = raw.find(entry => entry && entry.id === shade.id && Number.isInteger(entry.qty) && entry.qty > 0);
        return item ? [{ id: shade.id, qty: Math.min(10, item.qty) }] : [];
      });
    }
  } catch { cart = []; }
  const findShade = id => shades.find(shade => shade.id === id);
  const count = () => cart.reduce((total, item) => total + item.qty, 0);
  const subtotal = () => cart.reduce((total, item) => total + findShade(item.id).price * item.qty, 0);
  const main = document.querySelector('#main');
  let toastTimer;
  function announce(message) {
    const toast = document.querySelector('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
  }
  function saveCart() {
    writeStorage(storageKey, JSON.stringify(cart));
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count(); });
    if (!storageAvailable) document.querySelector('#storage-note').hidden = false;
  }
  function addToCart(id, qty = 1) {
    const item = cart.find(entry => entry.id === id);
    if (item && item.qty + qty > 10) {
      announce(t('Batas simulasi: 10 item per shade.', 'Demo limit: 10 items per shade.'));
      return;
    }
    if (item) item.qty += qty; else cart.push({ id, qty });
    saveCart();
    announce(`${findShade(id).name} ${t('ditambahkan ke keranjang demo.', 'added to the demo bag.')}`);
  }
  function card(shade) {
    return `<article class="product-card">
      <a class="product-image" href="${url('product', { shade: shade.id })}" aria-label="${t('Lihat shade', 'View shade')} ${shade.name}">
        <img src="images/shade-${shade.id}.svg" alt="${t('Ilustrasi botol', 'Bottle illustration')}: ${shade.name}" width="600" height="700" loading="lazy">
        <span class="image-index">${shade.id} / COLOR STUDY</span><span class="image-label">${t('ILUSTRASI', 'ILLUSTRATION')}</span><span class="image-arrow" aria-hidden="true">↗</span>
      </a>
      <div class="product-meta"><div><h3><a href="${url('product', { shade: shade.id })}">${shade.name}</a></h3><p>${label(shade)}</p></div><span class="color-dot" style="--shade:${shade.color}" aria-hidden="true"></span></div>
      <div class="product-buy"><span>${money(shade.price)} <small>${t('harga demo', 'demo price')}</small></span><button class="quick-add" data-add="${shade.id}" aria-label="${t('Tambah', 'Add')} ${shade.name} ${t('ke keranjang demo', 'to demo bag')}">+</button></div>
    </article>`;
  }
  function breadcrumb(text) {
    return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${url('index')}">Home</a><span aria-hidden="true">/</span><span aria-current="page">${text}</span></nav>`;
  }
  function heading(kicker, title, copy) {
    return `<header class="page-heading"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${copy}</p></header>`;
  }
  function faqItem(question, answer, open = false) {
    return `<details${open ? ' open' : ''}><summary>${question}<span aria-hidden="true">+</span></summary><div class="answer">${answer}</div></details>`;
  }
  function shell() {
    document.documentElement.lang = lang;
    const title = { home: 'Color Studio', shop: t('Koleksi warna', 'Shop colors'), product: t('Detail shade', 'Shade detail'), cart: t('Keranjang', 'Your bag'), checkout: t('Checkout simulasi', 'Demo checkout'), about: t('Tentang', 'About'), faq: 'FAQ' };
    document.title = `${title[pageName]} — Solpaċi / B`;
    const nav = [['index', t('Beranda', 'Home')], ['shop', t('Koleksi warna', 'Shop colors')], ['about', t('Tentang', 'Our story')], ['faq', 'FAQ']].map(([file, text]) => `<a href="${url(file)}"${pageName === file ? ' aria-current="page"' : ''}>${text}</a>`).join('');
    document.querySelector('#site-top').innerHTML = `
      <div class="preview-bar"><span>B / COLOR STUDIO — ${t('PREVIEW DESAIN', 'DESIGN PREVIEW')}</span><span>${t('DATA DEMO · TANPA TRANSAKSI', 'DEMO DATA · NO TRANSACTIONS')}</span></div>
      <header class="site-header"><a href="${url('index')}" class="wordmark" aria-label="Solpaċi Home">solpaċi</a>
        <nav id="site-nav" aria-label="${t('Navigasi utama', 'Main navigation')}">${nav}</nav>
        <div class="header-actions"><button class="language" id="language-switch" aria-label="${t('Switch to English', 'Ganti ke Bahasa Indonesia')}"><span${lang === 'id' ? ' class="selected"' : ''}>ID</span><span aria-hidden="true">/</span><span${lang === 'en' ? ' class="selected"' : ''}>EN</span></button>
        <a class="bag-link" href="${url('cart')}"${pageName === 'cart' ? ' aria-current="page"' : ''}>${t('Tas', 'Bag')} <span data-cart-count>${count()}</span></a>
        <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="${t('Buka atau tutup menu', 'Open or close menu')}"><span aria-hidden="true">☰</span><span class="sr-only">Menu</span></button></div>
      </header><p class="storage-note" id="storage-note"${storageAvailable ? ' hidden' : ''}>${t('Penyimpanan browser tidak tersedia. Keranjang hanya bertahan di halaman ini; gunakan server lokal agar alurnya konsisten.', 'Browser storage is unavailable. The bag only lasts on this page; use a local server for a consistent flow.')}</p>`;
    document.querySelector('#site-bottom').innerHTML = `
      <footer class="site-footer"><div class="footer-top"><div><a class="wordmark" href="${url('index')}">solpaċi</a><p>${t('Tidak perlu satu warna<br>untuk semua cerita.', 'Not one color.<br>Not one version of you.')}</p></div>
      <div><p class="eyebrow">THE COLOR STUDIO</p><a href="${url('shop')}">${t('Semua warna', 'All colors')}</a><a href="${url('shop', { family: 'soft' })}">${t('Warna lembut', 'Soft colors')}</a><a href="${url('shop', { family: 'bold' })}">${t('Warna berani', 'Bold colors')}</a></div>
      <div><p class="eyebrow">${t('KENALI LEBIH DEKAT', 'A LITTLE CLOSER')}</p><a href="${url('about')}">${t('Tentang Solpaċi', 'About Solpaċi')}</a><a href="${url('faq')}">${t('Bantuan & FAQ', 'Help & FAQ')}</a><a href="${url('cart')}">${t('Keranjang demo', 'Demo bag')}</a></div>
      <div class="footer-note"><p class="eyebrow">${t('CATATAN PREVIEW', 'PREVIEW NOTE')}</p><p>${notice}</p><p>${t('Logo teks & ilustrasi menunggu aset asli. Tidak ada data pribadi yang dikumpulkan.', 'Text logo & illustrations await brand assets. No personal data is collected.')}</p></div></div>
      <div class="footer-statement" aria-hidden="true">A SHADE OF YOU. ↗</div><div class="footer-bottom"><span>SOLPAĊI / DESIGN STUDY 2026</span><span>${t('Eksplorasi desain, bukan kebijakan toko final.', 'Design exploration, not final store policies.')}</span><a href="#main">${t('Kembali ke atas', 'Back to top')} ↑</a></div></footer>`;
  }
  function home() {
    main.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">SOLPAĊI / THE COLOR STUDIO</p><h1>${t('WARNA.<br>SESUAI<br><span>MAUMU.</span>', 'YOUR<br>COLOR.<br><span>YOUR CALL.</span>')}</h1><div class="hero-bottom"><p>${t('Lembut hari ini. Berani besok.<br>Tidak perlu satu warna untuk semua cerita.', 'Soft today. Bold tomorrow.<br>No single shade has to tell your whole story.')}</p><a class="circle-link" href="${url('shop')}" aria-label="${t('Jelajahi warna', 'Explore colors')}">↘</a></div></div>
      <figure class="hero-art"><img src="images/studio.svg" alt="${t('Ilustrasi tiga sapuan warna pink, berry, dan nude', 'Illustrated pink, berry and nude color strokes')}" width="720" height="760" fetchpriority="high"><span class="art-corner">COLOR IS<br>PERSONAL.</span><figcaption>${t('STUDI WARNA / BUKAN SWATCH ASLI', 'COLOR STUDY / NOT REAL SWATCHES')}</figcaption></figure></section>
      <div class="statement-strip"><span>A SHADE OF YOU.</span><span aria-hidden="true">✳</span><span>${t('BUKAN SEKADAR WARNA.', 'MORE THAN A COLOR.')}</span><span aria-hidden="true">✳</span><span>YOUR COLOR. YOUR CALL.</span></div>
      <section class="section" aria-labelledby="palette-title"><div class="section-heading"><div><p class="eyebrow">01 / THE PALETTE</p><h2 id="palette-title">${t('PILIH<br><span>MOOD-MU.</span>', 'PICK YOUR<br><span>MOOD.</span>')}</h2></div><div><p>${t('Mulai dari warna.<br>Sisanya, terserah kamu.', 'Start with a shade.<br>The rest is up to you.')}</p><a class="text-link" href="${url('shop')}">${t('Jelajahi semua warna', 'Explore all colors')} ${arrow}</a></div></div><div class="product-grid">${shades.map(card).join('')}</div><p class="small-note">${t('4 shade contoh · seluruh harga Rp99.000 untuk perbandingan desain A/B.', '4 sample shades · all priced at Rp99,000 for the A/B design comparison.')}</p></section>
      <section class="mood-section" aria-labelledby="mood-title"><div class="mood-intro"><p class="eyebrow">02 / FIND YOUR SIDE</p><h2 id="mood-title">${t('TAK HARUS<br>SATU SISI.', 'MORE THAN<br>ONE SIDE.')}</h2><p>${t('Warna tenang atau pernyataan tegas?<br>Kamu boleh menjadi keduanya.', 'A quiet color or a bold statement?<br>You can be both.')}</p></div><a class="mood-card soft-mood" href="${url('shop', { family: 'soft' })}"><span class="eyebrow">01—02 / SOFT SIDE</span><div class="mood-swatches" aria-hidden="true"><i style="--shade:#ce929b"></i><i style="--shade:#c6a28a"></i></div><span class="mood-title">${t('LEMBUT.', 'SOFT.')} ${arrow}</span><span>${t('Petal & Oat Milk · studi warna', 'Petal & Oat Milk · color studies')}</span></a><a class="mood-card bold-mood" href="${url('shop', { family: 'bold' })}"><span class="eyebrow">03—04 / BOLD SIDE</span><div class="mood-swatches" aria-hidden="true"><i style="--shade:#8b3549"></i><i style="--shade:#594039"></i></div><span class="mood-title">${t('BERANI.', 'BOLD.')} ${arrow}</span><span>${t('Berry & Espresso · studi warna', 'Berry & Espresso · color studies')}</span></a></section>
      <section class="story-section section"><div class="story-poster" aria-hidden="true"><span>NOT ONE<br>SHADE.<br><span>NOT ONE<br>VERSION<br>OF YOU.</span></span><img class="poster-illustration" src="images/studio.svg" alt="" loading="lazy"><span class="poster-star">✳</span><span class="eyebrow">SOLPAĊI / COLOR STUDIO</span></div><div class="story-copy"><p class="eyebrow">03 / A LITTLE ABOUT US</p><h2>${t('RUANG UNTUK<br>JADI <span>KAMU.</span>', 'ROOM TO<br>BE <span>YOU.</span>')}</h2><p>${t('Ada hari untuk pink lembut. Ada hari untuk warna yang lebih dalam. Solpaċi dieksplorasi sebagai ruang untuk menemukan ekspresi kecil yang terasa personal.', 'Some days call for soft pink. Others call for something deeper. This Solpaċi concept explores a space for small, personal expressions.')}</p>${buttonLink('about', t('Kenali arah cerita kami', 'Meet the story direction'), true)}<p class="small-note">${t('Usulan narasi brand; menunggu persetujuan klien.', 'Proposed brand narrative; pending client approval.')}</p></div></section>
      <section class="section help-section"><div><p class="eyebrow">04 / GOOD TO KNOW</p><h2>${t('WARNA BARU.<br>ADA TANYA?', 'NEW COLOR.<br>QUESTIONS?')}</h2><a href="${url('faq')}" class="text-link">${t('Buka semua FAQ', 'View all FAQs')} ${arrow}</a></div><div>${faqItem(t('Apakah ini foto dan shade asli?', 'Are these real photos and shades?'), t('Belum. Semua gambar adalah ilustrasi dan empat shade merupakan data contoh. Warna pada layar bukan acuan swatch produk asli.', 'Not yet. All images are illustrations and the four shades are sample data. On-screen colors are not real product swatches.'))}${faqItem(t('Bagaimana memilih warna?', 'How do I choose a color?'), t('Mulai dari kelompok Lembut atau Berani, lalu bandingkan studi warna di halaman produk. Foto swatch asli perlu ditambahkan sebelum toko diluncurkan.', 'Start with Soft or Bold, then compare the color studies on a product page. Real swatch photos must be added before launch.'))}${faqItem(t('Sudah bisa melakukan pemesanan?', 'Can I place an order yet?'), t('Belum. Keranjang dan checkout hanya simulasi desain. Tidak ada pesanan, pembayaran, atau pengiriman yang diproses.', 'Not yet. The bag and checkout are design simulations. No orders, payments or shipments are processed.'))}</div></section>
      <section class="closing-cta"><p class="eyebrow">NO RULES. JUST YOUR COLOR.</p><h2>${t('HARI INI,<br>WARNA APA?', 'WHAT COLOR<br>ARE YOU TODAY?')}</h2>${buttonLink('shop', t('Temukan warnamu', 'Find your color'))}</section>`;
  }
  function shop() {
    let family = ['soft', 'bold'].includes(params.get('family')) ? params.get('family') : 'all';
    let view = 'bottle';
    main.innerHTML = `${breadcrumb(t('Koleksi warna', 'Shop colors'))}${heading('THE PALETTE / 01—04', t('SEMUA WARNA.<br><span>SEMUA SISI KAMU.</span>', 'ALL THE COLORS.<br><span>ALL SIDES OF YOU.</span>'), t('Empat studi warna. Banyak cara untuk menjadi kamu.', 'Four color studies. More ways to be you.'))}
      <section class="section shop-section" aria-label="${t('Katalog warna demo', 'Demo color catalog')}"><div class="catalog-toolbar"><div class="filter-group" role="group" aria-label="${t('Keluarga warna', 'Color family')}">${[['all', t('Semua', 'All')], ['soft', t('Lembut', 'Soft')], ['bold', t('Berani', 'Bold')]].map(([id, text]) => `<button data-family="${id}" aria-pressed="${family === id}">${text}</button>`).join('')}</div><label class="search-field"><span class="sr-only">${t('Cari nama shade', 'Search shade names')}</span><input id="shade-search" type="search" placeholder="${t('Cari shade…', 'Find a shade…')}" autocomplete="off"><span aria-hidden="true">⌕</span></label></div>
      <div class="catalog-subtools"><p id="product-count" role="status" aria-live="polite"></p><div class="view-group" role="group" aria-label="${t('Tampilan ilustrasi', 'Illustration view')}"><button data-view="bottle" aria-pressed="true">${t('Botol', 'Bottle')}</button><button data-view="swatch" aria-pressed="false">${t('Studi warna', 'Color study')}</button></div><label class="sort-field">${t('Urutkan', 'Sort')} <select id="shade-sort"><option value="palette">${t('Urutan palet', 'Palette order')}</option><option value="name">${t('Nama A–Z', 'Name A–Z')}</option></select></label></div>
      <div class="product-grid" id="catalog-grid"></div><div class="empty-state" id="no-results" hidden><span class="empty-symbol" aria-hidden="true">⌕</span><h2>${t('BELUM KETEMU.', 'NOT FOUND YET.')}</h2><p>${t('Coba nama lain atau tampilkan semua shade demo.', 'Try another name or show every demo shade.')}</p><button class="button" id="reset-filters">${t('Reset pencarian', 'Reset search')} ${arrow}</button></div><p class="small-note">${notice} ${t('Ilustrasi bukan representasi akurat warna atau kemasan.', 'Illustrations do not accurately represent colors or packaging.')}</p>
      <aside class="catalog-aside"><span class="eyebrow">A LITTLE COLOR NOTE</span><p>${t('Layar memberi gambaran.<br>Swatch asli memberi kepastian.', 'A screen gives an impression.<br>A real swatch tells you more.')}</p><a class="text-link" href="${url('faq')}">${t('Tentang warna & produk', 'About colors & products')} ${arrow}</a></aside></section>`;
    const search = document.querySelector('#shade-search');
    const sort = document.querySelector('#shade-sort');
    function update() {
      let filtered = shades.filter(shade => (family === 'all' || shade.family === family) && shade.name.toLowerCase().includes(search.value.trim().toLowerCase()));
      if (sort.value === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      document.querySelector('#catalog-grid').innerHTML = filtered.map(card).join('');
      if (view === 'swatch') document.querySelectorAll('#catalog-grid img').forEach(img => { img.src = img.src.replace('shade-', 'swatch-'); img.alt = t('Studi warna ilustratif', 'Illustrative color study'); });
      document.querySelector('#no-results').hidden = filtered.length > 0;
      document.querySelector('#product-count').textContent = `${filtered.length} ${t('dari 4 shade demo', 'of 4 demo shades')}`;
      document.querySelectorAll('[data-family]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.family === family)));
    }
    document.querySelectorAll('[data-family]').forEach(el => el.addEventListener('click', () => { family = el.dataset.family; update(); }));
    document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => {
      view = el.dataset.view;
      document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button === el)));
      update();
    }));
    search.addEventListener('input', update);
    sort.addEventListener('change', update);
    document.querySelector('#reset-filters').addEventListener('click', () => { search.value = ''; family = 'all'; sort.value = 'palette'; update(); search.focus(); });
    update();
  }
  function product() {
    const id = params.get('shade') || '01';
    const shade = findShade(id);
    if (!shade) {
      main.innerHTML = `${breadcrumb(t('Shade tidak ditemukan', 'Shade not found'))}<section class="empty-state section"><p class="eyebrow">COLOR NOT FOUND</p><h1>${t('WARNA INI<br>BELUM ADA.', 'THIS SHADE<br>IS NOT HERE.')}</h1><p>${t('Tautan shade tidak dikenali. Pilih salah satu dari empat studi warna demo.', 'This shade link is not recognized. Choose one of the four demo color studies.')}</p>${buttonLink('shop', t('Kembali ke koleksi', 'Back to colors'))}</section>`;
      return;
    }
    document.title = `${shade.name} — Solpaċi / B`;
    let quantity = 1;
    main.innerHTML = `${breadcrumb(`${t('Koleksi warna', 'Shop colors')} / ${shade.name}`)}<section class="product-layout"><div class="product-gallery"><div class="gallery-image"><img id="detail-image" src="images/shade-${shade.id}.svg" alt="${t('Ilustrasi botol', 'Bottle illustration')} ${shade.name}" width="600" height="700"><span class="image-index">${shade.id} / COLOR STUDY</span><span class="image-label">${t('ASET DEMO', 'DEMO ASSET')}</span></div><div class="gallery-controls" role="group" aria-label="${t('Tampilan produk', 'Product view')}"><button data-gallery="shade" aria-pressed="true">${t('01 / Botol', '01 / Bottle')}</button><button data-gallery="swatch" aria-pressed="false">${t('02 / Studi warna', '02 / Color study')}</button></div><p class="small-note">${t('Ilustrasi botol dan studi warna, bukan foto atau swatch asli.', 'Bottle and color illustrations, not real photos or swatches.')}</p></div>
      <div class="product-info"><p class="eyebrow">${t('STUDI SHADE', 'SHADE STUDY')} ${shade.id} / ${shade.family.toUpperCase()} SIDE</p><h1>${shade.name}</h1><p class="shade-label"><span class="color-dot" style="--shade:${shade.color}" aria-hidden="true"></span>${label(shade)}</p><p class="detail-price">${money(shade.price)} <small>${t('harga demo', 'demo price')}</small></p><p class="product-description">${shade.description[lang === 'en' ? 1 : 0]}</p>
      <div class="shade-picker"><p class="eyebrow">${t('BANDINGKAN SHADE', 'COMPARE SHADES')}</p><div>${shades.map(item => `<a class="swatch-link${item.id === id ? ' current' : ''}" href="${url('product', { shade: item.id })}" aria-label="${item.name}"${item.id === id ? ' aria-current="page"' : ''}><span style="--shade:${item.color}"></span></a>`).join('')}</div></div>
      <div class="add-row"><div class="quantity-control"><button id="product-minus" aria-label="${t('Kurangi jumlah', 'Decrease quantity')}" disabled>−</button><output id="product-quantity" aria-live="polite">1</output><button id="product-plus" aria-label="${t('Tambah jumlah', 'Increase quantity')}">+</button></div><button class="button" id="add-product">${t('Tambah ke tas demo', 'Add to demo bag')} ${arrow}</button></div><a class="text-link bag-follow" href="${url('cart')}">${t('Lihat keranjang demo', 'View demo bag')} →</a>
      <p class="demo-note">${t('Nama, harga, ukuran kemasan & formula belum dikonfirmasi. Tidak ada transaksi di preview ini.', 'Names, prices, pack size & formula are unconfirmed. This preview does not process transactions.')}</p>
      <div class="product-details">${faqItem(t('Detail produk', 'Product details'), t('Kelompok warna: ', 'Color family: ') + label(shade) + '. ' + t('Isi/volume, finish, komposisi, nomor registrasi, dan foto produk menunggu data resmi klien. Tidak ada klaim formula pada preview.', 'Volume, finish, ingredients, registration details and product photos await official client data. This preview makes no formula claims.'))}${faqItem(t('Cara pakai & perawatan', 'Use & care'), t('Petunjuk pemakaian, pengeringan, dan penyimpanan akan mengikuti label produk yang disetujui. Preview tidak memberikan instruksi formula yang belum diketahui.', 'Application, drying and storage guidance will follow the approved product label. This preview does not give instructions for an unconfirmed formula.'))}${faqItem(t('Pengiriman & pengembalian', 'Shipping & returns'), t('Cakupan yang direncanakan adalah domestik Indonesia. Ongkir, estimasi, dan ketentuan pengembalian belum final; angka checkout hanya simulasi.', 'The planned scope is domestic Indonesia. Shipping rates, estimates and returns terms are not final; checkout amounts are illustrative only.'))}</div></div></section>
      <section class="section related"><div class="section-heading"><div><p class="eyebrow">ANOTHER SIDE OF YOU</p><h2>${t('COBA SISI<br><span>LAINNYA.</span>', 'EXPLORE YOUR<br><span>OTHER SIDE.</span>')}</h2></div><a class="text-link" href="${url('shop')}">${t('Semua warna', 'All colors')} ${arrow}</a></div><div class="product-grid three">${shades.filter(item => item.id !== id).map(card).join('')}</div></section>`;
    function updateQuantity() {
      document.querySelector('#product-quantity').textContent = quantity;
      document.querySelector('#product-minus').disabled = quantity === 1;
      document.querySelector('#product-plus').disabled = quantity === 10;
    }
    document.querySelector('#product-minus').addEventListener('click', () => { quantity = Math.max(1, quantity - 1); updateQuantity(); });
    document.querySelector('#product-plus').addEventListener('click', () => { quantity = Math.min(10, quantity + 1); updateQuantity(); });
    document.querySelector('#add-product').addEventListener('click', () => addToCart(id, quantity));
    document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
      const image = document.querySelector('#detail-image');
      image.src = `images/${button.dataset.gallery}-${id}.svg`;
      image.alt = `${t('Ilustrasi demo', 'Demo illustration')}: ${shade.name} / ${button.dataset.gallery}`;
      document.querySelectorAll('[data-gallery]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    }));
  }
  function orderLines() {
    return cart.map(item => {
      const shade = findShade(item.id);
      return `<div class="order-line"><img src="images/shade-${shade.id}.svg" alt="" width="60" height="70"><div><strong>${shade.name}</strong><span>${item.qty} × ${money(shade.price)}</span></div><strong>${money(item.qty * shade.price)}</strong></div>`;
    }).join('');
  }
  function emptyBag(isCheckout = false) {
    return `${breadcrumb(t('Keranjang', 'Bag'))}<section class="empty-state section"><span class="empty-symbol" aria-hidden="true">↗</span><p class="eyebrow">A LITTLE ROOM FOR COLOR</p><h1>${t('TASMU MASIH<br><span>MENUNGGU WARNA.</span>', 'YOUR BAG IS<br><span>WAITING FOR COLOR.</span>')}</h1><p>${isCheckout ? t('Pilih shade terlebih dahulu untuk mencoba alur checkout simulasi.', 'Choose a shade first to try the demo checkout flow.') : t('Belum ada shade di sini. Mulai dari warna yang menarik perhatianmu.', 'No shades here yet. Start with a color that catches your eye.')}</p>${buttonLink('shop', t('Jelajahi koleksi', 'Explore colors'))}<p class="small-note">${notice}</p></section>`;
  }
  function cartPage(focusKey) {
    if (!cart.length) {
      main.innerHTML = emptyBag();
      if (focusKey) { main.querySelector('h1').tabIndex = -1; main.querySelector('h1').focus(); }
      return;
    }
    main.innerHTML = `${breadcrumb(t('Keranjang demo', 'Demo bag'))}${heading('YOUR COLOR / YOUR BAG', t('WARNA<br><span>PILIHANMU.</span>', 'YOUR COLORS.<br><span>YOUR BAG.</span>'), t('Coba alurnya. Belum ada pembelian yang diproses.', 'Try the flow. No purchases are processed.'))}<section class="section cart-layout"><div><div class="cart-labels"><span>${t('PRODUK CONTOH', 'SAMPLE PRODUCTS')}</span><span>${count()} ${t('ITEM', 'ITEMS')}</span></div>
      <div class="cart-items">${cart.map(item => { const shade = findShade(item.id); return `<article class="cart-item"><a class="cart-image" href="${url('product', { shade: shade.id })}"><img src="images/shade-${shade.id}.svg" alt="${t('Ilustrasi', 'Illustration')} ${shade.name}" width="150" height="175"></a><div class="cart-item-info"><p class="eyebrow">${shade.id} / COLOR STUDY</p><h2><a href="${url('product', { shade: shade.id })}">${shade.name}</a></h2><p>${label(shade)} · ${t('harga demo', 'demo price')}</p><p>${money(shade.price)}</p><button class="remove-link" data-remove="${shade.id}" aria-label="${t('Hapus', 'Remove')} ${shade.name}">${t('Hapus', 'Remove')}</button></div><div class="cart-item-controls"><div class="quantity-control"><button data-qty="${shade.id}" data-change="-1" data-focus="minus-${shade.id}" aria-label="${t('Kurangi', 'Decrease')} ${shade.name}"${item.qty === 1 ? ' disabled' : ''}>−</button><output aria-label="${t('Jumlah', 'Quantity')} ${shade.name}">${item.qty}</output><button data-qty="${shade.id}" data-change="1" data-focus="plus-${shade.id}" aria-label="${t('Tambah', 'Increase')} ${shade.name}"${item.qty === 10 ? ' disabled' : ''}>+</button></div><strong>${money(item.qty * shade.price)}</strong></div></article>`; }).join('')}</div><a class="text-link continue-link" href="${url('shop')}">← ${t('Lanjut jelajahi warna', 'Keep exploring colors')}</a><p class="small-note">${t('Batas simulasi 10 item per shade, bukan informasi stok.', 'Demo limit: 10 items per shade, not an inventory indication.')}</p></div>
      <aside class="order-summary"><p class="eyebrow">THE COLOR EDIT</p><h2>${t('Ringkasan tas', 'Bag summary')}</h2><div class="summary-row"><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div class="summary-row"><span>${t('Pengiriman', 'Shipping')}</span><span>${t('Simulasi di checkout', 'Simulated at checkout')}</span></div><div class="summary-total"><span>${t('Subtotal demo', 'Demo subtotal')}</span><strong>${money(subtotal())}</strong></div>${buttonLink('checkout', t('Coba checkout', 'Try checkout'))}<p class="small-note">${t('Tidak ada pembayaran. Harga dan ongkir belum final. Keranjang menyimpan ID shade dan jumlah di browser ini saja.', 'No payment. Prices and shipping are not final. This bag only stores shade IDs and quantities in this browser.')}</p></aside></section>`;
    document.querySelectorAll('[data-qty]').forEach(button => button.addEventListener('click', () => {
      const item = cart.find(entry => entry.id === button.dataset.qty);
      item.qty = Math.min(10, Math.max(1, item.qty + Number(button.dataset.change)));
      const key = button.dataset.focus;
      saveCart(); cartPage(key);
      announce(t('Jumlah di keranjang diperbarui.', 'Bag quantity updated.'));
    }));
    document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
      const name = findShade(button.dataset.remove).name;
      cart = cart.filter(entry => entry.id !== button.dataset.remove);
      saveCart(); cartPage('removed');
      announce(`${name} ${t('dihapus dari tas demo.', 'removed from the demo bag.')}`);
    }));
    if (focusKey) {
      const candidate = document.querySelector(`[data-focus="${focusKey}"]:not(:disabled)`) || document.querySelector('[data-remove]');
      if (candidate) candidate.focus();
    }
  }
  function checkout() {
    if (!cart.length) { main.innerHTML = emptyBag(true); return; }
    let shipping = 15000;
    main.innerHTML = `${breadcrumb(t('Checkout simulasi', 'Demo checkout'))}${heading('THE LAST LITTLE STEP / DEMO', t('SELANGKAH<br><span>LAGI.</span>', 'ONE LITTLE<br><span>STEP MORE.</span>'), t('Ini hanya simulasi. Gunakan data contoh yang sudah disediakan.', 'This is only a simulation. Use the sample details provided.'))}
      <section class="section checkout-layout"><div><div class="checkout-notice"><strong>${t('Mode demo — tidak menerima data pribadi.', 'Demo mode — no personal data accepted.')}</strong><p>${t('Alamat, ongkir, dan metode bayar di bawah hanya contoh layout. Tidak ada API payment/shipping yang dihubungkan.', 'The address, shipping fees and payment methods below are layout examples. No payment or shipping API is connected.')}</p></div>
      <section class="checkout-step"><div class="step-title"><span>01</span><h2>${t('Detail penerima contoh', 'Sample recipient')}</h2></div><div class="sample-fields"><div><span>${t('Nama', 'Name')}</span><strong>${t('Pelanggan Demo', 'Demo Customer')}</strong></div><div><span>Email</span><strong>demo@example.com</strong></div><div class="wide"><span>${t('Alamat', 'Address')}</span><strong>${t('Alamat contoh — bukan tujuan pengiriman', 'Sample address — not a shipping destination')}</strong><span>Jakarta, Indonesia · 00000</span></div></div><p class="small-note">${t('Teks statis untuk review. Jangan masukkan data asli.', 'Static text for review. Do not enter real details.')}</p></section>
      <form id="checkout-form"><fieldset class="checkout-step"><legend><span class="step-number">02</span> ${t('Pengiriman simulasi', 'Simulated delivery')}</legend><label class="choice"><input type="radio" name="shipping" value="15000" checked><span><strong>${t('Reguler — contoh', 'Regular — sample')}</strong><small>${t('Bukan tarif atau estimasi kurir asli', 'Not a real courier rate or estimate')}</small></span><strong>${money(15000)}</strong></label><label class="choice"><input type="radio" name="shipping" value="25000"><span><strong>${t('Prioritas — contoh', 'Priority — sample')}</strong><small>${t('Opsi visual, belum terhubung Biteship', 'Visual option, not connected to Biteship')}</small></span><strong>${money(25000)}</strong></label></fieldset>
      <fieldset class="checkout-step"><legend><span class="step-number">03</span> ${t('Metode bayar simulasi', 'Simulated payment')}</legend><label class="choice"><input type="radio" name="payment" value="qris" checked><span><strong>QRIS</strong><small>${t('Demo · tidak menghasilkan kode QR', 'Demo · no QR code is generated')}</small></span></label><label class="choice"><input type="radio" name="payment" value="va"><span><strong>Virtual Account</strong><small>${t('Demo · tidak menghasilkan nomor rekening', 'Demo · no account number is generated')}</small></span></label><label class="choice"><input type="radio" name="payment" value="wallet"><span><strong>E-Wallet</strong><small>${t('Demo · tidak membuka aplikasi pembayaran', 'Demo · no payment app is opened')}</small></span></label></fieldset>
      <label class="consent"><input type="checkbox" id="demo-consent" required><span>${t('Saya memahami ini hanya simulasi, bukan pesanan atau pembayaran.', 'I understand this is a simulation, not an order or payment.')}</span></label><button class="button checkout-submit" type="submit">${t('Selesaikan simulasi', 'Complete simulation')} ${arrow}</button><p class="small-note">${t('Tidak ada pesanan yang dikirim ke server.', 'No order is sent to a server.')}</p></form></div>
      <aside class="order-summary checkout-summary"><p class="eyebrow">YOUR COLOR EDIT</p><h2>${t('Ringkasan demo', 'Demo summary')}</h2>${orderLines()}<div class="summary-row"><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div class="summary-row"><span>${t('Ongkir contoh', 'Sample shipping')}</span><strong id="shipping-total">${money(shipping)}</strong></div><div class="summary-total"><span>${t('Total demo', 'Demo total')}</span><strong id="checkout-total" aria-live="polite">${money(subtotal() + shipping)}</strong></div><a class="text-link" href="${url('cart')}">${t('Ubah isi tas', 'Edit your bag')} ${arrow}</a><p class="small-note">${t('Harga contoh, bukan penawaran final. Kebijakan pajak & ongkir menunggu konfirmasi.', 'Sample prices, not a final offer. Tax and shipping policies await confirmation.')}</p></aside></section>`;
    document.querySelectorAll('[name="shipping"]').forEach(input => input.addEventListener('change', () => {
      shipping = Number(input.value);
      document.querySelector('#shipping-total').textContent = money(shipping);
      document.querySelector('#checkout-total').textContent = money(subtotal() + shipping);
    }));
    document.querySelector('#checkout-form').addEventListener('submit', event => {
      event.preventDefault();
      if (!document.querySelector('#demo-consent').checked) return;
      main.innerHTML = `<section class="simulation-complete section"><span class="completion-mark" aria-hidden="true">✓</span><p class="eyebrow">END OF DESIGN WALKTHROUGH</p><h1 tabindex="-1">${t('SIMULASI<br><span>SELESAI.</span>', 'SIMULATION<br><span>COMPLETE.</span>')}</h1><p>${t('Bukan konfirmasi pesanan. Tidak ada pembayaran, nomor pesanan, email, atau pengiriman yang dibuat.', 'This is not an order confirmation. No payment, order number, email or shipment has been created.')}</p><div class="completion-total"><span>${t('Total yang disimulasikan', 'Simulated total')}</span><strong>${money(subtotal() + shipping)}</strong></div><p class="small-note">${t('Isi tas demo tetap tersimpan agar kamu bisa mengulang review.', 'Your demo bag is kept so you can repeat the review.')}</p><div class="button-row">${buttonLink('shop', t('Kembali ke warna', 'Back to colors'))}${buttonLink('cart', t('Lihat tas demo', 'View demo bag'), true)}</div></section>`;
      main.querySelector('h1').focus();
      window.scrollTo(0, 0);
    });
  }
  function about() {
    main.innerHTML = `${breadcrumb(t('Tentang Solpaċi', 'About Solpaċi'))}<section class="about-hero"><div><p class="eyebrow">SOLPAĊI / A BRAND STORY STUDY</p><h1>${t('BUKAN<br>SEKADAR<br><span>WARNA.</span>', 'MORE<br>THAN A<br><span>COLOR.</span>')}</h1><p>${t('Sebuah ruang kecil untuk ekspresi yang terasa milikmu sendiri.', 'A little space for an expression that feels entirely your own.')}</p><p class="small-note">${t('Narasi konsep, bukan riwayat resmi brand.', 'Concept narrative, not the official brand history.')}</p></div><div class="about-art"><img src="images/studio.svg" alt="${t('Studi ilustrasi sapuan warna Solpaċi', 'Solpaċi illustrated color study')}" width="720" height="760"><span class="about-sticker">A SHADE<br>OF YOU. ↗</span></div></section>
      <section class="section manifesto"><p class="eyebrow">01 / THE IDEA</p><div><h2>${t('KAMU TIDAK HARUS<br>MENJADI <span>SATU HAL.</span>', 'YOU DO NOT HAVE<br>TO BE <span>ONE THING.</span>')}</h2><p>${t('Kadang lembut. Kadang berani. Kadang ingin mencoba sesuatu yang berbeda. Arah Color Studio berangkat dari gagasan sederhana: warna bisa menjadi bagian kecil dari cara kita mengekspresikan diri.', 'Sometimes soft. Sometimes bold. Sometimes ready to try something different. Color Studio starts with a simple idea: color can be a small part of how we express ourselves.')}</p><p>${t('Di sini, palet menjadi titik awal—bukan aturan. Kami mengusulkan pengalaman yang memudahkanmu melihat, membandingkan, dan menemukan warna dengan caramu sendiri.', 'Here, a palette is a starting point, not a rule. We propose an experience that helps you see, compare and discover colors on your own terms.')}</p></div></section>
      <section class="principles section"><p class="eyebrow">02 / THE DESIGN POINT OF VIEW</p><div class="principle-grid"><article><span>01</span><h2>${t('Warna dulu.', 'Color first.')}</h2><p>${t('Produk dan shade menjadi pusat perhatian. Ruang, foto, dan tipografi membantu warna berbicara.', 'Products and shades take center stage. Space, imagery and type give color room to speak.')}</p></article><article><span>02</span><h2>${t('Pilihanmu.', 'Your choice.')}</h2><p>${t('Tidak perlu satu mood setiap hari. Navigasi dibuat sederhana agar eksplorasi terasa ringan.', 'You do not need one mood every day. Simple navigation makes exploration feel easy.')}</p></article><article><span>03</span><h2>${t('Jelas adanya.', 'Keep it clear.')}</h2><p>${t('Informasi produk mengikuti data yang disetujui, tanpa janji ketahanan, sertifikasi, atau klaim formula yang belum terbukti.', 'Product information follows approved data, without unverified wear, certification or formula claims.')}</p></article></div></section>
      <aside class="section editorial-note"><span class="eyebrow">FOR THE DESIGN REVIEW</span><h2>${t('CERITA ASLI<br>MASIH MENUNGGU.', 'THE REAL STORY<br>IS STILL TO COME.')}</h2><p>${t('Halaman ini menunjukkan struktur dan nada komunikasi. Cerita pendiri, asal brand, foto, serta keunggulan produk perlu diberikan dan disetujui klien sebelum dipublikasikan.', 'This page demonstrates structure and tone. The founder story, brand origins, photos and product benefits need to be supplied and approved by the client before publication.')}</p></aside>
      <section class="closing-cta"><p class="eyebrow">LET THE COLOR DO THE TALKING</p><h2>${t('MULAI DARI<br>WARNAMU.', 'START WITH<br>YOUR COLOR.')}</h2>${buttonLink('shop', t('Jelajahi palet', 'Explore the palette'))}</section>`;
  }
  function faq() {
    const groups = [
      ['colors', t('Warna & produk', 'Colors & products'), [
        [t('Apakah warna di layar sama dengan produk asli?', 'Do on-screen colors match the real product?'), t('Tidak dapat dijadikan acuan. Di preview ini, gambar dan shade merupakan ilustrasi. Untuk toko final, foto swatch asli perlu tersedia; tampilan layar dan pencahayaan juga dapat memengaruhi persepsi warna.', 'They cannot be used as a reference. Images and shades in this preview are illustrations. The final store needs real swatch photos; displays and lighting can also affect color perception.')],
        [t('Bagaimana memilih shade?', 'How do I choose a shade?'), t('Coba filter Lembut atau Berani di Koleksi, lalu buka detail untuk membandingkan empat studi warna. Pilihan ini menggambarkan alur desain, bukan rekomendasi produk berbasis warna kulit.', 'Try the Soft or Bold filter in Shop, then open a detail page to compare the four color studies. This demonstrates the design flow, not a skin-tone-based product recommendation.')],
        [t('Berapa ukuran dan apa formula produknya?', 'What are the size and formula?'), t('Belum dikonfirmasi dalam aset yang tersedia. Volume, finish, komposisi, sertifikasi dan petunjuk pakai harus mengikuti informasi resmi dari klien. Tidak ada klaim halal, vegan, atau ketahanan pada preview ini.', 'These are not confirmed in the available assets. Volume, finish, ingredients, certifications and usage directions must follow official client information. This preview makes no halal, vegan or wear-time claims.')],
      ]],
      ['orders', t('Pesanan & pembayaran', 'Orders & payments'), [
        [t('Bisakah saya membeli dari preview ini?', 'Can I buy from this preview?'), t('Tidak. Tombol tambah, keranjang, dan checkout hanya simulasi lokal. Tidak ada pesanan yang dibuat dan tidak ada uang yang ditagihkan.', 'No. Add buttons, the bag and checkout are local simulations. No orders are created and no money is charged.')],
        [t('Apakah harga Rp99.000 merupakan harga final?', 'Is Rp99,000 the final price?'), t('Bukan. Semua shade memakai harga contoh yang sama agar perbandingan desain A/B konsisten. Harga final menunggu daftar produk klien.', 'No. Every shade uses the same sample price to keep the A/B design comparison consistent. Final prices await the client product list.')],
        [t('Metode pembayaran apa yang direncanakan?', 'Which payment methods are planned?'), t('Scope proyek mencakup QRIS, Virtual Account dan E-Wallet melalui Midtrans. Ketersediaan akhir bergantung aktivasi akun dan integrasi. Preview ini tidak terhubung dengan Midtrans.', 'The project scope includes QRIS, Virtual Account and E-Wallet through Midtrans. Final availability depends on account activation and integration. This preview is not connected to Midtrans.')],
      ]],
      ['shipping', t('Pengiriman & pengembalian', 'Shipping & returns'), [
        [t('Ke mana produk akan dikirim?', 'Where will products be shipped?'), t('Brief mencakup pengiriman domestik Indonesia. Cakupan kurir, tarif dan estimasi perlu dikonfirmasi melalui implementasi Biteship. Ongkir demo bukan tarif aktual.', 'The brief covers domestic shipping within Indonesia. Courier coverage, rates and estimates must be confirmed through the Biteship implementation. Demo fees are not actual rates.')],
        [t('Bagaimana jika pesanan rusak atau ingin dikembalikan?', 'What if an order is damaged or needs a return?'), t('Kebijakan pengembalian, batas waktu, bukti yang diperlukan dan kontak bantuan menunggu persetujuan klien. Preview tidak menetapkan kebijakan toko.', 'The returns policy, time limits, required evidence and support contact await client approval. This preview does not establish store policies.')],
      ]],
      ['preview', t('Tentang preview', 'About this preview'), [
        [t('Apakah data saya disimpan?', 'Is my data stored?'), t('Preview tidak meminta nama, email, alamat atau informasi pembayaran. Jika penyimpanan browser tersedia, hanya ID shade, jumlah keranjang dan pilihan bahasa yang disimpan lokal. Tidak dikirim ke server dan dapat dihapus lewat pengaturan browser.', 'The preview does not request your name, email, address or payment details. Where browser storage is available, only shade IDs, bag quantities and the language preference are saved locally. They are not sent to a server and can be cleared in browser settings.')],
        [t('Apakah ini sudah menjadi toko WordPress?', 'Is this already a WordPress store?'), t('Belum. Ini preview HTML/CSS/JavaScript mandiri untuk review desain. Implementasi akhir tetap mengikuti WordPress/WooCommerce dan perlu validasi bilingual, payment serta shipping secara terpisah.', 'Not yet. This is a standalone HTML/CSS/JavaScript design preview. Final implementation still follows WordPress/WooCommerce and needs separate bilingual, payment and shipping validation.')],
      ]],
    ];
    main.innerHTML = `${breadcrumb('FAQ')}${heading('A LITTLE CLARITY / FAQ', t('ADA<br><span>PERTANYAAN?</span>', 'A LITTLE<br><span>CLARITY.</span>'), t('Tentang warna, alur belanja, dan apa yang masih berupa contoh.', 'About colors, the shopping flow, and what is still a sample.'))}<section class="section faq-layout"><nav class="faq-nav" aria-label="${t('Topik FAQ', 'FAQ topics')}">${groups.map(([id, name], index) => `<a href="#${id}"><span>0${index + 1}</span>${name} ↘</a>`).join('')}</nav><div>${groups.map(([id, name, entries], index) => `<section class="faq-group" id="${id}"><p class="eyebrow">0${index + 1} / GOOD TO KNOW</p><h2>${name}</h2>${entries.map(([q, a]) => faqItem(q, a)).join('')}</section>`).join('')}<aside class="demo-note"><strong>${t('Informasi toko final belum tersedia.', 'Final store information is not yet available.')}</strong><p>${t('Kontak bantuan dan kebijakan resmi akan diisi setelah diterima dari klien. Tidak ada tautan WhatsApp atau kontak rekaan.', 'Support contacts and official policies will be added after they are supplied by the client. There are no invented WhatsApp links or contacts.')}</p></aside></div></section>`;
  }
  shell();
  // Lenis smooth scroll + sticky header backdrop toggle.
  (function () {
    const s = document.createElement('script');
    s.src = 'lenis.min.js';
    s.async = true;
    s.onload = () => {
      // Lenis untuk scrollTo saja (smooth anchor jumps); wheel pakai native.
      // Quizabl pakai duration:1.2 + easing juga terasa lambat di wheel burst.
      const lenis = new Lenis({
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: false,
      });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // Toggle backdrop class pada .site-header via native scroll.
      const header = document.querySelector('.site-header');
      if (header) {
        const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        window.addEventListener('scroll', update, { passive: true });
        update();
      }
    };
    document.head.appendChild(s);
  })();
  ({ home, shop, product, cart: cartPage, checkout, about, faq }[pageName] || home)();
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-add]');
    if (button) addToCart(button.dataset.add);
  });
  document.querySelector('#language-switch').addEventListener('click', () => {
    const nextLang = lang === 'id' ? 'en' : 'id';
    writeStorage('solpaci-b-lang', nextLang);
    const next = new URL(location.href);
    next.searchParams.set('lang', nextLang);
    location.href = next.href;
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.querySelector('.site-header').addEventListener('focusout', event => { if (!event.currentTarget.contains(event.relatedTarget)) closeMenu(); });
  window.matchMedia('(max-width: 700px)').addEventListener('change', closeMenu);
})();