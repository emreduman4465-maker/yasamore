/* Yasamore — siteyi Supabase'deki veriden anında üretip sunar (GitHub/token gerekmez).
   Panelde kaydedilen her değişiklik ~20-30 sn içinde sitede görünür. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const Gen = require('../dist/yonetim/generator.js');

const SB_URL = (process.env.SUPABASE_URL || 'https://xnktorruwvnzndubeaeo.supabase.co').replace(/\/+$/, '');
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const TTL = 20 * 1000;
let cache = { t: 0, files: null };

function fallbackData() {
  const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/yonetim/site-data.js'), 'utf8'), ctx);
  return ctx.SITE_DATA;
}
async function loadData() {
  if (!SB_KEY) return fallbackData();
  const r = await fetch(SB_URL + '/rest/v1/aurelya_site?id=eq.main&select=data', { headers: SB_KEY.startsWith('sb_') ? { apikey: SB_KEY } : { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
  if (!r.ok) throw new Error('Supabase HTTP ' + r.status);
  const j = await r.json();
  return (j[0] && j[0].data && j[0].data.products) ? j[0].data : fallbackData();
}
async function getFiles() {
  if (cache.files && Date.now() - cache.t < TTL) return cache.files;
  try { const d = await loadData(); cache = { t: Date.now(), files: Gen.build(d, { local: false }).files }; }
  catch (e) { console.error(e); if (!cache.files) cache = { t: Date.now(), files: Gen.build(fallbackData(), { local: false }).files }; }
  return cache.files;
}
const TYPES = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'application/javascript; charset=utf-8', xml: 'application/xml; charset=utf-8', txt: 'text/plain; charset=utf-8', json: 'application/json; charset=utf-8', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', ico: 'image/x-icon' };

module.exports = async (req, res) => {
  const files = await getFiles();
  let p = decodeURIComponent(String(req.query.path || '')).replace(/^\/+/, '');
  const cands = p === '' ? ['index.html'] : p.endsWith('/') ? [p + 'index.html'] : [p, p + '/index.html'];
  let key = cands.find(k => files[k] != null), status = 200;
  if (!key) { key = files['404.html'] != null ? '404.html' : null; status = 404; }
  if (!key) { res.status(404).send('Not found'); return; }
  const v = files[key], ext = key.split('.').pop().toLowerCase();
  res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', status === 200 ? 'public, s-maxage=20, stale-while-revalidate=120' : 'public, s-maxage=20');
  res.status(status).send(typeof v === 'string' ? v : Buffer.from(v.b64, 'base64'));
};
