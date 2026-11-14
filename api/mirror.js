/* Yasamore — dış görsel adresini indirip kendi Supabase deposuna (aurelya-assets) kopyalar.
   Yalnızca giriş yapmış YÖNETİCİ kullanabilir (kullanıcının kendi oturum anahtarıyla yüklenir, service key gerekmez). */
const dns = require('dns').promises, net = require('net');
const SB_URL = (process.env.SUPABASE_URL || 'https://xnktorruwvnzndubeaeo.supabase.co').replace(/\/+$/, '');
const ANON = process.env.SUPABASE_ANON_KEY || 'sb_publishable_iNttOqqACr2imk6k0PXetg_155nooIZ';
const MAX = 8 * 1024 * 1024, EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

function privateIp(ip) {
  if (net.isIPv4(ip)) { const [a, b] = ip.split('.').map(Number); return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224; }
  const x = ip.toLowerCase(); if (x.startsWith('::ffff:')) return privateIp(x.slice(7));
  return x === '::1' || x === '::' || x.startsWith('fc') || x.startsWith('fd') || x.startsWith('fe8') || x.startsWith('fe9') || x.startsWith('fea') || x.startsWith('feb');
}
async function safeUrl(u) {
  const p = new URL(u); if (!/^https?:$/.test(p.protocol)) throw new Error('Yalnızca http/https');
  const h = p.hostname.replace(/^\[|\]$/g, '');
  const ips = net.isIP(h) ? [{ address: h }] : await dns.lookup(h, { all: true });
  if (!ips.length || ips.some(i => privateIp(i.address))) throw new Error('Adrese izin verilmiyor');
  return p.toString();
}
async function download(u) {
  for (let i = 0; i < 4; i++) {
    u = await safeUrl(u);
    const r = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YasamoreImageImport/1.0)', Accept: 'image/*' } });
    if (r.status >= 300 && r.status < 400 && r.headers.get('location')) { u = new URL(r.headers.get('location'), u).toString(); continue; }
    if (!r.ok) throw new Error('Kaynak HTTP ' + r.status);
    const type = (r.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!EXT[type]) throw new Error('Görsel değil (' + (type || 'bilinmiyor') + ')');
    if (+r.headers.get('content-length') > MAX) throw new Error('Dosya çok büyük');
    const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > MAX) throw new Error('Dosya çok büyük');
    return { buf, type };
  }
  throw new Error('Çok fazla yönlendirme');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST gerekli' }); return; }
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) { res.status(401).json({ error: 'Oturum yok' }); return; }
    const H = { apikey: ANON, Authorization: 'Bearer ' + token };
    const a = await fetch(SB_URL + '/rest/v1/rpc/aurelya_is_admin', { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: '{}' });
    if (!a.ok || (await a.json()) !== true) { res.status(403).json({ error: 'Yönetici değil' }); return; }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { buf, type } = await download(String(body.url || ''));
    const nm = 'urunler/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + EXT[type];
    const up = await fetch(SB_URL + '/storage/v1/object/aurelya-assets/' + nm, { method: 'POST', headers: { ...H, 'Content-Type': type, 'cache-control': 'max-age=31536000' }, body: buf });
    if (!up.ok) { res.status(502).json({ error: 'Depoya yüklenemedi: ' + (await up.text()).slice(0, 200) }); return; }
    res.status(200).json({ url: SB_URL + '/storage/v1/object/public/aurelya-assets/' + nm });
  } catch (e) { res.status(400).json({ error: String(e.message || e) }); }
};
