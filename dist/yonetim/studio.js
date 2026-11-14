/* Yasamore — Banner Stüdyosu, Depo temizliği ve Toplu otomatik SEO.
   admin.js'in genel değişkenlerini kullanır (D, sb, persist, render, upImg, langs, LG, cparts, ck, catKeys). */
(function () {
  var SLOT_LBL = { hero1: 'Hero — büyük görsel', hero2: 'Hero — küçük görsel', ed1: 'Koleksiyon — görsel 1', ed2: 'Koleksiyon — görsel 2', story: 'Hikâyemiz görseli' };
  var SHAPE_LBL = { arch: 'Kemer', round: 'Yuvarlak köşe', square: 'Kare', circle: 'Daire', ellipse: 'Oval', pill: 'Hap', blob: 'Organik', leaf: 'Yaprak', ticket: 'Bilet', star: 'Yıldız', star8: 'Yıldız 8', burst: 'Patlama', heart: 'Kalp', hexagon: 'Altıgen', octagon: 'Sekizgen', diamond: 'Elmas', triangle: 'Üçgen', cross: 'Artı', arrow: 'Ok', wave: 'Dalga', custom: 'Özel' };
  var REBUILD = { img: 1, code: 1, lt: 1, lv: 1, badge: 1 };
  var cur = 'hero1', dev = 'd', frame = null, fd = null, ov = null, live = null, scrollY = 0, drag = null, rt = null;
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $q = function (s) { return document.querySelector(s); };
  var r1 = function (v) { return Math.round(v * 10) / 10; }, r2 = function (v) { return Math.round(v * 100) / 100; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  function BN() { var S = D.settings; S.banners = S.banners || {}; return S.banners; }
  function B() { var n = BN(); return n[cur] = n[cur] || {}; }
  function DV() { var b = B(); return b[dev] = b[dev] || {}; }
  function slotEl() { return fd && fd.querySelector('.arch[data-s="' + cur + '"]'); }

  /* ---------- Banner Stüdyosu ---------- */
  function html() {
    return '<div class="c"><h3>Banner Stüdyosu</h3><p class="mut">Soldan bannerı seçin; sağdaki önizlemede <b>sürükleyerek taşıyın</b>, köşedeki <b>yuvarlak tutamakla boyutlandırın</b>. Masaüstü ve telefon görünümleri ayrı kaydedilir. Her değişiklik otomatik kaydedilir ve sitede birkaç saniye içinde yayına girer.</p></div>' +
      '<div class="stu"><div id="stp" class="stp"></div><div class="stv"><div class="row stdev"><button data-stdev="d">🖥 Masaüstü</button><button data-stdev="m">📱 Telefon</button><span class="mut" id="stinfo"></span></div><div id="stwrap"><iframe id="stf" title="Önizleme"></iframe></div></div></div>';
  }
  function out(id, v) { var o = document.querySelector('[data-so="' + id + '"]'); if (o) o.textContent = v; }
  function rng(label, attr, key, min, max, step, val, unit) {
    return '<div class="stR"><label>' + label + ' <b data-so="' + key + '">' + val + (unit || '') + '</b></label><input type="range" ' + attr + '="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
  }
  function panel() {
    var p = $q('#stp'); if (!p) return;
    var b = B(), v = DV(), el = slotEl(), AB = AurelyaBuild, wv, arv, lt = b.lt || '';
    wv = v.w != null ? +v.w : el ? r1(measureW(el)) : 100;
    arv = v.ar != null ? +v.ar : el && el.offsetHeight ? r2(el.offsetWidth / el.offsetHeight) : 1;
    var codes = (D.products || []).filter(function (x) { return x.code; }).slice(0, 5000).map(function (x) { return '<option value="' + E(x.code) + '">' + E((x.name || {}).tr || '') + '</option>'; }).join('');
    var cats = (typeof catKeys === 'function' ? catKeys() : []).map(function (c) { return '<option value="' + E(c) + '">'; }).join('');
    var shapes = AB.shapes.concat(['custom']).map(function (s) {
      var d = AB.shapeDefs[s] || {}, st = d.c ? 'clip-path:' + d.c : d.r ? 'border-radius:' + d.r : 'border-radius:8px';
      return '<button class="stsh' + ((b.shape || 'arch') === s ? ' on' : '') + '" data-stset="shape:' + s + '" title="' + E(SHAPE_LBL[s] || s) + '"><i style="' + st + '"></i><small>' + E(SHAPE_LBL[s] || s) + '</small></button>';
    }).join('');
    var fit = b.fit || '';
    p.innerHTML = '<datalist id="stcodes">' + codes + '</datalist><datalist id="stcats">' + cats + '</datalist>' +
      '<div class="c"><h3>Banner seçin</h3><div class="row">' + Object.keys(SLOT_LBL).map(function (k) { return '<button class="' + (k === cur ? 'pri' : '') + '" data-stslot="' + k + '">' + SLOT_LBL[k] + '</button>'; }).join('') + '</div></div>' +
      '<div class="c"><h3>Görsel</h3><p class="mut">Boşsa ürün görseli otomatik gelir. Bir ürün koduyla başka ürün seçebilir ya da kendi görselinizi yükleyebilirsiniz.</p>' +
      '<label>Ürün kodu (bu ürünün görseli kullanılsın)</label><input type="text" data-sf="code" list="stcodes" value="' + E(b.code || '') + '" placeholder="örn. DEMO-001">' +
      '<label>Kendi görselinizi yükleyin</label><div class="r"><img class="pv" src="' + E(b.img || '') + '" alt=""' + (b.img ? '' : ' hidden') + '><input type="file" data-stup="1" accept="image/*"><button class="sm" data-stset="img:">Yüklenen görseli kaldır</button></div>' +
      '<label>Sığdırma</label><div class="row"><button class="' + (fit === '' || fit === 'cover' ? 'pri' : '') + '" data-stset="fit:cover">Kırp (doldur)</button><button class="' + (fit === 'contain' ? 'pri' : '') + '" data-stset="fit:contain">Tam sığdır</button><button class="' + (fit === 'fill' ? 'pri' : '') + '" data-stset="fit:fill">Esnet</button></div>' +
      rng('Görsel yakınlığı', 'data-sf', 'zoom', 40, 250, 1, b.zoom != null ? b.zoom : 100, '%') + rng('Görsel konumu — yatay', 'data-sf', 'px', 0, 100, 1, b.px != null ? b.px : 50, '%') + rng('Görsel konumu — dikey', 'data-sf', 'py', 0, 100, 1, b.py != null ? b.py : 50, '%') +
      '<div class="row"><label style="margin:0">Arka plan rengi</label><input type="color" data-sf="bg" value="' + E(/^#[0-9a-f]{6}$/i.test(b.bg || '') ? b.bg : '#f3ebdd') + '" style="width:48px;padding:2px"><button class="sm" data-stset="bg:">Varsayılan</button></div></div>' +
      '<div class="c"><h3>Şekil</h3><div class="shg">' + shapes + '</div>' +
      (b.shape === 'custom' ? '<label>CSS clip-path (örn. polygon(50% 0,100% 100%,0 100%) ya da circle(45% at 50% 50%))</label><input type="text" data-sf="clip" value="' + E(b.clip || '') + '"><label>veya köşe yuvarlatma (örn. 30% 70% 70% 30% / 30% 30% 70% 70%)</label><input type="text" data-sf="radius" value="' + E(b.radius || '') + '">' : '') + '</div>' +
      '<div class="c"><h3>Boyut ve konum — ' + (dev === 'd' ? 'Masaüstü' : 'Telefon') + '</h3>' +
      (v.hide ? '<p class="mut">Bu banner bu cihazda gizli.</p>' : '') +
      rng('Genişlik', 'data-sd', 'w', 20, 160, 0.5, wv, '%') + rng('En/boy oranı (genişlik ÷ yükseklik)', 'data-sd', 'ar', 0.4, 2.5, 0.01, arv, '') + rng('Yatay kaydırma', 'data-sd', 'x', -100, 100, 0.5, v.x || 0, '%') + rng('Dikey kaydırma', 'data-sd', 'y', -100, 100, 0.5, v.y || 0, '%') + rng('Döndürme', 'data-sd', 'r', -30, 30, 1, v.r || 0, '°') +
      '<label style="display:flex;gap:8px;align-items:center;text-transform:none"><input type="checkbox" data-sd="hide" style="width:auto"' + (v.hide ? ' checked' : '') + '> Bu cihazda gizle</label>' +
      '<div class="row"><button class="sm" data-stdreset="1">Bu cihaz ayarını sıfırla</button><button class="sm" data-stcopy="' + (dev === 'd' ? 'd:m' : 'm:d') + '">' + (dev === 'd' ? 'Telefona kopyala' : 'Masaüstüne kopyala') + '</button></div></div>' +
      '<div class="c"><h3>Tıklayınca nereye gitsin?</h3><label>Bağlantı türü</label><select data-sf="lt">' + [['', 'Otomatik (görsel bir ürünse o ürünün sayfası)'], ['product', 'Belirli bir ürün'], ['cat', 'Bir kategori'], ['url', 'Özel adres (URL)'], ['wa', 'WhatsApp mesajı'], ['none', 'Bağlantı yok']].map(function (o) { return '<option value="' + o[0] + '"' + (lt === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' +
      (lt === 'product' ? '<label>Ürün kodu</label><input type="text" data-sf="lv" list="stcodes" value="' + E(b.lv || '') + '">' : lt === 'cat' ? '<label>Kategori (Ana ya da Ana > Alt)</label><input type="text" data-sf="lv" list="stcats" value="' + E(b.lv || '') + '">' : lt === 'url' ? '<label>Adres (https://… ya da /urunler/)</label><input type="text" data-sf="lv" value="' + E(b.lv || '') + '">' : lt === 'wa' ? '<label>WhatsApp mesajı</label><input type="text" data-sf="lv" value="' + E(b.lv || '') + '" placeholder="Merhaba, kampanya hakkında bilgi almak istiyorum">' : '') +
      '<label>Rozet yazısı (görselin köşesinde; örn. Yeni, %20 İndirim)</label><input type="text" data-sf="badge" value="' + E(b.badge || '') + '" maxlength="24"></div>' +
      '<div class="row"><button class="sm dg" data-stsreset="1">Bu bannerın tüm ayarlarını sıfırla</button></div>';
    document.querySelectorAll('[data-stdev]').forEach(function (x) { x.className = x.dataset.stdev === dev ? 'pri' : ''; });
  }
  function measureW(el) {
    var cw = el.offsetWidth, s = el.style.width, m = el.style.maxWidth; el.style.maxWidth = 'none'; el.style.width = '100%';
    var full = el.offsetWidth; el.style.width = s; el.style.maxWidth = m; return full ? cw / full * 100 : 100;
  }
  function previewData() {
    var S = JSON.parse(JSON.stringify(D.settings || {})); S.langs = ['tr'];
    var bn = S.banners || {}, codes = [];
    Object.keys(bn).forEach(function (k) { var b = bn[k]; if (!b || typeof b !== 'object') return;['fit', 'px', 'py', 'zoom', 'bg', 'shape', 'clip', 'radius', 'd', 'm'].forEach(function (f) { delete b[f]; }); if (b.code) codes.push(String(b.code).trim()); if (b.lt === 'product' && b.lv) codes.push(String(b.lv).trim()); });
    var keep = new Set(), fc = String(S.featuredCat || '').trim();
    (D.products || []).slice(0, 40).forEach(function (p) { keep.add(p); });
    (D.products || []).forEach(function (p) { if (codes.indexOf(p.code) > -1 || codes.indexOf(p.slug) > -1) keep.add(p); });
    if (fc) { var n = 0; (D.products || []).forEach(function (p) { if (n < 6 && cparts(p.cat)[0] === fc) { keep.add(p); n++; } }); }
    return Object.assign({}, D, { settings: S, products: (D.products || []).filter(function (p) { return keep.has(p); }) });
  }
  function renderFrame() {
    var f = $q('#stf'); if (!f) return; frame = f;
    if (fd) { try { scrollY = fd.documentElement.scrollTop; } catch (e) { } }
    var h = '', css = '';
    try { var r = AurelyaBuild.build(previewData(), { local: false, rel: false }); h = r.files['index.html'] || ''; css = r.files['style.css'] || ''; }
    catch (e) { f.srcdoc = '<p style="font:14px sans-serif;padding:20px">Önizleme üretilemedi: ' + E(e.message) + '</p>'; return; }
    var inj = '<style id="stlive"></style><style>.rv{opacity:1!important;transform:none!important;animation:none!important}html{scroll-behavior:auto!important}' +
      '#stov{position:absolute;z-index:99999;border:2px dashed #c0392b;box-sizing:border-box;cursor:move;touch-action:none;background:rgba(192,57,43,.07)}#stov .sth{position:absolute;right:-10px;bottom:-10px;width:20px;height:20px;background:#c0392b;border:2px solid #fff;border-radius:50%;cursor:nwse-resize;box-shadow:0 1px 4px rgba(0,0,0,.4)}#stov .stl{position:absolute;left:-2px;top:-26px;background:#c0392b;color:#fff;font:600 12px sans-serif;padding:3px 9px;border-radius:6px;white-space:nowrap;pointer-events:none}.arch[data-s]{outline:1px dashed rgba(192,57,43,.45);outline-offset:2px}</style>';
    h = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<link[^>]*href="[^"]*style\.css[^"]*"[^>]*>/i, function () { return '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>'; }).replace('</head>', function () { return inj + '</head>'; });
    f.onload = onFrame; f.srcdoc = h;
  }
  function onFrame() {
    fd = frame.contentDocument; if (!fd) return; live = fd.getElementById('stlive');
    fd.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a'); if (a) e.preventDefault();
      var s = e.target.closest && e.target.closest('.arch[data-s]'); if (s && s.dataset.s !== cur) { cur = s.dataset.s; panel(); place(); }
    }, true);
    ov = fd.createElement('div'); ov.id = 'stov'; ov.innerHTML = '<i class="sth"></i><b class="stl"></b>'; fd.body.appendChild(ov);
    ov.addEventListener('pointerdown', down); ov.addEventListener('pointermove', move); ov.addEventListener('pointerup', up); ov.addEventListener('pointercancel', up);
    ov.addEventListener('dblclick', function () { B()[dev] = {}; commit(false); panel(); });
    apply(); if (scrollY) fd.documentElement.scrollTop = scrollY; else focusSlot();
    setTimeout(function () { place(); panel(); }, 60);
  }
  function focusSlot() { var el = slotEl(); if (el && el.scrollIntoView) { el.scrollIntoView({ block: 'center' }); } place(); }
  function apply() { if (live) live.textContent = AurelyaBuild.bannerCss(BN()); place(); }
  function place() {
    if (!ov || !fd) return; var el = slotEl();
    if (!el || !el.offsetWidth) { ov.style.display = 'none'; return; }
    var r = el.getBoundingClientRect(), w = fd.defaultView;
    ov.style.display = 'block'; ov.style.left = (r.left + w.pageXOffset) + 'px'; ov.style.top = (r.top + w.pageYOffset) + 'px'; ov.style.width = r.width + 'px'; ov.style.height = r.height + 'px';
    ov.querySelector('.stl').textContent = SLOT_LBL[cur];
  }
  function down(e) {
    var el = slotEl(); if (!el) return; var v = DV();
    drag = { mode: e.target.classList.contains('sth') ? 'r' : 'm', x: e.clientX, y: e.clientY, w: el.offsetWidth, h: el.offsetHeight, vx: +v.x || 0, vy: +v.y || 0, vw: v.w != null ? +v.w : measureW(el) };
    try { ov.setPointerCapture(e.pointerId); } catch (x) { } e.preventDefault();
  }
  function move(e) {
    if (!drag) return; var v = DV(), dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (drag.mode === 'm') { v.x = r1(clamp(drag.vx + dx / drag.w * 100, -300, 300)); v.y = r1(clamp(drag.vy + dy / drag.h * 100, -300, 300)); }
    else { var nw = Math.max(40, drag.w + dx), nh = Math.max(40, drag.h + dy); v.w = r1(clamp(drag.vw * nw / drag.w, 10, 200)); v.ar = r2(clamp(nw / nh, .3, 4)); }
    delete v.hide; apply(); sync();
  }
  function up() { if (!drag) return; drag = null; commit(false); }
  function sync() {
    var v = DV();[['w', v.w, '%'], ['ar', v.ar, ''], ['x', v.x || 0, '%'], ['y', v.y || 0, '%'], ['r', v.r || 0, '°']].forEach(function (a) {
      if (a[1] == null) return; var i = document.querySelector('[data-sd="' + a[0] + '"]'); if (i && i.type === 'range') i.value = a[1]; out(a[0], a[1] + a[2]);
    });
  }
  function commit(rebuild) { persist(); if (rebuild) renderFrame(); else apply(); }
  function sizeFrame() {
    var wrap = $q('#stwrap'), f = $q('#stf'); if (!wrap || !f) return;
    var W = dev === 'd' ? 1280 : 390, H = dev === 'd' ? 900 : 780, avail = wrap.parentElement.clientWidth - 6, k = Math.min(1, avail / W);
    f.style.width = W + 'px'; f.style.height = H + 'px'; f.style.transform = 'scale(' + k + ')'; f.style.transformOrigin = 'top left';
    wrap.style.width = (W * k) + 'px'; wrap.style.height = (H * k) + 'px'; wrap.className = dev === 'm' ? 'mob' : 'desk';
    var i = $q('#stinfo'); if (i) i.textContent = (dev === 'd' ? 'Masaüstü 1280 px' : 'Telefon 390 px') + ' · önizleme %' + Math.round(k * 100);
    setTimeout(place, 80);
  }

  /* ---------- Depo ve veritabanı ---------- */
  var scanRes = null;
  function depoHtml() {
    var js = JSON.stringify(D), kb = Math.round(new Blob([js]).size / 1024), imgs = (js.match(/\/aurelya-assets\//g) || []).length;
    var warn = kb > 6000 ? ' <b class="bad">Büyük: kaydetme yavaşlayabilir, görselleri ve eski ürünleri temizleyin.</b>' : '';
    return '<div class="c"><h3>Veritabanı durumu</h3><p>Ürün: <b>' + (D.products || []).length + '</b> · Kategori: <b>' + (typeof catKeys === 'function' ? catKeys().length : '—') + '</b> · Depodaki görsel bağlantısı: <b>' + imgs + '</b> · Site verisi: <b>' + kb + ' KB</b>' + warn + '</p>' +
      '<p class="mut">Bir ürünü sildiğinizde ürün kaydı, Merchant XML akışındaki yeri ve ürüne ait görseller (başka ürünün kullanmadığı) otomatik silinir. XML bir dosya değil canlı bağlantıdır; silinen ürün bir sonraki Google çekişinde akıştan kalkar.</p></div>' +
      '<div class="c"><h3>Depo temizliği (kullanılmayan görseller)</h3><p class="mut">Eski kopyalar, yarım kalan yüklemeler ve silinmiş ürünlerin artıkları depoyu şişirir. Tarama yalnızca <b>urunler/</b> klasörüne bakar ve hiçbir yerde kullanılmayan görselleri bulur. Aynı depoyu başka bir site de kullanıyorsa bu aracı kullanmayın.</p>' +
      '<div class="row"><button class="pri" data-staction="scan">Depoyu tara</button><button class="dg" data-staction="clean" id="stclean" hidden>Kullanılmayanları sil</button></div><div id="stscan" class="mut" style="margin-top:8px"></div></div>';
  }
  async function scan() {
    var o = $q('#stscan'); if (!sb || !remoteOk) { o.textContent = 'Önce giriş yapın (Supabase bağlı değil).'; return; }
    o.textContent = 'Taranıyor…'; var bucket = sb.storage.from('aurelya-assets'), files = [], off = 0;
    try {
      for (; ;) {
        var r = await bucket.list('urunler', { limit: 1000, offset: off, sortBy: { column: 'name', order: 'asc' } });
        if (r.error) throw r.error; var d = r.data || [];
        d.forEach(function (it) { if (it.id && it.name.charAt(0) !== '.') files.push({ path: 'urunler/' + it.name, size: (it.metadata && it.metadata.size) || 0 }); });
        if (d.length < 1000) break; off += 1000;
      }
    } catch (e) { o.textContent = 'Taranamadı: ' + (e.message || e); return; }
    var js = JSON.stringify(D), orphans = files.filter(function (f) { return js.indexOf(f.path) < 0 && js.indexOf(encodeURI(f.path)) < 0; });
    var mb = function (a) { return (a.reduce(function (s, f) { return s + f.size; }, 0) / 1048576).toFixed(1); };
    scanRes = orphans;
    o.innerHTML = 'Depoda <b>' + files.length + '</b> görsel (' + mb(files) + ' MB). Kullanılmayan: <b class="' + (orphans.length ? 'warn' : 'ok') + '">' + orphans.length + '</b> (' + mb(orphans) + ' MB).' + (orphans.length ? '<br><small>' + orphans.slice(0, 12).map(function (f) { return E(f.path); }).join('<br>') + (orphans.length > 12 ? '<br>…' : '') + '</small>' : '');
    $q('#stclean').hidden = !orphans.length;
  }
  async function clean() {
    if (!scanRes || !scanRes.length) return;
    if (!confirm(scanRes.length + ' kullanılmayan görsel depodan kalıcı olarak silinsin mi? Bu işlem geri alınamaz.')) return;
    var o = $q('#stscan'), bucket = sb.storage.from('aurelya-assets'), paths = scanRes.map(function (f) { return f.path; }), done = 0;
    for (var i = 0; i < paths.length; i += 100) {
      var r = await bucket.remove(paths.slice(i, i + 100)); if (r.error) { o.textContent = 'Silinemedi: ' + r.error.message; return; } done += Math.min(100, paths.length - i); o.textContent = done + ' / ' + paths.length + ' silindi…';
    }
    scanRes = null; $q('#stclean').hidden = true; o.textContent = done + ' görsel silindi. Depo temiz.';
  }

  /* ---------- Toplu otomatik SEO ---------- */
  var DT = {
    tr: 'Hızlı kargo, güvenli alışveriş ve WhatsApp ile kolay sipariş.', en: 'Fast shipping, secure shopping and easy ordering via WhatsApp.',
    de: 'Schneller Versand, sicher einkaufen und einfach per WhatsApp bestellen.', fr: 'Livraison rapide, achat sécurisé et commande facile via WhatsApp.', ar: 'شحن سريع وتسوق آمن وطلب سهل عبر واتساب.'
  };
  function clipTxt(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'; }
  function plainTxt(s) { return String(s || '').replace(/\*\*/g, '').replace(/\s*;\s*-\s*/g, '. ').replace(/^\s*-\s*/, '').replace(/\s+/g, ' ').trim(); }
  function catLabel(p, l) {
    var parts = cparts(p.cat); if (!parts.length) return ''; if (l === 'tr') return parts[parts.length - 1];
    var m = (D.catNames || {})[ck(parts.join(' > '))] || (D.catNames || {})[ck(parts[0])]; return (m && m[l]) || '';
  }
  function autoSeo(over) {
    var cnt = { title: 0, desc: 0, mtitle: 0, alt: 0 }, store = D.settings.name || '', L = langs();
    D.products.forEach(function (p) {
      p.seo = p.seo || {};
      L.forEach(function (l) {
        var n = String((p.name || {})[l] || '').trim(); if (!n) return;
        var c = catLabel(p, l), put = function (k, v) {
          p.seo[k] = p.seo[k] || {}; if (!v || (p.seo[k][l] && !over)) return; p.seo[k][l] = v; cnt[k]++;
        };
        var tf = n + (c && n.toLowerCase().indexOf(c.toLowerCase()) < 0 ? ' - ' + c : ''); put('title', tf.length <= 58 ? tf : clipTxt(n, 60));
        var d = plainTxt((p.desc || {})[l]);
        put('desc', d.length >= 70 ? clipTxt(d, 155) : clipTxt(n + (c ? ' — ' + c : '') + '. ' + (DT[l] || DT.tr) + ' ' + store, 158));
        var extra = [p.brand, p.color, p.size].filter(Boolean).join(' ');
        if (extra) put('mtitle', clipTxt((p.brand && n.toLowerCase().indexOf(String(p.brand).toLowerCase()) < 0 ? p.brand + ' ' : '') + n + ([p.color, p.size].filter(function (x) { return x && n.toLowerCase().indexOf(String(x).toLowerCase()) < 0; }).length ? ' - ' + [p.color, p.size].filter(function (x) { return x && n.toLowerCase().indexOf(String(x).toLowerCase()) < 0; }).join(' ') : ''), 150));
        put('alt', clipTxt(n + (p.color && n.toLowerCase().indexOf(String(p.color).toLowerCase()) < 0 ? ' - ' + p.color : ''), 120));
      });
    });
    persist(); return cnt;
  }
  function seoCardHtml() {
    return '<div class="c"><h3>Toplu otomatik SEO</h3><p class="mut">Ürün adı, kategori ve açıklamadan SEO başlığı, SEO açıklaması, Merchant başlığı ve görsel alt metnini tüm aktif dillerde üretir. Varsayılan olarak yalnızca boş alanları doldurur; elle yazdıklarınıza dokunmaz. Yeni eklediğiniz ürünlerde boş kalan alanlar site üretilirken zaten otomatik dolar.</p>' +
      '<div class="row"><button class="pri" data-staction="autoseo">Boş SEO alanlarını doldur</button><button class="dg" data-staction="autoseo-over">Tümünü yeniden üret (üzerine yaz)</button></div><div id="stseo" class="mut" style="margin-top:8px"></div></div>';
  }

  /* ---------- olaylar ---------- */
  function handleField(t) {
    var f = t.dataset.sf, b = B(), v;
    if (f === 'zoom' || f === 'px' || f === 'py') v = parseFloat(t.value); else v = t.value;
    if (v === '' || (typeof v === 'number' && isNaN(v))) delete b[f]; else b[f] = v;
    if (f === 'lt') { delete b.lv; panel(); }
    if (t.type === 'range') { var u = f === 'zoom' || f === 'px' || f === 'py' ? '%' : ''; out(f, t.value + u); }
    commit(!!REBUILD[f]);
  }
  function handleDev(t) {
    var f = t.dataset.sd, v = DV();
    if (f === 'hide') { if (t.checked) v.hide = true; else delete v.hide; panel(); }
    else { v[f] = parseFloat(t.value); out(f, t.value + (f === 'w' || f === 'x' || f === 'y' ? '%' : f === 'r' ? '°' : '')); }
    commit(false);
  }
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t.dataset) return;
    if (t.dataset.sd && t.type === 'range') handleDev(t);
    else if (t.dataset.sf && t.type === 'range') handleField(t);
    else if (t.dataset.sf && t.type === 'color') handleField(t);
  });
  document.addEventListener('change', function (e) {
    var t = e.target; if (!t.dataset) return;
    if (t.dataset.sd && t.type === 'checkbox') handleDev(t);
    else if (t.dataset.sf && t.type !== 'range' && t.type !== 'color') handleField(t);
    else if (t.dataset.stup && t.files && t.files[0]) { upImg(t.files[0], function (u) { if (u) { B().img = u; commit(true); panel(); } }, 1400); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button'); if (!t) return; var d = t.dataset;
    if (d.cp) { navigator.clipboard.writeText(d.cp).then(function () { var o = t.textContent; t.textContent = 'Kopyalandı ✓'; setTimeout(function () { t.textContent = o; }, 1500); }); return; }
    if (d.stslot) { cur = d.stslot; panel(); focusSlot(); return; }
    if (d.stdev) { dev = d.stdev; sizeFrame(); panel(); return; }
    if (d.stset) {
      var i = d.stset.indexOf(':'), f = d.stset.slice(0, i), v = d.stset.slice(i + 1), b = B();
      if (v === '') delete b[f]; else b[f] = v; commit(!!REBUILD[f]); panel(); return;
    }
    if (d.stdreset) { B()[dev] = {}; commit(false); panel(); return; }
    if (d.stcopy) { var p = d.stcopy.split(':'), bb = B(); bb[p[1]] = JSON.parse(JSON.stringify(bb[p[0]] || {})); commit(false); panel(); return; }
    if (d.stsreset) { if (confirm('Bu bannerın tüm stüdyo ayarları sıfırlansın mı?')) { delete BN()[cur]; commit(true); panel(); } return; }
    if (d.staction === 'scan') scan();
    else if (d.staction === 'clean') clean();
    else if (d.staction === 'autoseo' || d.staction === 'autoseo-over') {
      if (d.staction === 'autoseo-over' && !confirm('Elle yazdığınız SEO alanları dahil hepsi yeniden üretilsin mi?')) return;
      var c = autoSeo(d.staction === 'autoseo-over'), o = $q('#stseo');
      if (o) o.innerHTML = 'Tamamlandı: <b>' + c.title + '</b> başlık, <b>' + c.desc + '</b> açıklama, <b>' + c.mtitle + '</b> Merchant başlığı, <b>' + c.alt + '</b> alt metin yazıldı. Değişiklikler kaydedildi ve sitede yayına girer.';
    }
  });
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(sizeFrame, 150); });

  window.Studio = {
    html: html, depoHtml: depoHtml, seoCardHtml: seoCardHtml,
    after: function (sub) {
      document.body.classList.toggle('stwide', sub === 'studio');
      if (sub !== 'studio') { fd = null; ov = null; live = null; frame = null; scrollY = 0; return; }
      scrollY = 0; panel(); sizeFrame(); renderFrame();
    }
  };
})();
