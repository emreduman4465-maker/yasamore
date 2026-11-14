/* Yasamore — Site Ayarları → "Tasarım ve Özel Kod"
   Burada yapılan her değişiklik önce TASLAK olur (siteyi etkilemez), sağdaki canlı önizlemede anında görünür.
   "Aktif et" düğmesi taslağı siteye yansıtır. Ayrıca Google Merchant XML adres testi de bu dosyadadır. */
(function () {
  var $q = function (s) { return document.querySelector(s); };
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o || {})); };
  var DEF = { accent: '#b08d57', acd: '#8a6a38', bg: '#faf6ef', card: '#ffffff', ink: '#2a2420', mut: '#74685d', line: '#e9e0d1', soft: '#f3ebdd', dk: '#2a2018', dkt: '#f3e9d8', waBg: '#25d366', waText: '#ffffff' };
  var RATIOS = [['', 'Varsayılan'], ['1/1', 'Kare 1:1'], ['4/5', 'Dikey 4:5'], ['3/4', 'Dikey 3:4'], ['2/3', 'Uzun 2:3'], ['4/3', 'Yatay 4:3'], ['16/9', 'Geniş 16:9']];
  var draft = null, files = null, pageKey = 'index.html', dev = 'd', plang = 'tr', bt = null, st = null, lastScroll = 0, buildErr = '', pendQ = '';

  function groups() {
    var fonts = [['', 'Varsayılan']].concat((window.AurelyaBuild.fonts || []).map(function (f) { return [f, f]; }));
    return [
      { t: 'Renkler', f: [
        ['theme.accent', 'Vurgu rengi (butonlar, çizgiler)', 'c'], ['theme.acd', 'Vurgu — üzerine gelince', 'c'], ['theme.bg', 'Sayfa arka planı', 'c'], ['theme.card', 'Kart / kutu rengi', 'c'],
        ['theme.ink', 'Ana yazı rengi', 'c'], ['theme.mut', 'İkincil yazı rengi', 'c'], ['theme.line', 'Çizgi / kenarlık rengi', 'c'], ['theme.soft', 'Yumuşak zemin rengi', 'c'],
        ['theme.dk', 'Koyu bölüm ve altbilgi zemini', 'c'], ['theme.dkt', 'Altbilgi yazı rengi', 'c'],
        ['theme.dark', 'Koyu mod', 's', [['', 'Otomatik (ziyaretçinin telefon ayarına göre)'], ['off', 'Her zaman açık tema']]]] },
      { t: 'Yazı tipleri ve yazı boyutları', f: [
        ['theme.fontHead', 'Başlık yazı tipi', 's', fonts], ['theme.fontBody', 'Metin yazı tipi', 's', fonts],
        ['theme.baseSize', 'Genel yazı boyutu — bilgisayar (px)', 'n', '16', 13, 22], ['theme.baseSizeM', 'Genel yazı boyutu — mobil (px)', 'n', '16', 12, 22],
        ['theme.heroSize', 'Ana sayfa büyük başlık en çok (px)', 'n', '96', 40, 170], ['theme.h2Size', 'Bölüm başlıkları en çok (px)', 'n', '56', 28, 100],
        ['theme.cardTitle', 'Ürün adı boyutu — bilgisayar (px)', 'n', '21', 13, 36], ['theme.cardTitleM', 'Ürün adı boyutu — mobil (px)', 'n', '21', 12, 28]] },
      { t: 'Logo ve üst menü (canlı önizlemeli)', f: [
        ['theme.logoW', 'Logo genişliği — bilgisayar (px; boşsa yüksekliğe göre)', 'n', 'otomatik', 30, 600], ['theme.logoH', 'Logo yüksekliği — bilgisayar (px)', 'n', '64', 20, 240],
        ['theme.logoWM', 'Logo genişliği — mobil (px)', 'n', 'otomatik', 30, 400], ['theme.logoHM', 'Logo yüksekliği — mobil (px)', 'n', '54', 20, 200],
        ['theme.logoShape', 'Logo köşe şekli', 's', [['', 'Olduğu gibi'], ['round', 'Yuvarlak'], ['soft', 'Yumuşak köşe'], ['square', 'Köşeli']]],
        ['theme.logoName', 'Logonun yanında mağaza adı', 's', [['', 'Logo ve Marka sekmesindeki ayara göre'], ['show', 'Göster'], ['hide', 'Gizle (yalnızca logo)']]],
        ['theme.brandSize', 'Mağaza adı yazı boyutu — bilgisayar (px)', 'n', '30', 12, 64], ['theme.brandSizeM', 'Mağaza adı yazı boyutu — mobil (px)', 'n', '24', 12, 48],
        ['theme.hdrLayout', 'Üst menü düzeni', 's', [['', 'Menü solda, logo ortada'], ['left', 'Logo solda, menü ortada']]],
        ['theme.hdrBg', 'Üst menü arka plan rengi', 'c'], ['theme.menuInk', 'Menü yazı rengi', 'c'],
        ['theme.menuSize', 'Menü yazı boyutu (px)', 'n', '14', 11, 22], ['theme.menuGap', 'Menü öğeleri arası boşluk (px)', 'n', '20', 6, 60],
        ['theme.megaMenu', '“Tüm ürünler” açılır menüsü (tüm kategoriler ve alt kategoriler)', 's', [['', 'Göster'], ['off', 'Gizle']]],
        ['theme.menuMax', 'Menüde ayrıca gösterilecek kategori sayısı (0–12)', 'n', '3', 0, 12],
        ['theme.hdrSearch', 'Üst menüde arama (ürün adı / kodu)', 's', [['', 'Göster'], ['off', 'Gizle']]]] },
      { t: 'Ana sayfa: kategoriler ve arama', f: [
        ['theme.homeCats', 'Kategori bölümü görünümü', 's', [['', 'Kart ızgarası + alt kategori düğmeleri (tüm kategoriler)'], ['mosaic', 'Mozaik (alt kategoriler altta çip olarak)']]],
        ['theme.homeSubs', 'Kartların altında alt kategoriler', 's', [['', 'Göster'], ['off', 'Gizle']]],
        ['theme.homeCols', 'Kategori kartı sütunu — bilgisayar (2–6)', 'n', 'otomatik', 2, 6], ['theme.homeColsM', 'Kategori kartı sütunu — mobil', 's', [['', 'Otomatik'], ['1', '1 sütun'], ['2', '2 sütun']]],
        ['theme.catRatio', 'Kategori görseli oranı', 's', RATIOS],
        ['theme.homeSearch', 'Ana sayfada büyük arama kutusu', 's', [['', 'Göster'], ['off', 'Gizle']]],
        ['theme.homeCount', '“Yeni gelenler” ürün sayısı (4–48)', 'n', '8', 4, 48]] },
      { t: 'Ürün listeleri: arama, sıralama ve filtre', f: [
        ['theme.listTools', 'Liste araç çubuğu (arama, sıralama, fiyat filtresi)', 's', [['', 'Göster'], ['off', 'Gizle']]],
        ['theme.defSort', 'Varsayılan sıralama', 's', [['', 'Önerilen (yeni eklenenler)'], ['pa', 'Fiyat: düşükten yükseğe'], ['pd', 'Fiyat: yüksekten düşüğe'], ['na', 'İsim: A → Z'], ['nd', 'İsim: Z → A'], ['ka', 'Ürün koduna göre'], ['disc', 'İndirim oranına göre']]],
        ['theme.perPage', 'Sayfada gösterilen ürün (0 = hepsi, “Daha fazla göster” düğmesi)', 'n', '48', 0, 500],
        ['theme.showCode', 'Kartlarda ürün kodu', 's', [['', 'Gösterme'], ['1', 'Göster']]]] },
      { t: 'Yerleşim ve boşluklar', f: [
        ['theme.containerW', 'Sayfa içerik genişliği (px)', 'n', '1240', 900, 1800], ['theme.sectionGap', 'Bölümler arası boşluk (px)', 'n', '76', 16, 180],
        ['theme.hdrPad', 'Üst menü yüksekliği (üst-alt boşluk, px)', 'n', '14', 2, 50],
        ['theme.hdrSticky', 'Üst menü', 's', [['', 'Kaydırırken yukarıda sabit kalsın'], ['off', 'Sabit kalmasın']]]] },
      { t: 'Ürün kartları ve görseller', f: [
        ['theme.gridMin', 'Kart en az genişlik (px) — küçülünce daha çok sütun', 'n', '240', 130, 440],
        ['theme.mobCols', 'Mobilde sütun sayısı', 's', [['', 'Otomatik'], ['1', 'Mobilde 1 sütun'], ['2', 'Mobilde 2 sütun']]],
        ['theme.gridGapX', 'Kartlar arası yatay boşluk (px)', 'n', '20', 0, 90], ['theme.gridGapY', 'Kartlar arası dikey boşluk (px)', 'n', '30', 0, 120],
        ['theme.cardRadius', 'Görsel köşe yuvarlaklığı (px)', 'n', '16', 0, 60],
        ['theme.imgRatio', 'Liste görsel oranı', 's', RATIOS], ['theme.prodRatio', 'Ürün sayfası büyük görsel oranı', 's', RATIOS],
        ['theme.imgFit', 'Görsel yerleşimi', 's', [['', 'Alanı doldur (kırpar)'], ['contain', 'Tamamını göster (kırpmaz)']]]] },
      { t: 'Butonlar', f: [
        ['theme.btnRadius', 'Köşe yuvarlaklığı (px, 999 = hap)', 'n', '99', 0, 999], ['theme.btnPadY', 'Dikey iç boşluk (px)', 'n', '14', 4, 40],
        ['theme.btnPadX', 'Yatay iç boşluk (px)', 'n', '28', 8, 90], ['theme.btnSize', 'Yazı boyutu (px)', 'n', '14', 11, 24]] },
      { t: 'WhatsApp ile sipariş butonu (tüm ürün kartları: ana sayfa, kategori, ürünler, benzer ürünler)', f: 'wa' }
    ];
  }
  function cur(p) { var a = p.split('.'), o = draft; for (var i = 0; i < a.length; i++) { if (o == null) return ''; o = o[a[i]]; } return o == null ? '' : o; }
  function put(p, v) {
    var a = p.split('.'), o = draft, chain = [];
    for (var i = 0; i < a.length - 1; i++) { if (o[a[i]] == null || typeof o[a[i]] !== 'object') o[a[i]] = {}; chain.push([o, a[i]]); o = o[a[i]]; }
    if (v === '' || v == null) {
      delete o[a[a.length - 1]];
      for (var j = chain.length - 1; j >= 1; j--) { var c = chain[j]; if (!Object.keys(c[0][c[1]]).length) delete c[0][c[1]]; }
    } else o[a[a.length - 1]] = v;
  }
  function liveOf() { var S = D.settings; return { theme: clone(S.theme), custom: clone(S.custom), cardWa: clone(S.cardWa) }; }
  function ensure() {
    if (!D.draft || typeof D.draft !== 'object') D.draft = liveOf();
    D.draft.theme = D.draft.theme || {}; D.draft.custom = D.draft.custom || {}; D.draft.cardWa = D.draft.cardWa || {};
    draft = D.draft;
  }
  function stable(o) { if (o && typeof o === 'object') { if (Array.isArray(o)) return '[' + o.map(stable).join(',') + ']'; return '{' + Object.keys(o).sort().map(function (k) { return JSON.stringify(k) + ':' + stable(o[k]); }).join(',') + '}'; } return JSON.stringify(o); }
  function dirty() { return stable(draft) !== stable(liveOf()); }

  function field(f) {
    var p = f[0], l = f[1], t = f[2], v = cur(p), id = 'dp_' + p.replace(/\./g, '_');
    if (t === 'c') {
      var key = p.split('.').pop(), def = (key === 'accent' && D.settings.accent) || DEF[key] || '#000000';
      return '<div><label>' + l + '</label><div class="row"><input type="color" data-dp="' + p + '" value="' + E(v || def) + '"><button class="sm" data-dclr="' + p + '" type="button">Varsayılan</button><span class="mut">' + (v ? E(v) : 'varsayılan') + '</span></div></div>';
    }
    if (t === 's') return '<div><label>' + l + '</label><select data-dp="' + p + '">' + f[3].map(function (o) { return '<option value="' + E(o[0]) + '"' + (String(v) === o[0] ? ' selected' : '') + '>' + E(o[1]) + '</option>'; }).join('') + '</select></div>';
    if (t === 'n') return '<div><label>' + l + '</label><input type="number" inputmode="decimal" data-dp="' + p + '" value="' + E(v) + '" placeholder="' + E(f[3]) + '" min="' + f[4] + '" max="' + f[5] + '"></div>';
    return '<div><label>' + l + '</label><input type="text" data-dp="' + p + '" value="' + E(v) + '"' + (f[3] ? ' placeholder="' + E(f[3]) + '"' : '') + '></div>';
  }
  function waGroup() {
    var LG = AurelyaBuild.LANGS, L = langs();
    var f1 = [['cardWa.off', 'Kartlardaki WhatsApp butonu', 's', [['', 'Göster'], ['1', 'Gizle']]], ['theme.waBg', 'Buton rengi', 'c'], ['theme.waText', 'Buton yazı rengi', 'c'],
      ['theme.waRadius', 'Köşe yuvarlaklığı (px)', 'n', '12', 0, 999], ['theme.waSize', 'Yazı boyutu (px)', 'n', '14', 11, 22]];
    return '<div class="g">' + f1.map(field).join('') + '</div><h4>Buton yazısı</h4><div class="g">' + L.map(function (l) { return field(['cardWa.label.' + l, LG[l].n, 't', 'WhatsApp ile sipariş ver']); }).join('') + '</div>' +
      '<p class="mut">Müşteri butona basınca WhatsApp’ta <b>sizin numaranıza</b> hazır bir mesaj açılır: ürün adı, ürün kodu ve <b>o ürünün bağlantısı</b> otomatik yazılır. WhatsApp numarası ve mesaj şablonu <b>İletişim</b> sekmesindedir (şablonda {link} yazmasa bile ürün bağlantısı mesajın sonuna eklenir).</p>';
  }
  function codeBox(p, l, rows, ph) { return '<div><label>' + l + '</label><textarea class="code" spellcheck="false" autocapitalize="off" autocomplete="off" rows="' + rows + '" data-dp="' + p + '" data-dpslow="1" placeholder="' + E(ph) + '">' + E(cur(p)) + '</textarea></div>'; }

  function html() {
    ensure();
    var G = groups(), gh = G.map(function (g, i) {
      return '<details class="c dsg"' + (i === 0 ? ' open' : '') + '><summary><b>' + g.t + '</b></summary><div class="g" style="margin-top:10px">' + (g.f === 'wa' ? '' : g.f.map(field).join('')) + '</div>' + (g.f === 'wa' ? waGroup() : '') + '</details>';
    }).join('');
    var code = '<details class="c dsg"><summary><b>Özel CSS / JavaScript / HTML</b></summary>' +
      '<p class="mut">Buraya yazdığınız kodlar tüm sayfalara eklenir. Önizlemede anında çalışır; siteye ancak <b>Aktif et</b> deyince yansır. Gizli anahtar/şifre yazmayın: site kodu herkese açıktır.</p>' +
      codeBox('custom.css', 'Özel CSS (en sonda uygulanır, tema ayarlarını da ezer)', 12, '.btn{border-radius:0}\n.hdr{background:#111}') +
      codeBox('custom.js', 'Özel JavaScript (&lt;script&gt; etiketi yazmayın; /custom.js olarak yüklenir)', 12, "document.addEventListener('DOMContentLoaded', function () {\n  // kodunuz\n});") +
      codeBox('custom.head', 'Head HTML (&lt;/head&gt; öncesi): meta etiketi, Pixel, Tag Manager, doğrulama kodu…', 8, '<meta name="facebook-domain-verification" content="…">') +
      codeBox('custom.body', 'Sayfa sonu HTML (&lt;/body&gt; öncesi): canlı destek, sohbet balonu…', 8, '<div id="destek">…</div>') +
      '</details>';
    var L = langs(), LG = AurelyaBuild.LANGS;
    return '<div class="c"><h3>Tasarım ve Özel Kod</h3><p class="mut" style="margin:0 0 10px">Soldaki ayarları değiştirin, sağdaki önizlemede <b>anında</b> görün. Sitede <b>hiçbir şey değişmez</b> — beğenince <b>Aktif et</b>’e basın, birkaç saniyede canlı siteye yansır.</p>' +
      '<div class="row"><b id="dsst"></b><span style="flex:1"></span><button type="button" data-dreset="1">Taslağı yayındakine döndür</button><a href="../" target="_blank" rel="noopener"><button type="button">Siteyi aç</button></a><button class="pri" type="button" data-dact="1" id="dsact">Aktif et — siteye yansıt</button></div><div class="mut" id="dsmsg" style="margin-top:6px"></div></div>' +
      '<div class="dsl"><div class="dsctl">' + gh + code + '</div><div class="dsp"><div class="c" style="padding:10px">' +
      '<div class="row" style="margin-bottom:8px"><select id="dspg" style="max-width:260px"></select>' +
      (L.length > 1 ? '<select id="dslg" style="max-width:130px">' + L.map(function (l) { return '<option value="' + l + '"' + (l === plang ? ' selected' : '') + '>' + LG[l].n + '</option>'; }).join('') + '</select>' : '') +
      '<button type="button" data-ddev="d" class="' + (dev === 'd' ? 'pri' : '') + '">🖥</button><button type="button" data-ddev="t" class="' + (dev === 't' ? 'pri' : '') + '">▭</button><button type="button" data-ddev="m" class="' + (dev === 'm' ? 'pri' : '') + '">📱</button></div>' +
      '<label class="chk"><input type="checkbox" id="dsjs"> Head/Sayfa sonu HTML içindeki &lt;script&gt;’leri önizlemede de çalıştır</label>' +
      '<div id="dsbox"><iframe id="dsf" title="Önizleme"></iframe></div><div class="mut" id="dsper" style="margin-top:6px">Önizlemede ilk 60 ürün gösterilir; sitede tümü yayınlanır. Önizlemedeki bağlantılara tıklayarak sayfalar arasında gezebilirsiniz.</div></div></div></div>';
  }

  /* ---------- önizleme ---------- */
  function pdata() {
    var S = clone(D.settings); S.theme = clone(draft.theme); S.custom = clone(draft.custom); S.cardWa = clone(draft.cardWa);
    S.langs = plang === 'tr' ? ['tr'] : ['tr', plang];
    var cb = $q('#dsjs'); if (!cb || !cb.checked) { ['head', 'body'].forEach(function (k) { if (S.custom[k]) S.custom[k] = String(S.custom[k]).replace(/<script[\s\S]*?<\/script>/gi, ''); }); }
    return Object.assign({}, D, { settings: S, products: (D.products || []).slice(0, 60) });
  }
  function rebuild() {
    buildErr = '';
    try { files = AurelyaBuild.build(pdata(), { local: false, rel: false }).files; } catch (e) { buildErr = e.message || String(e); }
    fillPages(); show(pageKey);
  }
  function title(k) { var m = /<title>([^<]*)<\/title>/.exec(files[k] || ''); return m ? m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') : k; }
  function fillPages() {
    var sel = $q('#dspg'); if (!sel || !files) return;
    var pre = plang === 'tr' ? '' : plang + '/', keys = Object.keys(files).filter(function (k) { return /index\.html$/.test(k) && k !== '404.html' && (pre ? k.indexOf(pre) === 0 : !/^(en|de|fr|ar)\//.test(k)); });
    var home = keys.filter(function (k) { return k === pre + 'index.html'; }), all = keys.filter(function (k) { return k === pre + 'urunler/index.html'; });
    var cats = keys.filter(function (k) { return k.indexOf(pre + 'kategori/') === 0; }).slice(0, 10), prods = keys.filter(function (k) { return k.indexOf(pre + 'urun/') === 0; }).slice(0, 30);
    var rest = keys.filter(function (k) { return [].concat(home, all, cats, prods).indexOf(k) < 0; }).slice(0, 20);
    var opt = function (arr, lb) { return arr.length ? '<optgroup label="' + lb + '">' + arr.map(function (k) { return '<option value="' + E(k) + '">' + E(title(k)) + '</option>'; }).join('') + '</optgroup>' : ''; };
    sel.innerHTML = opt(home, 'Ana sayfa') + opt(all, 'Tüm ürünler') + opt(cats, 'Kategoriler') + opt(prods, 'Ürün sayfaları') + opt(rest, 'Diğer sayfalar');
    if (!files[pageKey]) pageKey = home[0] || keys[0] || 'index.html';
    sel.value = pageKey;
  }
  var MIME = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', ico: 'image/x-icon' };
  function show(key) {
    var f = $q('#dsf'); if (!f) return;
    if (buildErr) { f.srcdoc = '<p style="font:14px sans-serif;padding:20px;color:#c0392b">Önizleme üretilemedi: ' + E(buildErr) + '</p>'; setMsg('Önizleme hatası: ' + buildErr, 'bad'); return; }
    if (!files || files[key] == null) key = 'index.html';
    pageKey = key;
    var h = files[key], css = files['style.css'] || '', app = files['app.js'] || '', cj = files['custom.js'] || '';
    var js = function (s) { return String(s).replace(/<\/script/gi, '<\\/script'); };
    h = h.replace('<link rel="stylesheet" href="/style.css">', function () { return '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>'; })
      .replace('<script src="/custom.js" defer></script>', function () { return cj ? '<script>' + js(cj) + '<\/script>' : ''; })
      .replace('<script src="/app.js"></script>', function () { return '<script>' + js(app) + '<\/script>'; })
      .replace(/window\.AUR_GA="[^"]*"/, 'window.AUR_GA=""')
      .replace(/(src|href)="\/assets\/img\/([^"]+)"/g, function (m, a, n) { var o = files['assets/img/' + n]; if (!o || !o.b64) return m; return a + '="data:' + (MIME[n.split('.').pop()] || 'application/octet-stream') + ';base64,' + o.b64 + '"'; })
      .replace('</head>', function () { return '<style>.rv{opacity:1!important;transform:none!important}html{scroll-behavior:auto!important}#ck{display:none!important}</style></head>'; });
    f.onload = function () {
      var d; try { d = f.contentDocument; } catch (e) { return; } if (!d) return;
      d.addEventListener('submit', function (e) {
        var fm = e.target; if (!fm || !fm.classList) return; e.preventDefault();
        if (fm.classList.contains('sx')) { var qv = (fm.querySelector('input') || {}).value || ''; pendQ = qv; nav('/urunler/'); }
      });
      if (pendQ) { var qi = d.querySelector('.tq input'); if (qi) { qi.value = pendQ; qi.dispatchEvent(new Event('input', { bubbles: true })); } pendQ = ''; }
      d.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a'); if (!a) return;
        var hr = a.getAttribute('href') || '';
        if (/^(https?:|\/\/)/i.test(hr) || /^(mailto:|tel:|javascript:)/i.test(hr)) { if (/^(https?:|\/\/)/i.test(hr)) a.target = '_blank'; return; }
        if (hr.charAt(0) === '#') return;
        e.preventDefault(); nav(hr);
      });
      try { d.documentElement.scrollTop = lastScroll; } catch (e) { }
    };
    try { if (f.contentDocument && f.contentDocument.documentElement) lastScroll = f.contentDocument.documentElement.scrollTop; } catch (e) { }
    f.srcdoc = h;
    var sel = $q('#dspg'); if (sel) sel.value = key;
  }
  function nav(hr) {
    var path = hr.split('#')[0].split('?')[0].replace(/^\/+/, ''), c = path === '' ? ['index.html'] : /\/$/.test(path) ? [path + 'index.html'] : [path, path + '/index.html'];
    var k = c.filter(function (x) { return files[x] != null; })[0];
    if (!k) { setMsg('Bu sayfa önizlemede yok (önizleme ilk 60 ürünle sınırlıdır).', 'warn'); return; }
    lastScroll = 0; show(k);
  }
  function sizeBox() {
    var b = $q('#dsbox'); if (!b) return;
    b.style.width = dev === 'm' ? '390px' : dev === 't' ? '820px' : '100%';
    var f = $q('#dsf'); if (f) f.style.height = Math.max(420, window.innerHeight - 250) + 'px';
  }
  function setMsg(t, cls) { var m = $q('#dsmsg'); if (m) { m.className = 'mut ' + (cls || ''); m.textContent = t; } }
  function status() {
    var s = $q('#dsst'), b = $q('#dsact'); if (!s) return;
    var d = dirty(); s.className = d ? 'warn' : 'ok';
    s.textContent = d ? '● Taslak yayındakinden farklı — beğendiyseniz “Aktif et”e basın' : '✓ Taslak, yayındaki siteyle aynı';
  }
  function changed(slow) {
    status(); clearTimeout(bt); bt = setTimeout(rebuild, slow ? 500 : 220);
    clearTimeout(st); st = setTimeout(function () { saveNow().then(function () { var sv = $q('#sv'); if (sv && /Kaydedildi/.test(sv.textContent)) sv.textContent = 'Taslak kaydedildi ✓ (siteye yansımadı — Aktif et)'; }); }, 700);
  }

  /* ---------- aktif et ---------- */
  async function activate() {
    if (!remoteOk) { setMsg('Kaydedilemedi: Supabase oturumu yok. Sayfayı yenileyip yeniden giriş yapın.', 'bad'); return; }
    var btn = $q('#dsact'); if (btn) btn.disabled = true;
    clearTimeout(st); clearTimeout(bt);
    D.settings.theme = clone(draft.theme); D.settings.custom = clone(draft.custom); D.settings.cardWa = clone(draft.cardWa);
    setMsg('Siteye yansıtılıyor…');
    await saveNow(); status();
    var sv = $q('#sv'); if (sv && /Kaydedilemedi/.test(sv.textContent)) { setMsg(sv.textContent, 'bad'); if (btn) btn.disabled = false; return; }
    var h = AurelyaBuild.designHash(D.settings.theme, D.settings.cardWa, D.settings.custom), ok = false;
    for (var i = 0; i < 12 && !ok; i++) {
      await new Promise(function (r) { setTimeout(r, i ? 2000 : 1200); });
      try { var r = await fetch('/style.css?_=' + Date.now(), { cache: 'no-store' }); ok = r.ok && (await r.text()).indexOf('design:' + h + ' ') > -1; } catch (e) { break; }
    }
    setMsg(ok ? '✓ Yayında! Değişiklikler canlı sitede görünüyor (görmüyorsanız Ctrl+F5).' : 'Kaydedildi ✓ — site birkaç saniye içinde güncellenir (Ctrl+F5). Hâlâ değişmezse sitenin Supabase verisini okuyabildiğini kontrol edin: supabase-kurulum.sql 6. adım.', ok ? 'ok' : 'warn');
    if (sv) sv.textContent = 'Aktif edildi ✓';
    if (btn) btn.disabled = false;
  }

  /* ---------- Merchant XML adres testi ---------- */
  async function ftest(btn) {
    var out = btn.closest('.r') && btn.closest('.r').nextElementSibling; if (!out || !out.classList.contains('ftr')) return;
    out.className = 'mut ftr'; out.textContent = 'Test ediliyor…';
    try {
      var path = new URL(btn.dataset.ftest, location.href).pathname;
      var r = await fetch(path + '?_t=' + Date.now(), { cache: 'no-store', headers: { Accept: 'text/html,application/xhtml+xml' } });
      var t = await r.text(), n = (t.match(/<item>/g) || []).length, ct = r.headers.get('content-type') || '?', src = r.headers.get('x-data-source') || '?';
      var msg = 'HTTP ' + r.status + ' · ' + ct + ' · ürün: ' + n + ' · veri kaynağı: ' + src;
      if (r.status === 404) { out.className = 'bad ftr'; out.textContent = msg + ' — Akış pasif ya da henüz yayına girmedi. “XML akışı”nı Aktif yapın.'; }
      else if (!r.ok) { out.className = 'bad ftr'; out.textContent = msg; }
      else if (/octet-stream|attachment/i.test(ct)) { out.className = 'warn ftr'; out.textContent = msg + ' — Tarayıcı bunu indirebilir; sunucu ayarı (api/serve.js) güncel değil, siteyi yeniden dağıtın (deploy).'; }
      else if (src === 'fallback') { out.className = 'warn ftr'; out.textContent = msg + ' — Site canlı veriyi okuyamıyor (yedek veri). supabase-kurulum.sql 6. adımı çalıştırın.'; }
      else { out.className = 'ok ftr'; out.textContent = '✓ ' + msg + ' — adres tarayıcıda açılıyor.'; }
    } catch (e) { out.className = 'bad ftr'; out.textContent = 'Test edilemedi: ' + (e.message || e) + ' (panel, sitenin kendi adresinde açık olmalı).'; }
  }

  /* ---------- olaylar ---------- */
  function onField(e) {
    var t = e.target, p = t.dataset && t.dataset.dp; if (!p || !draft) return;
    put(p, t.value);
    if (t.type === 'color') { var sp = t.parentNode.querySelector('span'); if (sp) sp.textContent = t.value; }
    changed(!!t.dataset.dpslow);
  }
  document.addEventListener('input', onField);
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'dspg') { lastScroll = 0; show(t.value); return; }
    if (t.id === 'dslg') { plang = t.value; pageKey = 'index.html'; lastScroll = 0; rebuild(); return; }
    if (t.id === 'dsjs') { rebuild(); return; }
    if (t.dataset && t.dataset.dp && t.tagName === 'SELECT') onField(e);
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button'); if (!b) return; var d = b.dataset;
    if (d.dclr) { put(d.dclr, ''); var inp = document.querySelector('[data-dp="' + d.dclr + '"]'); if (inp) { var key = d.dclr.split('.').pop(); inp.value = (key === 'accent' && D.settings.accent) || DEF[key] || '#000000'; var sp = b.parentNode.querySelector('span'); if (sp) sp.textContent = 'varsayılan'; } changed(); }
    else if (d.dact) activate();
    else if (d.dreset) { if (confirm('Taslaktaki tüm değişiklikler atılıp yayındaki site ayarlarına dönülsün mü?')) { D.draft = liveOf(); ensure(); saveNow(); render(); } }
    else if (d.ddev) { dev = d.ddev; document.querySelectorAll('[data-ddev]').forEach(function (x) { x.className = x.dataset.ddev === dev ? 'pri' : ''; }); sizeBox(); }
    else if (d.ftest) ftest(b);
  });
  window.addEventListener('resize', function () { sizeBox(); });

  window.Design = {
    html: html,
    after: function (sub) {
      document.body.classList.toggle('dswide', sub === 'design' || sub === 'custom');
      if (sub !== 'design' && sub !== 'custom') { clearTimeout(bt); files = null; return; }
      ensure(); status(); sizeBox(); lastScroll = 0; rebuild();
    }
  };
})();
