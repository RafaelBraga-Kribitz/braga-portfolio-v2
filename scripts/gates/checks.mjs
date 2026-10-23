// ============================================================
// scripts/gates/checks.mjs — the gates.
//
// Ported from handoff/ds-update/proposals/checks.js (Audit · 20 Oct 2026).
// "A rule you have not seen fail is not a gate": every gate here is seen
// failing on tests/gates/fixtures/bad/ (see tests/gates/README.md).
//
// Three kinds of function:
//   pageGates(opts)   G-01…G-15. Runs INSIDE the page (page.evaluate), so it
//                     is self-contained: no closure over this module.
//   pageFacts(html)   runs inside a blank page; parses the raw HTML file with
//                     DOMParser (no script runs) and returns plain data for
//                     the static gates.
//   staticGates(...)  L-01…L-07, in Node, over pageFacts output and the
//                     files on disk.
//   axeGate(...)      A-01, axe-core over the live page.
//
// Every result has the shape of checks.js:
//   { id, name, status: 'pass'|'fail'|'skip', count, total, summary, offenders[] }
// ============================================================
import { existsSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

export const GATES = [
  ['G-01', 'Type floor 12px'],
  ['G-02', 'Text contrast'],
  ['G-03', 'Mid grey never text'],
  ['G-04', 'Accent text passes'],
  ['G-05', 'Targets ≥ 24 / 44px'],
  ['G-06', 'No horizontal overflow'],
  ['G-07', 'Square corners'],
  ['G-08', 'No shadow, gradient, blur'],
  ['G-09', 'Heading order'],
  ['G-10', 'Landmarks + skip link'],
  ['G-11', 'Reduced motion'],
  ['G-12', 'Project fonts loaded'],
  ['G-13', 'No third-party requests'],
  ['G-14', 'Shell on the page grid'],
  ['G-15', 'One accent per section'],
  ['L-01', 'Internal links resolve'],
  ['L-02', 'hreflang pairs'],
  ['L-03', 'Scripts policy'],
  ['L-04', 'No inline style'],
  ['L-05', 'Head metadata'],
  ['L-06', 'Glyph inventory'],
  ['L-07', 'Draft mark'],
  ['A-01', 'axe WCAG 2.1 AA'],
];
export const GATE_NAME = Object.fromEntries(GATES);

const MAX_OFFENDERS = 12;
export function result(id, offenders, total, noteOk, noteFail, extra) {
  return {
    id, name: GATE_NAME[id] || id, status: offenders.length ? 'fail' : 'pass',
    count: offenders.length, total,
    summary: offenders.length ? noteFail.replace('%n', String(offenders.length)) : noteOk,
    offenders: offenders.slice(0, MAX_OFFENDERS), ...(extra || {}),
  };
}
export const skipped = (id, why) => ({ id, name: GATE_NAME[id] || id, status: 'skip', count: 0, total: 0, summary: why, offenders: [] });

/* ================================================================
   G-01 … G-15 — inside the page. Keep this function self-contained.
   opts: { foreign: string[] }   third-party requests seen on the wire
   ================================================================ */
export async function pageGates(opts = {}) {
  const win = window, doc = document;
  try { await doc.fonts.ready; } catch (e) { /* no FontFaceSet */ }

  /* ---- colour maths (checks.js) ---- */
  const canvas = doc.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx2d = canvas.getContext('2d', { willReadFrequently: true });
  const colorCache = new Map();
  const parseColor = (str) => {
    if (!str) return null;
    str = String(str).trim();
    if (colorCache.has(str)) return colorCache.get(str);
    let out = null;
    if (str === 'transparent') out = [0, 0, 0, 0];
    else if (str === 'none' || str.startsWith('url(')) out = null;
    else {
      let m = str.match(/^rgba?\(([^)]+)\)$/i);
      if (m) {
        const p = m[1].split(/[\s,\/]+/).filter(Boolean).map((v) => v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));
        out = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
      } else if ((m = str.match(/^#([0-9a-f]{3,8})$/i))) {
        let h = m[1];
        if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
        const n = parseInt(h.slice(0, 6), 16);
        out = [(n >> 16) & 255, (n >> 8) & 255, n & 255, h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
      } else if ((m = str.match(/^color\(srgb\s+([^)]+)\)$/i))) {
        const p = m[1].split(/[\s\/]+/).filter(Boolean).map(parseFloat);
        out = [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1];
      } else if (ctx2d && win.CSS && CSS.supports('color', str)) {
        // any other valid syntax (oklch(), lab(), named): let the canvas paint it
        try {
          ctx2d.clearRect(0, 0, 1, 1); ctx2d.fillStyle = str; ctx2d.fillRect(0, 0, 1, 1);
          const d = ctx2d.getImageData(0, 0, 1, 1).data;
          out = [d[0], d[1], d[2], d[3] / 255];
        } catch (e) { out = null; }
      }
    }
    colorCache.set(str, out);
    return out;
  };
  const toHex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const luminance = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const contrast = (a, b) => { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
  const same = (a, b, tol = 3) => !!(a && b && Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol && Math.abs(a[2] - b[2]) <= tol);

  const MAX = 12;
  const result = (id, name, offenders, total, noteOk, noteFail, extra) => ({
    id, name, status: offenders.length ? 'fail' : 'pass', count: offenders.length, total,
    summary: offenders.length ? noteFail.replace('%n', String(offenders.length)) : noteOk,
    offenders: offenders.slice(0, MAX), ...(extra || {}),
  });

  /* ---- element helpers (checks.js) ---- */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
  const GLYPH_ONLY = /^[→↗←↑↓▲■□▣▤⊡§·•+−–\-\s]+$/;
  const vw = doc.documentElement.clientWidth || win.innerWidth;
  const csCache = new Map();
  const cs = (el) => { let s = csCache.get(el); if (!s) { s = win.getComputedStyle(el); csCache.set(el, s); } return s; };
  const skip = (el) => !!el.closest('[data-gate-skip], [hidden], script, style, template, noscript');
  const visible = (el) => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false; const s = cs(el); return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  // visually hidden: an ancestor-or-self box of ≤ 1px that clips (the
  // sr-only pattern). Not rendered text, not a target.
  const clipMemo = new Map();
  const clippedBox = (n) => {
    if (clipMemo.has(n)) return clipMemo.get(n);
    const r = n.getBoundingClientRect(), s = cs(n);
    const v = (r.width <= 1 || r.height <= 1) && (/hidden|clip/.test(s.overflow) || (s.clip && s.clip !== 'auto') || (s.clipPath && s.clipPath !== 'none'));
    clipMemo.set(n, v); return v;
  };
  const srOnly = (el) => { for (let n = el; n && n !== doc.body; n = n.parentElement) if (clippedBox(n)) return true; return false; };
  const all = Array.from(doc.querySelectorAll('body *')).filter((el) => !skip(el));
  const textOf = (el) => Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
  const desc = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '';
    const t = (textOf(el) || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36);
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}${t ? ' “' + t + '”' : ''}`;
  };
  const textEls = all.filter((el) => textOf(el) && visible(el) && !srOnly(el));

  // SVG text: the font size after the viewBox (and any transform) scales it
  const svgScale = (el) => {
    if (!el.ownerSVGElement) return 1;
    try { const m = el.getScreenCTM(); if (m) return Math.hypot(m.c, m.d) || 1; } catch (e) { /* fall through */ }
    const svg = el.ownerSVGElement, vb = svg.viewBox && svg.viewBox.baseVal;
    if (!vb || !vb.width) return 1;
    return svg.getBoundingClientRect().width / vb.width;
  };
  const renderedSize = (el) => parseFloat(cs(el).fontSize) * svgScale(el);
  const fgOf = (el) => parseColor(el.ownerSVGElement ? cs(el).fill : cs(el).color);
  // walk up to the first painted background; a background image makes the
  // pair unmeasurable (null), as in checks.js
  const bgOf = (el) => {
    let n = el;
    while (n && n !== doc.documentElement) {
      const s = cs(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') return null;
      const bg = parseColor(s.backgroundColor);
      if (bg && bg[3] > 0.99) return bg;
      n = n.parentElement;
    }
    const b = parseColor(cs(doc.body).backgroundColor);
    if (b && b[3] > 0) return b;
    const h = parseColor(cs(doc.documentElement).backgroundColor);
    if (h && h[3] > 0) return h;
    // nothing painted: the browser canvas (checks.js fell through to a
    // transparent <html> here and measured text against black)
    const scheme = cs(doc.documentElement).colorScheme || '';
    return /\bdark\b/.test(scheme) && !/\blight\b/.test(scheme) ? [18, 18, 18, 1] : [255, 255, 255, 1];
  };
  const tokenOf = (el, name) => parseColor(cs(el).getPropertyValue(name).trim());
  const needOf = (el) => { const size = renderedSize(el), weight = parseInt(cs(el).fontWeight, 10) || 400; return size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5; };
  const out = [];

  // G-01 · nothing below 12px, including SVG text after viewBox scaling
  const small = textEls.filter((el) => renderedSize(el) < 11.5).map((el) => `${desc(el)} · ${renderedSize(el).toFixed(1)}px`);
  out.push(result('G-01', 'Type floor 12px', small, textEls.length, `${textEls.length} text runs, none below 12px`, '%n text runs render below 12px'));

  // G-02 · text contrast 4.5:1 (3:1 at 24px, or 18.66px bold)
  const low = [];
  let measured = 0;
  for (const el of textEls) {
    const fg = fgOf(el), bg = bgOf(el);
    if (!fg || !bg || fg[3] < 0.99) continue;
    measured++;
    const need = needOf(el), r = contrast(fg, bg);
    if (r < need) low.push(`${desc(el)} · ${r.toFixed(2)}:1 < ${need} (${toHex(fg)} on ${toHex(bg)})`);
  }
  out.push(result('G-02', 'Text contrast', low, measured, `${measured} text runs measured, all pass`, '%n text runs below their threshold'));

  // G-03 · mid grey is a hairline, never text (D-007): no text run's colour
  // equals the resolved --mid where it sits
  const midText = textEls.filter((el) => !GLYPH_ONLY.test(textOf(el)) && same(fgOf(el), tokenOf(el, '--mid'))).map((el) => `${desc(el)} · ${toHex(fgOf(el))} = --mid`);
  out.push(result('G-03', 'Mid grey never text', midText, textEls.length, 'no text set in --mid', '%n text runs are set in --mid'));

  // G-04 · accent text (one accent per section, G-15) must still
  // pass its threshold where it sits — never on the raised dark surface
  const accRuns = textEls.filter((el) => !GLYPH_ONLY.test(textOf(el)) && same(fgOf(el), tokenOf(el, '--accent-01')));
  const accLow = accRuns.filter((el) => { const bg = bgOf(el); return bg && contrast(fgOf(el), bg) < needOf(el); })
    .map((el) => `${desc(el)} · ${contrast(fgOf(el), bgOf(el)).toFixed(2)}:1 on ${toHex(bgOf(el))}`);
  out.push(result('G-04', 'Accent text passes', accLow, accRuns.length, `${accRuns.length} accent text runs, all at or above their threshold`, '%n accent text runs below their threshold'));

  // G-05 · targets ≥ 24px; ≥ 44px below 768. Inline links inside a sentence
  // are exempt (WCAG 2.5.8 inline exception)
  const inlineInText = (el) => { if (cs(el).display !== 'inline') return false; const host = el.closest('p, li, dd, dt, td, th, figcaption, blockquote, summary'); return (!!host && textOf(host).length > 0) || !!el.closest('sup'); };
  const targets = Array.from(doc.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="tab"], [role="switch"], [role="button"]'))
    .filter((el) => !skip(el) && visible(el) && !srOnly(el) && !inlineInText(el));
  const min = win.innerWidth < 768 ? 44 : 24;
  // the footer's links are 32px below 768 (owner, 23 Oct 2026: the space
  // between them no larger than the text); above WCAG 2.5.8's 24px
  const minOf = (el) => (min === 44 && el.closest('.site-footer-links') ? 32 : min);
  const smallT = targets.filter((el) => { const r = el.getBoundingClientRect(), m = minOf(el); return r.width < m - 0.5 || r.height < m - 0.5; })
    .map((el) => { const r = el.getBoundingClientRect(); return `${desc(el)} · ${Math.round(r.width * 10) / 10}×${Math.round(r.height * 10) / 10}`; });
  out.push(result('G-05', `Targets ≥ ${min}px`, smallT, targets.length, `${targets.length} targets, all at least ${min}px`, `%n targets smaller than ${min}px`));

  // G-06 · no horizontal overflow. Content inside an overflow-x: auto|scroll
  // wrapper that itself stays in the viewport is the permitted case
  // ("tables scroll inside their wrapper, and only there"). Only the
  // outermost crossing element is listed.
  const inScroller = (el) => { let n = el.parentElement; while (n && n !== doc.body) { const ox = cs(n).overflowX; if ((ox === 'auto' || ox === 'scroll') && n.getBoundingClientRect().right <= vw + 1) return true; n = n.parentElement; } return false; };
  const wideSet = new Set(all.filter((el) => visible(el) && cs(el).position !== 'fixed' && el.getBoundingClientRect().right > vw + 1 && !inScroller(el) && !srOnly(el)));
  const wide = Array.from(wideSet).filter((el) => !wideSet.has(el.parentElement)).map((el) => `${desc(el)} · right edge ${Math.round(el.getBoundingClientRect().right)}px of ${vw}`);
  const sw = doc.documentElement.scrollWidth;
  if (sw > vw + 1) wide.unshift(`document scrollWidth ${sw}px > clientWidth ${vw}px`);
  out.push(result('G-06', 'No horizontal overflow', wide, all.length, `nothing wider than the ${vw}px viewport`, '%n elements cross the viewport edge'));

  // pseudo-elements carry corners and shadows too
  const pseudos = (el) => ['::before', '::after'].map((p) => [p, win.getComputedStyle(el, p)]).filter(([, s]) => s.content && s.content !== 'none' && s.content !== 'normal' && s.display !== 'none');
  const shown = all.filter((el) => visible(el));

  // G-07 · square corners: radius 0 everywhere (BUILD-BRIEF §3 "Corners 0")
  const RADII = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'];
  const rounded = (s) => RADII.some((k) => parseFloat(s[k]) > 0);
  const round = [];
  for (const el of shown) {
    if (rounded(cs(el))) round.push(`${desc(el)} · border-radius ${cs(el).borderTopLeftRadius}`);
    for (const [p, s] of pseudos(el)) if (rounded(s)) round.push(`${desc(el)}${p} · border-radius ${s.borderTopLeftRadius}`);
  }
  out.push(result('G-07', 'Square corners', round, shown.length, 'no corner above 0', '%n elements carry a radius'));

  // G-08 · flat: no shadow, no gradient, no blur
  // the sticky header's glass (owner, 23 Oct 2026) is the one blur allowed
  const unflat = (s, glass = false) => {
    const why = [];
    if (s.boxShadow && s.boxShadow !== 'none') why.push('box-shadow');
    if (s.textShadow && s.textShadow !== 'none') why.push('text-shadow');
    if (/gradient/.test(s.backgroundImage || '')) why.push('gradient');
    if (/blur\(|drop-shadow\(/.test(s.filter || '')) why.push('filter ' + s.filter);
    const bf = s.backdropFilter || s.webkitBackdropFilter;
    if (bf && bf !== 'none' && !glass) why.push('backdrop-filter ' + bf);
    return why;
  };
  const flat = [];
  for (const el of shown) {
    const w = unflat(cs(el), el.matches('header.shell')); if (w.length) flat.push(`${desc(el)} · ${w.join(', ')}`);
    for (const [p, s] of pseudos(el)) { const v = unflat(s); if (v.length) flat.push(`${desc(el)}${p} · ${v.join(', ')}`); }
  }
  out.push(result('G-08', 'No shadow, gradient, blur', flat, shown.length, 'no shadow, gradient or blur in the rendered page', '%n elements use a shadow, a gradient or a blur'));

  // G-09 · headings: one h1, no skipped level
  const hs = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter((el) => !skip(el));
  const hOff = [];
  const h1s = hs.filter((h) => h.tagName === 'H1');
  if (h1s.length !== 1) hOff.push(`${h1s.length} h1 elements${h1s.length ? ': ' + h1s.map((h) => '“' + h.textContent.replace(/\s+/g, ' ').trim().slice(0, 30) + '”').join(', ') : ''}`);
  let prev = 0;
  for (const h of hs) { const lvl = +h.tagName[1]; if (prev && lvl > prev + 1) hOff.push(`h${prev} → h${lvl} “${h.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)}”`); prev = lvl; }
  out.push(result('G-09', 'Heading order', hOff, hs.length, `${hs.length} headings, one h1, no skipped level`, '%n heading problems'));

  // G-10 · landmarks and the skip link (first tab stop, pointing at a target)
  const lOff = ['header', 'nav', 'footer'].filter((t) => !doc.querySelector(t)).map((l) => `no <${l}>`);
  const mains = doc.querySelectorAll('main, [role="main"]').length;
  if (mains !== 1) lOff.push(`${mains} <main> landmarks (one expected)`);
  const first = Array.from(doc.querySelectorAll(FOCUSABLE)).filter((el) => !skip(el)).find((el) => { const s = cs(el); return s.display !== 'none' && s.visibility !== 'hidden'; });
  if (!first) lOff.push('no focusable element');
  else if (!(first.matches('a[href^="#"]') && (first.classList.contains('skip') || /skip/i.test(first.textContent)))) lOff.push(`first tab stop is ${desc(first)}, not the .skip link`);
  else {
    const id = decodeURIComponent(first.getAttribute('href').slice(1));
    if (!id || !doc.getElementById(id)) lOff.push(`skip link points at #${id}, which does not exist`);
  }
  // two landmarks of one role need different names (axe best practice
  // landmark-unique, outside the WCAG tags A-01 runs): a landmark list
  // that offers "Index navigation" twice cannot be told apart
  const nameOf = (el) => {
    const lab = el.getAttribute('aria-labelledby');
    if (lab) return lab.split(/\s+/).map((i) => doc.getElementById(i)?.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
    return (el.getAttribute('aria-label') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
  };
  const IMPLICIT = { NAV: 'navigation', ASIDE: 'complementary', SECTION: 'region', FORM: 'form' };
  const marks = new Map();
  for (const el of doc.querySelectorAll('nav, aside, section[aria-label], section[aria-labelledby], form[aria-label], form[aria-labelledby], [role="navigation"], [role="complementary"], [role="region"], [role="search"]')) {
    if (skip(el) || cs(el).display === 'none' || cs(el).visibility === 'hidden') continue;
    const role = el.getAttribute('role') || IMPLICIT[el.tagName];
    if (!role) continue;
    const name = nameOf(el);
    const key = `${role}|${name.toLowerCase()}`;
    const m = marks.get(key) || { role, name, n: 0 };
    m.n++; marks.set(key, m);
  }
  for (const m of marks.values()) if (m.n > 1) lOff.push(`${m.n} ${m.role} landmarks named “${m.name || '(no name)'}”: the landmark name must be unique`);
  out.push(result('G-10', 'Landmarks + skip link', lOff, 5, 'header, nav, one main, footer present; landmark names unique; the skip link is the first tab stop', '%n structure problems'));

  // G-11 · a prefers-reduced-motion rule sets --dur to 0
  const walk = (rules, fn) => { for (const r of Array.from(rules || [])) { fn(r); let kids = null; try { kids = r.cssRules; } catch (e) { /* none */ } if (kids && kids.length) walk(kids, fn); } };
  const rootCs = win.getComputedStyle(doc.documentElement);
  const resolveVar = (v, d = 0) => { const m = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec((v || '').trim()); if (!m || d > 8) return (v || '').trim(); const got = rootCs.getPropertyValue(m[1]).trim(); return resolveVar(got || m[2] || '', d + 1); };
  const isZero = (v) => /^[+-]?0*(\.0+)?(m?s)?$/.test(v.replace(/\s+/g, '')) && v.trim() !== '';
  let rmRules = 0; const durs = [];
  for (const sheet of Array.from(doc.styleSheets)) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    walk(rules, (r) => {
      if (!(r.media && /prefers-reduced-motion/.test(r.conditionText || r.media.mediaText || ''))) return;
      if (!/reduce/.test(r.conditionText || r.media.mediaText)) return;
      rmRules++;
      walk(r.cssRules, (s) => { if (s.style) { const v = s.style.getPropertyValue('--dur'); if (v) durs.push({ raw: v.trim(), value: resolveVar(v) }); } });
    });
  }
  const rmOff = [];
  if (!rmRules) rmOff.push('no @media (prefers-reduced-motion: reduce) rule in any stylesheet');
  else if (!durs.length) rmOff.push(`${rmRules} reduced-motion rule${rmRules > 1 ? 's' : ''}, none sets --dur`);
  else if (!durs.some((d) => isZero(d.value))) rmOff.push(`--dur under reduced motion is ${durs.map((d) => d.raw + (d.raw !== d.value ? ' = ' + d.value : '')).join(', ')}, not 0`);
  out.push(result('G-11', 'Reduced motion', rmOff, 1, `--dur falls to ${durs.length ? durs.find((d) => isZero(d.value))?.value || '0' : '0'} under prefers-reduced-motion`, 'motion stays on for readers who asked for none'));

  // G-12 · the project faces are loaded (both families)
  const fam = (f) => String(f.family || '').replace(/^["']|["']$/g, '');
  const faces = Array.from(doc.fonts || []);
  const fOff = [];
  const loadedNames = [];
  for (const family of ['BKribitz', 'BKribitz Mono']) {
    const mine = faces.filter((f) => fam(f) === family);
    const ok = mine.filter((f) => f.status === 'loaded');
    if (!mine.length) fOff.push(`no @font-face for “${family}”`);
    else if (!ok.length) fOff.push(`no “${family}” face reports status “loaded” (${mine.map((f) => f.weight + (f.style !== 'normal' ? ' ' + f.style : '') + ':' + f.status).join(', ')})`);
    else loadedNames.push(`${family} ${ok.map((f) => f.weight + (f.style !== 'normal' ? 'i' : '')).join('/')}`);
  }
  out.push(result('G-12', 'Project fonts loaded', fOff, 2, `loaded: ${loadedNames.join(' · ')}`, 'the page renders in a fallback face'));

  // G-13 · no third-party requests: every stylesheet, script, image, frame,
  // @import and @font-face resolves on this origin; plus every request the
  // runner saw leave for another origin (opts.foreign)
  const origin = win.location.origin;
  const urlOf = (u) => { try { return new URL(u, doc.baseURI); } catch (e) { return null; } };
  const isForeign = (u) => u && /^https?:$/.test(u.protocol) && u.origin !== origin;
  const foreign = new Set();
  doc.querySelectorAll('link[href], script[src], img[src], iframe[src], video[src], audio[src], source[src], object[data], embed[src]').forEach((el) => {
    if (el.tagName === 'LINK' && !/stylesheet|preload|icon|modulepreload|prefetch|manifest/.test(el.rel || 'stylesheet')) return;
    const u = urlOf(el.getAttribute('href') || el.getAttribute('src') || el.getAttribute('data'));
    if (isForeign(u)) foreign.add(`<${el.tagName.toLowerCase()}> ${u.host}${u.pathname.slice(0, 48)}`);
  });
  for (const sheet of Array.from(doc.styleSheets)) {
    try {
      walk(sheet.cssRules, (r) => {
        if (r.type === 3 && isForeign(urlOf(r.href))) foreign.add('@import ' + r.href);
        if (r.type === 5) for (const m of (r.style.getPropertyValue('src') || '').matchAll(/url\(["']?([^"')]+)/g)) { const u = urlOf(m[1]); if (isForeign(u)) foreign.add('@font-face ' + u.host + u.pathname.slice(0, 48)); }
      });
    } catch (e) { if (sheet.href && isForeign(urlOf(sheet.href))) foreign.add('<link> ' + sheet.href); }
  }
  for (const f of opts.foreign || []) { const u = urlOf(f); foreign.add('request ' + (u ? u.host + u.pathname.slice(0, 48) : f)); }
  out.push(result('G-13', 'No third-party requests', Array.from(foreign), 1, 'every resource is served from this origin', '%n resources load from another origin'));

  // G-14 · the shell stands on the page grid (grid.css rule 1): the header's
  // wordmark starts where the content of <main> starts, the cluster ends
  // where it ends (768 and up), and the footer's wordmark stacks under the
  // header's, at every width: above --page-max too (the shell's hairline is
  // full bleed, its bar is not)
  const sOff = [];
  const shellMark = doc.querySelector('.shell-mark');
  const mainEl = doc.querySelector('main');
  if (shellMark && mainEl && !skip(shellMark)) {
    const mr = mainEl.getBoundingClientRect(), ms = cs(mainEl);
    const left = mr.left + parseFloat(ms.borderLeftWidth) + parseFloat(ms.paddingLeft);
    const right = mr.right - parseFloat(ms.borderRightWidth) - parseFloat(ms.paddingRight);
    const textLeft = (el) => { const r = doc.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect(); return b.width ? b.left : el.getBoundingClientRect().left; };
    const mx = textLeft(shellMark);
    if (Math.abs(mx - left) > 1) sOff.push(`header wordmark starts at ${Math.round(mx)}px, the content of <main> at ${Math.round(left)}px`);
    const cluster = doc.querySelector('.shell-cluster');
    if (cluster && vw >= 768) { const cr = cluster.getBoundingClientRect().right; if (Math.abs(cr - right) > 1) sOff.push(`header controls end at ${Math.round(cr)}px, the content of <main> at ${Math.round(right)}px`); }
    const footMark = doc.querySelector('.site-footer-mark');
    if (footMark && visible(footMark)) { const fx = textLeft(footMark); if (Math.abs(fx - mx) > 1) sOff.push(`footer wordmark starts at ${Math.round(fx)}px, the header's at ${Math.round(mx)}px`); }
  }
  out.push(result('G-14', 'Shell on the page grid', sOff, shellMark ? 3 : 0, shellMark ? 'header and footer wordmarks and the controls stand on the column lines of <main>' : 'no .shell-mark on this page', '%n shell edges off the page grid'));

  // G-15 · one accent per section (owner, 22 Oct 2026; replaces D-025's
  // one per view). An accent spot is an element painted in the resolved
  // --accent-01 at rest: its own text, its background, a border, an SVG
  // fill or stroke, or a ::before/::after. A spot inside another spot is
  // the same spot (a button's glyph), and every accent mark of one <svg>
  // is one spot (a chart's marker and its cursor). The section is the
  // nearest of SCOPES; inside article.doc and outside those, the h2
  // section the element follows. Hover and focus are not at rest. Code
  // panels are left out: their syntax colours are a palette of their own
  // (D-035) that happens to share a value with the dark accent.
  const SCOPES = 'figure, .bench-tool, .cover, .doc-opener, .metric-strip, .doc-close, .doc-end, main > .section, header, footer, nav';
  const accentOf = (el) => tokenOf(el, '--accent-01');
  const painted = (el) => {
    const s = cs(el), acc = accentOf(el);
    if (!acc) return false;
    if (textOf(el) && same(parseColor(s.color), acc)) return true;
    const bg = parseColor(s.backgroundColor);
    if (bg && bg[3] > 0.5 && same(bg, acc)) return true;
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(s[`border${side}Width`]) > 0 && same(parseColor(s[`border${side}Color`]), acc)) return true;
    if (el.ownerSVGElement && (same(parseColor(s.fill), acc) || (s.stroke !== 'none' && same(parseColor(s.stroke), acc)))) return true;
    for (const [, p] of pseudos(el)) { const pb = parseColor(p.backgroundColor); if ((pb && pb[3] > 0.5 && same(pb, acc)) || same(parseColor(p.color), acc)) return true; }
    return false;
  };
  const spotsAll = shown.filter((el) => !srOnly(el) && !el.closest('.code, pre') && painted(el));
  const spotSet = new Set(spotsAll.map((el) => el.ownerSVGElement || el));
  const spots = Array.from(spotSet).filter((el) => { for (let n = el.parentElement; n; n = n.parentElement) if (spotSet.has(n)) return false; return true; });
  const scopeOf = (el) => {
    const sc = el.closest(SCOPES);
    const art = el.closest('article.doc');
    if (art && (!sc || sc.contains(art))) {
      let h = null;
      for (const h2 of art.querySelectorAll('h2')) { if (h2.compareDocumentPosition(el) & 4) h = h2; else break; }
      return { key: art, sub: h, label: h ? `h2 “${h.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)}”` : 'document lead' };
    }
    return { key: sc || doc.body, sub: null, label: sc ? desc(sc) : 'page' };
  };
  const groups = new Map();
  for (const el of spots) {
    const s = scopeOf(el);
    let byKey = groups.get(s.key); if (!byKey) { byKey = new Map(); groups.set(s.key, byKey); }
    const g = byKey.get(s.sub) || { label: s.label, els: [] };
    g.els.push(el); byKey.set(s.sub, g);
  }
  const aOff = [];
  let sections = 0;
  for (const byKey of groups.values()) for (const g of byKey.values()) { sections++; if (g.els.length > 1) aOff.push(`${g.label} · ${g.els.length} accents: ${g.els.map(desc).join(' + ')}`); }
  out.push(result('G-15', 'One accent per section', aOff, sections, `${spots.length} accent spots, at most one per section`, '%n sections carry more than one accent'));

  return { results: out, theme: doc.documentElement.dataset.theme || '', vw, elements: all.length };
}

/* ================================================================
   pageFacts(html) — inside a blank page. Parses the RAW file with
   DOMParser: nothing runs, nothing hydrates. Self-contained.
   ================================================================ */
export function pageFacts(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const q = (s, root = doc) => Array.from(root.querySelectorAll(s));
  const desc = (el) => {
    const cls = el.getAttribute('class') ? '.' + el.getAttribute('class').trim().split(/\s+/)[0] : '';
    return `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}>`;
  };
  const REF = [
    ['a', 'href'], ['area', 'href'], ['link', 'href'], ['script', 'src'], ['img', 'src'], ['img', 'srcset'],
    ['source', 'src'], ['source', 'srcset'], ['iframe', 'src'], ['video', 'src'], ['video', 'poster'], ['audio', 'src'],
    ['track', 'src'], ['embed', 'src'], ['object', 'data'], ['form', 'action'], ['use', 'href'], ['use', 'xlink:href'],
    ['image', 'href'], ['astro-island', 'component-url'], ['astro-island', 'renderer-url'], ['astro-island', 'before-hydration-url'],
  ];
  const refs = [];
  for (const [tag, attr] of REF) {
    for (const el of q(tag)) {
      if (!el.hasAttribute(attr)) continue;
      const raw = el.getAttribute(attr);
      if (tag === 'link' && /\b(preconnect|dns-prefetch)\b/.test(el.getAttribute('rel') || '')) continue;
      const vals = attr === 'srcset' ? raw.split(',').map((c) => c.trim().split(/\s+/)[0]).filter(Boolean) : [raw];
      for (const v of vals) refs.push({ tag, attr, value: v, rel: el.getAttribute('rel') || '', el: desc(el) });
    }
  }
  const metaRefresh = doc.querySelector('meta[http-equiv="refresh" i]');
  let refresh = null;
  if (metaRefresh) {
    const m = /url\s*=\s*['"]?([^'";]+)/i.exec(metaRefresh.getAttribute('content') || '');
    refresh = m ? m[1].trim() : '';
    if (refresh) refs.push({ tag: 'meta', attr: 'refresh', value: refresh, rel: '', el: '<meta http-equiv=refresh>' });
  }
  // D-030: the text may use → ↗ ← § · ▲ + − – … and the squares; any
  // other symbol (©, ™, ✓, ★, an emoji, another arrow) is a glyph the
  // inventory does not have. Code, formulae and scripts are not prose.
  const GLYPH = /[\p{So}\p{Extended_Pictographic}\u2190-\u21FF\u27F0-\u27FF\u2900-\u297F\u2B00-\u2BFF]/u;
  const GLYPH_OK = new Set(['→', '↗', '←', '▲', '■', '□', '▣', '▤', '⊡', '°']);
  const glyphs = [];
  const notProse = 'script, style, template, noscript, code, pre, kbd, samp, math';
  const walker = doc.body ? doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT) : null;
  const seenGlyph = new Set();
  const noteGlyphs = (text, where) => {
    for (const ch of text) {
      if (!GLYPH.test(ch) || GLYPH_OK.has(ch) || seenGlyph.has(ch + where)) continue;
      seenGlyph.add(ch + where);
      glyphs.push(`“${ch}” U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')} in ${where}`);
    }
  };
  for (let n = walker && walker.nextNode(); n; n = walker.nextNode()) {
    const host = n.parentElement;
    if (!host || host.closest(notProse)) continue;
    noteGlyphs(n.textContent || '', `${desc(host)} “${(n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 32)}”`);
  }
  for (const el of q('[aria-label], [title], [alt]')) for (const a of ['aria-label', 'title', 'alt']) if (el.hasAttribute(a)) noteGlyphs(el.getAttribute(a) || '', `${desc(el)} ${a}`);
  const firstScript = doc.head ? doc.head.querySelector('script') : null;
  const firstSheet = doc.head ? doc.head.querySelector('link[rel~="stylesheet"], style') : null;
  return {
    lang: doc.documentElement.getAttribute('lang') || '',
    title: doc.title || '',
    titleCount: q('title').length,
    description: q('meta[name="description" i]').map((m) => m.getAttribute('content') || ''),
    viewport: q('meta[name="viewport" i]').map((m) => m.getAttribute('content') || ''),
    themeColors: q('meta[name="theme-color" i]').map((m) => ({ media: m.getAttribute('media') || '', content: m.getAttribute('content') || '' })),
    refresh,
    canonical: (doc.querySelector('link[rel~="canonical"]') || { getAttribute: () => '' }).getAttribute('href') || '',
    alternates: q('link[rel~="alternate"][hreflang]').map((l) => ({ hreflang: (l.getAttribute('hreflang') || '').toLowerCase(), href: l.getAttribute('href') || '' })),
    refs,
    ids: Array.from(new Set([...q('[id]').map((e) => e.id), ...q('a[name]').map((e) => e.getAttribute('name'))])),
    scripts: q('script').map((s) => ({
      src: s.getAttribute('src') || '',
      type: (s.getAttribute('type') || '').trim().toLowerCase(),
      text: s.getAttribute('src') ? '' : s.textContent || '',
      inHead: !!s.closest('head'),
      firstInHead: s === firstScript,
      beforeSheets: !firstSheet || !!(s.compareDocumentPosition(firstSheet) & Node.DOCUMENT_POSITION_FOLLOWING),
    })),
    // where rule 1 allows a custom-property style: an evidence bar or chart
    // mark, anything inside an <svg>, anything inside a tool island
    styles: q('[style]').map((el) => ({ el: desc(el), value: el.getAttribute('style') || '', placed: el.matches('.ev-fill, .ev-mid, .mark, .swatch') || !!el.closest('svg, astro-island') })),
    glyphs,
    // the draft mark (StatusMark with the draft label sets data-draft)
    drafts: q('.status[data-state="in-build"][data-draft]').length,
    // code panels whose buttons need /scripts/code.js
    codeBlocks: q('.code .code-copy, .code .code-wrap').length,
  };
}

/* ================================================================
   L-01 … L-05 — in Node, over pageFacts output and the files on disk.
   ctx: { dir, site: URL|null, pages: Map<pagePath, facts>,
          pending?: Set<string>,    pages of the site map not built yet
                                    (tests/gates/pending-routes.json): a
                                    link to one is counted, not failed
          base?: string }           the build's base path ('' or '/repo'):
                                    URLs carry it, page paths and files do
                                    not; a local URL outside it fails L-01
   ================================================================ */

/** the page path a file serves: en/work/index.html → /en/work/ */
export function pagePathOf(rel) {
  const p = '/' + rel.split(sep).join('/');
  return p.endsWith('/index.html') ? p.slice(0, -'index.html'.length) : p;
}
const normPath = (p) => (p.endsWith('/index.html') ? p.slice(0, -'index.html'.length) : p);

/**
 * classify a reference: fragment | local | external | skip. `pagePath` and
 * the returned `path` are relative to the build root (no base); `base` is
 * the prefix every local URL must carry ('' at the root, '/repo' on a
 * project page): it is stripped, and a local URL without it is `outside`.
 */
export function classifyRef(value, pagePath, site, base = '') {
  const v = (value || '').trim();
  if (!v) return { kind: 'skip' };
  if (v.startsWith('#')) { let id = v.slice(1); try { id = decodeURIComponent(id); } catch { /* keep raw */ } return { kind: 'fragment', id }; }
  if (v.startsWith('//')) return { kind: 'external' };
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(v);
  if (scheme) {
    const s = scheme[1].toLowerCase();
    if (s === 'http' || s === 'https') {
      let u; try { u = new URL(v); } catch { return { kind: 'bad', why: 'unparseable URL' }; }
      if (site && u.origin === site.origin) return { ...unbase(u.pathname, base), hash: u.hash, site: true };
      return { kind: 'external' };
    }
    return { kind: 'skip', scheme: s }; // mailto:, tel:, data:, blob:, javascript:
  }
  let u; try { u = new URL(v, 'http://gates.local' + base + pagePath); } catch { return { kind: 'bad', why: 'unparseable URL' }; }
  return { ...unbase(u.pathname, base), hash: u.hash };
}

/** a URL path with the base stripped; one outside the base keeps its path and is flagged. @param {string} path @param {string} base */
function unbase(path, base) {
  if (!base) return { kind: 'local', path };
  if (path === base || path.startsWith(base + '/')) return { kind: 'local', path: path.slice(base.length) || '/' };
  return { kind: 'local', path, outside: true };
}

/** the file a local URL path resolves to, or null (dir → index.html) */
export function fileFor(dir, urlPath) {
  let p; try { p = decodeURIComponent(urlPath); } catch { p = urlPath; }
  const root = resolve(dir);
  const target = resolve(join(root, p));
  if (target !== root && !target.startsWith(root + sep)) return null;
  const st = (() => { try { return statSync(target); } catch { return null; } })();
  if (p.endsWith('/')) { const idx = join(target, 'index.html'); return existsSync(idx) ? idx : null; }
  if (st?.isFile()) return target;
  if (st?.isDirectory()) { const idx = join(target, 'index.html'); return existsSync(idx) ? idx : null; }
  return null;
}

const isToolPage = (p) => /^\/(en|de)\/tools\/[^/]+\/$/.test(p);

export function staticGates(pagePath, f, ctx) {
  const out = [];
  const site = ctx.site || null;
  const base = ctx.base || '';
  const redirect = f.refresh !== null;

  // L-01 · internal links resolve (href/src without a scheme, and absolute
  // URLs on the site's own origin); #fragments stripped; on-page #ids exist
  const lOff = [];
  let checked = 0;
  const pendingHits = new Set();
  const ids = new Set(f.ids);
  const seen = new Set();
  for (const r of f.refs) {
    const c = classifyRef(r.value, pagePath, site, base);
    if (c.kind === 'bad') { lOff.push(`${r.el} ${r.attr}="${r.value}" · ${c.why}`); continue; }
    if (c.kind === 'fragment') {
      checked++;
      if (c.id && c.id !== 'top' && !ids.has(c.id) && !seen.has('#' + c.id)) { seen.add('#' + c.id); lOff.push(`${r.el} ${r.attr}="${r.value}" · no element with id “${c.id}” on this page`); }
      continue;
    }
    if (c.kind !== 'local') continue;
    checked++;
    if (c.outside) { lOff.push(`${r.el} ${r.attr}="${r.value}" · outside the base path ${base}/`); continue; }
    if (seen.has(c.path)) continue;
    seen.add(c.path);
    if (fileFor(ctx.dir, c.path)) continue;
    if (ctx.pending && ctx.pending.has(c.path)) { pendingHits.add(c.path); continue; }
    lOff.push(`${r.el} ${r.attr}="${r.value}" · ${c.path} does not exist`);
  }
  const pendingNote = pendingHits.size ? ` (${pendingHits.size} to pending pages not built yet)` : '';
  out.push(result('L-01', lOff, checked, `${checked} internal references, all resolve${pendingNote}`, `%n internal references do not resolve${pendingNote}`, { pending: Array.from(pendingHits) }));

  // L-02 · hreflang: every /en/ and /de/ page (and any page that declares
  // alternates) carries its own language and x-default; its own-language
  // alternate is itself; a declared other-language alternate exists, has
  // that lang and points back. A page without a twin (a note written in
  // one language, a tag page; owner, 23 Oct 2026) declares no other-
  // language alternate, and its x-default is itself.
  const tree = /^\/(en|de)\//.exec(pagePath);
  if (redirect) out.push(skipped('L-02', 'redirect page'));
  else if (!tree && !f.alternates.length) out.push(skipped('L-02', 'not under /en/ or /de/ and declares no alternates'));
  else {
    const hOff = [];
    const own = tree ? tree[1] : (f.lang || '').slice(0, 2).toLowerCase();
    const other = own === 'de' ? 'en' : 'de';
    const localOf = (href) => { const c = classifyRef(href, pagePath, site, base); return c.kind === 'local' && !c.outside ? normPath(c.path) : null; };
    const by = {};
    for (const a of f.alternates) (by[a.hreflang] ||= []).push(a.href);
    for (const h of [own, other, 'x-default']) {
      if (!by[h]) { if (h !== other) hOff.push(`no hreflang="${h}" alternate`); }
      else if (by[h].length > 1) hOff.push(`${by[h].length} hreflang="${h}" alternates`);
    }
    for (const [h, hrefs] of Object.entries(by)) {
      for (const href of hrefs) {
        const p = localOf(href);
        if (!p) hOff.push(`hreflang="${h}" ${href} is not on this site${site ? ' (' + site.origin + ')' : ''}`);
        else if (!fileFor(ctx.dir, p)) hOff.push(`hreflang="${h}" ${href} does not exist`);
      }
    }
    if (by[own]?.[0] && localOf(by[own][0]) && localOf(by[own][0]) !== pagePath) hOff.push(`hreflang="${own}" points to ${localOf(by[own][0])}, not to this page`);
    if (f.lang && f.lang.slice(0, 2).toLowerCase() !== own) hOff.push(`<html lang="${f.lang}"> on a /${own}/ page`);
    const twinPath = by[other]?.[0] ? localOf(by[other][0]) : null;
    if (twinPath && fileFor(ctx.dir, twinPath)) {
      const twin = ctx.pages.get(twinPath);
      if (!twin) hOff.push(`hreflang="${other}" ${twinPath} is not a page in this build`);
      else {
        if ((twin.lang || '').slice(0, 2).toLowerCase() !== other) hOff.push(`${twinPath} has <html lang="${twin.lang}">, not ${other}`);
        const back = twin.alternates.filter((a) => a.hreflang === own).map((a) => { const c = classifyRef(a.href, twinPath, site, base); return c.kind === 'local' && !c.outside ? normPath(c.path) : a.href; });
        if (!back.length) hOff.push(`${twinPath} has no hreflang="${own}" alternate back`);
        else if (!back.includes(pagePath)) hOff.push(`${twinPath} hreflang="${own}" points to ${back[0]}, not back to ${pagePath}`);
      }
    }
    out.push(result('L-02', hOff, 3, `en, de, x-default present; ${other} twin ${twinPath || '—'} points back`, '%n hreflang problems'));
  }

  // L-03 · scripts policy: content pages carry only the inline pre-paint
  // script (first script in <head>, before the stylesheets), the inline
  // theme toggle (which also runs the contact pair's copy buttons) and /scripts/code.js; /tools/<name>/ pages may also carry
  // Astro island scripts. Non-JS script types (JSON, JSON-LD) are data.
  const sOff = [];
  const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module', 'text/ecmascript']);
  const kinds = { prepaint: 0, toggle: 0, code: 0, island: 0 };
  for (const s of f.scripts) {
    if (!JS_TYPES.has(s.type)) continue; // data block
    let kind;
    if (s.src) {
      const c = classifyRef(s.src, pagePath, site, base);
      if (c.kind === 'external') kind = 'external';
      else if (c.kind === 'local' && c.path === '/scripts/code.js') kind = 'code';
      else if (c.kind === 'local' && c.path.startsWith('/_astro/')) kind = 'island';
      else kind = 'other';
    } else if (/bk-theme/.test(s.text) && /dataset\.theme|data-theme/.test(s.text) && !/shell-theme/.test(s.text) && s.inHead && s.text.length <= 400) kind = 'prepaint';
    else if (/shell-theme/.test(s.text) && /bk-theme/.test(s.text)) kind = 'toggle';
    else if (/astro-island|astro:load|astro:idle|astro:visible|astro:only|self\.Astro|\(self\.Astro/.test(s.text)) kind = 'island';
    else kind = 'inline';
    const label = s.src ? `<script src="${s.src}">` : `inline <script> “${s.text.trim().slice(0, 48)}…” (${s.text.length} B)`;
    if (kind === 'external') sOff.push(`${label} · third-party script`);
    else if (kind === 'other' || kind === 'inline') sOff.push(`${label} · not one of the permitted scripts`);
    else if (kind === 'island' && !isToolPage(pagePath)) sOff.push(`${label} · island script outside /tools/<name>/`);
    else {
      kinds[kind]++;
      if (kind !== 'island' && kinds[kind] > 1) sOff.push(`${label} · second ${kind} script`);
      if (kind === 'prepaint' && !(s.firstInHead && s.beforeSheets)) sOff.push(`pre-paint script is not the first script in <head> before the stylesheets`);
    }
  }
  // every page, the redirect stub included: a stored dark choice must
  // hold from the first frame (D-024)
  if (!kinds.prepaint) sOff.push('no inline pre-paint theme script in <head> (D-024)');
  // code.js exactly where a code panel needs it: without it the Copy and
  // Wrap buttons the build rendered do nothing; without a panel it is a
  // script the page does not need (rule 5)
  const panels = f.codeBlocks || 0;
  if (panels && !kinds.code) sOff.push(`${panels} code-panel button${panels === 1 ? '' : 's'} but no /scripts/code.js: they do nothing (pass hasCode to Base)`);
  if (!panels && kinds.code) sOff.push('/scripts/code.js on a page without a code panel');
  out.push(result('L-03', sOff, f.scripts.length, `${f.scripts.length} scripts: ${Object.entries(kinds).filter(([, n]) => n).map(([k, n]) => (n > 1 ? n + ' ' : '') + k).join(', ') || 'none'}`, '%n script policy problems'));

  // L-04 · no inline style attributes except custom-property-only values,
  // and those only where rule 1 allows them: on .ev-fill / .ev-mid, a chart
  // mark (.mark, .swatch, inside an <svg>) or inside a tool island.
  // Nothing is exempt: mathematics is native MathML (21 Oct 2026), so
  // KaTeX's styled HTML layer no longer reaches a page.
  const stOff = [];
  for (const s of f.styles) {
    const decls = s.value.split(';').map((d) => d.trim()).filter(Boolean);
    const bad = decls.filter((d) => !/^--[\w-]+\s*:/.test(d));
    if (bad.length) stOff.push(`${s.el} style="${s.value.slice(0, 60)}" · sets ${bad.map((d) => d.split(':')[0].trim()).join(', ')}`);
    else if (s.placed === false) stOff.push(`${s.el} style="${s.value.slice(0, 60)}" · custom properties outside an evidence bar, a chart mark or a tool island`);
  }
  out.push(result('L-04', stOff, f.styles.length, `${f.styles.length} style attributes, custom properties only, on bars, marks or in islands`, '%n inline style attributes break rule 1'));

  // L-05 · head metadata: title, description, lang, two theme-colors, viewport
  // (a redirect stub needs lang, title and viewport only)
  const mOff = [];
  if (!f.lang) mOff.push('no <html lang>');
  if (!f.title.trim()) mOff.push('no <title>');
  else if (f.titleCount > 1) mOff.push(`${f.titleCount} <title> elements`);
  if (!f.viewport.length) mOff.push('no <meta name="viewport">');
  else if (!/width\s*=\s*device-width/.test(f.viewport[0])) mOff.push(`viewport “${f.viewport[0]}” lacks width=device-width`);
  if (!redirect) {
    if (!f.description.length || !f.description[0].trim()) mOff.push('no <meta name="description">');
    else if (f.description.length > 1) mOff.push(`${f.description.length} meta descriptions`);
    const tc = f.themeColors.filter((t) => t.content.trim());
    if (tc.length !== 2) mOff.push(`${tc.length} <meta name="theme-color"> (two expected, light and dark)`);
    else if (!(tc.some((t) => /light/.test(t.media)) && tc.some((t) => /dark/.test(t.media)))) mOff.push('theme-color metas lack the light and dark media queries');
  }
  out.push(result('L-05', mOff, redirect ? 3 : 5, redirect ? 'redirect stub: lang, title, viewport present' : 'title, description, lang, two theme-colors, viewport present', '%n head metadata problems'));

  // L-06 · glyph inventory (D-030, BUILD-BRIEF rule 3): no symbol in the
  // text (or in aria-label, title, alt) beyond → ↗ ← ▲ and the squares;
  // punctuation (§ · + − – …) and the degree sign are not symbols
  const gl = f.glyphs || [];
  out.push(result('L-06', gl, 1, 'no symbol outside the D-030 inventory', '%n symbols outside the D-030 inventory'));

  // L-07 · draft mark: every page in a draft language (--draft-langs,
  // DRAFT_LANGS in src/lib/i18n.ts) shows the in-build mark with the draft
  // label (D-011; HANDOFF item 25: drafts show their status in the page)
  const draftLangs = ctx.draftLangs || [];
  const pageLang = (f.lang || '').slice(0, 2).toLowerCase();
  if (redirect) out.push(skipped('L-07', 'redirect page'));
  else if (!draftLangs.includes(pageLang)) out.push(skipped('L-07', pageLang ? `lang ${pageLang} is not a draft language` : 'no lang'));
  else out.push(result('L-07', f.drafts ? [] : [`no draft mark (.status[data-state="in-build"][data-draft]) on a page in ${pageLang}`], 1, `the draft mark is shown (${f.drafts})`, 'the page is a draft and does not say so'));

  return out;
}

/* ================================================================
   A-01 · axe-core, WCAG 2.0 A/AA + 2.1 AA, zero violations
   ================================================================ */
export async function axeGate(page, AxeBuilder) {
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const offenders = r.violations.map((v) => `${v.id} (${v.impact}) · ${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'} · ${(v.nodes[0]?.target || []).join(' ')} · ${v.help}`);
  return result('A-01', offenders, r.passes.length + r.violations.length, `${r.passes.length} rules pass, no violations`, '%n axe rules violated');
}
