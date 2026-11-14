/* Yönetim paneli — Supabase girişi, ürün/kategori/ayar yönetimi, Excel içe aktarma,
   otomatik çeviri ve GitHub'a yayınlama. Veri tek satırda (aurelya_site.id='main') saklanır. */
var CFG = window.AURELYA_CONFIG || {}, sb = null, LG = AurelyaBuild.LANGS;
var $ = function (s) { return document.querySelector(s); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var D = null, view = 'urun', sub = 'brand', ei = -1, cpi = -1, el = 'tr', sheet = null, q = '', cf = '', remoteOk = false, me = '', sel = new Set(), vis = [], csel = new Set();
D = JSON.parse(JSON.stringify(window.SITE_DATA || { settings: { name: 'Mağazam', langs: ['tr'], seo: {} }, products: [], catNames: {} }));
function norm() { D.settings = D.settings || {}; D.settings.custom = D.settings.custom || {}; D.settings.cpages = D.settings.cpages || []; D.settings.seo = D.settings.seo || {}; D.products = D.products || []; D.catNames = D.catNames || {}; D.catDesc = D.catDesc || {}; D.catSeo = D.catSeo || {}; D.catImg = D.catImg || {}; }
norm();
var langs = function () { var l = (D.settings.langs || ['tr']).filter(function (x) { return LG[x]; }); if (l.indexOf('tr') < 0) l.unshift('tr'); return l; };
var NAV = [['urun', 'Ürünler'], ['kat', 'Kategoriler'], ['xl', 'Excel ile ürün ekle'], ['set', 'Site Ayarları'], ['pub', 'Yayınla'], ['acc', 'Hesap']];
var SUB = [['brand', 'Logo ve Marka'], ['contact', 'İletişim'], ['legal', 'Yasal Bilgiler'], ['home', 'Ana sayfa'], ['banner', 'Bannerlar ve Görseller'], ['about', 'Hakkımızda'], ['custom', 'Özel Kod'], ['cpages', 'Özel Sayfalar'], ['langs', 'Diller ve Çeviri'], ['merchant', 'Google Merchant'], ['seo', 'SEO']];

/* ---------- kaydetme ---------- */
var tm;
function persist() { clearTimeout(tm); $('#sv').textContent = 'Kaydediliyor…'; tm = setTimeout(function () { saveNow().then(schedAuto); }, 300); }
/* Yayın: site doğrudan Supabase'deki veriden üretilir; kaydetmek = yayınlamak (GitHub/token yok). */
var autoTm, pubBusy = false, pubAgain = false;
function schedAuto() { if (!remoteOk) return; $('#sv').textContent = 'Kaydedildi ✓ — site birkaç saniye içinde güncellenir'; }
async function ghPublish(manual) {
  await saveNow(); var br = AurelyaBuild.build(D, { local: false });
  var m = 'Kaydedildi ✓ — ' + br.report.pages + ' sayfa. Site ~30 sn içinde güncellenir (Ctrl+F5).';
  log(m); $('#sv').textContent = m;
}
function saveNow() {
  clearTimeout(tm); if (!sb || !remoteOk) return Promise.resolve();
  return sb.from('aurelya_site').upsert({ id: 'main', data: D, updated_at: new Date().toISOString() })
    .then(function (r) { $('#sv').textContent = r.error ? 'Kaydedilemedi: ' + r.error.message : 'Kaydedildi ✓'; })
    .catch(function (e) { $('#sv').textContent = 'Kaydedilemedi: ' + e.message; });
}
window.addEventListener('beforeunload', function (e) { if ($('#sv').textContent === 'Kaydediliyor…') { saveNow(); e.preventDefault(); e.returnValue = ''; } });

/* ---------- yardımcılar ---------- */
function path(p, v, set) { var a = p.split('.'), o = D; for (var i = 0; i < a.length - 1; i++) { if (o[a[i]] == null) o[a[i]] = {}; o = o[a[i]]; } if (set) o[a[a.length - 1]] = v; return o[a[a.length - 1]]; }
var get = function (p) { return path(p); }, val = function (p) { var v = get(p); return v == null ? '' : v; };
function inp(p, l, o) {
  o = o || {}; var v = esc(val(p));
  return '<div><label>' + l + (o.cnt ? '<span class="cnt" data-cnt="' + p + '">' + String(val(p)).length + '</span>' : '') + '</label>' +
    (o.area ? '<textarea data-p="' + esc(p) + '">' + v + '</textarea>' : '<input type="' + (o.t || 'text') + '" data-p="' + esc(p) + '"' + (o.n ? ' data-n="1"' : '') + ' value="' + v + '"' + (o.ph ? ' placeholder="' + o.ph + '"' : '') + (o.list ? ' list="' + o.list + '"' : '') + '>') + '</div>';
}
function selx(p, label, opts) { var v = String(val(p)); return '<div><label>' + label + '</label><select data-p="' + esc(p) + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (v === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>'; }
function cparts(c) { return String(c || '').split('>').map(function (x) { return x.trim(); }).filter(Boolean); }
function ck(c) { return String(c).replace(/\./g, ''); }
function topCats() { var s = {}; D.products.forEach(function (p) { var t = cparts(p.cat)[0]; if (t) s[t] = (s[t] || 0) + 1; }); return s; }
function allCats() { var s = topCats(); (D.extraCats || []).forEach(function (c) { var t = cparts(c)[0]; if (t && !(t in s)) s[t] = 0; }); return s; }
function subCats() { var s = {}; D.products.forEach(function (p) { var a = cparts(p.cat); if (a.length > 1) { var k = a[0] + ' > ' + a[1]; s[k] = (s[k] || 0) + 1; } }); (D.extraCats || []).forEach(function (c) { var a = cparts(c); if (a.length > 1) { var k = a[0] + ' > ' + a[1]; if (!(k in s)) s[k] = 0; } }); return s; }
function catKeys() { var t = allCats(), sc = subCats(), out = []; Object.keys(t).sort().forEach(function (c) { out.push(c); Object.keys(sc).filter(function (k) { return k.indexOf(c + ' > ') === 0; }).sort().forEach(function (k) { out.push(k); }); }); return out; }
function catCount(k) { var t = allCats(), sc = subCats(); return k in t ? t[k] : (sc[k] || 0); }
function catProds(names) { return D.products.filter(function (p) { var a = cparts(p.cat), f = a.slice(0, 2).join(' > '); return names.some(function (n) { return a[0] === n || f === n; }); }); }
function renameCat(old, nn) {
  var oa = cparts(old), isSub = oa.length > 1;
  var fix = function (c) { var a = cparts(c); if (!a.length || a[0] !== oa[0]) return c; if (isSub) { if (a[1] !== oa[1]) return c; a[1] = nn; } else a[0] = nn; return a.join(' > '); };
  D.products.forEach(function (p) { if (p.cat) p.cat = fix(p.cat); });
  D.extraCats = (D.extraCats || []).map(fix);
  ['catNames', 'catDesc', 'catSeo', 'catImg'].forEach(function (k) { Object.keys(D[k] || {}).forEach(function (key) { var nk = fix(key); if (nk !== key) { D[k][nk] = D[k][key]; delete D[k][key]; } }); });
  if (!isSub && D.settings.featuredCat === old) D.settings.featuredCat = nn;
}
function img(file, max, png, cb) {
  if (file.type === 'image/svg+xml') { var r = new FileReader(); r.onload = function () { cb(r.result); }; r.readAsDataURL(file); return; }
  var im = new Image(); im.onload = function () { var s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL(png ? 'image/png' : 'image/jpeg', .86)); }; im.src = URL.createObjectURL(file);
}
/* Dış (tedarikçi) görsel adreslerini kendi deponuza kopyalar. Önce sunucu (/api/mirror), olmazsa tarayıcı denenir. */
var OWN = '/storage/v1/object/public/aurelya-assets/';
async function mirrorOne(u) {
  if (!/^https?:\/\//i.test(u) || u.indexOf(OWN) >= 0) return u;
  try {
    var s = await sb.auth.getSession(), tk = s.data.session && s.data.session.access_token;
    var r = await fetch('/api/mirror', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk }, body: JSON.stringify({ url: u }) });
    if (r.ok) { var j = await r.json(); if (j.url) return j.url; }
  } catch (e) {}
  try {
    var b = await (await fetch(u)).blob(); if (!/^image\//.test(b.type)) return null;
    var ex = b.type === 'image/png' ? 'png' : b.type === 'image/svg+xml' ? 'svg' : b.type === 'image/webp' ? 'webp' : 'jpg', nm = 'urunler/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ex;
    var up = await sb.storage.from('aurelya-assets').upload(nm, b, { contentType: b.type, cacheControl: '31536000' });
    return up.error ? null : sb.storage.from('aurelya-assets').getPublicUrl(nm).data.publicUrl;
  } catch (e) { return null; }
}
async function mirrorProducts(list) {
  var jobs = [], ok = 0, fail = 0, done = 0;
  list.forEach(function (p) { (p.images || []).forEach(function (u, i) { if (/^https?:\/\//i.test(u) && u.indexOf(OWN) < 0) jobs.push({ p: p, i: i, u: u }); }); });
  if (!jobs.length) return;
  log('Görseller kendi depoya kopyalanıyor (' + jobs.length + ')…');
  var next = 0;
  await Promise.all([0, 1, 2, 3].map(async function () {
    while (next < jobs.length) {
      var j = jobs[next++], n = await mirrorOne(j.u);
      if (n) { j.p.images[j.i] = n; ok++; } else { fail++; log('Kopyalanamadı (eski adres duruyor): ' + j.u); }
      if (++done % 10 === 0) { $('#sv').textContent = 'Görseller: ' + done + '/' + jobs.length; }
    }
  }));
  log(ok + ' görsel kendi depoya kopyalandı' + (fail ? ', ' + fail + ' görsel kopyalanamadı' : '') + '.');
}
function upImg(file, cb, max) {
  img(file, max || 1400, false, function (u) {
    if (!sb || !remoteOk) { cb(null); return; }
    fetch(u).then(function (r) { return r.blob(); }).then(function (b) {
      var ex = b.type === 'image/png' ? 'png' : b.type === 'image/svg+xml' ? 'svg' : 'jpg', nm = 'urunler/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ex;
      return sb.storage.from('aurelya-assets').upload(nm, b, { contentType: b.type, cacheControl: '31536000' }).then(function (r) {
        if (r.error) { alert('Görsel yüklenemedi: ' + r.error.message); cb(null); return; }
        cb(sb.storage.from('aurelya-assets').getPublicUrl(nm).data.publicUrl);
      });
    }).catch(function (e) { alert('Görsel yüklenemedi: ' + e.message); cb(null); });
  });
}
function dl(name, blob) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); }
function log(m) { var l = $('#lg'); if (!l) return; l.hidden = false; l.textContent += m + '\n'; l.scrollTop = 1e9; }
var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

/* ---------- görünümler ---------- */
function render() {
  $('#nav').innerHTML = NAV.map(function (t) { return '<button class="' + (t[0] === view ? 'on' : '') + '" data-go="' + t[0] + '">' + t[1] + '</button>'; }).join('');
  $('#ttl').textContent = (NAV.filter(function (t) { return t[0] === view; })[0] || [])[1] || '';
  var S = D.settings; $('#sname').textContent = S.name || 'Yönetim'; document.title = (S.name || 'Yönetim') + ' — Yönetim Paneli';
  [['#slogo', S.logo], ['#llogo', S.logo]].forEach(function (x) { var e = $(x[0]); if (S.logo) { e.src = S.logo; e.hidden = false; } else e.hidden = true; });
  var h = '';
  if (view === 'urun') h = ei >= 0 && D.products[ei] ? editor() : productList();
  else if (view === 'kat') h = categories();
  else if (view === 'xl') h = excelView();
  else if (view === 'set') h = settings();
  else if (view === 'pub') h = publishView();
  else h = account();
  $('#v').innerHTML = h;
  if (view === 'urun' && ei < 0) fillList();
  if (view === 'pub') audit();
  $('#side').classList.remove('open');
}

function productList() {
  var cats = catKeys();
  return '<div class="c"><div class="row"><button class="pri" data-new="1">+ Yeni ürün</button><input type="search" id="pq" placeholder="Ürün adı veya koduyla ara…" value="' + esc(q) + '"><select id="pc"><option value="">Tüm kategoriler</option>' +
    cats.map(function (c) { var sb = c.indexOf(' > ') > -1; return '<option value="' + esc(c) + '"' + (c === cf ? ' selected' : '') + '>' + (sb ? '\u00a0\u00a0\u21b3 ' + esc(c.split(' > ')[1]) : esc(c)) + '</option>'; }).join('') + '</select><span class="mut" id="pn"></span></div><div class="row" style="margin-top:10px"><label class="chk"><input type="checkbox" id="sa"> Tümünü seç</label><button class="dg sm" data-run="bulkdel" id="bd" hidden></button></div><div id="pl"></div></div>';
}
function fillList() {
  var t = q.trim().toLocaleLowerCase('tr'), n = 0, h = ''; vis = [];
  D.products.forEach(function (p, i) {
    if (cf) { var pa = cparts(p.cat); if (pa[0] !== cf && pa.slice(0, 2).join(' > ') !== cf) return; }
    if (t && (String((p.name || {}).tr || '') + ' ' + (p.code || '')).toLocaleLowerCase('tr').indexOf(t) < 0) return;
    vis.push(p); n++; if (n > 200) return;
    h += '<div class="r"><input type="checkbox" data-sel="' + i + '"' + (sel.has(p) ? ' checked' : '') + ' style="width:auto"><img class="pv" src="' + esc((p.images || [])[0] || '') + '" alt=""><span><b>' + esc(p.code || '-') + '</b> ' + esc((p.name || {}).tr) + '<br><small class="mut">' + esc(p.cat || '') + ' · ' + (p.sale > 0 ? p.sale + ' (' + p.price + ')' : (p.price || 0)) + '</small></span><span style="flex:0 0 130px">' +
      langs().map(function (l) { return '<span class="badge' + ((p.name || {})[l] ? ' on' : '') + '">' + l.toUpperCase() + '</span>'; }).join('') + '</span><button class="sm" data-edit="' + i + '">Düzenle</button></div>';
  });
  $('#pl').innerHTML = h || '<p class="mut">Ürün bulunamadı.</p>'; $('#pn').textContent = n + ' / ' + D.products.length + ' ürün' + (n > 200 ? ' (ilk 200 gösteriliyor)' : '');
  selUi();
}
function selUi() {
  var b = $('#bd'), a = $('#sa'); if (!b) return;
  sel.forEach(function (p) { if (D.products.indexOf(p) < 0) sel.delete(p); });
  b.hidden = !sel.size; b.textContent = 'Seçilenleri sil (' + sel.size + ')';
  a.checked = vis.length > 0 && vis.every(function (p) { return sel.has(p); });
}
/* Ürünleri siler; yalnızca bunlara ait yüklenmiş görselleri depodan da kaldırır (yer açılır). */
async function removeProducts(list) {
  var gone = new Set(list), keepUrls = {}, del = [], mark = '/storage/v1/object/public/aurelya-assets/';
  D.products.forEach(function (p) { if (!gone.has(p)) (p.images || []).forEach(function (u) { keepUrls[u] = 1; }); });
  list.forEach(function (p) { (p.images || []).forEach(function (u) { var k = String(u).indexOf(mark); if (k >= 0 && !keepUrls[u]) del.push(decodeURIComponent(String(u).slice(k + mark.length))); }); });
  D.products = D.products.filter(function (p) { return !gone.has(p); }); list.forEach(function (p) { sel.delete(p); });
  await saveNow(); schedAuto(); var msg = list.length + ' ürün silindi';
  if (del.length && sb && remoteOk) { var r = await sb.storage.from('aurelya-assets').remove(del); msg += r.error ? ' (görseller silinemedi: ' + r.error.message + ')' : ', ' + del.length + ' görsel depodan kaldırıldı'; }
  if (!autoOn()) $('#sv').textContent = msg + '. Siteden kalkması için “Yayınla”ya basın.';
}
function editor() {
  var p = D.products[ei], b = 'products.' + ei, L = langs();
  return '<datalist id="cl">' + catKeys().map(function (c) { return '<option value="' + esc(c) + '">'; }).join('') + '</datalist><p><button data-close="1">← Ürün listesine dön</button></p><div class="c"><h3>Ürün: ' + esc((p.name || {}).tr || 'yeni') + '</h3><div class="g">' + inp(b + '.code', 'Ürün kodu (SKU)') + inp(b + '.slug', 'URL adı (boşsa addan üretilir; yayından sonra değiştirmeyin)') + inp(b + '.cat', 'Kategori (Ana > Alt) — listeden seçin ya da yeni yazın', { list: 'cl' }) + inp(b + '.price', 'Fiyat', { t: 'number', n: 1 }) + inp(b + '.sale', 'İndirimli fiyat', { t: 'number', n: 1 }) + '</div>' +
    '<label>Görseller (her satıra bir adres) — ya da dosya yükleyin</label><textarea data-p="' + b + '.imgtext" data-imgs="1">' + esc((p.images || []).filter(function (u) { return !/^data:/.test(u); }).join('\n')) + '</textarea><input type="file" data-addimg="' + ei + '" accept="image/*" multiple><div style="margin-top:6px">' + (p.images || []).map(function (u) { return '<img class="pv" src="' + esc(u) + '" alt=""> '; }).join('') + '</div>' +
    '<div class="tabs" style="margin-top:14px">' + L.map(function (l) { return '<button class="' + (l === el ? 'on' : '') + '" data-el="' + l + '">' + LG[l].n + '</button>'; }).join('') + '</div>' +
    inp(b + '.name.' + el, 'Ürün adı (' + LG[el].n + ')') + inp(b + '.desc.' + el, 'Açıklama — her madde "- " ile başlasın, ";" ile ayrılsın', { area: 1 }) + inp(b + '.seo.title.' + el, 'SEO başlığı (boşsa şablondan üretilir, 50–60 karakter)', { cnt: 1 }) + inp(b + '.seo.desc.' + el, 'SEO açıklaması (boşsa ürün açıklamasından üretilir, 120–158 karakter)', { area: 1, cnt: 1 }) +
    '<div class="serp"><b>' + esc(val(b + '.seo.title.' + el) || (String(D.settings.seo.titleTemplate || '{title} | {store}').replace('{title}', val(b + '.name.' + el)).replace('{store}', D.settings.name || ''))) + '</b><i>' + esc((D.settings.siteUrl || '') + '/urun/' + (p.slug || '…')) + '</i><div class="mut">' + esc(String(val(b + '.seo.desc.' + el) || val(b + '.desc.' + el)).replace(/\*\*|;?\s*-\s/g, ' ').slice(0, 158)) + '</div></div>' +
    '<h3 style="margin-top:18px">Google Merchant ve ek SEO</h3><p class="mut">Boş bırakılanlar için Site Ayarları → Google Merchant’taki varsayılanlar kullanılır. Bu bilgiler hem Merchant XML’ine hem sayfadaki Google yapılandırılmış verisine (fiyat, stok, marka, GTIN) yazılır.</p><div class="g">' +
    inp(b + '.brand', 'Marka') + inp(b + '.gtin', 'GTIN / barkod (EAN, UPC)') + inp(b + '.mpn', 'MPN (üretici parça no)') +
    selx(b + '.condition', 'Durum', [['', 'Varsayılan (yeni)'], ['new', 'Yeni'], ['refurbished', 'Yenilenmiş'], ['used', 'İkinci el']]) +
    selx(b + '.availability', 'Stok durumu', [['', 'Stokta'], ['in_stock', 'Stokta'], ['out_of_stock', 'Stokta yok'], ['preorder', 'Ön sipariş'], ['backorder', 'Tedarik bekleniyor']]) +
    inp(b + '.gcat', 'Google ürün kategorisi (örn. Home & Garden > Decor > Vases)') + inp(b + '.color', 'Renk') + inp(b + '.material', 'Malzeme') + inp(b + '.size', 'Beden / ölçü') +
    inp(b + '.group', 'Varyant grup kodu (item_group_id)') + inp(b + '.label0', 'Özel etiket 0') + inp(b + '.label1', 'Özel etiket 1') +
    selx(b + '.nofeed', 'Merchant XML’ine', [['', 'Dahil et'], ['1', 'Dahil etme']]) + '</div>' +
    inp(b + '.seo.mtitle.' + el, 'Merchant başlığı (' + LG[el].n + ') — boşsa ürün adı; en çok 150 karakter', { cnt: 1 }) +
    inp(b + '.seo.alt.' + el, 'Ana görsel alt metni (' + LG[el].n + ') — boşsa ürün adı') +
    '<p><button class="pri" data-run="one">Bu ürünü diğer dillere çevir</button> <button class="dg" data-del="' + ei + '">Ürünü sil</button></p><div class="log" id="lg" hidden></div></div>';
}
function categories() {
  var names = catKeys(), L = langs().filter(function (l) { return l !== 'tr'; });
  csel.forEach(function (c) { if (names.indexOf(c) < 0) csel.delete(c); });
  return '<div class="c"><h3>Kategoriler</h3><p class="mut">Ürünlerin kategorisi buradan yönetilir. Alt kategori için ana kategori kartındaki “+ Alt kategori” düğmesini kullanın ya da ürün düzenlerken “Kategori” kutusuna <b>Ana &gt; Alt</b> biçiminde yazın (örn. Sunumluklar &gt; Lokumluklar). Alt kategorilerin de çevirisi gerekir; “Eksik kategori çevirilerini otomatik tamamla” bunları da çevirir. Ürünü olmayan kategori sitede görünmez. Çevirisi olmayan kategori o dilde yayınlanmaz.</p>' +
    '<div class="row"><button class="pri" data-newcat="1">+ Yeni kategori</button><button data-run="cattpl">Excel şablonu indir</button><button data-run="catxe">Kategorileri Excel’e aktar</button></div>' +
    '<label>Excel’den kategori ekle/güncelle (sütunlar: A Kategori, B İngilizce, C Almanca, D Fransızca, E Arapça, F Türkçe açıklama)</label><input type="file" id="cxf" accept=".xlsx,.xls,.csv">' +
    '<label class="chk"><input type="checkbox" id="catatr" checked>Eksik dilleri otomatik çevir</label>' +
    '<div class="row" style="margin-top:6px"><button class="pri" data-run="catmiss">Eksik kategori çevirilerini otomatik tamamla</button></div><div class="log" id="lg" hidden></div></div>' +
    (names.length ? '<div class="c"><div class="row"><label class="chk" style="margin:0"><input type="checkbox" id="csa"' + (names.every(function (c) { return csel.has(c); }) ? ' checked' : '') + '> Tümünü seç</label><button class="dg sm" data-run="catbulkdel" id="cbd"' + (csel.size ? '' : ' hidden') + '>Seçilenleri sil (' + csel.size + ')</button></div></div>' +
    names.map(function (c) {
      var isSub = c.indexOf(' > ') > -1, lab = isSub ? c.split(' > ')[1] : c;
      return '<div class="c"' + (isSub ? ' style="margin-left:28px;border-left:3px solid #b08d57"' : '') + '><div class="row"><input type="checkbox" data-csel="' + esc(c) + '"' + (csel.has(c) ? ' checked' : '') + ' style="width:auto"><h3 style="margin:0;flex:1">' + (isSub ? '\u21b3 ' : '') + esc(lab) + ' <small class="mut">(' + catCount(c) + ' ürün)</small></h3>' + (isSub ? '' : '<button class="sm" data-newsub="' + esc(c) + '">+ Alt kategori</button>') + '<button class="sm" data-rencat="' + esc(c) + '">Yeniden adlandır</button><button class="sm dg" data-delcat="' + esc(c) + '">Sil</button></div><div class="g">' +
        L.map(function (l) { return inp('catNames.' + ck(c) + '.' + l, LG[l].n + ' adı'); }).join('') + '</div>' + inp('catDesc.' + ck(c) + '.tr', 'Türkçe kategori açıklaması (SEO)', { area: 1 }) + inp('catImg.' + ck(c), 'Ana sayfa koleksiyon kutusu görseli (adres) — boşsa kategorinin ilk ürününün görseli') + '<div><label>veya görsel yükleyin</label><input type="file" data-bimg="catImg.' + ck(c) + '" accept="image/*"></div>' + '<details style="margin-top:8px"><summary>Kategori sayfası SEO (başlık / açıklama, her dil)</summary>' + langs().map(function (l) { return inp('catSeo.' + ck(c) + '.title.' + l, LG[l].n + ' — SEO başlığı (50–60 karakter)', { cnt: 1 }) + inp('catSeo.' + ck(c) + '.desc.' + l, LG[l].n + ' — SEO açıklaması (120–158 karakter)', { area: 1, cnt: 1 }); }).join('') + '</details></div>';
    }).join('') : '<div class="c mut">Henüz kategori yok. “+ Yeni kategori” ile ekleyin ya da Excel yükleyin.</div>');
}
function csUi() { var b = $('#cbd'), a = $('#csa'); if (!b) return; b.hidden = !csel.size; b.textContent = 'Seçilenleri sil (' + csel.size + ')'; var ks = catKeys(); a.checked = ks.length > 0 && ks.every(function (c) { return csel.has(c); }); }
/* Kategori siler. Ürünleriyle birlikte ya da ürünler kategorisiz kalacak şekilde. */
async function deleteCats(names, withProducts) {
  var prods = catProds(names), n = prods.length, hit = function (k) { return names.some(function (x) { return k === x || k === ck(x) || k.indexOf(x + ' > ') === 0 || k.indexOf(ck(x) + ' > ') === 0; }); };
  ['catNames', 'catDesc'].forEach(function (m) { Object.keys(D[m] || {}).forEach(function (k) { if (hit(k)) delete D[m][k]; }); });
  names.forEach(function (c) { csel.delete(c); });
  D.extraCats = (D.extraCats || []).filter(function (c) { var f = cparts(c).slice(0, 2).join(' > '); return !names.some(function (x) { return cparts(c)[0] === x || f === x; }); });
  if (withProducts && n) await removeProducts(prods); else { prods.forEach(function (p) { var a = cparts(p.cat); p.cat = names.indexOf(a[0]) > -1 ? '' : a[0]; }); await saveNow(); schedAuto(); if (!autoOn()) $('#sv').textContent = names.length + ' kategori silindi. Siteden kalkması için “Yayınla”ya basın.'; }
}
async function importCats(rows) {
  var LK = ['en', 'de', 'fr', 'ar'], add = 0, up = 0, tc = {}; catKeys().forEach(function (k) { tc[k] = 1; });
  rows.forEach(function (r) {
    var c = cparts(r[0]).slice(0, 2).join(' > '); if (!c) return;
    if (c in tc) up++; else { (D.extraCats = D.extraCats || []).push(c); tc[c] = 1; add++; }
    var key = ck(c); D.catNames[key] = D.catNames[key] || {}; LK.forEach(function (l, i) { var v = String(r[i + 1] == null ? '' : r[i + 1]).trim(); if (v) D.catNames[key][l] = v; });
    var d = String(r[5] == null ? '' : r[5]).trim(); if (d) { D.catDesc[key] = D.catDesc[key] || {}; D.catDesc[key].tr = d; }
  });
  persist(); log(add + ' kategori eklendi, ' + up + ' güncellendi.');
  if ($('#catatr') && $('#catatr').checked) { var L = langs().filter(function (l) { return l !== 'tr'; }); if (L.length) { log('Eksik diller çevriliyor…'); await transCats(L); } }
  render();
}
function excelView() {
  var F = [['code', 'Ürün kodu', 'A'], ['cat', 'Kategori', 'B'], ['name', 'Ürün adı', 'C'], ['price', 'Fiyat', 'D'], ['sale', 'İndirimli fiyat', 'E'], ['desc', 'Açıklama', 'F'], ['imgs', 'Resim sütunları', 'I-P']];
  return '<div class="c"><h3>Excel’den toplu ürün ekle</h3><p class="mut">Dosyadaki metinler Türkçe kabul edilir. Aynı ürün koduna sahip ürünler güncellenir, yenileri eklenir. Hazır şablonu indirip doldurabilirsiniz.</p>' +
    '<p><button data-run="tpl">Boş Excel şablonunu indir</button> <button data-run="xe">Mevcut ürünleri Excel’e aktar</button></p><input type="file" id="xf" accept=".xlsx,.xls,.csv"><div id="xi" class="mut" style="margin:6px 0"></div>' +
    '<div class="g">' + F.map(function (f) { return '<div><label>' + f[1] + ' (sütun harfi)</label><input type="text" data-f="' + f[0] + '" value="' + f[2] + '"></div>'; }).join('') + '</div>' +
    '<label class="chk"><input type="checkbox" id="hd" checked>İlk satır başlık</label><br><label class="chk"><input type="checkbox" id="mir" checked><b>Görselleri kendi depoma kopyala</b> (karşı firma linkleri sitede kalmaz)</label><br><label class="chk"><input type="checkbox" id="atr" checked><b>Dilleri otomatik güncelle</b> (içe aktarırken seçili dillere çevir)</label><br>' +
    Object.keys(LG).filter(function (k) { return k !== 'tr'; }).map(function (k) { return '<label class="chk"><input type="checkbox" class="tl" value="' + k + '"' + (langs().indexOf(k) >= 0 ? ' checked' : '') + '>' + LG[k].n + '</label>'; }).join('') +
    '<p><button class="pri" data-run="imp">İçe aktar</button></p><div class="log" id="lg" hidden></div></div>';
}
function settings() {
  var S = D.settings, h = '<div class="tabs">' + SUB.map(function (t) { return '<button class="' + (t[0] === sub ? 'on' : '') + '" data-sub="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
  if (sub === 'brand') h += '<div class="c"><h3>Logo</h3><p class="mut">Logo hem sitede hem tarayıcı sekmesinde (favicon) kullanılır. PNG, JPG veya SVG yükleyin.</p><div class="r"><img class="pv logo" src="' + esc(S.logo || '') + '" alt=""><input type="file" data-up="settings.logo" data-max="512" data-png="1" accept="image/*"><button class="dg sm" data-clr="settings.logo">Kaldır</button></div></div>' +
    '<div class="c"><h3>Marka</h3><div class="g">' + inp('settings.name', 'Mağaza adı') + inp('settings.siteUrl', 'Alan adı (https://…)', { ph: 'https://www.alanadiniz.com' }) + inp('settings.accent', 'Vurgu rengi', { t: 'color' }) + inp('settings.logoSize', 'Sitedeki logo yüksekliği (px, 24–160)', { t: 'number', n: 1, ph: '64' }) + inp('settings.logoSizeM', 'Mobilde logo yüksekliği (px, 24–120)', { t: 'number', n: 1, ph: '54' }) + '<div><label>Logonun yanında mağaza adı</label><select data-p="settings.logoOnly"><option value=""' + (val('settings.logoOnly') !== '1' ? ' selected' : '') + '>Göster</option><option value="1"' + (val('settings.logoOnly') === '1' ? ' selected' : '') + '>Gizle (yalnızca logo)</option></select></div>' + inp('settings.currency', 'Para birimi (TRY, USD…)') + '</div></div>';
  else if (sub === 'contact') h += '<div class="c"><h3>İletişim</h3><div class="g">' + inp('settings.whatsapp', 'WhatsApp (905xxxxxxxxx)') + inp('settings.email', 'E-posta') + inp('settings.instagram', 'Instagram adresi') + '</div></div>' +
    '<div class="c"><h3>Üst duyuru çubuğu</h3><div class="g">' + langs().map(function (l) { return inp('settings.announce.' + l, LG[l].n); }).join('') + '</div></div>';
  else if (sub === 'legal') h += '<div class="c"><h3>Yasal bilgiler (KVKK, mesafeli satış, iade sayfaları için)</h3><p class="mut">Bu bilgiler sitedeki KVKK Aydınlatma Metni, Gizlilik, Çerez, Mesafeli Satış Sözleşmesi, İade ve Değişim ve Kullanım Koşulları sayfalarına ve altbilgiye otomatik yazılır. Gerçek ticari bilgilerinizi girin; boş bırakılan zorunlu alanlar sayfada sarı “[… giriniz]” olarak görünür. E-posta ve telefon “İletişim” sekmesinden alınır.</p><div class="g">' + inp('settings.legal.company', 'Ticari unvan (şahıs ise ad-soyad)') + inp('settings.legal.taxOffice', 'Vergi dairesi') + inp('settings.legal.taxNo', 'Vergi no / T.C. kimlik no') + inp('settings.legal.mersis', 'MERSİS no (varsa)') + inp('settings.legal.phone', 'Telefon (boşsa WhatsApp numarası)') + inp('settings.legal.kep', 'KEP adresi (varsa)') + '</div>' + inp('settings.legal.address', 'Açık adres', { area: 1 }) + '</div>';
  else if (sub === 'home') h += '<div class="c"><h3>Ana sayfa (Hero)</h3><p class="mut">Başlıkta *yıldız* arasına aldığınız kelime altın renkli italik görünür.</p>' + inp('settings.featuredCat', 'Ana sayfada öne çıkan kategori (tam adı)') +
    langs().map(function (l) { return '<h4>' + LG[l].n + '</h4><div class="g">' + inp('settings.heroTitle.' + l, 'Başlık') + inp('settings.heroSub.' + l, 'Alt metin') + inp('settings.eyebrow.' + l, 'Başlık üstü küçük yazı') + '</div>'; }).join('') + '</div>';
  else if (sub === 'banner') {
    var BN = (S.banners = S.banners || {}), RO = [['', 'Varsayılan'], ['portrait', 'Dikey 3:4'], ['square', 'Kare 1:1'], ['landscape', 'Yatay 4:3'], ['tall', 'Uzun 2:3']];
    var slots = [['hero1', 'Hero — büyük görsel'], ['hero2', 'Hero — küçük görsel'], ['ed1', 'Öne çıkan koleksiyon — görsel 1'], ['ed2', 'Öne çıkan koleksiyon — görsel 2'], ['story', 'Hikâyemiz görseli']];
    var pvOf = function (b) { b = b || {}; return b.img || (((D.products.filter(function (p) { return p.code && p.code === String(b.code || '').trim(); })[0] || {}).images) || [])[0] || ''; };
    h += '<datalist id="pcodes">' + D.products.filter(function (p) { return p.code; }).map(function (p) { return '<option value="' + esc(p.code) + '">' + esc((p.name || {}).tr || '') + '</option>'; }).join('') + '</datalist>' +
      '<div class="c"><h3>Ana sayfa görselleri</h3><p class="mut">Her alan için öncelik sırası: <b>yüklediğiniz görsel</b> → <b>seçtiğiniz ürünün görseli</b> → otomatik (en yeni ürünler). Ürün seçmek için ürün kodunu yazın; liste açılır.</p>' +
      slots.map(function (x) { var pv = pvOf(BN[x[0]]); return '<div style="border-top:1px solid var(--line);padding:10px 0"><div class="row"><img class="pv" src="' + esc(pv) + '" alt=""' + (pv ? '' : ' hidden') + '><b style="flex:1">' + x[1] + '</b><button class="sm" data-clr="settings.banners.' + x[0] + '.img">Yüklenen görseli kaldır</button></div><div class="g">' + inp('settings.banners.' + x[0] + '.code', 'Ürün kodu (bu ürünün görseli kullanılsın)', { list: 'pcodes' }) + '<div><label>Kendi görselinizi yükleyin</label><input type="file" data-bimg="settings.banners.' + x[0] + '.img" accept="image/*"></div></div></div>'; }).join('') +
      '<p class="mut">Koleksiyon kutularının görselini <b>Kategoriler</b> sekmesinde her kategoride değiştirebilirsiniz.</p></div>' +
      '<div class="c"><h3>Tam genişlik banner (kampanya)</h3><p class="mut">Ana sayfada hero bölümünün altında görünür; görsel yüklemezseniz gösterilmez. Önerilen boyut 1920×600.</p><div class="row"><img class="pv" src="' + esc((BN.wide || {}).img || '') + '" alt=""' + ((BN.wide || {}).img ? '' : ' hidden') + '><input type="file" data-bimg="settings.banners.wide.img" data-max="1920" accept="image/*"><button class="sm" data-clr="settings.banners.wide.img">Kaldır</button></div>' +
      '<div class="g">' + inp('settings.banners.wide.h', 'Yükseklik — bilgisayar (px)', { t: 'number', n: 1, ph: '320' }) + inp('settings.banners.wide.hm', 'Yükseklik — mobil (px)', { t: 'number', n: 1, ph: '180' }) + '</div>' +
      langs().map(function (l) { return '<h4>' + LG[l].n + '</h4><div class="g">' + inp('settings.banners.wide.alt.' + l, 'Görsel alt metni (SEO)') + inp('settings.banners.wide.link.' + l, 'Tıklanınca gidilecek adres (örn. /kategori/sunumluklar/)') + '</div>'; }).join('') + '</div>' +
      '<div class="c"><h3>Görsel boyut ve şekilleri</h3><div class="g">' +
      selx('settings.banners.shape', 'Köşe şekli', [['', 'Kemer (varsayılan)'], ['round', 'Yuvarlatılmış köşe'], ['square', 'Köşesiz']]) +
      selx('settings.banners.fit', 'Görsel yerleşimi', [['', 'Alanı doldur (kırpar)'], ['contain', 'Tamamını göster (kırpmaz)']]) +
      selx('settings.banners.heroRatio', 'Hero görsel oranı', RO) + selx('settings.banners.edRatio', 'Öne çıkan koleksiyon görsel oranı', RO) + selx('settings.banners.storyRatio', 'Hikâye görsel oranı', RO) +
      inp('settings.banners.tileH', 'Koleksiyon kutuları yüksekliği — bilgisayar (px, 120–500)', { t: 'number', n: 1, ph: '230' }) + '</div></div>';
  }
  else if (sub === 'about') h += '<div class="c"><h3>Hakkımızda / Hikâyemiz</h3><p class="mut">Boş bırakırsanız hazır metin kullanılır.</p>' + langs().map(function (l) { return inp('settings.about.' + l, LG[l].n, { area: 1 }); }).join('') + '</div>';
  else if (sub === 'custom') h += customView();
  else if (sub === 'cpages') h += cpagesView();
  else if (sub === 'langs') h += '<div class="c"><h3>Site dilleri</h3><p class="mut">Seçtiğiniz her dil için ayrı SEO sayfaları üretilir.</p>' + Object.keys(LG).map(function (k) { return '<label class="chk"><input type="checkbox" data-lang="' + k + '"' + (langs().indexOf(k) >= 0 ? ' checked' : '') + (k === 'tr' ? ' disabled' : '') + '>' + LG[k].n + '</label>'; }).join('') +
    '<p><button class="pri" data-run="miss">Eksik çevirileri otomatik tamamla</button></p><div class="log" id="lg" hidden></div></div>' +
    '<div class="c"><h3>Çeviri yöntemi</h3><p class="mut">Anahtar girerseniz Claude ile yüksek kaliteli çeviri yapılır (önerilir). Anahtar girmezseniz ücretsiz MyMemory servisi kullanılır (günlük sınırı vardır, kalitesi daha düşüktür). Anahtar yalnızca bu tarayıcıda saklanır.</p><label>Anthropic API anahtarı (isteğe bağlı)</label><input type="password" id="ak" value="' + esc(localStorage.getItem('aurelya-key') || '') + '" placeholder="sk-ant-…"></div>';
  else if (sub === 'merchant') {
    var root = (S.siteUrl || 'https://alanadiniz.com').replace(/\/+$/, '');
    h += '<div class="c"><h3>Google Merchant Center ürün akışı (XML)</h3><p class="mut">Site her değişiklikte bu akışı otomatik günceller. Merchant Center → Ürünler → Akışlar → Yeni akış → “Zamanlanmış getirme” ile aşağıdaki adresi bir kez ekleyin; Google akışı kendisi düzenli çeker.</p>' +
      langs().map(function (l) { var u = root + (l === 'tr' ? '' : '/' + l) + '/google-merchant.xml'; return '<div class="r"><span><b>' + LG[l].n + '</b> — <a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(u) + '</a></span><button class="sm" data-run="feed:' + l + '">XML indir</button></div>'; }).join('') +
      '<p class="mut" style="margin-top:8px">Akışa yalnızca fiyatı ve görseli olan ürünler girer. GTIN/MPN’si olmayan ürünlere otomatik identifier_exists=no yazılır.</p></div>' +
      '<div class="c"><h3>Varsayılanlar</h3><div class="g">' + inp('settings.merchant.brand', 'Varsayılan marka (boşsa mağaza adı)') + inp('settings.merchant.gcat', 'Varsayılan Google ürün kategorisi', { ph: 'Home & Garden > Decor' }) +
      selx('settings.merchant.condition', 'Varsayılan durum', [['', 'Yeni'], ['new', 'Yeni'], ['refurbished', 'Yenilenmiş'], ['used', 'İkinci el']]) + '</div></div>' +
      '<div class="c"><h3>Kargo (isteğe bağlı)</h3><p class="mut">Kargo ücretini Merchant Center’da ayarladıysanız boş bırakın. Ücretsiz kargo için 0 yazın.</p><div class="g">' + inp('settings.merchant.shipCountry', 'Ülke kodu', { ph: 'TR' }) + inp('settings.merchant.shipService', 'Hizmet adı', { ph: 'Standart' }) + inp('settings.merchant.shipPrice', 'Kargo ücreti', { ph: '49.90' }) + '</div></div>';
  }
  else h += '<div class="c"><h3>Genel SEO</h3>' + inp('settings.seo.titleTemplate', 'Başlık şablonu ({title} ve {store} kullanılır)') + inp('settings.seo.keywords', 'Anahtar kelimeler (virgülle)') + '<div class="g">' + inp('settings.seo.gaId', 'Google Analytics ID (G-XXXX)') + inp('settings.seo.gscToken', 'Search Console doğrulama kodu') + '</div>' + inp('settings.seo.sameAs', 'Sosyal medya linkleri (boşlukla ayır)', { area: 1 }) +
    '<label>Paylaşım görseli (1200×630 JPG/PNG önerilir)</label><div class="r"><img class="pv" src="' + esc(S.seo.ogImage || '') + '" alt=""><input type="file" data-up="settings.seo.ogImage" data-max="1200" accept="image/*"></div></div>' +
    '<div class="c"><h3>Ana sayfa SEO</h3>' + langs().map(function (l) { return inp('settings.seo.homeTitle.' + l, LG[l].n + ' — ana sayfa başlığı (50–60 karakter)', { cnt: 1 }) + inp('settings.seo.siteDesc.' + l, LG[l].n + ' — ana sayfa açıklaması (120–158 karakter)', { area: 1, cnt: 1 }); }).join('') + '</div>';
  return h;
}

/* ---------- özel kod ve özel sayfalar ---------- */
function code(p, label, ph, rows) {
  return '<div><label>' + label + '</label><textarea class="code" spellcheck="false" autocapitalize="off" autocomplete="off" rows="' + (rows || 10) + '" data-p="' + esc(p) + '" placeholder="' + esc(ph || '') + '">' + esc(val(p)) + '</textarea></div>';
}
function customView() {
  return '<div class="c"><h3>Özel kod (tüm sayfalara uygulanır)</h3>' +
    '<p class="mut">Buraya yazdıklarınız sitedeki <b>tüm sayfalara</b> eklenir (ürün, kategori, ana sayfa, yasal sayfalar, özel sayfalar). Kaydedince site birkaç saniye içinde güncellenir. Bir alanı boşaltırsanız kod siteden kalkar. Kodlar olduğu gibi yayınlanır; yanlış kod siteyi bozabilir, önce küçük bir değişiklikle deneyin. Gizli anahtar/şifre yazmayın: site kodu herkese açıktır.</p>' +
    code('settings.custom.css', 'Özel CSS (temanın üstüne eklenir, aynı seçiciyi ezer)', '.btn{border-radius:0}\n.hdr{background:#111}', 12) +
    code('settings.custom.head', 'Head HTML (&lt;/head&gt; öncesi): meta etiketi, Meta/TikTok Pixel, Tag Manager, doğrulama kodu, ek font…', '<meta name="facebook-domain-verification" content="…">\n<script>/* pixel kodu */</script>', 8) +
    code('settings.custom.body', 'Sayfa sonu HTML (&lt;/body&gt; öncesi): canlı destek, sohbet balonu, açılır pencere…', '<div id="destek">…</div>', 8) +
    code('settings.custom.js', 'Özel JavaScript (&lt;script&gt; etiketi yazmayın; /custom.js olarak yüklenir)', "document.addEventListener('DOMContentLoaded', function () {\n  // kodunuz\n});", 12) +
    '<p class="mut">Not: “Boş sayfa” düzenindeki özel sayfalara bu genel kod eklenmez (sayfanın HTML’i olduğu gibi yayınlanır).</p></div>';
}
function cpageList() { return D.settings.cpages || (D.settings.cpages = []); }
function cpagesView() {
  var A = cpageList(), RES = AurelyaBuild.reserved.concat(Object.keys(LG));
  if (cpi < 0 || !A[cpi]) {
    cpi = -1;
    return '<div class="c"><h3>Özel sayfalar</h3><p class="mut">Kendi HTML, CSS ve JavaScript’inizle istediğiniz kadar sayfa ekleyin (kampanya, landing page, SSS, iletişim formu, üçüncü parti araç sayfaları…). Her sayfa içeriği girdiğiniz dillerde ayrı adreste yayınlanır ve sitemap’e eklenir.</p>' +
      '<p><button class="pri" data-cpnew="1">+ Yeni sayfa</button></p>' +
      (A.length ? A.map(function (c, i) {
        var bd = (c.draft === '1' ? '<span class="bd">taslak</span>' : '') + (c.menu === '1' ? '<span class="bd">menü</span>' : '') + (c.footer === '1' ? '<span class="bd">altbilgi</span>' : '') + (c.noindex === '1' ? '<span class="bd">noindex</span>' : '') + (c.layout === 'raw' ? '<span class="bd">boş sayfa</span>' : '');
        return '<div class="r"><span><b>' + esc((c.title || {}).tr || c.slug || '(adsız)') + '</b> <span class="mut">/' + esc(c.slug) + '/</span>' + bd + '</span><button class="sm" data-cpedit="' + i + '">Düzenle</button>' + (c.draft === '1' || !c.slug ? '' : '<a href="../' + esc(c.slug) + '/" target="_blank" rel="noopener"><button class="sm">Aç</button></a>') + '<button class="sm dg" data-cpdel="' + i + '">Sil</button></div>';
      }).join('') : '<p class="mut">Henüz özel sayfa yok.</p>') + '</div>';
  }
  var c = A[cpi], b = 'settings.cpages.' + cpi, cl = langs(); if (cl.indexOf(el) < 0) el = 'tr';
  var warn = '';
  if (!c.slug) warn = 'Adres boş: sayfa yayınlanmaz.';
  else if (RES.indexOf(c.slug) > -1) warn = 'Bu adres sistem tarafından kullanılıyor, sayfa yayınlanmaz. Başka bir adres yazın.';
  else if (A.some(function (x, i) { return i !== cpi && x.slug === c.slug; })) warn = 'Bu adresi başka bir sayfa kullanıyor, sayfa yayınlanmaz.';
  var u = (el === 'tr' ? '' : '/' + el) + '/' + (c.slug || '…') + '/';
  return '<div class="c"><div class="row"><button data-cpback="1">← Sayfa listesi</button><b style="flex:1">' + esc((c.title || {}).tr || c.slug || 'Yeni sayfa') + '</b>' + (c.draft === '1' || !c.slug ? '' : '<a href="..' + esc(u) + '" target="_blank" rel="noopener"><button class="sm">Sayfayı aç</button></a>') + '<button class="sm dg" data-cpdel="' + cpi + '">Sil</button></div></div>' +
    '<div class="c"><h3>Sayfa ayarları</h3><div class="g">' +
    '<div><label>Adres (URL)</label><input type="text" data-cpslug="' + cpi + '" value="' + esc(c.slug || '') + '" placeholder="kampanya"></div>' +
    selx(b + '.layout', 'Sayfa düzeni', [['text', 'Metin sayfası (başlık + dar sütun)'], ['site', 'Serbest HTML (üst menü ve altbilgi var)'], ['wide', 'Tam genişlik (üst menü ve altbilgi var, kenar boşluğu yok)'], ['raw', 'Boş sayfa (menü/altbilgi yok, tüm sayfa sizin HTML’iniz)']]) +
    selx(b + '.draft', 'Durum', [['', 'Yayında'], ['1', 'Taslak (siteye eklenmez)']]) +
    selx(b + '.menu', 'Üst menüde bağlantı', [['', 'Hayır'], ['1', 'Evet']]) +
    selx(b + '.footer', 'Altbilgide bağlantı', [['', 'Hayır'], ['1', 'Evet']]) +
    selx(b + '.noindex', 'Arama motorları', [['', 'İndekslensin'], ['1', 'İndekslenmesin (noindex, sitemap’e girmez)']]) +
    selx(b + '.hideTitle', 'Metin sayfasında otomatik başlık (H1)', [['', 'Göster'], ['1', 'Gizle (H1’i kendi HTML’imde yazıyorum)']]) +
    '</div>' + (warn ? '<p class="bad" style="margin:8px 0 0">' + warn + '</p>' : '') +
    '<p class="mut" style="margin:8px 0 0">Adres: <b>' + esc(u) + '</b>. “Boş sayfa” düzeninde tam bir HTML belgesi (&lt;html&gt;…) yazarsanız olduğu gibi yayınlanır; yazmazsanız yalnızca gövde içeriği sayılır ve başlık/açıklama/canonical sizin için eklenir.</p></div>' +
    '<div class="c"><h3>İçerik</h3><div class="tabs">' + cl.map(function (l) { return '<button class="' + (l === el ? 'on' : '') + '" data-el="' + l + '">' + LG[l].n + (((c.html || {})[l] || '').trim() ? ' ✓' : '') + '</button>'; }).join('') + '</div>' +
    '<div class="g">' + inp(b + '.title.' + el, 'Sayfa başlığı') + '</div>' +
    inp(b + '.desc.' + el, 'Meta açıklama (SEO, 120–158 karakter; boşsa içerikten alınır)', { area: 1, cnt: 1 }) +
    code(b + '.html.' + el, 'HTML içerik (' + LG[el].n + ')', '<h2>Başlık</h2>\n<p>Metin…</p>', 18) +
    '<p class="mut">Bu dilin içeriği boşsa sayfa bu dilde yayınlanmaz. Dil sekmelerindeki ✓ içerik girilmiş dilleri gösterir.</p></div>' +
    '<div class="c"><h3>Bu sayfaya özel kod (tüm diller)</h3>' +
    code(b + '.css', 'Sayfa CSS', '.hero{background:#000}', 8) +
    code(b + '.head', 'Head HTML', '<script src="…"></script>', 5) +
    code(b + '.js', 'Sayfa JavaScript (&lt;script&gt; etiketi yazmayın; sayfa sonunda çalışır)', "document.querySelector('#x').onclick = function () {};", 8) + '</div>';
}
function publishView() {
  return '<div class="c"><h3>SEO denetimi</h3><div id="audit"></div></div><div class="c"><h3>Siteyi yayınla</h3><p class="mut">Artık GitHub anahtarı gerekmez. Yaptığınız her değişiklik Supabase’e kaydedilir ve site birkaç saniye içinde otomatik güncellenir.</p><p><button class="pri" data-run="gh">Kaydet ve kontrol et</button></p><div class="log" id="lg" hidden></div></div>' +
    '<div class="c"><h3>Yedek</h3><p><button data-run="data">Veriyi indir (site-data.js)</button> <button data-run="zip">Siteyi ZIP olarak indir</button></p><label>Yedekten yükle (site-data.js)</label><input type="file" id="bk" accept=".js,.json"></div>';
}
function account() {
  return '<div class="c"><h3>Hesap</h3><p>Giriş yapan: <b>' + esc(me) + '</b></p><label>Yeni şifre (en az 8 karakter)</label><input type="password" id="p1" autocomplete="new-password"><label>Yeni şifre (tekrar)</label><input type="password" id="p2" autocomplete="new-password"><p><button class="pri" data-run="pw">Şifreyi değiştir</button></p><div class="log" id="lg" hidden></div></div>';
}

/* ---------- olaylar ---------- */
document.addEventListener('input', function (e) {
  var t = e.target, p = t.dataset.p;
  if (t.id === 'pq') { q = t.value; fillList(); return; }
  if (!p) return;
  if (t.dataset.imgs) { var qq = D.products[ei], keep = (qq.images || []).filter(function (u) { return /^data:/.test(u); }); qq.images = t.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean).concat(keep); persist(); return; }
  path(p, t.dataset.n ? parseFloat(t.value) || 0 : t.value, 1);
  var c = document.querySelector('[data-cnt="' + p + '"]'); if (c) c.textContent = t.value.length; persist();
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset.cpslug != null) { var cps = cpageList()[+t.dataset.cpslug]; if (cps) { cps.slug = AurelyaBuild.slugify(t.value); persist(); render(); } return; }
  if (t.id === 'pc') { cf = t.value; fillList(); return; }
  if (t.id === 'csa') { catKeys().forEach(function (c) { t.checked ? csel.add(c) : csel.delete(c); }); document.querySelectorAll('[data-csel]').forEach(function (x) { x.checked = t.checked; }); csUi(); return; }
  if (t.dataset.csel != null) { t.checked ? csel.add(t.dataset.csel) : csel.delete(t.dataset.csel); csUi(); return; }
  if (t.id === 'cxf' && t.files[0]) { var cr = new FileReader(); cr.onload = function () { try { var wb = XLSX.read(cr.result, { type: 'array' }), rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' }); if (rows.length && /kategori/i.test(String(rows[0][0]))) rows = rows.slice(1); importCats(rows); } catch (x) { log('Dosya okunamadı.'); } }; cr.readAsArrayBuffer(t.files[0]); return; }
  if (t.id === 'sa') { vis.forEach(function (p) { t.checked ? sel.add(p) : sel.delete(p); }); document.querySelectorAll('[data-sel]').forEach(function (c) { c.checked = t.checked; }); selUi(); return; }
  if (t.dataset.sel != null) { var sp = D.products[+t.dataset.sel]; t.checked ? sel.add(sp) : sel.delete(sp); selUi(); return; }
  if (t.dataset.lang) { var s = new Set(langs()); t.checked ? s.add(t.dataset.lang) : s.delete(t.dataset.lang); D.settings.langs = Array.from(s); persist(); render(); }
  if (t.dataset.up && t.files[0]) img(t.files[0], +t.dataset.max, !!t.dataset.png, function (u) { path(t.dataset.up, u, 1); persist(); render(); });
  if (t.dataset.bimg && t.files[0]) { if (!remoteOk) { alert('Görsel yüklemek için Supabase girişi gerekir.'); return; } $('#sv').textContent = 'Görsel yükleniyor…'; upImg(t.files[0], function (u) { if (u) { path(t.dataset.bimg, u, 1); persist(); render(); } else $('#sv').textContent = 'Görsel yüklenemedi'; }, +t.dataset.max || 1400); return; }
  if (t.dataset.addimg) { var pr = D.products[+t.dataset.addimg], fl = Array.from(t.files), k = 0; if (!remoteOk) return; $('#sv').textContent = 'Görseller yükleniyor…'; fl.forEach(function (f) { upImg(f, function (u) { if (u) (pr.images = pr.images || []).push(u); if (++k === fl.length) { persist(); render(); } }); }); }
  if (t.id === 'xf' && t.files[0]) { var r = new FileReader(); r.onload = function () { try { var wb = XLSX.read(r.result, { type: 'array' }); sheet = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' }); $('#xi').textContent = (sheet.length - 1) + ' satır bulundu'; } catch (x) { $('#xi').textContent = 'Dosya okunamadı'; } }; r.readAsArrayBuffer(t.files[0]); }
  if (t.id === 'ak') localStorage.setItem('aurelya-key', t.value.trim());
  if (t.id === 'auto') localStorage.setItem('aurelya-auto', t.checked ? '1' : '0');
  if (t.id === 'bk' && t.files[0]) { var r2 = new FileReader(); r2.onload = function () { try { var tx = String(r2.result).trim().replace(/^window\.SITE_DATA\s*=\s*/, '').replace(/;\s*$/, ''), n = JSON.parse(tx); if (!n.settings || !n.products) throw 0; if (!confirm(n.products.length + ' ürünlü yedek yüklenecek; şimdiki veri değişecek. Devam?')) return; D = n; norm(); ei = -1; persist(); view = 'urun'; render(); } catch (x) { alert('Dosya geçerli bir site-data.js değil.'); } }; r2.readAsText(t.files[0]); }
});
document.addEventListener('click', function (e) {
  if (e.target.id === 'mb') { $('#side').classList.toggle('open'); return; }
  var t = e.target.closest('button'); if (!t) return; var d = t.dataset;
  if (d.go) { view = d.go; ei = -1; render(); }
  else if (d.sub) { sub = d.sub; render(); }
  else if (d.clr) { path(d.clr, '', 1); persist(); render(); }
  else if (d.el) { el = d.el; render(); }
  else if (d.edit) { ei = +d.edit; el = 'tr'; render(); window.scrollTo(0, 0); }
  else if (d.new) { D.products.unshift({ code: '', cat: '', price: 0, sale: 0, images: [], name: { tr: '' }, desc: { tr: '' }, seo: {} }); ei = 0; el = 'tr'; q = ''; cf = ''; persist(); render(); }
  else if (d.close) { ei = -1; render(); }
  else if (d.del) { if (confirm('Ürün ve yüklenmiş görselleri kalıcı olarak silinsin mi?')) { removeProducts([D.products[+d.del]]).then(function () { ei = -1; render(); }); } }
  else if (d.newcat) { var nc = prompt('Yeni kategori adı (alt kategori için “Ana > Alt” yazabilirsiniz):'); if (nc && cparts(nc).length) { nc = cparts(nc).slice(0, 2).join(' > '); if (catKeys().indexOf(nc) > -1) { alert('Bu kategori zaten var.'); } else { (D.extraCats = D.extraCats || []).push(nc); persist(); render(); } } }
  else if (d.newsub) { var ns = prompt('“' + d.newsub + '” için alt kategori adı:'); if (ns && ns.replace(/>/g, ' ').trim()) { var nf = d.newsub + ' > ' + ns.replace(/>/g, ' ').replace(/\s+/g, ' ').trim(); if (catKeys().indexOf(nf) > -1) { alert('Bu alt kategori zaten var.'); } else { (D.extraCats = D.extraCats || []).push(nf); persist(); render(); } } }
  else if (d.delcat) { var dn = catProds([d.delcat]).length; if (confirm('“' + d.delcat + '” kategorisi silinsin mi?' + (dn ? '\n\nTamam: kategori VE içindeki ' + dn + ' ürün kalıcı silinir.\nİptal: bir sonraki soruda yalnızca kategoriyi silme seçeneği sunulur.' : ''))) { deleteCats([d.delcat], true).then(render); } else if (dn && confirm('Yalnızca kategori silinsin, ' + dn + ' ürün kategorisiz kalsın mı?')) { deleteCats([d.delcat], false).then(render); } }
  else if (d.rencat) { var oldn = cparts(d.rencat).pop(), nn = prompt('Yeni ad:', oldn); if (nn) { nn = nn.replace(/>/g, ' ').replace(/\s+/g, ' ').trim(); if (nn && nn !== oldn) { renameCat(d.rencat, nn); persist(); render(); } } }
  else if (d.cpnew) { var cpT = prompt('Sayfa başlığı (Türkçe):'); if (cpT && cpT.trim()) { var cpA = cpageList(), cpB = AurelyaBuild.slugify(cpT) || 'sayfa', cpS = cpB, cpN = 2, cpR = AurelyaBuild.reserved.concat(Object.keys(LG)); while (cpR.indexOf(cpS) > -1 || cpA.some(function (x) { return x.slug === cpS; })) cpS = cpB + '-' + (cpN++); cpA.push({ slug: cpS, layout: 'text', title: { tr: cpT.trim() }, desc: {}, html: { tr: '<p>İçeriğinizi buraya yazın.</p>' } }); cpi = cpA.length - 1; el = 'tr'; persist(); render(); window.scrollTo(0, 0); } }
  else if (d.cpedit) { cpi = +d.cpedit; el = 'tr'; render(); window.scrollTo(0, 0); }
  else if (d.cpback) { cpi = -1; render(); }
  else if (d.cpdel) { var cpD = cpageList()[+d.cpdel]; if (cpD && confirm('“' + (((cpD.title || {}).tr) || cpD.slug || 'Adsız') + '” sayfası kalıcı olarak silinsin mi?')) { cpageList().splice(+d.cpdel, 1); cpi = -1; persist(); render(); } }
  else if (d.run) run(d.run);
});
$('#lo').onclick = async function () { await saveNow(); await sb.auth.signOut(); location.reload(); };

/* ---------- çeviri ---------- */
var hasKey = function () { return !!localStorage.getItem('aurelya-key'); };
async function ask(prompt) {
  var k = localStorage.getItem('aurelya-key');
  var x = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': k, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }) });
  var j = await x.json(); if (!x.ok) throw new Error(j.error && j.error.message || x.status); return j.content.map(function (c) { return c.text || ''; }).join('');
}
function js(t) { var a = t.indexOf('['), b = t.lastIndexOf(']'), o = t.indexOf('{'), c = t.lastIndexOf('}'); if (a >= 0 && (o < 0 || a < o)) return JSON.parse(t.slice(a, b + 1)); return JSON.parse(t.slice(o, c + 1)); }
var dec = document.createElement('textarea');
function unent(s) { dec.innerHTML = s; return dec.value; }
async function mm(text, l) { /* ücretsiz MyMemory */
  text = String(text || '').trim(); if (!text) return '';
  var parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text], chunks = [], cur = '';
  parts.forEach(function (s) { if ((cur + s).length > 450) { if (cur) chunks.push(cur); cur = s; } else cur += s; }); if (cur) chunks.push(cur);
  var out = [];
  for (var i = 0; i < chunks.length; i++) {
    var r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(chunks[i].slice(0, 480)) + '&langpair=tr|' + l), j = await r.json();
    if (!j.responseData || (j.responseStatus && +j.responseStatus !== 200)) throw new Error(j.responseDetails || 'Çeviri servisi hata verdi (günlük sınır dolmuş olabilir)');
    out.push(unent(j.responseData.translatedText)); await sleep(250);
  }
  return out.join(' ').trim();
}
async function mmDesc(desc, l) {
  var bl = String(desc || '').split(/;\s*(?=-\s)/);
  if (bl.length > 1 || /^\s*-\s/.test(desc)) { var o = []; for (var i = 0; i < bl.length; i++) o.push('- ' + await mm(bl[i].replace(/^\s*-\s*/, ''), l)); return o.join('; '); }
  return mm(desc, l);
}
async function translate(items, L) {
  if (hasKey()) {
    for (var i = 0; i < items.length; i += 5) {
      var b = items.slice(i, i + 5), data = b.map(function (p, j) { return { i: j, name: p.name.tr, desc: String(p.desc && p.desc.tr || '').slice(0, 800) }; }), names = L.map(function (l) { return l + ' (' + LG[l].n + ')'; }).join(', ');
      try {
        var r = js(await ask('Translate these home-decor e-commerce product names and descriptions from Turkish into: ' + names + '. Write natural, SEO-friendly marketing language. Keep sizes, numbers, codes, and the "- " bullet format with ";" separators. Return ONLY a JSON array: [{"i":0,"en":{"name":"","desc":""},"de":{...}}] with exactly the requested language keys.\n' + JSON.stringify(data)));
        r.forEach(function (o) { var p = b[o.i]; if (!p) return; L.forEach(function (l) { if (o[l]) { p.name[l] = o[l].name; p.desc = p.desc || {}; p.desc[l] = o[l].desc; } }); }); persist(); log('Çevrildi: ' + Math.min(i + 5, items.length) + '/' + items.length);
      } catch (e) { log('Hata: ' + e.message); return false; }
    }
    return true;
  }
  log('Claude anahtarı yok: ücretsiz çeviri servisi kullanılıyor (yavaş olabilir).');
  for (var n = 0; n < items.length; n++) {
    var p2 = items[n];
    try { for (var k = 0; k < L.length; k++) { var l2 = L[k]; if (p2.name[l2]) continue; p2.name[l2] = await mm(p2.name.tr, l2); p2.desc = p2.desc || {}; p2.desc[l2] = await mmDesc(p2.desc.tr, l2); } persist(); log('Çevrildi: ' + (n + 1) + '/' + items.length); }
    catch (e) { log('Hata: ' + e.message); return false; }
  }
  return true;
}
async function transCats(L) {
  var need = catKeys().filter(function (c) { return L.some(function (l) { return !(D.catNames[ck(c)] && D.catNames[ck(c)][l]); }); }); if (!need.length) return;
  var lab = {}; need.forEach(function (c) { lab[c] = cparts(c).pop(); });
  try {
    if (hasKey()) { var r = js(await ask('Translate these Turkish home-decor store category names into ' + L.join(', ') + '. Keys are identifiers: keep them unchanged and translate only the values. Return ONLY JSON: {"<same key>":{"' + L[0] + '":"..."}} with exactly those language keys.\n' + JSON.stringify(lab))); Object.keys(r).forEach(function (c) { if (c in lab) D.catNames[ck(c)] = Object.assign(D.catNames[ck(c)] || {}, r[c]); }); }
    else for (var i = 0; i < need.length; i++) { var c = need[i], k = ck(c); D.catNames[k] = D.catNames[k] || {}; for (var m = 0; m < L.length; m++) if (!D.catNames[k][L[m]]) D.catNames[k][L[m]] = await mm(lab[c], L[m]); }
    persist(); log('Kategoriler çevrildi.');
  } catch (e) { log('Kategori çevirisi hatası: ' + e.message); }
}

/* ---------- Excel ---------- */
var ci = function (s) { var n = 0; String(s).trim().toUpperCase().split('').forEach(function (c) { n = n * 26 + c.charCodeAt(0) - 64; }); return n - 1; };
function cols(s) { var o = []; String(s).split(',').forEach(function (x) { var a = x.split('-'); if (a[1]) for (var i = ci(a[0]); i <= ci(a[1]); i++) o.push(i); else o.push(ci(a[0])); }); return o.filter(function (n) { return n >= 0; }); }
function num(v) { var s = String(v == null ? '' : v); if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(',', '.'); var n = parseFloat(s); return isNaN(n) ? 0 : n; }
var XH = ['Ürün kodu', 'Kategori', 'Ürün adı', 'Fiyat', 'İndirimli fiyat', 'Açıklama', '', '', 'Resim 1', 'Resim 2', 'Resim 3', 'Resim 4', 'Resim 5', 'Resim 6', 'Resim 7', 'Resim 8'];
function xlsOut(rows, name, sheetName) { var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), sheetName || 'Ürünler'); XLSX.writeFile(wb, name); }

async function run(w) {
  if (w === 'catbulkdel') { var cn = Array.from(csel); if (!cn.length) return; var pc = catProds(cn).length; if (!confirm(cn.length + ' kategori silinecek (içlerinde toplam ' + pc + ' ürün var).\n\nTamam: kategoriler VE ürünleri kalıcı silinir.\nİptal: bir sonraki soruda yalnızca kategorileri silme seçeneği sunulur.')) { if (pc && confirm('Yalnızca kategoriler silinsin, ürünler kategorisiz kalsın mı?')) { await deleteCats(cn, false); render(); } else if (!pc) { await deleteCats(cn, false); render(); } return; } await deleteCats(cn, true); render(); return; }
  if (w === 'cattpl') { xlsOut([['Kategori', 'English', 'Deutsch', 'Français', 'العربية', 'Türkçe açıklama'], ['Sunumluklar', 'Serving Pieces', 'Servierstücke', 'Pièces de service', 'قطع التقديم', 'Şık sunum ürünleri'], ['Sunumluklar > Lokumluklar', 'Turkish Delight Dishes', 'Konfektschalen', 'Coupelles de confiseries', 'أطباق الحلوى', 'Alt kategori örneği']], 'kategori-sablonu.xlsx', 'Kategoriler'); return; }
  if (w === 'catxe') { var xr2 = [['Kategori', 'English', 'Deutsch', 'Français', 'العربية', 'Türkçe açıklama']]; catKeys().forEach(function (c) { var n = D.catNames[ck(c)] || {}; xr2.push([c, n.en || '', n.de || '', n.fr || '', n.ar || '', (D.catDesc[ck(c)] || {}).tr || '']); }); xlsOut(xr2, 'kategoriler.xlsx', 'Kategoriler'); return; }
  if (w === 'bulkdel') { var l = Array.from(sel); if (!l.length) return; if (!confirm(l.length + ' ürün kalıcı olarak silinecek (veritabanından ve yüklenmiş görselleriyle). Bu işlem geri alınamaz. Devam edilsin mi?')) return; await removeProducts(l); render(); return; }
  if (w === 'one') { var p = D.products[ei], L = langs().filter(function (l) { return l !== 'tr'; }); if (!(p.name || {}).tr) { alert('Önce Türkçe ürün adını yazın.'); return; } if (!L.length) { alert('Site Ayarları → Diller bölümünden dil ekleyin.'); return; } log('Çevriliyor…'); p.name = p.name || {}; await translate([p], L); await transCats(L); render(); return; }
  if (w === 'miss') { var L2 = langs().filter(function (l) { return l !== 'tr'; }), m = D.products.filter(function (p) { return p.name && p.name.tr && L2.some(function (l) { return !(p.name[l] && (p.desc && p.desc[l] || !(p.desc && p.desc.tr))); }); }); log(m.length + ' ürün çevrilecek…'); if (m.length) await translate(m, L2); await transCats(L2); log('Bitti.'); return; }
  if (w === 'catmiss') { log('Kategoriler çevriliyor…'); await transCats(langs().filter(function (l) { return l !== 'tr'; })); render(); return; }
  if (w === 'pw') { var a = $('#p1').value, b = $('#p2').value; if (a.length < 8) { log('Şifre en az 8 karakter olmalı.'); return; } if (a !== b) { log('Şifreler aynı değil.'); return; } var r0 = await sb.auth.updateUser({ password: a }); log(r0.error ? 'Hata: ' + r0.error.message : 'Şifre değiştirildi ✓'); return; }
  if (w === 'gh') { await ghPublish(true); return; }
  if (w === 'tpl') { xlsOut([XH, ['ORNEK-001', 'Dekoratif Obje > Biblo', 'Örnek ürün adı', 1250, 990, '- Ölçü: 20 cm; - Malzeme: Metal', '', '', 'https://…/gorsel1.jpg']], 'urun-sablonu.xlsx'); return; }
  if (w.indexOf('feed:') === 0) { var fl = w.slice(5), fr = AurelyaBuild.build(D, { local: false }), fk = (fl === 'tr' ? '' : fl + '/') + 'google-merchant.xml'; dl('google-merchant-' + fl + '.xml', new Blob([fr.files[fk] || ''], { type: 'application/xml' })); var fi = (fr.report.feed || {})[fl]; $('#sv').textContent = fi ? 'XML hazır: ' + fi.items + ' ürün' + (fi.skipped ? ', ' + fi.skipped + ' ürün fiyat/görsel eksik olduğu için dışarıda' : '') : 'XML hazır'; return; }
  if (w === 'xe') { var xr = [XH]; D.products.forEach(function (p) { var im = (p.images || []).filter(function (u) { return !/^data:/.test(u); }), r = [p.code || '', p.cat || '', (p.name || {}).tr || '', p.price || 0, p.sale || 0, (p.desc || {}).tr || '', '', '']; for (var i = 0; i < 8; i++) r.push(im[i] || ''); xr.push(r); }); xlsOut(xr, 'urunler.xlsx'); return; }
  if (w === 'data') { dl('site-data.js', new Blob(['window.SITE_DATA=' + JSON.stringify(D) + ';'], { type: 'text/javascript' })); return; }
  if (w === 'zip') { var r1 = AurelyaBuild.build(D, { local: false }), z = new JSZip(); Object.keys(r1.files).forEach(function (k) { var v = r1.files[k]; typeof v === 'string' ? z.file(k, v) : z.file(k, v.b64, { base64: true }); }); dl('site.zip', await z.generateAsync({ type: 'blob' })); return; }
  if (w === 'imp') {
    if (!sheet) { alert('Önce Excel dosyası seçin.'); return; }
    var f = {}; document.querySelectorAll('[data-f]').forEach(function (i) { f[i.dataset.f] = i.value; });
    var rows = sheet.slice($('#hd').checked ? 1 : 0), add = 0, up = 0, touched = [];
    rows.forEach(function (r) {
      var g = function (k) { return r[ci(f[k])]; }, name = String(g('name') == null ? '' : g('name')).trim(); if (!name) return;
      var code = String(g('code') == null ? '' : g('code')).trim(), ex = code ? D.products.filter(function (x) { return x.code === code; })[0] : null;
      var imgs = cols(f.imgs).map(function (c) { return String(r[c] || '').trim(); }).filter(Boolean), desc = String(g('desc') || '');
      if (ex) { if (ex.name.tr !== name) ex.name = { tr: name }; ex.cat = String(g('cat') || '').trim(); ex.price = num(g('price')); ex.sale = num(g('sale')); if ((ex.desc && ex.desc.tr) !== desc) ex.desc = { tr: desc }; if (imgs.length) ex.images = imgs; touched.push(ex); up++; }
      else { var nq = { code: code, cat: String(g('cat') || '').trim(), price: num(g('price')), sale: num(g('sale')), images: imgs, name: { tr: name }, desc: { tr: desc }, seo: {} }; D.products.push(nq); touched.push(nq); add++; }
    });
    log(add + ' eklendi, ' + up + ' güncellendi.');
    if ($('#mir') && $('#mir').checked && remoteOk) { await mirrorProducts(touched); }
    persist();
    if ($('#atr').checked) {
      var L3 = Array.from(document.querySelectorAll('.tl:checked')).map(function (x) { return x.value; });
      if (L3.length) { var s2 = new Set(langs()); L3.forEach(function (l) { s2.add(l); }); D.settings.langs = Array.from(s2); persist(); log('Diller güncelleniyor…'); var need = touched.filter(function (p) { return L3.some(function (l) { return !p.name[l]; }); }); if (need.length) await translate(need, L3); await transCats(L3); }
    }
    log('Bitti — Ürünler sekmesinden kontrol edin, sonra “Yayınla” sekmesinden siteyi güncelleyin.');
  }
}

function audit() {
  var S = D.settings, o = [], add = function (c, m) { o.push('<div class="' + c + '">' + (c === 'ok' ? '✓ ' : '• ') + m + '</div>'); };
  /example\.com|aurelyahome/.test(S.siteUrl || '') || !S.siteUrl ? add('bad', 'Alan adı örnek değer: Site Ayarları → Logo ve Marka bölümüne gerçek adresinizi yazın.') : add('ok', 'Alan adı ayarlı.');
  !S.logo ? add('bad', 'Logo yok.') : add('ok', 'Logo var.');
  /^905000000000$/.test(S.whatsapp || '') || !S.whatsapp ? add('bad', 'WhatsApp numarası örnek/boş.') : add('ok', 'WhatsApp numarası ayarlı.');
  (function () { var np = D.products.filter(function (p) { return !p.gtin && !p.mpn; }).length, nb = D.products.filter(function (p) { return !p.brand; }).length, ng = D.products.filter(function (p) { return !p.gcat; }).length; np && add('warn', np + ' üründe GTIN/MPN yok (Merchant akışında identifier_exists=no yazılır; barkodu varsa girin).'); !(S.merchant && S.merchant.gcat) && ng && add('warn', 'Google ürün kategorisi tanımlı değil: Site Ayarları → Google Merchant.'); nb && !(S.merchant && S.merchant.brand) && add('warn', 'Marka girilmemiş ürünlerde mağaza adı marka olarak kullanılır.'); })();
  !S.seo.ogImage ? add('warn', 'Paylaşım görseli yok.') : /^data:image\/svg/.test(S.seo.ogImage) ? add('warn', 'Paylaşım görseli SVG; sosyal ağlar için JPG/PNG yükleyin.') : add('ok', 'Paylaşım görseli var.');
  D.products.some(function (p) { return /^DEMO-/.test(p.code); }) && add('bad', 'Örnek (DEMO-) ürünler duruyor: silin veya kendi ürünlerinizle değiştirin.');
  var r = AurelyaBuild.build(D).report; r.warnings.slice(0, 30).forEach(function (w) { add('warn', esc(w)); });
  var cnt = 0; D.products.forEach(function (p) { langs().forEach(function (l) { var n = (p.name || {})[l]; if (!n) { if (cnt++ < 30) add('warn', esc(p.code || (p.name || {}).tr) + ' → ' + l.toUpperCase() + ' çevirisi yok (o dilde yayınlanmaz).'); return; } if (!(p.price > 0) && l === 'tr') add('bad', esc(p.code || n) + ' fiyatı yok.'); }); });
  add('ok', r.pages + ' sayfa üretilecek, ' + r.sitemapUrls + ' URL sitemap’e girecek.');
  $('#audit').innerHTML = o.join('');
}

/* ---------- giriş ---------- */
function showLogin(m) { $('#lgn').hidden = false; $('#app').hidden = true; $('#la').textContent = m || ''; }
async function afterLogin() {
  var a = await sb.rpc('aurelya_is_admin');
  if (a.error || !a.data) { await sb.auth.signOut(); showLogin(a.error ? 'Yetki kontrolü yapılamadı: ' + a.error.message + ' (supabase-kurulum.sql çalıştırıldı mı?)' : 'Bu hesabın yönetici yetkisi yok. supabase-kurulum.sql içindeki “yönetici ekle” satırını çalıştırın.'); return; }
  var r = await sb.from('aurelya_site').select('data').eq('id', 'main').maybeSingle();
  if (r.error) { showLogin('Veri okunamadı: ' + r.error.message); return; }
  var seed = !(r.data && r.data.data && r.data.data.settings);
  if (!seed) { D = r.data.data; norm(); }
  var u = await sb.auth.getUser(); me = (u.data && u.data.user && u.data.user.email) || ''; $('#who').textContent = me;
  remoteOk = true; $('#lgn').hidden = true; $('#app').hidden = false; render(); if (seed) saveNow();
}
async function boot() {
  if (!CFG.supabaseUrl || !CFG.supabaseKey || /PROJE_ID|BURAYA/.test(CFG.supabaseUrl + CFG.supabaseKey)) { showLogin('dist/yonetim/config.js dosyasına Supabase adresini ve anahtarını yazın.'); return; }
  if (!window.supabase) { showLogin('Supabase kütüphanesi yüklenemedi; internet bağlantısını kontrol edin.'); return; }
  sb = supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);
  var s = await sb.auth.getSession(); if (s.data.session) afterLogin(); else showLogin('');
}
$('#lf').addEventListener('submit', async function (e) {
  e.preventDefault(); $('#la').textContent = ''; if (!sb) return;
  var r = await sb.auth.signInWithPassword({ email: $('#le').value.trim(), password: $('#lp').value });
  if (r.error) { $('#la').textContent = /invalid login/i.test(r.error.message) ? 'E-posta veya şifre hatalı.' : r.error.message; return; }
  $('#lp').value = ''; afterLogin();
});
$('#llogo').hidden = true;
boot();
