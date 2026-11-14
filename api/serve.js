/* Yasamore — siteyi Supabase'deki veriden anında üretip sunar (GitHub/token gerekmez).
   Panelde kaydedilen değişiklik birkaç saniye içinde sitede görünür:
   her istekte (en çok 3 sn'de bir) yalnızca updated_at sorgulanır; değiştiyse site yeniden üretilir. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const Gen = require('../dist/yonetim/generator.js');

const SB_URL = (process.env.SUPABASE_URL || 'https://xnktorruwvnzndubeaeo.supabase.co').replace(/\/+$/, '');
/* Service key varsa o, yoksa herkese açık (publishable) anahtar — ikincisi için supabase-kurulum.sql'deki
   "herkes site okur" politikası çalıştırılmış olmalı. */
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_iNttOqqACr2imk6k0PXetg_155nooIZ';
const HDR = SB_KEY.startsWith('sb_') ? { apikey: SB_KEY } : { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY };
const CHECK_MS = 3000;
let cache = { checked: 0, ver: null, files: null, src: 'fallback' };

function fallbackData() {
  const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/yonetim/site-data.js'), 'utf8'), ctx);
  return ctx.SITE_DATA;
}
async function rest(sel) {
  const r = await fetch(SB_URL + '/rest/v1/aurelya_site?id=eq.main&select=' + sel, { headers: HDR, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('Supabase HTTP ' + r.status);
  return r.json();
}
async function getCache() {
  const now = Date.now();
  if (cache.files && now - cache.checked < CHECK_MS) return cache;
  try {
    const m = await rest('updated_at'), ver = (m[0] && m[0].updated_at) || null;
    if (!cache.files || ver !== cache.ver) {
      const j = await rest('data'), d = j[0] && j[0].data && j[0].data.products ? j[0].data : null;
      if (!d) console.error('Supabase verisi okunamadı (satır yok veya okuma izni yok) — yedek veri kullanılıyor');
      cache = { checked: now, ver, files: Gen.build(d || fallbackData(), { local: false }).files, src: d ? 'supabase' : 'fallback' };
    } else cache.checked = now;
  } catch (e) {
    console.error(e);
    if (!cache.files) cache = { checked: now, ver: null, files: Gen.build(fallbackData(), { local: false }).files, src: 'fallback' };
    else cache.checked = now;
  }
  return cache;
}
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'application/javascript; charset=utf-8', xml: 'application/xml; charset=utf-8', txt: 'text/plain; charset=utf-8', json: 'application/json; charset=utf-8', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', ico: 'image/x-icon' };

module.exports = async (req, res) => {
  const c = await getCache(), files = c.files;
  let p = decodeURIComponent(String(req.query.path || '')).replace(/^\/+/, '');
  const cands = p === '' ? ['index.html'] : p.endsWith('/') ? [p + 'index.html'] : [p, p + '/index.html'];
  let key = cands.find(k => files[k] != null), status = 200;
  if (!key) { key = files['404.html'] != null ? '404.html' : null; status = 404; }
  if (!key) { res.status(404).send('Not found'); return; }
  const v = files[key], ext = key.split('.').pop().toLowerCase();
  res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
  res.setHeader('X-Data-Source', c.src); /* supabase = canlı veri, fallback = yedek (panel değişiklikleri görünmez) */
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=5, must-revalidate');
  res.status(status).send(typeof v === 'string' ? v : Buffer.from(v.b64, 'base64'));
};
