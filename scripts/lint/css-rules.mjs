#!/usr/bin/env node
/* ============================================================
   lint:css — design-system rules (BUILD-BRIEF §6 rules 2 and 4, §8 A)
   No dependencies. Exits 1 with a message when:
     1. a hex colour appears in any design-system/*.css other than
        tokens.css, or anywhere under src/ (theme-color metas included:
        src/lib/theme.ts reads them out of tokens.css);
     2. a font-size below 12px (px) or 0.75rem appears in a stylesheet,
        a component or an SVG attribute; or a relative size below 1em /
        100% / `smaller` / `x-small` that is not held on the floor by
        max(12px, …) or clamp(12px, …): an em follows its context (a 12px
        table head, a 13px mono cell), so 0.75em there is 9px;
     3. a class of the class contract (BUILD-BRIEF §5) is missing from
        the stylesheets (the bench set is Agent D's: a warning while
        bench.css does not exist, a failure once it does); or a stylesheet
        defines a class that neither the contract nor design-system/
        README.md ("Sub-classes the patterns use") names: "use those
        names, do not coin others" (§5) holds only while the list is whole;
     4. a token pair of the contrast table falls below its threshold.
   It always prints the contrast table (WCAG 2 ratios computed from the
   hex values it parses out of tokens.css), light and dark.
   ============================================================ */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const DS = join(root, 'design-system');
const SRC = join(root, 'src');
const rel = p => relative(root, p);

const failures = [];
const warnings = [];

/* ---------- helpers ---------- */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.astro' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const TEXT = new Set(['.astro', '.css', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.mdx', '.json', '.html', '.svg', '.yaml', '.yml', '.txt']);
const blank = m => m.replace(/[^\n]/g, ' ');            // keep line numbers
function stripComments(text, ext) {
  let t = text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/<!--[\s\S]*?-->/g, blank);
  if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.astro'].includes(ext)) t = t.replace(/(^|[^:'"\\])\/\/[^\n]*/g, (m, pre) => pre + blank(m.slice(pre.length)));
  return t;
}
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

/* ---------- 1 · hex colours ---------- */
const HEX = /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const hexTargets = [
  ...walk(DS).filter(p => extname(p) === '.css' && basename(p) !== 'tokens.css'),
  ...walk(SRC).filter(p => TEXT.has(extname(p))),
];
for (const p of hexTargets) {
  const raw = readFileSync(p, 'utf8');
  const text = stripComments(raw, extname(p));
  for (const m of text.matchAll(HEX)) {
    const ln = lineOf(text, m.index);
    // no exemption: the theme-color metas read --surface from tokens.css
    // at build time (src/lib/theme.ts), so no hex is copied into src/
    failures.push(`hex colour outside tokens.css · ${rel(p)}:${ln} · ${m[0]} (use a var(--…) from design-system/tokens.css)`);
  }
}

/* ---------- 2 · the 12px floor ---------- */
const floorTargets = [
  ...walk(DS).filter(p => extname(p) === '.css'),
  ...walk(SRC).filter(p => ['.css', '.astro', '.tsx', '.jsx', '.html', '.svg', '.mdx', '.md'].includes(extname(p))),
];
const FONT_DECL = /\bfont(?:-size)?\s*:\s*([^;{}]+)/gi;          // font-size: … and the font: shorthand
const SIZE = /(\d*\.?\d+)(px|rem)(?![\w-])/g;
const REL = /(?<![\w.-])(\d*\.?\d+)(em|%)(?![\w-])/g;
const SVG_ATTR = /\bfont-size\s*=\s*["']?(\d*\.?\d+)(px|rem)?["']?/gi;
for (const p of floorTargets) {
  const text = stripComments(readFileSync(p, 'utf8'), extname(p));
  for (const d of text.matchAll(FONT_DECL)) {
    for (const s of d[1].matchAll(SIZE)) {
      const v = parseFloat(s[1]);
      if ((s[2] === 'px' && v < 12) || (s[2] === 'rem' && v < 0.75)) failures.push(`font size below the 12px floor · ${rel(p)}:${lineOf(text, d.index)} · ${s[0]} in "${d[0].trim().slice(0, 60)}"`);
    }
  }
  for (const d of text.matchAll(FONT_DECL)) {
    // the size of a `font:` shorthand comes before the "/" of the line height
    const isShorthand = !/^font-size/i.test(d[0]);
    const value = isShorthand ? d[1].split('/')[0] : d[1];
    if (/\b(?:max|clamp)\(\s*(?:12px|0?\.75rem)/i.test(value)) continue;
    const small = [...value.matchAll(REL)].filter((s) => parseFloat(s[1]) < (s[2] === '%' ? 100 : 1));
    if (/(?:^|\s)(?:smaller|x-small|xx-small)\b/i.test(value)) small.push(['smaller']);
    for (const s of small) failures.push(`relative font size can fall below the 12px floor · ${rel(p)}:${lineOf(text, d.index)} · ${s[0]} in "${d[0].trim().slice(0, 60)}" (write max(12px, ${s[0]}))`);
  }
  for (const a of text.matchAll(SVG_ATTR)) {
    const v = parseFloat(a[1]);
    if ((!a[2] || a[2] === 'px') && v < 12) failures.push(`SVG font-size below the 12px floor · ${rel(p)}:${lineOf(text, a.index)} · ${a[0]}`);
    if (a[2] === 'rem' && v < 0.75) failures.push(`SVG font-size below the 12px floor · ${rel(p)}:${lineOf(text, a.index)} · ${a[0]}`);
  }
}

/* ---------- 3 · the class contract (BUILD-BRIEF §5) ---------- */
const CONTRACT = {
  layout: ['grid-container', 'page-grid', 'grid', ...Array.from({ length: 12 }, (_, i) => `col-${i + 1}`), ...Array.from({ length: 12 }, (_, i) => `col-start-${i + 1}`), 'section', 'rule-t', 'rule-strong', 'vrule', 'skip'],
  type: ['display', 'label', 'index', 'prose'],
  shell: ['shell', 'shell-bar', 'shell-mark', 'shell-doors', 'door', 'door-code', 'door-label', 'shell-cluster', 'shell-lang', 'shell-theme'],
  listing: ['listing', 'listing-head', 'listing-row', 'lr-index', 'lr-title', 'lr-title-main', 'lr-title-sub', 'lr-meta', 'lr-trail', 'lr-code', 'lr-mono', 'lr-dim', 'lr-year', 'lr-arrow'],
  status: ['status'],
  document: ['doc', 'doc-opener', 'doc-trail', 'doc-lead', 'doc-meta', 'doc-end', 'glyph', 'table-scroll', 'fig', 'fig-label', 'fig-title', 'fig-source', 'code', 'code-bar', 'code-copy', 'code-wrap', 'math', 'eq-no', 'footnotes', 'callout', 'callout-title', 'callout-content', 'cta'],
  site: ['cover', 'cover-rail', 'cover-body', 'section-heading', 'metric-strip', 'toc', 'evidence', 'ev-bars', 'ev-bar', 'ev-track', 'ev-fill', 'ev-mid'],
  bench: ['bench', 'bench-head', 'bench-controls', 'bench-output', 'bench-verdict', 'bench-kpis', 'bench-limit', 'segmented', 'range', 'button'],
};
const STATES = ['complete', 'functional', 'under-revision', 'in-build', 'archived'];
const CALLOUTS = ['note', 'aside', 'warning', 'tool', 'summary', 'definition', 'quote', 'spec', 'metrics', 'faq', 'bookmark', 'cta'];

const dsFiles = walk(DS).filter(p => extname(p) === '.css');
const css = dsFiles.map(p => stripComments(readFileSync(p, 'utf8'), '.css')).join('\n');
const selectorsOnly = css.replace(/\{[^{}]*\}/g, '{}');           // declarations out, so "color: …" text cannot fake a class
const hasClass = c => new RegExp(`\\.${c.replace(/[-]/g, '\\-')}(?![\\w-])`).test(selectorsOnly);
const benchPresent = existsSync(join(DS, 'bench.css'));
for (const [group, classes] of Object.entries(CONTRACT)) {
  for (const c of classes) {
    if (hasClass(c)) continue;
    if (group === 'bench' && !benchPresent) warnings.push(`contract class .${c} pending: design-system/bench.css (Agent D) does not exist yet`);
    else failures.push(`contract class .${c} (${group}) is missing from design-system/*.css`);
  }
}
// every class a stylesheet defines is named in the contract or the README
// (ranges as the documents write them: .col-1…12, .col-start-N, .cat-1…5)
{
  const docs = ['BUILD-BRIEF.md', 'design-system/README.md'].map((f) => existsSync(join(root, f)) ? readFileSync(join(root, f), 'utf8') : '').join('\n');
  const named = new Set([...docs.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
  const ranges = [...docs.matchAll(/\.([a-z][\w-]*-)(\d+)\s*…\s*(?:\.\1)?(\d+)/g)].map((m) => [m[1], +m[2], +m[3]]);
  const families = [...docs.matchAll(/\.([a-z][\w-]*-)N\b/g)].map((m) => m[1]);
  const isNamed = (c) => {
    if (named.has(c)) return true;
    const m = /^(.*-)(\d+)$/.exec(c);
    return !!m && (families.includes(m[1]) || ranges.some(([p, a, b]) => p === m[1] && +m[2] >= a && +m[2] <= b));
  };
  for (const p of dsFiles.filter((f) => basename(f) !== 'obsidian-snippet.css')) {
    const sel = stripComments(readFileSync(p, 'utf8'), '.css').replace(/\{[^{}]*\}/g, '{}');
    const coined = new Set([...sel.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]).filter((c) => !isNamed(c)));
    for (const c of coined) failures.push(`class .${c} in ${rel(p)} is named in neither BUILD-BRIEF §5 nor design-system/README.md (list it under "Sub-classes the patterns use", or use a listed name)`);
  }
}
for (const s of STATES) if (!new RegExp(`\\.status\\[data-state=["']${s}["']\\]`).test(selectorsOnly) && s !== 'complete') failures.push(`status state "${s}" has no .status[data-state="${s}"] rule`);
for (const k of CALLOUTS) if (!new RegExp(`\\[data-callout=["']${k}["']\\]`).test(selectorsOnly) && k !== 'faq') failures.push(`callout kind "${k}" has no [data-callout="${k}"] rule`);
if (!/details\.callout/.test(selectorsOnly)) failures.push('callout kind "faq" has no details.callout rule');
if (!/@media\s*\(\s*prefers-reduced-motion/.test(css)) failures.push('no @media (prefers-reduced-motion) rule in design-system/*.css (gate G-11)');
if (!/@font-face[^{]*\{[^}]*BKribitz Mono/.test(css) || !/@font-face[^{]*\{[^}]*'BKribitz'/.test(css)) failures.push('tokens.css does not declare the BKribitz faces (gate G-12)');
if (/Söhne|Sohne/.test(css)) failures.push('a Söhne alias survives in design-system/*.css (v2 has no alias)');
if (/border-radius\s*:\s*(?!0\b)[1-9]/.test(css)) failures.push('a border-radius above 0 appears in design-system/*.css (gate G-07)');
if (/box-shadow\s*:\s*(?!none)/.test(css.replace(/box-shadow\s*:\s*none/g, '')) || /gradient\(/.test(css)) failures.push('a box-shadow or gradient appears in design-system/*.css (gate G-08)');

/* ---------- 4 · the contrast table, from tokens.css ---------- */
const tokensText = stripComments(readFileSync(join(DS, 'tokens.css'), 'utf8'), '.css');
function block(startRe) {
  const m = tokensText.match(startRe);
  if (!m) return '';
  const from = tokensText.indexOf('{', m.index) + 1;
  let depth = 1, i = from;
  for (; i < tokensText.length && depth; i++) { if (tokensText[i] === '{') depth++; else if (tokensText[i] === '}') depth--; }
  return tokensText.slice(from, i - 1);
}
function readMap(text, base = {}) {
  const map = { ...base };
  for (const m of text.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) map[m[1]] = m[2].trim();
  const resolve = (v, depth = 0) => {
    const r = v.match(/^var\(--([\w-]+)\)$/);
    if (r && depth < 8 && map[r[1]] !== undefined) return resolve(map[r[1]], depth + 1);
    return v;
  };
  for (const k of Object.keys(map)) map[k] = resolve(map[k]);
  return map;
}
const light = readMap(block(/(^|\n)\s*:root\s*\{/));
const dark = readMap(block(/:root\[data-theme="dark"\]\s*,\s*\.dark\s*\{/), light);
const darkMedia = readMap(block(/:root:not\(\[data-theme="light"\]\)\s*\{/), light);
if (!light.surface || !dark.surface) failures.push('could not parse the light or dark token block out of tokens.css');
// the two dark copies must be identical (D-024)
for (const k of new Set([...Object.keys(dark), ...Object.keys(darkMedia)])) {
  if (dark[k] !== darkMedia[k]) failures.push(`dark token --${k} differs between the two dark copies (${dark[k]} vs ${darkMedia[k]})`);
}

const hexToRgb = h => { const s = h.replace('#', ''); const f = s.length === 3 ? s.split('').map(c => c + c).join('') : s; return [0, 2, 4].map(i => parseInt(f.slice(i, i + 2), 16) / 255); };
const lin = c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = h => { const [r, g, b] = hexToRgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

const PAIRS = [
  ['ink', 'surface', 4.5, 'text'],
  ['ink-2', 'surface', 4.5, 'text'],
  ['ink-3', 'surface', 4.5, 'text'],
  ['ink-2', 'surface-2', 4.5, 'text'],
  ['accent-01', 'surface', 4.5, 'text · the one earned figure (D-025)'],
  ['accent-01', 'surface-3', 3, 'mark · never text on dark surface-3 (D-025)'],
  ['var-pos', 'surface', 3, 'mark'],
  ['var-neg', 'surface', 3, 'mark'],
  ['mid', 'surface', null, 'decorative · hairlines only, never text (D-007)'],
];
const rows = [];
for (const [theme, map] of [['light', light], ['dark', dark]]) {
  for (const [fg, bg, need, role] of PAIRS) {
    const a = map[fg], b = map[bg];
    if (!/^#/.test(a || '') || !/^#/.test(b || '')) { failures.push(`contrast table: --${fg} or --${bg} is not a hex in the ${theme} block`); continue; }
    const r = contrast(a, b);
    const verdict = need === null ? 'decorative' : r >= need ? 'pass' : 'FAIL';
    if (verdict === 'FAIL') failures.push(`contrast ${theme} --${fg} on --${bg} is ${r.toFixed(2)}:1, below ${need}:1 (${role})`);
    rows.push([theme, `--${fg}`, a, `--${bg}`, b, `${r.toFixed(2)}:1`, need === null ? '—' : `${need}:1`, verdict, role]);
  }
}
const head = ['theme', 'fg', 'hex', 'bg', 'hex', 'ratio', 'needs', 'verdict', 'role'];
const widths = head.map((h, i) => Math.max(h.length, ...rows.map(r => String(r[i]).length)));
const line = r => r.map((c, i) => String(c).padEnd(widths[i])).join('  ');
console.log('\nContrast table (WCAG 2, computed from design-system/tokens.css)');
console.log(line(head));
console.log(widths.map(w => '-'.repeat(w)).join('  '));
for (const r of rows) console.log(line(r));

/* ---------- report ---------- */
console.log('');
for (const w of warnings) console.log(`warning · ${w}`);
if (failures.length) {
  for (const f of failures) console.error(`FAIL · ${f}`);
  console.error(`\nlint:css failed with ${failures.length} problem${failures.length === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(`lint:css passed · ${hexTargets.length} files checked for hex, ${floorTargets.length} for the 12px floor, ${dsFiles.length} stylesheets for the class contract${warnings.length ? ` · ${warnings.length} warning${warnings.length === 1 ? '' : 's'}` : ''}.`);
