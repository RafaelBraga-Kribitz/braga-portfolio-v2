// src/lib/math-fit.mjs — display formulas that fit their column without a
// horizontal scrollbar (owner, 30 Oct 2026: the site never scrolls
// sideways). MathML neither wraps nor shrinks, so the build breaks a long
// formula itself:
//
//   breakVariants(tex)   the formula as written, then broken before each
//                        top-level relation (=, ≤, ≈ …) and separator
//                        (\quad, \qquad), aligned on the relations; then
//                        also before top-level + and − where a line still
//                        runs long. Nothing inside braces, \left…\right or
//                        an environment is ever split.
//   mathWidth(node)      the width, in em, of a KaTeX MathML tree: a model
//                        of how the browser sets it (glyph widths, operator
//                        spacing, script sizes), calibrated against
//                        Chromium's own measure of every display formula of
//                        the site (1,947 formulas, 30 Oct 2026: the estimate
//                        runs 9% wide at the median, and the measure stays
//                        under 1.2 × the estimate for every formula wider
//                        than 12em; FIT_MARGIN).
//
// src/lib/rehype/katex.mjs renders every variant and marks each with the
// container widths it is shown at (data-from, data-to, from FIT_STEPS);
// components.css shows exactly one per width through container queries:
// the least broken one that fits. No script runs on the page.

/** Container widths (px) at which the shown variant may change: the queries in components.css. */
export const FIT_STEPS = [160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760, 800, 880, 960, 1040];

/** Font size of display maths, px (components.css: .math math is 1.2em of 16px). */
export const MATH_PX = 19.2;

/** Headroom over the estimate: the widest miss on the site's 586 formulas over
    12em was 1.19 × the estimate (p99 1.09), and a reader's maths font may be
    a little wider than Chromium's. */
export const FIT_MARGIN = 1.2;

/* ---------- the width model ---------- */

const RELATIONS = new Set(['=', '<', '>', '≤', '≥', '≈', '≠', '≡', '∼', '≃', '≅', '∝', '→', '←', '⇒', '⇐', '⇔', '↔', '⟹', '⟸', '⟺', '∈', '∉', '⊂', '⊆', '⊃', '⊇', '∣', ':=', '≔', '⊥', '∥', '≪', '≫', '⪯', '⪰', '≺', '≻', '↦']);
const BINARY = new Set(['+', '−', '-', '×', '·', '⋅', '±', '∓', '∗', '∘', '÷', '∪', '∩', '∧', '∨', '⊕', '⊗', '\\', '∖']);
const LARGE = new Set(['∑', '∏', '∫', '∬', '∭', '∮', '⋃', '⋂', '⨁', '⨂', '∐']);
const PUNCT = new Set([',', ';']);

/** Average advance of one character, em, by element and script. */
const glyph = (/** @type {string} */ ch, /** @type {string} */ tag) => {
  if (/[0-9]/.test(ch)) return 0.5;
  if (/[A-Z]/.test(ch)) return tag === 'mtext' ? 0.66 : 0.68;
  if (/[a-z]/.test(ch)) return tag === 'mtext' ? 0.47 : 0.52;
  if (/[α-ωΑ-Ω]/.test(ch)) return 0.58;
  if (ch === ' ' || ch === ' ') return 0.27;
  if (/[.,;:'!|]/.test(ch)) return 0.28;
  if (/[()[\]{}⟨⟩⌊⌋⌈⌉]/.test(ch)) return 0.39;
  if (LARGE.has(ch)) return 1.05;
  return 0.78;
};

const textOf = (/** @type {any} */ n) => (n.type === 'text' ? n.value : (n.children || []).map(textOf).join(''));
const kids = (/** @type {any} */ n) => (n.children || []).filter((c) => c.type === 'element');
const attr = (/** @type {any} */ n, /** @type {string} */ k) => (n.properties ? n.properties[k] : undefined);

/** Parses a MathML length (em, ex, px, mu or a bare number) into em. @param {any} v */
function emOf(v) {
  const m = /^(-?[\d.]+)\s*(em|ex|px|mu)?$/.exec(String(v ?? '').trim());
  if (!m) return 0;
  const x = Number(m[1]);
  return m[2] === 'ex' ? x * 0.43 : m[2] === 'px' ? x / MATH_PX : m[2] === 'mu' ? x / 18 : x;
}

/**
 * The width of a MathML element, in em of the formula's own font size.
 * @param {any} n  a hast element (KaTeX's MathML)
 * @param {{ scale?: number, display?: boolean }} [s]
 * @returns {number}
 */
export function mathWidth(n, s = {}) {
  const scale = s.scale ?? 1;
  const display = s.display ?? (n.tagName === 'math' && attr(n, 'display') === 'block');
  const sub = (/** @type {any} */ c, f = 0.71, d = false) => mathWidth(c, { scale: Math.max(scale * f, 0.5), display: d });
  const same = (/** @type {any} */ c) => mathWidth(c, { scale, display });
  const sum = (/** @type {any[]} */ cs) => cs.reduce((w, c) => w + same(c), 0);
  const k = kids(n);
  switch (n.tagName) {
    case 'annotation': case 'annotation-xml': return 0;
    case 'mi': case 'mn': case 'mtext': case 'ms': {
      const t = textOf(n);
      return scale * [...t].reduce((w, ch) => w + glyph(ch, n.tagName), 0);
    }
    case 'mo': {
      const t = textOf(n).trim();
      const core = [...t].reduce((w, ch) => w + glyph(ch, 'mo'), 0);
      if (attr(n, 'stretchy') === 'true' || attr(n, 'fence') === 'true') return scale * 0.42;
      const big = LARGE.has(t) ? (display ? 0.4 : 0) : 0;
      // operator spacing shrinks away in scripts
      const space = scale < 0.9 ? 0 : RELATIONS.has(t) ? 0.556 : BINARY.has(t) ? 0.444 : PUNCT.has(t) ? 0.167 : LARGE.has(t) ? 0.167 : 0;
      return scale * (core + big + space);
    }
    case 'mspace': return scale * emOf(attr(n, 'width'));
    case 'mpadded': return sum(k) + scale * emOf(attr(n, 'lspace'));
    case 'mfrac': {
      const f = display ? 1 : 0.71;
      return Math.max(sub(k[0], f), sub(k[1], f)) + scale * 0.24;
    }
    case 'msqrt': return sum(k) + scale * 0.9;
    case 'mroot': return same(k[0]) + sub(k[1], 0.5) + scale * 0.9;
    case 'msub': case 'msup': return same(k[0]) + sub(k[1]) + scale * 0.05;
    case 'msubsup': return same(k[0]) + Math.max(sub(k[1]), sub(k[2])) + scale * 0.05;
    case 'munder': case 'mover': case 'munderover': {
      const base = same(k[0]);
      const marks = k.slice(1).map((c) => sub(c));
      // a large operator's limits sit beside it in text style
      const isLarge = LARGE.has(textOf(k[0]).trim());
      if (isLarge && !display) return base + Math.max(0, ...marks) + scale * 0.05;
      return Math.max(base, ...marks);
    }
    case 'mtable': {
      // columnspacing lists the gap after each column (KaTeX: 1em for a
      // matrix, 0em 2em … for aligned), repeating its last value
      const gaps = String(attr(n, 'columnspacing') ?? '0.8em').trim().split(/\s+/).map(emOf);
      const gap = (/** @type {number} */ i) => gaps[Math.min(i, gaps.length - 1)];
      const rows = k.filter((r) => r.tagName === 'mtr' || r.tagName === 'mlabeledtr');
      const cols = Math.max(0, ...rows.map((r) => kids(r).length));
      const colW = Array.from({ length: cols }, (_, c) => Math.max(0, ...rows.map((r) => (kids(r)[c] ? same(kids(r)[c]) : 0))));
      return colW.reduce((w, cw, c) => w + cw + (c < cols - 1 ? scale * gap(c) : 0), 0);
    }
    case 'mstyle': {
      const ds = attr(n, 'displaystyle');
      const lvl = attr(n, 'scriptlevel');
      const f = lvl !== undefined && Number(lvl) > 0 ? 0.71 ** Number(lvl) : 1;
      return k.reduce((w, c) => w + mathWidth(c, { scale: scale * f, display: ds === undefined ? display : ds === 'true' }), 0);
    }
    case 'mphantom': case 'mrow': case 'semantics': case 'math': case 'mtd': case 'menclose': case 'merror':
    default: return sum(k);
  }
}

/* ---------- breaking the TeX ---------- */

const REL_TOKENS = ['=', '<', '>', '\\le', '\\leq', '\\ge', '\\geq', '\\approx', '\\ne', '\\neq', '\\equiv', '\\sim', '\\simeq', '\\cong', '\\propto', '\\Rightarrow', '\\Leftarrow', '\\Leftrightarrow', '\\iff', '\\implies', '\\impliedby', '\\to', '\\leftarrow', '\\rightarrow', '\\mapsto', '\\in', '\\notin', '\\subset', '\\subseteq', '\\supset', '\\supseteq', '\\coloneqq', '\\ll', '\\gg', '\\preceq', '\\succeq'];
const SEP_TOKENS = ['\\quad', '\\qquad'];
const BIN_TOKENS = ['+', '-', '\\pm', '\\mp', '\\times', '\\cdot'];

/**
 * Splits TeX into top-level tokens: a group in braces, a \left…\right span,
 * an environment or a \command (with its own braced arguments kept with the
 * groups that follow it) stays one piece. Returns [text, depth0] pieces.
 * @param {string} tex
 * @returns {{ t: string, top: boolean }[]}
 */
function tokens(tex) {
  const out = [];
  let i = 0;
  while (i < tex.length) {
    const ch = tex[i];
    if (ch === '{') {
      let d = 0; let j = i;
      for (; j < tex.length; j++) { if (tex[j] === '\\') { j++; continue; } if (tex[j] === '{') d++; else if (tex[j] === '}' && --d === 0) break; }
      out.push({ t: tex.slice(i, j + 1), top: false }); i = j + 1; continue;
    }
    if (ch === '\\') {
      const m = /^\\([A-Za-z]+|.)/.exec(tex.slice(i));
      const name = m ? m[0] : '\\';
      if (name === '\\left' || name === '\\begin') {
        // to the matching \right / \end, counting nested pairs
        const open = name === '\\left' ? /\\left(?![A-Za-z])/g : /\\begin\{/g;
        const close = name === '\\left' ? /\\right(?![A-Za-z])/g : /\\end\{/g;
        let d = 0; let j = i;
        const re = new RegExp(`${open.source}|${close.source}`, 'g');
        re.lastIndex = i;
        let mm;
        while ((mm = re.exec(tex))) {
          if (mm[0].startsWith('\\left') || mm[0].startsWith('\\begin')) d++;
          else if (--d === 0) { j = mm.index + mm[0].length; break; }
        }
        // the closing delimiter or environment name
        const tail = name === '\\left' ? /^(\\[A-Za-z]+|\\.|.)/.exec(tex.slice(j)) : /^[^}]*\}/.exec(tex.slice(j));
        j += tail ? tail[0].length : 0;
        out.push({ t: tex.slice(i, j), top: false }); i = j; continue;
      }
      out.push({ t: name, top: true }); i += name.length; continue;
    }
    out.push({ t: ch, top: true }); i++;
  }
  return out;
}

/** Joins pieces back into TeX. @param {{ t: string }[]} ps */
const join = (ps) => ps.map((p) => p.t).join('').trim();

/**
 * True when the TeX already lays itself out over lines: a line break (\\\\)
 * or an alignment point (&) at the top level, or a multi-line environment
 * (aligned, gathered …) as the whole formula. A cases or matrix block
 * inside a formula is one unit, and the formula around it may still break.
 * @param {string} tex
 */
function managed(tex) {
  const ps = tokens(tex).filter((p) => p.t.trim());
  if (ps.some((p) => p.top && (p.t === '&' || p.t === '\\\\'))) return true;
  return ps.length === 1 && /^\\begin\{(aligned|align\*?|gathered|gather\*?|split|multline\*?|alignedat|eqnarray\*?)\}/.test(ps[0].t);
}

/** Where a line may break, best first: a relation, a separator, a sign, the author's own line break in a product, a space inside \text. */
const BREAK_KINDS = ['rel', 'sep', 'bin', 'nl', 'word'];

/**
 * The formula cut at every place a line may break, at the top level only.
 * Each segment holds its own leading operator; a separator is dropped and
 * marks the break after it.
 * @param {string} src
 * @returns {{ tex: string, kind: string }[]}
 */
export function segments(src) {
  const ps = tokens(src);
  /** @type {{ tex: string, kind: string }[]} */
  const out = [{ tex: '', kind: 'start' }];
  let pendingNl = false;
  const last = () => out[out.length - 1];
  const prevSolid = () => { const t = last().tex.trim(); return t; };
  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    if (p.top && /^\s+$/.test(p.t)) { if (p.t.includes('\n')) pendingNl = true; last().tex += p.t; continue; }
    const prevTail = prevSolid();
    const atStart = !prevTail;
    const unary = (p.t === '-' || p.t === '+') && (atStart || /[=<>([{,&]$|\\(le|ge|leq|geq|approx|ne|neq|to|cdot|times|pm|mp)$/.test(prevTail));
    if (p.top && SEP_TOKENS.includes(p.t) && !atStart) { out.push({ tex: '', kind: 'sep' }); pendingNl = false; continue; }
    if (p.top && REL_TOKENS.includes(p.t) && !atStart) { out.push({ tex: p.t, kind: 'rel' }); pendingNl = false; continue; }
    if (p.top && BIN_TOKENS.includes(p.t) && !atStart && !unary) { out.push({ tex: p.t, kind: 'bin' }); pendingNl = false; continue; }
    if (pendingNl && !atStart && !/[=<>([{,]$|\\(cdot|times|pm|mp|left)$/.test(prevTail) && !(p.top && /^[)\]}^_,.;!']$/.test(p.t))) {
      out.push({ tex: '', kind: 'nl' });
    }
    pendingNl = false;
    // \text{…} with spaces: a break between its words
    if (p.top && p.t === '\\text' && ps[i + 1] && /^\{[^{}]*\s[^{}]*\}$/.test(ps[i + 1].t)) {
      const words = ps[i + 1].t.slice(1, -1).split(/(?=\s)/);
      words.forEach((w, k) => { if (k === 0) last().tex += `\\text{${w}}`; else out.push({ tex: `\\text{${w}}`, kind: 'word' }); });
      i++;
      continue;
    }
    last().tex += p.t;
  }
  return out.map((sgm) => ({ ...sgm, tex: sgm.tex.trim() })).filter((sgm, i) => i === 0 || sgm.tex);
}

/**
 * Lines of segments, filled greedily up to a width (em); a segment never
 * splits, so a line may still run over.
 * @param {number[]} widths @param {number} limit
 * @returns {number[][]} indices per line
 */
function fill(widths, limit) {
  /** @type {number[][]} */
  const lines = [[0]];
  let w = widths[0];
  for (let i = 1; i < widths.length; i++) {
    if (w + widths[i] <= limit) { lines[lines.length - 1].push(i); w += widths[i]; }
    else { lines.push([i]); w = widths[i]; }
  }
  return lines;
}

/**
 * The TeX of lines of segments, in one of two layouts: `aligned` lines up
 * the relations (the first line's left side, then &= …), `stacked` sets
 * every line flush left, the continuations indented by a \quad. A product
 * broken at the author's line break continues with ×.
 * @param {{ tex: string, kind: string }[]} segs @param {number[][]} lines @param {'aligned' | 'stacked'} mode
 */
function layout(segs, lines, mode) {
  const text = (/** @type {number[]} */ line) => line.map((i, k) => (k === 0 && segs[i].kind === 'nl' ? `\\times ${segs[i].tex}` : segs[i].tex)).join(' ').trim();
  const rows = lines.map((line, n) => {
    const t = text(line);
    if (n === 0) {
      if (mode === 'stacked') return `&${t}`;
      const relAt = line.findIndex((i, k) => k > 0 && segs[i].kind === 'rel');
      return relAt > 0 ? `${text(line.slice(0, relAt))} &${text(line.slice(relAt))}` : `${t} &`;
    }
    return mode === 'aligned' && segs[line[0]].kind === 'rel' ? `&${t}` : `&\\quad ${t}`;
  });
  return `\\begin{aligned}${rows.join(' \\\\ ')}\\end{aligned}`;
}

/** Line widths (px of the column) the formula is broken to fit, widest first. */
const FILL_TARGETS = [880, 720, 600, 500, 420, 360, 300, 260, 220, 180];

/**
 * The formula as written, then versions broken over more and more lines;
 * just the formula when there is nothing to break.
 * @param {string} tex
 * @param {(tex: string) => number | null} measure  a TeX fragment's width in em (null: cannot render)
 * @returns {string[]}
 */
export function breakVariants(tex, measure) {
  const src = tex.trim();
  if (managed(src)) return [src];
  const segs = segments(src);
  if (segs.length < 2) return [src];
  const widths = segs.map((sgm) => measure(sgm.tex));
  if (widths.some((w) => w === null)) return [src];
  const ws = /** @type {number[]} */ (widths);
  const seen = new Set([src]);
  /** @type {{ tex: string, lines: number, mode: number }[]} */
  const versions = [];
  for (const px of FILL_TARGETS) {
    const lines = fill(ws, px / (MATH_PX * FIT_MARGIN));
    if (lines.length < 2) continue;
    ['aligned', 'stacked'].forEach((mode, m) => {
      const t = layout(segs, lines, /** @type {'aligned' | 'stacked'} */ (mode));
      if (!seen.has(t)) { seen.add(t); versions.push({ tex: t, lines: lines.length, mode: m }); }
    });
  }
  versions.sort((a, b) => a.lines - b.lines || a.mode - b.mode);
  return [src, ...versions.map((v) => v.tex)];
}

/** The largest data-w the stylesheet maps (components.css); wider formulas take this one. */
export const FIT_EM_MAX = 80;

/** A version's width for data-w: em with the headroom, rounded up, at most FIT_EM_MAX. @param {number} widthEm */
export const fitEm = (widthEm) => Math.min(FIT_EM_MAX, Math.max(1, Math.ceil(widthEm * FIT_MARGIN)));

/**
 * For variants of known widths (em), the container widths each is shown
 * at: the least broken variant that fits wins at every step. Returns, per
 * variant, [from, to) in px (to = Infinity when it never gives way), or
 * null for a variant never shown.
 * @param {number[]} widthsEm
 * @returns {({ from: number, to: number } | null)[]}
 */
export function fitRanges(widthsEm) {
  const need = widthsEm.map((w) => w * MATH_PX * FIT_MARGIN);
  // where nothing fits, the narrowest version (the fewest lines among equals)
  const narrowest = need.indexOf(Math.min(...need));
  const steps = [0, ...FIT_STEPS];
  // at each step, the least broken version that fits a column that wide
  const pick = steps.map((c) => { const fit = need.findIndex((n) => n <= c); return fit < 0 ? narrowest : fit; });
  return need.map((_, v) => {
    const at = steps.filter((_, i) => pick[i] === v);
    if (!at.length) return null;
    const from = Math.min(...at);
    const after = steps.find((c, i) => c > from && pick[i] !== v);
    return { from, to: after ?? Infinity };
  });
}
