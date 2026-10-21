#!/usr/bin/env node
/* ============================================================
   lint:style — no inline style attributes (BUILD-BRIEF §6 rule 1)
   No dependencies. Scans src/**/*.{astro,tsx,ts,md,mdx,mjs,js} and, when it
   exists, dist/**/*.html (or the folder given as --dist <dir>). Fails on
   every style= / style={ occurrence except an attribute whose value
   consists only of custom-property declarations — the ONE permitted form:
     style="--w: 40%; --x: 0%"       (.ev-fill / .ev-mid / chart marks)
     style={`--w: ${w}%`}            (the same, computed)
     style={{ '--w': w }}            (Preact islands only)
   Built HTML: the subtree <span class="katex-html" aria-hidden="true"> is
   KaTeX's own layout (struts and vlists, generated, hidden from assistive
   technology; the MathML beside it is the accessible tree) and is exempt;
   everything else in the page, including every code block and table, must
   be clean. Exits 1 and prints file:line for each offender.
   ============================================================ */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const rel = (p) => relative(root, p);
const args = process.argv.slice(2);
const distArg = args.indexOf('--dist');
const DIST = distArg >= 0 && args[distArg + 1] ? resolve(args[distArg + 1]) : join(root, 'dist');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const SRC_EXT = new Set(['.astro', '.tsx', '.ts', '.md', '.mdx', '.mjs', '.js']);
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

/* every style attribute: style="…", style='…', style={…} (one level of nested braces) */
const STYLE = /\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|\{((?:[^{}]|\{[^{}]*\})*)\})/g;
/* a value made only of custom-property declarations (template placeholders allowed inside values) */
const CUSTOM_ONLY = /^\s*(?:--[\w-]+\s*:\s*[^;]*;?\s*)+$/;

function permitted(str, obj) {
  if (str != null) return CUSTOM_ONLY.test(str);
  if (obj == null) return false;
  const v = obj.trim();
  // a template or plain string inside the braces
  const s = /^`([\s\S]*)`$/.exec(v) || /^"([^"]*)"$/.exec(v) || /^'([^']*)'$/.exec(v);
  if (s) return CUSTOM_ONLY.test(s[1].replace(/\$\{[^}]*\}/g, 'x'));
  // an object literal: every key must be a custom property
  const inner = /^\{([\s\S]*)\}$/.exec(v);
  if (!inner) return false;
  const keys = [...inner[1].matchAll(/(?:^|[,{]\s*)(?:'([^']+)'|"([^"]+)"|([\w-]+))\s*:/g)].map((m) => m[1] ?? m[2] ?? m[3]);
  return keys.length > 0 && keys.every((k) => k.startsWith('--'));
}

/* ranges of KaTeX's HTML layer in a built page: <span class="katex-html" …> … its closing </span> */
function katexRanges(html) {
  const ranges = [];
  const tag = /<span\b[^>]*>|<\/span>/g;
  let depth = 0, start = -1;
  for (const m of html.matchAll(tag)) {
    if (m[0][1] === '/') { if (depth > 0 && --depth === 0) { ranges.push([start, m.index + m[0].length]); start = -1; } continue; }
    if (depth > 0) depth++;
    else if (/class="[^"]*\bkatex-html\b/.test(m[0])) { depth = 1; start = m.index; }
  }
  return ranges;
}
const inRanges = (ranges, i) => ranges.some(([a, b]) => i >= a && i < b);

const failures = [];
let checked = 0;
function scan(file, html) {
  const text = readFileSync(file, 'utf8');
  const ranges = html ? katexRanges(text) : [];
  checked++;
  for (const m of text.matchAll(STYLE)) {
    if (permitted(m[1] ?? m[2], m[3])) continue;
    if (html && inRanges(ranges, m.index)) continue;
    failures.push(`${rel(file)}:${lineOf(text, m.index)} · ${m[0].slice(0, 80).replace(/\s+/g, ' ')}`);
  }
}

for (const p of walk(join(root, 'src')).filter((p) => SRC_EXT.has(extname(p)))) scan(p, false);
const distFiles = existsSync(DIST) ? walk(DIST).filter((p) => extname(p) === '.html') : [];
for (const p of distFiles) scan(p, true);

if (failures.length) {
  for (const f of failures) console.error(`FAIL · inline style · ${f}`);
  console.error(`\nlint:style failed · ${failures.length} inline style attribute${failures.length === 1 ? '' : 's'} (only custom-property declarations are allowed, e.g. style="--w: 40%").`);
  process.exit(1);
}
console.log(`lint:style passed · ${checked} files checked (${checked - distFiles.length} source, ${distFiles.length} built page${distFiles.length === 1 ? '' : 's'}${existsSync(DIST) ? ` in ${rel(DIST) || DIST}` : ', no dist'}).`);
