// tags.js — the tag search (D-061). ~2 KB, progressive: the tags index is
// the catalogue and the A–Z without it; with it the .tag-search form shows
// and matches every tag and every title against /<lang>/tags/index.json,
// fetched once on the first keystroke (or focus); its hrefs carry the
// deployment base already. Matching is on words:
// every word typed must occur in the name, the tag or the title, accents
// and case ignored; names that start with the words rank first. Nothing
// leaves the browser. The strings come from the form's data attributes.
(function () {
  var form = document.querySelector('form.tag-search');
  if (!form || !window.fetch) return;
  var field = form.querySelector('.tag-search-field');
  var note = form.querySelector('.tag-search-note');
  var out = form.querySelector('.tag-search-results');
  if (!field || !note || !out) return;
  var hint = note.textContent;
  var index = null, loading = null;
  var LIMIT = 8;

  function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function load() {
    if (index || loading) return loading;
    loading = fetch(form.getAttribute('data-index')).then(function (r) { return r.json(); }).then(function (j) {
      index = {
        tags: j.tags.map(function (t) { return { name: t[0], tag: t[1], kind: t[2], count: t[3], href: t[4], key: norm(t[0] + ' ' + t[1]) }; }),
        docs: j.docs.map(function (d) { return { name: d[0], kind: d[1], href: d[2], key: norm(d[0]) }; })
      };
      return index;
    }).catch(function () { loading = null; });
    return loading;
  }
  function count(n) { return n === 1 ? form.getAttribute('data-one') : form.getAttribute('data-many').replace('{n}', n); }
  function rank(list, words) {
    var hits = [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i], ok = true, starts = 0;
      for (var w = 0; w < words.length; w++) {
        var at = it.key.indexOf(words[w]);
        if (at < 0) { ok = false; break; }
        if (at === 0 || it.key.charAt(at - 1) === ' ' || it.key.charAt(at - 1) === '#') starts++;
      }
      if (ok) hits.push([starts === words.length ? 0 : 1, it]);
    }
    hits.sort(function (a, b) { return a[0] - b[0] || a[1].name.localeCompare(b[1].name); });
    return hits.map(function (h) { return h[1]; });
  }
  function row(it, meta) {
    return '<a class="listing-row" href="' + esc(it.href) + '"><span class="lr-index lr-code">' + esc(it.kind) + '</span><span class="lr-title"><span class="lr-title-main">' + esc(it.name) + '</span></span><span class="lr-meta">' + (meta ? '<span class="lr-mono">' + esc(meta) + '</span>' : '') + '</span><span class="lr-trail lr-year"><span class="lr-arrow" aria-hidden="true">→</span></span></a>';
  }
  function render(q) {
    var words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) { out.hidden = true; out.innerHTML = ''; note.textContent = hint; return; }
    var tags = rank(index.tags, words), docs = rank(index.docs, words);
    if (!tags.length && !docs.length) { out.hidden = true; out.innerHTML = ''; note.textContent = form.getAttribute('data-none'); return; }
    var html = '';
    if (tags.length) html += '<div class="listing-head"><span class="lr-index">#</span><span class="lr-title">' + esc(form.getAttribute('data-tags')) + '</span></div>' + tags.slice(0, LIMIT).map(function (t) { return row(t, count(t.count)); }).join('');
    if (docs.length) html += '<div class="listing-head"><span class="lr-index">#</span><span class="lr-title">' + esc(form.getAttribute('data-titles')) + '</span></div>' + docs.slice(0, LIMIT).map(function (d) { return row(d, ''); }).join('');
    out.innerHTML = html; out.hidden = false;
    note.textContent = form.getAttribute('data-result').replace('{a}', tags.length).replace('{b}', docs.length);
  }
  function update() {
    var q = field.value;
    if (!q.trim()) { render(''); return; }
    load().then(function () { if (index && field.value === q) render(q); });
  }
  field.addEventListener('focus', function () { load(); }, { once: true });
  field.addEventListener('input', update);
  field.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { field.value = ''; render(''); }
    else if (e.key === 'Enter') { var first = out.querySelector('a.listing-row'); if (first && !out.hidden) { e.preventDefault(); location.href = first.getAttribute('href'); } else e.preventDefault(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  form.setAttribute('data-ready', '');
  if (field.value) update();
})();
