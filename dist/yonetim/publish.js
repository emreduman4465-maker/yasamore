/* Modaedo — GitHub'a tek commit ile yayınlama (tarayıcıda ve Node'da çalışır).
   Yalnızca değişen dosyaları yükler; eski yayından kalan, artık üretilmeyen dosyaları siler.
   Sizin diğer dosyalarınıza (CNAME, yonetim/ klasörü vb.) dokunmaz. */
(function (root) {
  var enc = new TextEncoder(), dec = new TextDecoder();
  function b64bytes(b) { var s = atob(b), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function bytesB64(u) { var s = ''; for (var i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(s); }
  async function gitSha(u) {
    var h = enc.encode('blob ' + u.length + '\0'), m = new Uint8Array(h.length + u.length); m.set(h); m.set(u, h.length);
    var d = await root.crypto.subtle.digest('SHA-1', m);
    return Array.from(new Uint8Array(d)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join('');
  }
  async function publish(files, cfg, token, log, fetchImpl) {
    log = log || function () {}; var f = fetchImpl || root.fetch.bind(root);
    async function api(path, opt, tries) {
      var r = await f('https://api.github.com' + path, Object.assign({ headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' } }, opt || {}));
      var j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok) {
        if ((r.status === 403 || r.status === 429) && (tries || 0) < 3) { await new Promise(function (ok) { setTimeout(ok, 2500 * ((tries || 0) + 1)); }); return api(path, opt, (tries || 0) + 1); }
        var m = j && j.message || ('HTTP ' + r.status);
        if (r.status === 401) m = 'GitHub anahtarı geçersiz veya süresi dolmuş (' + m + ')';
        if (r.status === 404) m = 'Depo/dal bulunamadı veya anahtarın bu depoya yetkisi yok (' + path + ')';
        throw new Error(m);
      }
      return j;
    }
    var G = '/repos/' + cfg.owner + '/' + cfg.repo;
    var bp = cfg.basePath ? String(cfg.basePath).replace(/^\/+|\/+$/g, '') + '/' : '';
    var repo = await api(G), br = cfg.branch || repo.default_branch;
    var ref = await api(G + '/git/ref/heads/' + br), head = ref.object.sha;
    var cm = await api(G + '/git/commits/' + head);
    var tr = await api(G + '/git/trees/' + cm.tree.sha + '?recursive=1'), have = {};
    tr.tree.forEach(function (t) { if (t.type === 'blob') have[t.path] = t.sha; });

    var items = Object.keys(files).map(function (k) { var v = files[k]; return { path: bp + k, bytes: typeof v === 'string' ? enc.encode(v) : b64bytes(v.b64) }; });
    var paths = {}; items.forEach(function (i) { paths[i.path] = 1; });
    var mp = bp + '.aurelya-manifest.json';
    items.push({ path: mp, bytes: enc.encode(JSON.stringify(Object.keys(paths).sort())) });

    var old = [];
    if (have[mp]) { try { var b = await api(G + '/git/blobs/' + have[mp]); old = JSON.parse(dec.decode(b64bytes(b.content.replace(/\s/g, '')))); } catch (e) {} }

    var changed = [], canSha = !!(root.crypto && root.crypto.subtle);
    for (var n = 0; n < items.length; n++) { var it = items[n]; if (canSha) it.sha = await gitSha(it.bytes); if (!canSha || have[it.path] !== it.sha) changed.push(it); }
    var del = old.filter(function (p) { return !paths[p] && p !== mp && have[p]; });
    if (!changed.length && !del.length) return { changed: 0, deleted: 0 };

    log(changed.length + ' dosya yükleniyor…');
    var idx = 0, done = 0;
    async function worker() {
      while (idx < changed.length) {
        var c = changed[idx++];
        var r = await api(G + '/git/blobs', { method: 'POST', body: JSON.stringify({ content: bytesB64(c.bytes), encoding: 'base64' }) });
        c.sha = r.sha; if (++done % 25 === 0) log(done + '/' + changed.length);
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);

    var entries = changed.map(function (c) { return { path: c.path, mode: '100644', type: 'blob', sha: c.sha }; })
      .concat(del.map(function (p) { return { path: p, mode: '100644', type: 'blob', sha: null }; }));
    var nt = await api(G + '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: cm.tree.sha, tree: entries }) });
    var nc = await api(G + '/git/commits', { method: 'POST', body: JSON.stringify({ message: 'Site güncellendi (yönetim paneli)', tree: nt.sha, parents: [head] }) });
    await api(G + '/git/refs/heads/' + br, { method: 'PATCH', body: JSON.stringify({ sha: nc.sha }) });
    return { changed: changed.length, deleted: del.length, commit: nc.sha, branch: br };
  }
  root.AurelyaPublish = { publish: publish };
  if (typeof module !== 'undefined') module.exports = root.AurelyaPublish;
})(typeof window !== 'undefined' ? window : globalThis);
