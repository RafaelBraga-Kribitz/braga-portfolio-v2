// checks.js — live gates for the specimen pages (Audit · 20 Oct 2026).
// Pure functions over a window and a document. Nothing here writes to the
// DOM except short-lived measuring probes that it removes again.
// "A rule you have not seen fail is not a gate" (01-do-not-repeat §1.15).

const clamp01 = v => Math.min(1, Math.max(0, v));

export function parseColor(str) {
  if (!str) return null;
  str = str.trim();
  if (str === 'transparent') return [0, 0, 0, 0];
  let m = str.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  }
  m = str.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
  }
  return null;
}
export const toHex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
export const luminance = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
const same = (a, b, tol = 3) => a && b && Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol && Math.abs(a[2] - b[2]) <= tol;

/* ---- tokens: read the light and the dark set from the loaded stylesheets ---- */
export function readTokens(doc) {
  const light = {}, dark = {};
  const walk = rules => {
    for (const r of Array.from(rules)) {
      if (r.type === 1) {
        const sel = r.selectorText || '';
        const isDark = /\.dark|data-theme="dark"/.test(sel);
        const isRoot = /:root|^html\b|^body\b/.test(sel);
        if (!isDark && !isRoot) continue;
        const target = isDark ? dark : light;
        for (let i = 0; i < r.style.length; i++) {
          const n = r.style[i];
          if (n.startsWith('--')) target[n] = r.style.getPropertyValue(n).trim();
        }
      } else if (r.type === 4) {
        const cond = r.conditionText || (r.media && r.media.mediaText) || '';
        if (/prefers-color-scheme|prefers-reduced-motion|print/.test(cond)) continue;
        walk(r.cssRules);
      }
    }
  };
  for (const sheet of Array.from(doc.styleSheets)) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    walk(rules);
  }
  const resolve = map => {
    const out = {};
    const one = (v, d) => { const m = /^var\((--[\w-]+)\)$/.exec(v || ''); return m && d < 8 && map[m[1]] != null ? one(map[m[1]], d + 1) : v; };
    for (const k in map) out[k] = one(map[k], 0);
    return out;
  };
  return { light: resolve(light), dark: resolve({ ...light, ...dark }) };
}

/* ---- contrast matrix over the token sets ---- */
const TEXT_TOKENS = [
  ['--ink', 'text'], ['--ink-2', 'text'], ['--ink-3', 'text'],
  ['--accent-01', 'mark'], ['--var-pos', 'mark'], ['--var-neg', 'mark'],
  ['--chart-cat-1', 'mark'], ['--chart-cat-2', 'mark'], ['--chart-cat-3', 'mark'], ['--chart-cat-4', 'mark'], ['--chart-cat-5', 'mark'],
  ['--edge', 'control'], ['--mid', 'hairline'], ['--rule-c', 'hairline']
];
const SURFACES = ['--surface', '--surface-2', '--surface-3'];
const FILLS = [['--on-accent', '--accent-01'], ['--on-cat-1', '--chart-cat-1'], ['--on-cat-2', '--chart-cat-2'], ['--on-cat-3', '--chart-cat-3'], ['--on-cat-4', '--chart-cat-4'], ['--on-cat-5', '--chart-cat-5']];

function grade(ratio, role) {
  if (role === 'hairline') return { glyph: '·', ok: 'info' };
  if (role === 'text') return ratio >= 4.5 ? { glyph: '●', ok: 'pass' } : ratio >= 3 ? { glyph: '◐', ok: 'large' } : { glyph: '○', ok: 'fail' };
  return ratio >= 3 ? { glyph: '●', ok: 'pass' } : { glyph: '○', ok: 'fail' };
}
export function matrix(tokens) {
  return ['light', 'dark'].map(theme => {
    const t = tokens[theme];
    const rows = TEXT_TOKENS.map(([name, role]) => {
      const fg = parseColor(t[name]);
      return {
        name, role, hex: fg ? toHex(fg) : '—',
        cells: SURFACES.map(s => {
          const bg = parseColor(t[s]);
          if (!fg || !bg) return { ratio: '—', glyph: '', ok: 'info' };
          const r = contrast(fg, bg);
          return { ratio: r.toFixed(1), ...grade(r, role) };
        })
      };
    });
    const fills = FILLS.map(([txt, fill]) => {
      const fg = parseColor(t[txt]), bg = parseColor(t[fill]);
      if (!fg || !bg) return { name: txt.slice(2) + ' / ' + fill.slice(2), ratio: '—', glyph: '', ok: 'info' };
      const r = contrast(fg, bg);
      return { name: txt.slice(2) + ' on ' + fill.slice(2), ratio: r.toFixed(1), ...grade(r, 'text'), hex: toHex(fg) + ' / ' + toHex(bg) };
    });
    const fails = rows.reduce((n, r) => n + r.cells.filter(c => c.ok === 'fail').length, 0) + fills.filter(f => f.ok === 'fail').length;
    return { theme, surfaces: SURFACES.map(s => ({ name: s.slice(2), hex: t[s] })), rows, fills, fails: String(fails) };
  });
}

/* ---- type proofs: the OpenType features must be seen to render ---- */
export async function typeProofs(doc) {
  const win = doc.defaultView;
  const out = { fonts: [], tabular: null, tabularNote: '', zeroBody: null, zeroMono: null };
  const faces = async (fam, w) => { try { const f = await doc.fonts.load(`${w} 64px "${fam}"`); return f.length > 0 && f.every(x => x.status === 'loaded'); } catch (e) { return false; } };
  for (const [fam, w] of [['BKribitz', 400], ['BKribitz', 700], ['BKribitz', 800], ['BKribitz Mono', 400]]) out.fonts.push({ name: `${fam} ${w}`, loaded: await faces(fam, w) });
  await doc.fonts.ready;
  const probe = doc.createElement('div');
  probe.setAttribute('data-gate-skip', '');
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;font-size:64px;line-height:1;white-space:nowrap;';
  doc.body.appendChild(probe);
  const span = (text, css) => { const s = doc.createElement('span'); s.textContent = text; s.style.cssText = css; probe.appendChild(s); return s.getBoundingClientRect().width; };
  const fam = "font-family:'BKribitz';";
  const t1 = span('1111', fam + 'font-variant-numeric:tabular-nums lining-nums;'), t0 = span('0000', fam + 'font-variant-numeric:tabular-nums lining-nums;');
  const p1 = span('1111', fam + 'font-variant-numeric:proportional-nums;'), p0 = span('0000', fam + 'font-variant-numeric:proportional-nums;');
  out.tabular = Math.abs(t1 - t0) < 0.6;
  const pd = Math.abs(p1 - p0);
  out.tabularNote = `tabular: 1111 = ${t1.toFixed(1)}px, 0000 = ${t0.toFixed(1)}px · proportional: ${pd < 0.6 ? 'no difference — the default figures are already tabular' : 'differ by ' + pd.toFixed(1) + 'px — the feature is live'}`;
  probe.remove();
  // slashed zero: a slashed zero has ink at its centre, a plain zero is hollow there
  const centreInk = family => {
    try {
      const c = doc.createElement('canvas'); c.width = 240; c.height = 240;
      const ctx = c.getContext('2d');
      ctx.font = `400 180px "${family}"`; ctx.fillStyle = '#000'; ctx.textBaseline = 'alphabetic';
      const m = ctx.measureText('0');
      const x = 30, y = 200;
      ctx.fillText('0', x, y);
      const cx = Math.round(x + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2 - m.actualBoundingBoxLeft);
      const cy = Math.round(y - m.actualBoundingBoxAscent / 2);
      const d = ctx.getImageData(cx - 3, cy - 3, 7, 7).data;
      let ink = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 40) ink++;
      return ink > 0;
    } catch (e) { return null; }
  };
  out.zeroBody = centreInk('BKribitz');
  out.zeroMono = centreInk('BKribitz Mono');
  return out;
}

/* ---- flow pairs measured from the rendered article ---- */
const FLOW_NAMES = { 0: '0', 8: 'related', 16: 'element', 24: '—', 32: 'block', 48: 'lead', 64: 'group', 96: 'section' };
export function measurePairs(article, win) {
  if (!article) return { rows: [], headings: [], unnamed: '0' };
  const kind = el => {
    if (el.classList.contains('callout')) return (el.tagName === 'DETAILS' ? 'details' : 'callout') + '·' + (el.dataset.callout || '');
    if (el.classList.contains('doc-opener')) return 'opener';
    if (el.classList.contains('doc-end')) return 'end';
    if (el.classList.contains('table-scroll')) return 'table';
    if (el.classList.contains('footnotes')) return 'footnotes';
    return el.tagName.toLowerCase();
  };
  const kids = Array.from(article.children);
  const seen = new Map();
  let unnamed = 0;
  for (let i = 1; i < kids.length; i++) {
    const mt = Math.round(parseFloat(win.getComputedStyle(kids[i]).marginTop));
    const key = kind(kids[i - 1]) + ' → ' + kind(kids[i]);
    const token = FLOW_NAMES[mt] ?? 'unnamed';
    if (token === 'unnamed' || token === '—') unnamed++;
    const row = seen.get(key) || { pair: key, px: String(mt), token, n: 0 };
    row.n++; seen.set(key, row);
  }
  const headings = kids.filter(k => /^H[2-4]$/.test(k.tagName)).map((h, i) => {
    const above = parseFloat(win.getComputedStyle(h).marginTop);
    const next = h.nextElementSibling;
    const below = next ? parseFloat(win.getComputedStyle(next).marginTop) : 0;
    return { heading: h.tagName.toLowerCase() + ' “' + (h.textContent || '').trim().slice(0, 28) + '”', above: String(Math.round(above)), below: String(Math.round(below)), ok: above >= 2 * below && below > 0 };
  });
  return { rows: Array.from(seen.values()).map(r => ({ ...r, n: String(r.n) })), headings, unnamed: String(unnamed) };
}

/* ---- the gates ---- */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
const GLYPH_ONLY = /^[→↗←↑↓▲■□§·•+−\-\s]+$/;

export function runChecks(win, doc) {
  const vw = win.innerWidth;
  const cs = el => win.getComputedStyle(el);
  const skip = el => !!el.closest('[data-gate-skip], [hidden], script, style, template');
  const visible = el => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false; const s = cs(el); return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  const all = Array.from(doc.querySelectorAll('body *')).filter(el => !skip(el));
  const textOf = el => Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
  const desc = el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} “${textOf(el).replace(/\s+/g, ' ').slice(0, 36)}”`;
  const textEls = all.filter(el => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName) && textOf(el) && visible(el));

  const svgScale = el => {
    const svg = el.ownerSVGElement; if (!svg) return 1;
    const vb = svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width) return 1;
    return svg.getBoundingClientRect().width / vb.width;
  };
  const renderedSize = el => parseFloat(cs(el).fontSize) * svgScale(el);
  const fgOf = el => parseColor(el.ownerSVGElement ? cs(el).fill : cs(el).color);
  const bgOf = el => {
    let n = el;
    while (n && n !== doc.documentElement) {
      const s = cs(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return null;
      const bg = parseColor(s.backgroundColor);
      if (bg && bg[3] > 0.99) return bg;
      n = n.parentElement;
    }
    const b = parseColor(cs(doc.body).backgroundColor);
    return b && b[3] > 0 ? b : parseColor(cs(doc.documentElement).backgroundColor) || [255, 255, 255, 1];
  };
  const tokenOf = (el, name) => parseColor(cs(el).getPropertyValue(name).trim());
  const result = (id, name, offenders, total, noteOk, noteFail, extra) => ({
    id, name, status: offenders.length ? 'fail' : 'pass', count: String(offenders.length), total: String(total),
    summary: offenders.length ? noteFail.replace('%n', offenders.length) : noteOk, offenders: offenders.slice(0, 6), ...(extra || {})
  });
  const out = [];

  // G-01 · nothing below 12px, including SVG text after viewBox scaling
  const small = textEls.filter(el => renderedSize(el) < 11.5).map(el => `${desc(el)} · ${renderedSize(el).toFixed(1)}px`);
  out.push(result('G-01', 'Type floor 12px', small, textEls.length, `${textEls.length} text runs, none below 12px`, '%n text runs render below 12px'));

  // G-02 · text contrast 4.5:1 (3:1 at 24px, or 19px bold)
  const low = [];
  let measured = 0;
  for (const el of textEls) {
    const fg = fgOf(el), bg = bgOf(el);
    if (!fg || !bg || fg[3] < 0.99) continue;
    measured++;
    const size = renderedSize(el), weight = parseInt(cs(el).fontWeight, 10) || 400;
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    const r = contrast(fg, bg);
    if (r < need) low.push(`${desc(el)} · ${r.toFixed(2)}:1 (${toHex(fg)} on ${toHex(bg)})`);
  }
  out.push(result('G-02', 'Text contrast', low, measured, `${measured} text runs measured, all pass`, '%n text runs below their threshold'));

  // G-03 · mid grey is a hairline, never text (D-007)
  const midText = textEls.filter(el => !GLYPH_ONLY.test(textOf(el)) && same(fgOf(el), tokenOf(el, '--mid'))).map(desc);
  out.push(result('G-03', 'Mid grey never text', midText, textEls.length, 'no text set in --mid', '%n text runs are set in --mid'));

  // G-04 · accent text (D-025: the one earned figure per view may be set in
  // the accent) must still pass 4.5:1 where it sits — on the raised dark
  // surface it does not (3.2:1), and that is what this catches
  const accRuns = textEls.filter(el => !GLYPH_ONLY.test(textOf(el)) && same(fgOf(el), tokenOf(el, '--accent-01')));
  const accLow = accRuns.filter(el => { const bg = bgOf(el); if (!bg) return false; const size = renderedSize(el), weight = parseInt(cs(el).fontWeight, 10) || 400; const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5; return contrast(fgOf(el), bg) < need; }).map(el => `${desc(el)} · ${contrast(fgOf(el), bgOf(el)).toFixed(2)}:1 on ${toHex(bgOf(el))}`);
  out.push(result('G-04', 'Accent text passes', accLow, accRuns.length, `${accRuns.length} accent text runs, all at or above their threshold`, '%n accent text runs below their threshold'));

  // G-05 · targets ≥ 24 px; ≥ 44 px below 768
  // inline links inside a sentence are exempt (WCAG 2.5.8 inline exception)
  const inlineInText = el => { if (cs(el).display !== 'inline') return false; const host = el.closest('p, li, dd, dt, td, th, figcaption, blockquote, summary'); return !!host && textOf(host).length > 0 || !!el.closest('sup'); };
  const targets = Array.from(doc.querySelectorAll('a[href], button, input, select, textarea, summary, [role="tab"], [role="switch"], [role="button"]')).filter(el => !skip(el) && visible(el) && !inlineInText(el));
  const min = vw < 768 ? 44 : 24;
  const smallT = targets.filter(el => { const r = el.getBoundingClientRect(); return r.width < min || r.height < min; }).map(el => { const r = el.getBoundingClientRect(); return `${desc(el)} · ${Math.round(r.width)}×${Math.round(r.height)}`; });
  out.push(result('G-05', `Targets ≥ ${min}px`, smallT, targets.length, `${targets.length} targets, all at least ${min}px`, `%n targets smaller than ${min}px`));

  // G-06 · no horizontal overflow — content inside an overflow-x: auto|scroll
  // wrapper that itself stays in the viewport is the permitted case
  // ("tables scroll inside their wrapper, and only there")
  const inScroller = el => { let n = el.parentElement; while (n && n !== doc.body) { const ox = cs(n).overflowX; if ((ox === 'auto' || ox === 'scroll') && n.getBoundingClientRect().right <= vw + 1) return true; n = n.parentElement; } return false; };
  const wide = all.filter(el => visible(el) && cs(el).position !== 'fixed' && el.getBoundingClientRect().right > vw + 1 && !inScroller(el)).map(el => `${desc(el)} · right edge ${Math.round(el.getBoundingClientRect().right)}px of ${vw}`);
  if (doc.documentElement.scrollWidth > vw + 1) wide.unshift(`document scrollWidth ${doc.documentElement.scrollWidth}px of ${vw}`);
  out.push(result('G-06', 'No horizontal overflow', wide, all.length, `nothing wider than the ${vw}px viewport`, '%n elements cross the viewport edge'));

  // G-07 · radius 0 (the only exception is the 2px control token)
  const round = all.filter(el => visible(el) && !el.matches('input[type="range"]') && ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].some(k => parseFloat(cs(el)[k]) > 2)).map(el => `${desc(el)} · ${cs(el).borderTopLeftRadius}`);
  out.push(result('G-07', 'Square corners', round, all.length, 'no corner above the 2px control token', '%n elements carry a radius'));

  // G-08 · flat: no shadows, no gradients
  const flat = all.filter(el => visible(el) && (cs(el).boxShadow !== 'none' || /gradient/.test(cs(el).backgroundImage))).map(el => `${desc(el)} · ${cs(el).boxShadow !== 'none' ? 'box-shadow' : 'gradient'}`);
  out.push(result('G-08', 'No shadow, no gradient', flat, all.length, 'no box-shadow or gradient in the rendered page', '%n elements use a shadow or a gradient'));

  // G-09 · headings: one h1, no skipped level
  const hs = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(el => !skip(el));
  const hOff = [];
  const h1s = hs.filter(h => h.tagName === 'H1').length;
  if (h1s !== 1) hOff.push(`${h1s} h1 elements`);
  let prev = 0;
  for (const h of hs) { const lvl = +h.tagName[1]; if (prev && lvl > prev + 1) hOff.push(`h${prev} → h${lvl} “${textOf(h).slice(0, 30)}”`); prev = lvl; }
  out.push(result('G-09', 'Heading order', hOff, hs.length, `${hs.length} headings, one h1, no skipped level`, '%n heading problems'));

  // G-10 · landmarks and the skip link
  const land = ['header', 'nav', 'main', 'footer'].filter(t => !doc.querySelector(t));
  const first = Array.from(doc.querySelectorAll(FOCUSABLE)).filter(el => !skip(el)).find(el => { const s = cs(el); return s.display !== 'none' && s.visibility !== 'hidden'; });
  const lOff = land.map(l => `no <${l}>`);
  if (!first) lOff.push('no focusable element');
  else if (!(first.matches('a[href^="#"]') && /skip/i.test(first.textContent))) lOff.push(`first tab stop is ${desc(first)}, not a skip link`);
  out.push(result('G-10', 'Landmarks + skip link', lOff, 5, 'header, nav, main, footer present; the skip link is the first tab stop', '%n structure problems'));

  // G-11 · reduced-motion rule present
  let rm = false;
  for (const sheet of Array.from(doc.styleSheets)) { try { for (const r of Array.from(sheet.cssRules)) if (r.type === 4 && /prefers-reduced-motion/.test(r.conditionText || r.media.mediaText)) rm = true; } catch (e) { /* cross-origin */ } }
  out.push(result('G-11', 'Reduced motion', rm ? [] : ['no @media (prefers-reduced-motion) rule in any stylesheet'], 1, '--dur falls to 0ms under prefers-reduced-motion', 'motion stays at 140ms for readers who asked for none'));

  // G-12 · fonts are the project faces
  const faces = Array.from(doc.fonts || []).filter(f => /BKribitz/.test(f.family));
  const loaded = faces.filter(f => f.status === 'loaded');
  const fOff = loaded.length ? [] : ['no BKribitz face reports status “loaded”'];
  out.push(result('G-12', 'Project fonts loaded', fOff, faces.length, `${loaded.length} BKribitz faces loaded`, 'the page is rendering in a fallback face'));

  // G-13 · no third-party requests (04-F, 04-K; the guard test): every
  // stylesheet, script, image, frame, @import and @font-face resolves on
  // this origin. A CDN copy of KaTeX or Mermaid is what this catches.
  const origin = win.location.origin;
  const urlOf = u => { try { return new URL(u, doc.baseURI); } catch (e) { return null; } };
  const isForeign = u => u && /^https?:$/.test(u.protocol) && u.origin !== origin;
  const foreign = [];
  doc.querySelectorAll('link[href], script[src], img[src], iframe[src], video[src], audio[src], source[src], object[data]').forEach(el => {
    if (el.tagName === 'LINK' && !/stylesheet|preload|icon|modulepreload/.test(el.rel || 'stylesheet')) return;
    const u = urlOf(el.getAttribute('href') || el.getAttribute('src') || el.getAttribute('data'));
    if (isForeign(u)) foreign.push(`<${el.tagName.toLowerCase()}> ${u.host}${u.pathname.slice(0, 48)}`);
  });
  for (const sheet of Array.from(doc.styleSheets)) {
    try {
      for (const r of Array.from(sheet.cssRules)) {
        if (r.type === 3 && isForeign(urlOf(r.href))) foreign.push('@import ' + r.href);
        if (r.type === 5) for (const m of (r.style.getPropertyValue('src') || '').matchAll(/url\(["']?([^"')]+)/g)) { const u = urlOf(m[1]); if (isForeign(u)) foreign.push('@font-face ' + u.host); }
      }
    } catch (e) { if (sheet.href && isForeign(urlOf(sheet.href))) foreign.push('<link> ' + sheet.href); }
  }
  out.push(result('G-13', 'No third-party requests', foreign, 1, 'every resource is served from this origin', '%n resources load from another origin'));

  return out;
}

/* ---- run the gates against another page in an off-screen frame ---- */
export function runInFrame(doc, src, width) {
  return new Promise((resolve) => {
    const host = doc.createElement('div');
    host.setAttribute('data-gate-skip', '');
    host.style.cssText = `position:absolute;left:-20000px;top:0;width:${width}px;height:900px;overflow:hidden;`;
    const f = doc.createElement('iframe');
    f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
    f.style.cssText = `width:${width}px;height:900px;border:0;`;
    host.appendChild(f); doc.body.appendChild(host);
    const done = v => { host.remove(); resolve(v); };
    const t0 = Date.now();
    const poll = () => {
      let d; try { d = f.contentDocument; } catch (e) { return done({ error: 'The frame is cross-origin; the gates can only read same-origin pages.' }); }
      if (!d) return done({ error: 'The frame did not expose a document.' });
      const ready = d.readyState === 'complete' && d.querySelector('main') && d.body;
      if (ready && Date.now() - t0 > 2200) {
        try {
          const results = runChecks(f.contentWindow, d);
          return done({ results });
        } catch (e) { return done({ error: 'Gate run failed: ' + (e && e.message) }); }
      }
      if (Date.now() - t0 > 14000) return done({ error: 'The page did not finish rendering within 14 s.' });
      setTimeout(poll, 250);
    };
    f.addEventListener('load', () => setTimeout(poll, 250));
    f.addEventListener('error', () => done({ error: 'The page could not be loaded.' }));
    f.src = src;
  });
}
